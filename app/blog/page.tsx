'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { NewsletterSubscribe } from '../components/NewsletterSubscribe';
import Navbar from '../components/Navbar';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
}

// Default fallback posts
const defaultPosts: BlogPost[] = [
  {
    slug: 'ai-revenue-teams',
    title: 'The Rise of Autonomous Revenue Teams',
    date: '2025-04-22',
    author: 'ApexSalesAI Editorial',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Discover how AI agents are reshaping go-to-market operations, helping teams do more with less — and scale without headcount.',
    tags: ['AI Agents', 'Revenue Operations', 'Enterprise Strategy'],
  },
  {
    slug: 'ai-sales-future',
    title: 'The Future of Sales: How AI is Reshaping Revenue Operations',
    date: '2025-05-15',
    author: 'Dr. Sarah Chen, AI Strategy Director',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'The convergence of AI and sales operations is creating unprecedented opportunities for revenue growth.',
    tags: ['AI', 'Sales Strategy', 'Revenue Operations'],
  },
  {
    slug: 'predictive-analytics',
    title: 'Maximizing ROI with Predictive Sales Intelligence',
    date: '2025-05-10',
    author: 'Michael Thompson, Chief Revenue Officer',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Discover how leading enterprises are leveraging predictive analytics to identify high-value opportunities.',
    tags: ['Analytics', 'ROI', 'Sales Optimization'],
  },
];

function NewsletterSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Thank you for subscribing! Please check your inbox for a welcome email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-xl mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 px-4 py-3 rounded-lg border border-[#2d3748] bg-[#0d1321] text-white focus:outline-none focus:ring-2 focus:ring-[#00c2cb] min-w-[220px]"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className="bg-[#00c2cb] text-[#0d1321] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#00a8b3] transition"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <div className={`w-full mt-4 text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
      )}
    </form>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost>(defaultPosts[0]);
  
  // Filter posts based on selected tag
  const filteredPosts = selectedTag === 'All' 
    ? posts.slice(1) 
    : posts.slice(1).filter(post => post.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase())));

  useEffect(() => {
    // Fetch actual blog posts from API
    fetch('/api/posts?status=PUBLISHED')
      .then(res => res.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
          setFeaturedPost(data.posts[0]);
        }
      })
      .catch(err => {
        console.error('Error loading blog posts:', err);
        // Keep default posts on error
      })
      .finally(() => setLoading(false));
  }, []);

  const otherPosts = posts.slice(1);

  return (
    <>
      <Head>
        <title>Blog | ApexSalesAI</title>
        <meta name="description" content="Stay up to date with AI-powered GTM trends, sales execution strategies, and automation insights from ApexSalesAI." />
        <meta name="keywords" content="AI sales blog, go-to-market strategies, sales automation, revenue execution, ApexSalesAI insights, enterprise AI, B2B sales" />
        <meta property="og:title" content="Blog | ApexSalesAI" />
        <meta property="og:description" content="Insights and strategies on AI-powered sales automation, customer support, and revenue operations from ApexSalesAI." />
        <meta property="og:image" content="https://www.apexsalesai.com/images/social-preview.png" />
        <meta property="og:url" content="https://www.apexsalesai.com/blog.html" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | ApexSalesAI" />
        <meta name="twitter:description" content="Insights and strategies on AI-powered sales automation, customer support, and revenue operations from ApexSalesAI." />
        <meta name="twitter:image" content="https://www.apexsalesai.com/images/social-preview.png" />
        <meta name="twitter:site" content="@apexsalesai" />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </Head>
      
      {/* Navigation Ribbon */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-20 mt-16">
        <header className="relative text-center text-white py-24 overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00c2cb]/10 via-transparent to-[#005f6b]/10 animate-gradient"></div>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <circle cx="200" cy="200" r="150" fill="#00c2cb" className="opacity-15 animate-float" />
              <circle cx="600" cy="150" r="120" fill="#005f6b" className="opacity-15 animate-float2" />
            </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Insights That Drive Execution</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">Explore practical AI use cases, GTM strategies, and automation frameworks designed to accelerate revenue outcomes.</p>
            <a href="#subscribe" className="inline-block bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Subscribe for AI Sales Insights
            </a>
          </div>
        </header>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-[#1a202c] rounded-2xl overflow-hidden shadow-lg relative flex flex-col md:flex-row hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <span className="absolute top-4 right-4 bg-[#00c2cb] text-[#0d1321] px-4 py-1 rounded-full font-semibold text-xs z-10">Featured</span>
            {featuredPost.image && (
              <div className="md:w-1/2 w-full h-72 md:h-auto relative flex-shrink-0">
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" 
                  className="object-cover" 
                />
              </div>
            )}
            <div className={`${featuredPost.image ? 'md:w-1/2' : 'w-full'} p-8 flex flex-col justify-center`}>
              <span className="text-[#00c2cb] text-sm mb-2">{featuredPost.date}</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredPost.tags.map((tag, i) => (
                  <span key={i} className="bg-[#00c2cb]/10 text-[#00c2cb] px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{featuredPost.title}</h2>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">{featuredPost.excerpt}</p>
              <a href={`/blog/${featuredPost.slug}`} className="inline-block bg-[#00c2cb] text-[#0d1321] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#00a8b3] transition">Read Article</a>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 p-4 bg-[#1a202c]/70 rounded-lg justify-center">
          {['All', 'AI & Automation', 'Sales Strategy', 'Customer Support', 'Industry Insights', 'Case Studies'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setSelectedTag(filter)}
              className={`border border-[#00c2cb] px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                selectedTag === filter 
                  ? 'bg-[#00c2cb] text-[#0d1321] shadow-lg scale-105' 
                  : 'bg-transparent text-[#00c2cb] hover:bg-[#00c2cb] hover:text-[#0d1321]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Results Counter */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            {selectedTag !== 'All' && (
              <button 
                onClick={() => setSelectedTag('All')}
                className="ml-2 text-[#00c2cb] hover:underline"
              >
                Clear filter
              </button>
            )}
          </p>
        </div>

        {/* Blog Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1e29] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group"
            >
              <article>
                {post.image && (
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[#00c2cb] text-xs mb-2">{post.date}</span>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs rounded-full px-3 py-1 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-300 mb-4 flex-1 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-[#00c2cb] hover:text-[#00a8b3] font-semibold transition-colors group-hover:translate-x-1 transform duration-200"
                    aria-label={`Read full article: ${post.title}`}
                  >
                    Read Article →
                  </a>
                </div>
              </article>
            </motion.div>
          ))}
        </section>

        {/* Newsletter Section */}
        <NewsletterSubscribe />
      </main>
    </>
  );
}
