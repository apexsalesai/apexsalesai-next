import React from 'react';
import type { PageSection } from '@/lib/schemas';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { GridSection } from './GridSection';

// Import other sections as needed
// import { StatsSection } from './StatsSection';
// import { TestimonialsSection } from './TestimonialsSection';
// import { FAQSection } from './FAQSection';
// import { TimelineSection } from './TimelineSection';
// import { ContentSection } from './ContentSection';
// import { LogoCloudSection } from './LogoCloudSection';

interface SectionRendererProps {
  section: PageSection;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  switch (section.type) {
    case 'hero':
      return <HeroSection {...section} />;
    case 'features':
      return <FeaturesSection {...section} />;
    case 'cta':
      return <CTASection {...section} />;
    case 'grid':
      return <GridSection {...section} />;
    case 'stats':
      // TODO: Implement StatsSection
      return <div>Stats section (to be implemented)</div>;
    case 'testimonials':
      // TODO: Implement TestimonialsSection
      return <div>Testimonials section (to be implemented)</div>;
    case 'faq':
      // TODO: Implement FAQSection
      return <div>FAQ section (to be implemented)</div>;
    case 'timeline':
      // TODO: Implement TimelineSection
      return <div>Timeline section (to be implemented)</div>;
    case 'content':
      // TODO: Implement ContentSection
      return <div>Content section (to be implemented)</div>;
    case 'logoCloud':
      // TODO: Implement LogoCloudSection
      return <div>Logo cloud section (to be implemented)</div>;
    default:
      console.warn('Unknown section type:', section);
      return null;
  }
};
