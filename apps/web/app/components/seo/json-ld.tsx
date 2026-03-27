'use client';

// ============================================================================
// Organization JSON-LD
// ============================================================================

interface OrganizationJsonLdProps {
  name?: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = 'ApexSalesAI',
  description = 'Enterprise AI sales enablement platform with multi-agent system for autonomous content generation across channels. Microsoft ecosystem native.',
  logo = 'https://www.apexsalesai.com/images/apex-logo.png',
  sameAs = [
    'https://www.linkedin.com/company/apexsalesai',
    'https://twitter.com/ApexSalesAI',
    'https://www.youtube.com/c/ApexSalesAI',
  ],
}: OrganizationJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.apexsalesai.com',
    name,
    url: 'https://www.apexsalesai.com',
    logo,
    description,
    parentOrganization: {
      '@type': 'Organization',
      name: 'LYFYE',
      url: 'https://lyfye.com',
    },
    sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      telephone: '+1-860-997-7929',
      email: 'sales@apexsalesai.com',
    },
    foundingDate: '2024',
    areaServed: 'US',
    knowsAbout: [
      'AI Sales Enablement',
      'Enterprise CRM',
      'Content Generation',
      'Sales Pipeline',
      'Microsoft Dataverse',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// Software Application JSON-LD
// ============================================================================

interface SoftwareApplicationJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  featureList?: string[];
  offers?: {
    lowPrice?: string;
    highPrice?: string;
    priceCurrency?: string;
    description?: string;
  };
}

export function SoftwareApplicationJsonLd({
  name = 'ApexSalesAI',
  description = 'Enterprise AI sales enablement platform with Max and Mia AI agents for autonomous multi-channel content generation.',
  url = 'https://www.apexsalesai.com',
  applicationCategory = 'BusinessApplication',
  operatingSystem = 'Web',
  featureList = [
    'Multi-agent AI system',
    'Microsoft Dataverse integration',
    'Autonomous content generation',
    'Multi-channel publishing',
    'Enterprise pipeline acceleration',
    'Real-time collaboration',
    'Advanced analytics',
  ],
  offers = {
    lowPrice: '499',
    highPrice: '150000',
    priceCurrency: 'USD',
    description: 'Enterprise SaaS pricing based on agents, contacts, and channels',
  },
}: SoftwareApplicationJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    featureList,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: offers.priceCurrency,
      lowPrice: offers.lowPrice,
      highPrice: offers.highPrice,
      offerCount: '3',
      description: offers.description,
      availability: 'https://schema.org/InStock',
    },
    downloadUrl: 'https://www.apexsalesai.com/platform',
    softwareVersion: '2.0',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// WebSite JSON-LD with Search Action
// ============================================================================

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteJsonLd({
  name = 'ApexSalesAI',
  url = 'https://www.apexsalesai.com',
  description = 'Enterprise AI sales enablement platform',
}: WebSiteJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// Breadcrumb JSON-LD
// ============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// FAQ Page JSON-LD
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageJsonLdProps {
  items: FAQItem[];
}

export function FAQPageJsonLd({ items }: FAQPageJsonLdProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// Article / BlogPosting JSON-LD
// ============================================================================

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image: image || 'https://www.apexsalesai.com/images/og-image.png',
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          url: author.url,
        }
      : {
          '@type': 'Organization',
          name: 'ApexSalesAI',
          url: 'https://www.apexsalesai.com',
        },
    publisher: {
      '@type': 'Organization',
      name: 'ApexSalesAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.apexsalesai.com/images/apex-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// Product JSON-LD (for AI agents)
// ============================================================================

interface ProductJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
}

export function ProductJsonLd({
  name,
  description,
  url,
  image,
  brand = 'ApexSalesAI',
}: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image: image || 'https://www.apexsalesai.com/images/og-image.png',
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'ApexSalesAI',
      url: 'https://www.apexsalesai.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}

// ============================================================================
// Contact Point JSON-LD
// ============================================================================

interface ContactPointJsonLdProps {
  contactType?: string;
  telephone?: string;
  email?: string;
  url?: string;
}

export function ContactPointJsonLd({
  contactType = 'Sales',
  telephone = '+1-860-997-7929',
  email = 'sales@apexsalesai.com',
  url = 'https://www.apexsalesai.com/contact',
}: ContactPointJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'ContactPoint',
      contactType,
      telephone,
      email,
      url,
      areaServed: 'US',
      availableLanguage: 'en',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}
