import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state, redirectUri } = await request.json();

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    const config = {
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.mcleodsoftware.com',
    };

    if (!config.clientId || !config.clientSecret) {
      return NextResponse.json({ error: 'OIDC configuration missing' }, { status: 500 });
    }

    // Exchange code for tokens
    const tokenEndpoint = `${config.issuer}/oauth/token`;
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      redirect_uri: redirectUri,
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.json({ error: 'Token exchange failed' }, { status: 400 });
    }

    const tokens = await response.json();
    return NextResponse.json(tokens);

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
