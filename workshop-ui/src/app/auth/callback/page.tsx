'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { decodeJWT } from '../../../lib/oidc';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setError(`Authentication error: ${error}`);
          setStatus('error');
          return;
        }

        if (!code || !state) {
          setError('Missing authorization code or state parameter');
          setStatus('error');
          return;
        }

        // Verify state matches what we stored
        const storedState = sessionStorage.getItem('oidc_state');
        if (state !== storedState) {
          setError('Invalid state parameter - possible CSRF attack');
          setStatus('error');
          return;
        }

        // Exchange code for tokens using our API route
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            redirectUri: `${window.location.origin}/auth/callback`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Token exchange failed');
        }

        const tokens = await response.json();
        
        // Decode the ID token to get user info
        const userInfo = decodeJWT(tokens.id_token);
        
        // Store tokens and user info
        sessionStorage.setItem('access_token', tokens.access_token);
        sessionStorage.setItem('id_token', tokens.id_token);
        sessionStorage.setItem('user_info', JSON.stringify(userInfo));
        
        // Clean up
        sessionStorage.removeItem('oidc_state');
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('loginSuccess'));
        
        setStatus('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } catch (err) {
        console.error('Authentication callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Processing login...
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please wait while we complete your authentication.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Login successful!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You will be redirected shortly...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Authentication failed
              </h2>
              <p className="mt-2 text-red-600 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
