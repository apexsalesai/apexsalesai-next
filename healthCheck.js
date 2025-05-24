// Health check script for API endpoints
const fetch = require('node-fetch');

const endpoints = [
  'http://localhost:3002/api/request-demo',
  'http://localhost:3002/api/contact',
  'http://localhost:3002/api/callback',
  'http://localhost:3002/api/subscribe',
];

async function checkEndpoint(url) {
  try {
    const res = await fetch(url, { method: 'OPTIONS' });
    if (res.ok) {
      console.log(`[OK] ${url}`);
    } else {
      console.error(`[FAIL] ${url}: Status ${res.status}`);
    }
  } catch (err) {
    console.error(`[ERROR] ${url}:`, err.message);
  }
}

(async () => {
  for (const endpoint of endpoints) {
    await checkEndpoint(endpoint);
  }
})();
