// components/MaxAgent.tsx
'use client';

import { useEffect } from 'react';

const MaxAgent = () => {
  useEffect(() => {
    // Load Botpress webchat script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize the webchat once the script is loaded
    script.onload = () => {
      // Insert your actual Botpress webchat init code here
      // This should match what you're using on apexsalesai.com
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.botpressWebChat.init({
          "composerPlaceholder": "Ask Max your questions...",
          "botId": "086e1515-f61c-4d9b-9429-d4bb34de3106", // Replace with your actual bot ID if different
          "hostUrl": "https://cdn.botpress.cloud/webchat/v2",
          "messagingUrl": "https://messaging.botpress.cloud",
          "clientId": "086e1515-f61c-4d9b-9429-d4bb34de3106", // Replace with your actual client ID if different
          "botName": "Max",
          "avatarUrl": "https://apexsalesai.com/max-avatar.png", // Make sure this file exists in your public folder
          "themeName": "prism",
          "enableConversationDeletion": true,
          "showPoweredBy": false
        });
      `;
      document.body.appendChild(configScript);
    };

    // Cleanup function
    return () => {
      // Try to remove Botpress elements when component unmounts
      try {
        document.body.removeChild(script);
        // Remove injected botpress elements if they exist
        const bpElements = document.getElementById('bp-web-widget');
        if (bpElements) {
          document.body.removeChild(bpElements);
        }
      } catch (error) {
        console.log('Error cleaning up Botpress elements', error);
      }
    };
  }, []);

  // Component doesn't render anything directly
  return null;
};

export default MaxAgent;