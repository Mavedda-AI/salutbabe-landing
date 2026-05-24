import {NextResponse} from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.salutbabe.com';
  const API_VERSION  = process.env.NEXT_PUBLIC_API_BASE_VERSION || 'v1';
  const url = `${API_BASE_URL}/${API_VERSION}/auth/google`;

  try {
    // 1. Make request to Backend with the required header
    const response = await fetch(url, {
      headers: {
        "X-Device-Type": "web"
      },
      redirect: "manual" // Capture the redirect location manually
    });

    // 2. If Backend replies with a 302 Redirect to Google, forward that redirect to the browser
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        return NextResponse.redirect(location);
      }
    }

    // 3. If Backend replies with JSON containing the URL, redirect to it
    const data = await response.json().catch(() => null);
    if (data?.url || data?.payload?.url) {
       return NextResponse.redirect(data.url || data.payload.url);
    }
    
    // Fallback error
    return NextResponse.json({ error: "Backend did not return a valid redirect location." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
