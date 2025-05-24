'use client';
import React, { useState } from 'react';

import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';

const featuredPost = {
  title: "The Rise of Autonomous Revenue Teams",
  date: "April 22, 2025",
  author: "ApexSalesAI Editorial",
  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Teamwork/AI
  excerpt: "Discover how AI agents are reshaping go-to-market operations, helping teams do more with less — and scale without headcount. This comprehensive analysis explores real-world case studies from Fortune 500 companies deploying AI agents across their revenue org.",
  tags: ["AI Agents", "Revenue Operations", "Enterprise Strategy"],
  slug: "ai-revenue-teams"
};

const blogPosts = [
  {
    title: "The Future of Sales: How AI is Reshaping Revenue Operations",
    date: "May 15, 2025",
    author: "Dr. Sarah Chen, AI Strategy Director",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", // Futuristic sales
    excerpt: "The convergence of AI and sales operations is creating unprecedented opportunities for revenue growth. Learn how predictive analytics and autonomous execution are transforming the sales landscape.",
    tags: ["AI", "Sales Strategy", "Revenue Operations"],
    slug: "ai-sales-future"
  },
  {
    title: "Maximizing ROI with Predictive Sales Intelligence",
    date: "May 10, 2025",
    author: "Michael Thompson, Chief Revenue Officer",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Analytics
    excerpt: "Discover how leading enterprises are leveraging predictive analytics to identify high-value opportunities and optimize their sales funnels for maximum ROI.",
    tags: ["Analytics", "ROI", "Sales Optimization"],
    slug: "predictive-analytics"
  },
  {
    title: "The Rise of Autonomous Sales Execution",
    date: "May 5, 2025",
    author: "Lisa Martinez, AI Product Lead",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", // Automation/AI
    excerpt: "Explore the capabilities of our autonomous sales agents and how they're revolutionizing the way businesses engage with their customers at scale.",
    tags: ["AI Agents", "Sales Automation", "Customer Engagement"],
    slug: "autonomous-sales"
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
<main className="container mx-auto px-4 py-20">
        <header className="relative text-center text-white py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <circle cx="200" cy="200" r="150" fill="#00c2cb" className="opacity-15 animate-float" />
              <circle cx="600" cy="150" r="120" fill="#005f6b" className="opacity-15 animate-float2" />
            </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Insights That Drive Execution</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Explore practical AI use cases, GTM strategies, and automation frameworks designed to accelerate revenue outcomes.</p>
          </div>
        </header>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-[#1a202c] rounded-2xl overflow-hidden shadow-lg relative flex flex-col md:flex-row">
            <span className="absolute top-4 right-4 bg-[#00c2cb] text-[#0d1321] px-4 py-1 rounded-full font-semibold text-xs">Featured</span>
            <div className="md:w-1/2 w-full h-72 md:h-auto relative">
              <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" className="object-cover" />
            </div>
            <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
              <span className="text-[#00c2cb] text-sm mb-2">{featuredPost.date}</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredPost.tags.map((tag, i) => (
                  <span key={i} className="bg-[#00c2cb]/10 text-[#00c2cb] px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{featuredPost.title}</h2>
              <p className="text-gray-300 mb-4">{featuredPost.excerpt}</p>
              <a href={`/blog/${featuredPost.slug}`} className="inline-block bg-[#00c2cb] text-[#0d1321] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#00a8b3] transition">Read Article</a>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 p-4 bg-[#1a202c]/70 rounded-lg justify-center">
          {['All', 'AI & Automation', 'Sales Strategy', 'Customer Support', 'Industry Insights', 'Case Studies'].map((filter, i) => (
            <button key={i} className={`border border-[#00c2cb] px-4 py-2 rounded-full font-medium text-sm transition ${i===0 ? 'bg-[#00c2cb] text-[#0d1321]' : 'bg-transparent text-[#00c2cb] hover:bg-[#00c2cb] hover:text-[#0d1321]'}`}>{filter}</button>
          ))}
        </div>

        {/* Blog Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1e29] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <article>
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
                  <h2 className="text-xl font-bold text-white mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-blue-600 hover:underline font-semibold"
                    aria-label={`Read full article: ${post.title}`}
                  >
                    Read Article
                  </a>
                </div>
              </article>
            </motion.div>
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="bg-[#1a202c] rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-2">Stay Updated on AI Sales & Support Trends</h3>
          <p className="text-gray-300 mb-6">Join 15,000+ revenue leaders receiving our bi-weekly insights on AI-powered GTM execution.</p>
          <NewsletterSubscribeForm />
        </section>
      </main>
    </>
  );
}
