'use client';

import { useState, useEffect } from 'react';
import { buildAuthUrl, generateState, type OIDCConfig } from '../lib/oidc';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is already logged in on component mount and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = sessionStorage.getItem('user_info');
      const accessToken = sessionStorage.getItem('access_token');
      
      if (userInfo && accessToken) {
        setUser(JSON.parse(userInfo));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes (when login completes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_info' || e.key === 'access_token') {
        checkLoginStatus();
      }
    };

    // Listen for custom login event
    const handleLoginSuccess = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  const handleLogin = () => {
    // Generate state for CSRF protection
    const state = generateState();
    sessionStorage.setItem('oidc_state', state);

    // OIDC configuration
    const config: OIDCConfig = {
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || '',
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.mcleodsoftware.com',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid profile email orderrequests:create trackandtrace:read',
    };

    // Build authorization URL and redirect
    const authUrl = buildAuthUrl(config, state);
    window.location.href = authUrl;
  };

  const handleSignUp = () => {
    // Generate state for CSRF protection
    const state = generateState();
    sessionStorage.setItem('oidc_state', state);

    // OIDC configuration for signup
    const config: OIDCConfig = {
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || '',
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.mcleodsoftware.com',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid profile email',
    };

    // Build authorization URL with screen_hint=signup to show signup form
    const authUrl = buildAuthUrl(config, state) + '&screen_hint=signup';
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    // Clear all stored tokens and user info
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('oidc_state');
    
    setUser(null);
    setIsLoggedIn(false);

    // Redirect to OIDC provider's logout endpoint with client_id
    const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.mcleodsoftware.com';
    const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || '';
    const returnTo = encodeURIComponent(window.location.origin);
    const logoutUrl = `${issuer}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
    window.location.href = logoutUrl;
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Title/Logo on the left */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Connect API Workshop
          </h1>
        </div>

        {/* Login system on the right */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user?.name || user?.preferred_username || user?.email || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={handleSignUp}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
