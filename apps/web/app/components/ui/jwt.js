// app/components/ui/jwt.js
// Utility for retrieving JWT from localStorage or cookies (expand as needed)

export function getJWT() {
  if (typeof window !== 'undefined') {
    // Try localStorage first
    const token = localStorage.getItem('jwt_token');
    if (token) return token;
    // Optionally, check cookies or other sources here
    // Example: parse document.cookie for 'jwt_token'
  }
  return null;
}
