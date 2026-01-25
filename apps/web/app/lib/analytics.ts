// Google Analytics event tracking utility
// Replace 'G-XXXXXXXXXX' with your Google Analytics 4 Measurement ID

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export async function trackEvent(event: string, data: Record<string, any>) {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not set.');
    return;
  }
  // GA4 Measurement Protocol endpoint
  const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`;
  const payload = {
    client_id: data.email || 'anonymous', // Use email or another unique identifier
    events: [
      {
        name: event,
        params: data,
      },
    ],
  };
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[Analytics] Failed to send event:', err);
  }
}
