// app/layout.tsx
import type { Metadata, MetadataRoute } from 'next';
import '../styles/globals.css';
import './layout.css';
import Script from 'next/script';
import Head from 'next/head';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MaxChatWidget from './components/ui/maxchatwidget.js';
import { OrganizationJsonLd } from './components/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.apexsalesai.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    template: '%s | ApexSalesAI'
  },
  description:
    'Enterprise AI sales enablement platform. Autonomous multi-agent system for sales pipeline acceleration, content generation, and revenue execution powered by Microsoft Dataverse.',
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
    'revenue growth',
    'Microsoft Dataverse',
    'multi-agent AI system',
  ],
  authors: [{ name: 'ApexSalesAI Team' }],
  creator: 'ApexSalesAI',
  publisher: 'ApexSalesAI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.apexsalesai.com/',
    siteName: 'ApexSalesAI',
    title: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    description:
      'Enterprise AI sales enablement platform. Autonomous multi-agent system for sales pipeline acceleration, content generation, and revenue execution powered by Microsoft Dataverse.',
    images: [
      {
        url: 'https://www.apexsalesai.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ApexSalesAI Enterprise AI Sales Enablement Platform',
        type: 'image/png',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexSalesAI | Predictive Autonomous Revenue Execution',
    description:
      'Enterprise AI sales enablement platform. Autonomous multi-agent system for sales pipeline acceleration, content generation, and revenue execution powered by Microsoft Dataverse.',
    images: ['https://www.apexsalesai.com/images/twitter-card.png'],
    creator: '@ApexSalesAI',
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
        {/* Organization structured data now rendered via OrganizationJsonLd in body */}
      </Head>
      <body className="min-h-screen bg-[#0d1321]">
        <OrganizationJsonLd />
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