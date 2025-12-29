import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeScript } from '@/components/ThemeScript';
import { ToastProvider } from '@/components/ui/Toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { loadSiteConfig, loadNavigationConfig } from '@/lib/loaders';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await loadSiteConfig();

  return {
    title: {
      default: siteConfig.seo.defaultTitle,
      template: siteConfig.seo.titleTemplate,
    },
    description: siteConfig.seo.defaultDescription,
    keywords: ['AI', 'R&D', 'Technology', 'Precision AI', 'Enterprise Software'],
    authors: [{ name: siteConfig.legal.companyName }],
    creator: siteConfig.legal.companyName,
    publisher: siteConfig.legal.companyName,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.seo.defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
      creator: siteConfig.seo.twitterHandle,
      images: [siteConfig.seo.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: siteConfig.logo.favicon,
      shortcut: siteConfig.logo.favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await loadSiteConfig();
  const navigation = await loadNavigationConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme={siteConfig.theme.defaultMode as 'light' | 'dark'}>
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header navigation={navigation} siteName={siteConfig.name} />
              <main className="flex-1">{children}</main>
              <Footer navigation={navigation} siteConfig={siteConfig} />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
