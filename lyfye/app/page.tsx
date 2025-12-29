import { loadPage } from '@/lib/loaders';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export default async function HomePage() {
  const pageData = await loadPage('home');

  return (
    <>
      {pageData.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </>
  );
}
