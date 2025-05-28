// app/layout.tsx
import type { Metadata, MetadataRoute } from 'next';
import '../styles/globals.css';
import './layout.css';
import Script from 'next/script';
import Head from 'next/head';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MaxChatWidget from './components/ui/maxchatwidget.js';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    template: '%s | ApexSalesAI'
  },
  description: 'Transform your revenue operations with predictive autonomous agents that see opportunities others miss, deliver real-time decisions, and execute with unmatched precision.',
  keywords: [
    'AI sales automation',
    'predictive revenue execution',
    'autonomous sales agents',
    'sales optimization',
    'revenue acceleration',
    'AI-powered sales',
    'sales intelligence',
    'enterprise AI solutions',
    'sales analytics',
    'revenue growth'
  ],
  authors: [{ name: 'ApexSalesAI Team' }],
  creator: 'ApexSalesAI',
  publisher: 'ApexSalesAI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ApexSalesAI',
    title: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    description: 'Transform your revenue operations with predictive autonomous agents that see opportunities others miss, deliver real-time decisions, and execute with unmatched precision.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ApexSalesAI Open Graph Image'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    description: 'Transform your revenue operations with predictive autonomous agents that see opportunities others miss, deliver real-time decisions, and execute with unmatched precision.',
    images: ['/images/twitter-card.png']
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE'
  },
  alternates: {
    canonical: 'https://www.apexsalesai.com',
    types: {
      'application/rss+xml': [
        {
          url: '/feed.xml',
          title: 'ApexSalesAI Blog Feed'
        }
      ]
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Analytics 4 tag */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}`}
        />
        <Script
          id="google-analytics-inline"
          strategy="afterInteractive"
        >{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}');
        `}</Script>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ApexSalesAI',
              url: 'https://www.apexsalesai.com',
              logo: 'https://www.apexsalesai.com/images/apex-logo.png',
              sameAs: [
                'https://www.linkedin.com/company/apexsalesai',
                'https://twitter.com/apexsalesai'
              ],
              description:
                'Transform your revenue operations with predictive autonomous agents that see opportunities others miss, deliver real-time decisions, and execute with unmatched precision.'
            })
          }}
        />
      </Head>
      <body className="min-h-screen bg-[#0d1321]">
        {/* Legacy Botpress/Botpress Cloud webchat scripts and code removed here. */}
        {/* New MaxChatWidget React component injected globally below. */}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </div>
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000 }}>
          <MaxChatWidget />
        </div>
      </body>
    </html>
  );
}