// Sends a notification to a Microsoft Teams channel via Incoming Webhook

export async function sendTeamsNotification(title: string, message: string) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('TEAMS_WEBHOOK_URL not set. Skipping Teams notification.');
    return;
  }
  const payload = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    'summary': title,
    'themeColor': '0078D7',
    'title': title,
    'text': message
  };
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Failed to send Teams notification:', error);
  }
}
