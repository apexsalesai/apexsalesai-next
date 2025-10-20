'use client';

import { useEffect, useState } from 'react';
import { Share2, Linkedin, Twitter, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleEnhancements } from '../../components/ArticleEnhancements';

interface BlogArticleClientProps {
  title: string;
  content: string;
  slug: string;
  nextPost?: { title: string; slug: string } | null;
  prevPost?: { title: string; slug: string } | null;
}

export default function BlogArticleClient({ title, content, slug, nextPost, prevPost }: BlogArticleClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Calculate reading time (average 200 words per minute)
  useEffect(() => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    setReadingTime(minutes);
  }, [content]);

  // Track scroll progress
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading Time Badge */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{readingTime} min read</span>
      </div>

      {/* Floating Share Sidebar */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          <button
            onClick={shareToLinkedIn}
            className="w-12 h-12 rounded-full bg-[#1a202c] border border-gray-700 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] transition-all group"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
          <button
            onClick={shareToTwitter}
            className="w-12 h-12 rounded-full bg-[#1a202c] border border-gray-700 flex items-center justify-center hover:bg-[#1da1f2] hover:border-[#1da1f2] transition-all group"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
          <button
            onClick={copyLink}
            className="w-12 h-12 rounded-full bg-[#1a202c] border border-gray-700 flex items-center justify-center hover:bg-[#00c2cb] hover:border-[#00c2cb] transition-all group"
            aria-label="Copy link"
          >
            <Link2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Share Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="w-14 h-14 rounded-full bg-[#00c2cb] shadow-lg flex items-center justify-center hover:bg-[#00a8b3] transition-all"
          aria-label="Share article"
        >
          <Share2 className="w-6 h-6 text-white" />
        </button>
        
        {showShareMenu && (
          <div className="absolute bottom-16 right-0 bg-[#1a202c] border border-gray-700 rounded-lg p-2 shadow-xl">
            <button onClick={shareToLinkedIn} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded text-sm text-white w-full">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </button>
            <button onClick={shareToTwitter} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded text-sm text-white w-full">
              <Twitter className="w-4 h-4" /> Twitter
            </button>
            <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded text-sm text-white w-full">
              <Link2 className="w-4 h-4" /> Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Article Enhancements - Table of Contents & Related Articles */}
      <ArticleEnhancements content={content} title={title} />

      {/* Next/Previous Navigation */}
      {(prevPost || nextPost) && (
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-6">
            {prevPost && (
              <a
                href={`/blog/${prevPost.slug}`}
                className="group p-5 bg-[#1a202c] rounded-lg border border-gray-800 hover:border-[#00c2cb] transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <ChevronLeft className="w-3 h-3" />
                  <span>Previous Article</span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00c2cb] transition-colors line-clamp-2">
                  {prevPost.title}
                </h3>
              </a>
            )}
            
            {nextPost && (
              <a
                href={`/blog/${nextPost.slug}`}
                className="group p-5 bg-[#1a202c] rounded-lg border border-gray-800 hover:border-[#00c2cb] transition-all md:text-right"
              >
                <div className="flex items-center justify-end gap-2 text-xs text-gray-400 mb-2">
                  <span>Next Article</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00c2cb] transition-colors line-clamp-2">
                  {nextPost.title}
                </h3>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
