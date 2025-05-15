"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OuraApiResponse {
  data?: {
    id?: string;
    age?: number;
    weight?: number;
    height?: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sleep?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activity?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stress?: any[];
  error?: string;
}

export default function Dashboard() {
  const [pat, setPat] = useState<string | null>(null);
  const [ouraInfo, setOuraInfo] = useState<OuraApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedPat = typeof window !== 'undefined' ? localStorage.getItem('oura_pat') : null;
    if (!storedPat) {
      router.replace('/auth');
    } else {
      setPat(storedPat);
    }
  }, [router]);

  useEffect(() => {
    if (pat) {
      setLoading(true);
      setError("");
      fetch("/api/oura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pat }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Unknown error");
          setOuraInfo(data);
        })
        .catch((err) => {
          setError(err.message);
          setOuraInfo(null);
        })
        .finally(() => setLoading(false));
    }
  }, [pat]);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oura_pat');
    }
    router.replace('/auth');
  };

  // Calculate crash out score
  let crashScore = 0;
  let crashMsg = "";
  let avgSleep = null;
  let avgSteps = null;
  let avgStress = null;
  let sleepScore = 0;
  let stepsScore = 0;
  let stressScore = 0;

  if (ouraInfo && ouraInfo.sleep && ouraInfo.sleep.length > 0) {
    // Use Oura's sleep score (0-100) where lower is worse
    avgSleep = Math.round(
      ouraInfo.sleep.reduce((sum, s) => sum + (s.score || 0), 0) / ouraInfo.sleep.length
    );
    
    // Convert sleep score to a 0-100 crash risk score where higher is worse
    // Lower sleep score = higher crash risk
    sleepScore = 100 - avgSleep;
  }

  if (ouraInfo && ouraInfo.activity && ouraInfo.activity.length > 0) {
    avgSteps = Math.round(
      ouraInfo.activity.reduce((sum, a) => sum + (a.steps || 0), 0) / ouraInfo.activity.length
    );
    
    // Convert steps to a 0-100 score where higher is worse
    // 2000 steps = 100%, 10000 steps = 0%, linear in between
    stepsScore = Math.max(0, Math.min(100, Math.round((10000 - avgSteps) / 80)));
    
    // Debug log
    console.log('Steps calculation:', {
      avgSteps,
      stepsScore,
      rawSteps: ouraInfo.activity.map(a => a.steps)
    });
  }

  if (ouraInfo && ouraInfo.stress && ouraInfo.stress.length > 0) {
    avgStress = Math.round(
      ouraInfo.stress.reduce((sum, s) => sum + (s.stress_high || 0), 0) / ouraInfo.stress.length / 3600 * 10
    ) / 10; // hours, 1 decimal
    
    // Convert stress to a 0-100 score where higher is worse
    // More than 4 hours of stress = 100, less than 1 hour = 0, linear in between
    stressScore = Math.max(0, Math.min(100, (avgStress - 1) * 33.33));
  }

  if (avgSleep !== null && avgSteps !== null && avgStress !== null) {
    // Average the three scores
    crashScore = Math.round((sleepScore + stepsScore + stressScore) / 3);
    
    if (crashScore > 80) crashMsg = "will u stream it :3";
    else if (crashScore > 60) crashMsg = "log off";
    else if (crashScore > 40) crashMsg = "mid";
    else if (crashScore > 20) crashMsg = "you're fine";
    else crashMsg = "never kill yourself";
  } 

  if (!pat) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-black">Oura Ham Crashboard</h1>
        <p className="text-sm text-black">Because I want to know who I shouldn&apos;t lend money to</p>
        <button
          className="mt-2 px-4 py-1 bg-gray-200 rounded text-black hover:bg-gray-300 text-xs"
          onClick={() => console.log('Oura API Response:', ouraInfo)}
        >
          Debug: Log API Response
        </button>
      </header>
      <div className="bg-white rounded shadow-md p-8 w-full max-w-2xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Crashout Metric:</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-blue-100 rounded p-4 text-center">
          <span className="text-lg font-semibold text-black">Crashout Percentage:</span>
          <div className="text-4xl font-bold mt-2 text-black">{crashScore}%</div>
          <div className="text-sm mt-2 text-black">{crashMsg}</div>
          {avgSleep !== null && avgSteps !== null && avgStress !== null && (
            <div className="text-xs text-black mt-2">
              Sleep Risk: <b>{Math.round(sleepScore)}%</b> &nbsp;|&nbsp; 
              Activity Risk: <b>{Math.round(stepsScore)}%</b> &nbsp;|&nbsp; 
              Stress Risk: <b>{Math.round(stressScore)}%</b>
            </div>
          )}
        </div>
        <div className="bg-gray-100 rounded p-4">
          <span className="font-semibold text-black">Oura Data:</span>
          {loading && <div className="text-blue-500 mt-2">Loading... <span className="inline-block animate-spin">🔄</span></div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          
          {ouraInfo?.sleep && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-black mb-2">Sleep Scores (Last 5 Days)</h3>
              <Line
                data={{
                  labels: ouraInfo.sleep.map(s => new Date(s.day).toLocaleDateString()),
                  datasets: [{
                    label: 'Sleep Score',
                    data: ouraInfo.sleep.map(s => s.score || 0),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }]
                } as ChartData<'line'>}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                } as ChartOptions<'line'>}
              />
            </div>
          )}

          {ouraInfo?.activity && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-black mb-2">Daily Steps (Last 5 Days)</h3>
              <Line
                data={{
                  labels: ouraInfo.activity.map(a => new Date(a.day).toLocaleDateString()),
                  datasets: [{
                    label: 'Steps',
                    data: ouraInfo.activity.map(a => a.steps || 0),
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                  }]
                }}
              />
            </div>
          )}

          {ouraInfo?.stress && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-black mb-2">Stress Hours (Last 5 Days)</h3>
              <Line
                data={{
                  labels: ouraInfo.stress.map(s => new Date(s.day).toLocaleDateString()),
                  datasets: [{
                    label: 'Stress Hours',
                    data: ouraInfo.stress.map(s => (s.stress_high || 0) / 3600),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                  }]
                }}
              />
            </div>
          )}

         
        </div>
      </div>
      <footer className="text-center mt-4 text-xs text-black">
        <p>will u stream it :3</p>
      </footer>
    </div>
  );
}
