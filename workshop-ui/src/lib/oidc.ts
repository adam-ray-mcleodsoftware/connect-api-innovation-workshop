// Simple OIDC utilities
export interface OIDCConfig {
  clientId: string;
  clientSecret?: string;
  issuer: string; // e.g., "https://auth.mcleodsoftware.com"
  redirectUri: string;
  scope?: string;
}

// Generate a random state for CSRF protection
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Build the authorization URL
export function buildAuthUrl(config: OIDCConfig, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope || 'openid profile email',
    state: state,
  });

  return `${config.issuer}/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(
  config: OIDCConfig,
  code: string,
  state: string
): Promise<any> {
  const tokenEndpoint = `${config.issuer}/oauth/token`;
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret || '',
    code: code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

// Decode JWT payload (simple base64 decode - in production use a proper JWT library)
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}
