'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Share2 } from 'lucide-react';

interface ArticleEnhancementsProps {
  content: string;
  title: string;
}

export function ArticleEnhancements({ content, title }: ArticleEnhancementsProps) {
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Extract headings for table of contents
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level });
    }

    setTableOfContents(headings);

    // Track active section on scroll
    const handleScroll = () => {
      const sections = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      const current = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });
      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tableOfContents.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-24 w-56 ml-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-[#1a202c] rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-[#00c2cb]" />
          <h3 className="font-semibold text-white text-sm">Contents</h3>
        </div>
        <nav>
          <ul className="space-y-1.5">
            {tableOfContents.slice(0, 8).map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToSection(heading.id)}
                  className={`text-left w-full text-xs transition-colors leading-snug ${
                    heading.level === 3 ? 'pl-3' : ''
                  } ${
                    activeSection === heading.id
                      ? 'text-[#00c2cb] font-semibold'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {heading.text.length > 40 ? heading.text.substring(0, 40) + '...' : heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Related Articles - Compact */}
      <div className="bg-[#1a202c] rounded-lg p-4 border border-gray-800 mt-4">
        <h3 className="font-semibold text-white mb-3 text-sm">Related</h3>
        <div className="space-y-2">
          <a href="/blog" className="block text-xs text-gray-400 hover:text-[#00c2cb] transition-colors">
            → More Articles
          </a>
        </div>
      </div>
    </aside>
  );
}

// Drop Cap Component
export function DropCap({ children }: { children: string }) {
  if (!children || children.length === 0) return <>{children}</>;
  
  const firstLetter = children[0];
  const rest = children.slice(1);
  
  return (
    <p className="mb-5 leading-7 text-gray-300 text-[15px]">
      <span className="float-left text-6xl font-bold text-[#00c2cb] mr-2 mt-1 leading-none">
        {firstLetter}
      </span>
      {rest}
    </p>
  );
}

// Pull Quote Component
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 py-6 px-8 bg-gradient-to-r from-[#00c2cb]/10 to-transparent border-l-4 border-[#00c2cb] rounded-r-lg">
      <blockquote className="text-xl font-semibold text-white italic">
        {children}
      </blockquote>
    </div>
  );
}
