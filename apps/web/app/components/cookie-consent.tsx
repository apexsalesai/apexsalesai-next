'use client';

import { useState, useEffect } from 'react';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lyfye-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('lyfye-cookie-consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('lyfye-cookie-consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        padding: '16px 24px',
        zIndex: 9999,
        display: 'flex',
        flexWrap: 'wrap' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderTop: '1px solid #333',
        fontSize: '14px',
      }}
    >
      <p style={{ margin: 0, flex: '1 1 400px', lineHeight: '1.5' }}>
        We use cookies to improve your experience. Essential cookies are required for site
        functionality. Analytics and marketing cookies help us understand usage and improve our
        services. See our{' '}
        <a href="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          Privacy Policy
        </a>{' '}
        for details.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={acceptEssentialOnly}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Essential Only
        </button>
        <button
          onClick={acceptAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
