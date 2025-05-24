'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function MaxChatWidget() {
  useEffect(() => {
    // Only run initialization once when the component mounts
    if (typeof window !== 'undefined' && !window.botpressWebChat) {
      // Initialize Botpress after its script is loaded
      window.botpressWebChat = {
        init: () => {
          if (window.botpressWebChat?.init) {
            window.botpressWebChat.init({
              botId: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID || 'YOUR_BOTPRESS_BOT_ID',
              hostUrl: process.env.NEXT_PUBLIC_BOTPRESS_HOST || 'https://cdn.botpress.cloud/webchat/v1',
              messagingUrl: 'https://messaging.botpress.cloud',
              clientId: process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID || 'YOUR_CLIENT_ID',
              botName: 'Max',
              stylesheet: 'https://www.apexsalesai.com/css/botpress-chat.css',
              useSessionStorage: true,
              enableConversationDeletion: true,
              showConversationButton: false,
              showCloseButton: true,
              disableAnimations: false,
              closeOnEscape: true,
              avatarUrl: 'https://www.apexsalesai.com/images/max-avatar.png',
              className: 'max-chat-widget',
              emailAddress: '',
              phoneNumber: '',
              website: 'https://www.apexsalesai.com',
              hideWidget: false,
              disableToggleButton: false,
              showTimeStamp: true,
              theme: 'dark',
              themeColor: '#00c2cb',
              botConversationDescription: 'Hi there! I\'m Max, your AI assistant from ApexSalesAI. How can I help you today?',
              containerWidth: '400px',
              layoutWidth: '400px',
              messaging: {
                avatarUrl: 'https://www.apexsalesai.com/images/max-avatar.png',
                botName: 'Max',
                botConversationDescription: 'AI Sales Assistant',
                userMessageColor: '#00c2cb',
                botMessageColor: '#1a202c',
                headerText: 'Chat with Max',
              }
            });
          }
        }
      };
    }
  }, []);

  return (
    <>
      <Script 
        id="botpress-webchat-script"
        src={`${process.env.NEXT_PUBLIC_BOTPRESS_HOST || 'https://cdn.botpress.cloud/webchat/v1'}/inject.js`}
        onLoad={() => {
          if (window.botpressWebChat?.init) {
            window.botpressWebChat.init();
          }
        }}
        strategy="afterInteractive"
      />
    </>
  );
}