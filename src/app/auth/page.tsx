"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [pat, setPat] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) {
      setError('Please enter your Oura Personal Access Token.');
      return;
    }
    // Save PAT to localStorage (for demo; in production, use secure storage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('oura_pat', pat);
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Oura PAT Login</h1>
        <label className="block mb-2 font-medium">Personal Access Token</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={pat}
          onChange={e => setPat(e.target.value)}
          placeholder="Enter your Oura PAT"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <p className="text-xs text-gray-500 mt-4">
          You can create a PAT at <a href="https://cloud.ouraring.com/personal-access-tokens" target="_blank" rel="noopener noreferrer" className="underline">Oura Cloud</a>.
        </p>
      </form>
    </div>
  );
} 