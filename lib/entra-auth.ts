import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

// Microsoft Entra ID (Azure AD) Configuration
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (process.env.NODE_ENV === 'development') {
          console.log(message);
        }
      },
      piiLoggingEnabled: false,
      logLevel: 3, // Error
    },
  },
};

// Create MSAL instance
export const msalInstance = new ConfidentialClientApplication(msalConfig);

// Redirect URIs
export const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
export const POST_LOGOUT_REDIRECT_URI = `${REDIRECT_URI}/echo-breaker`;

// Scopes
export const SCOPES = ['user.read', 'openid', 'profile', 'email'];

// Session secret (generate a secure random string for production)
const SESSION_SECRET = process.env.ENTRA_SESSION_SECRET || 'dev-secret-change-in-production-min-32-chars-long';

// Session configuration
export const SESSION_CONFIG = {
  cookieName: 'entra_session',
  password: SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
