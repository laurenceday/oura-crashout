import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pat } = await req.json();
    if (!pat) {
      return NextResponse.json({ error: 'Missing PAT' }, { status: 400 });
    }

    // Fetch Oura user info
    const userResp = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    });
    if (!userResp.ok) {
      return NextResponse.json({ error: 'Invalid PAT or Oura API error' }, { status: userResp.status });
    }
    const userInfo = await userResp.json();
    console.log(userInfo);

    // Fetch last 5 days of sleep data
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 5);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    const sleepResp = await fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${startStr}&end_date=${endStr}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    });
    const sleepData = await sleepResp.json();

    // Fetch last 5 days of activity data
    const activityResp = await fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${startStr}&end_date=${endStr}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    });
    const activityData = await activityResp.json();

    // Fetch last 5 days of stress data
    const stressResp = await fetch(`https://api.ouraring.com/v2/usercollection/daily_stress?start_date=${startStr}&end_date=${endStr}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
    });
    const stressData = await stressResp.json();

    return NextResponse.json({
      data: userInfo.data,
      sleep: sleepData.data,
      activity: activityData.data,
      stress: stressData.data,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
} 