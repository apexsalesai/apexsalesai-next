import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import React from 'react';
import Markdown from 'react-markdown';
import Navbar from '../../components/Navbar';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateStaticParams() {
  // Check both locations for blog posts
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const appDir = path.join(process.cwd(), 'app', 'blog');
  
  let files: string[] = [];
  
  if (fs.existsSync(contentDir)) {
    files = [...files, ...fs.readdirSync(contentDir).filter(file => file.endsWith('.md'))];
  }
  
  if (fs.existsSync(appDir)) {
    files = [...files, ...fs.readdirSync(appDir).filter(file => file.endsWith('.md'))];
  }
  
  // Remove duplicates, .md extension, AND date prefix (YYYY-MM-DD-)
  const uniqueSlugs = [...new Set(files.map(filename => {
    // Remove .md extension
    let slug = filename.replace(/\.md$/, '');
    
    // Remove date prefix if present (YYYY-MM-DD-)
    slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    
    return slug;
  }))];
  
  return uniqueSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Helper to find file with or without date prefix
  const findFile = (dir: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    
    const files = fs.readdirSync(dir);
    const matchingFile = files.find(file => 
      file.endsWith('.md') && 
      (file === `${slug}.md` || file.match(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${slug}\\.md`)))
    );
    
    return matchingFile ? path.join(dir, matchingFile) : null;
  };
  
  // Try content/blog first, then app/blog
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const appDir = path.join(process.cwd(), 'app', 'blog');
  
  const filePath = findFile(contentDir) || findFile(appDir);
  
  if (!filePath || !fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  return {
    title: data.title || 'Blog Article | ApexSalesAI',
    description: data.excerpt || '',
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: data.image ? [{ url: data.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt,
      image: data.image,
    },
  };
}

export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  // First, try to find the post in the database (for AI-generated posts)
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        content: true,
        excerpt: true,
        image: true,
        author: true,
        publishedAt: true,
        tags: true,
      }
    });

    if (dbPost && dbPost.publishedAt) {
      // Found in database - render it
      const data = {
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        image: dbPost.image,
        author: dbPost.author,
        date: dbPost.publishedAt.toISOString().split('T')[0],
        tags: dbPost.tags,
      };
      const content = dbPost.content;

      return (
        <>
          <Navbar />
          <Head>
            <title>{data.title} | ApexSalesAI</title>
            <meta name="description" content={data.excerpt} />
          </Head>
          <main className="max-w-3xl mx-auto px-4 py-12 mt-16">
            <article>
              {data.image && (
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-64 object-cover rounded-lg mb-8"
                  style={{ maxHeight: '320px' }}
                />
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-snug text-white">{data.title}</h1>
              <div className="text-sm text-gray-400 mb-6 font-normal">
                {data.author} <span className="mx-2">•</span> {data.date}
              </div>
              <div className="prose prose-invert max-w-none">
                <Markdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="mt-8 mb-3 text-xl font-bold text-[#00c2cb]" {...props} />,
                    h3: ({node, ...props}) => <h3 className="mt-6 mb-2 text-lg font-semibold text-[#00c2cb]" {...props} />,
                    p: ({node, ...props}) => <p className="mb-5 leading-7 text-gray-300 text-[15px]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-5" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-5" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#00c2cb] pl-4 italic text-gray-400 mb-5" {...props} />,
                    img: ({node, ...props}) => <img className="rounded-lg my-8" {...props} />,
                    a: ({node, ...props}) => <a className="text-[#00c2cb] underline hover:text-[#00a8b3]" {...props} />,
                  }}
                >
                  {content}
                </Markdown>
              </div>
            </article>
          </main>
        </>
      );
    }
  } catch (error) {
    console.error('Error fetching post from database:', error);
    // Fall through to markdown file lookup
  }

  // If not in database, try markdown files (for legacy posts)
  const findFile = (dir: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    
    const files = fs.readdirSync(dir);
    const matchingFile = files.find(file => 
      file.endsWith('.md') && 
      (file === `${slug}.md` || file.match(new RegExp(`\\d{4}-\\d{2}-\\d{2}-${slug}\\.md`)))
    );
    
    return matchingFile ? path.join(dir, matchingFile) : null;
  };
  
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const appDir = path.join(process.cwd(), 'app', 'blog');
  
  const filePath = findFile(contentDir) || findFile(appDir);
  
  if (!filePath || !fs.existsSync(filePath)) return notFound();
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

  return (
    <>
      <Navbar />
      <Head>
        <title>{data.title} | ApexSalesAI</title>
        <meta name="description" content={data.excerpt} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.excerpt} />
        {data.image && <meta property="og:image" content={data.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.excerpt} />
        {data.image && <meta name="twitter:image" content={data.image} />}
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12 mt-16">
  <article>
    {data.image && (
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-64 object-cover rounded-lg mb-8"
        style={{ maxHeight: '320px' }}
      />
    )}
    <h1 className="text-4xl font-bold mb-4 leading-tight text-white drop-shadow-md">{data.title}</h1>
    <div className="text-base text-gray-400 mb-8 font-medium">
      {data.author} <span className="mx-2">|</span> {data.date}
    </div>
    <div className="prose prose-invert prose-lg max-w-none mb-4">
      <Markdown
        components={{
          h2: ({node, ...props}) => <h2 className="mt-10 mb-4 text-2xl font-bold text-[#00c2cb]" {...props} />,
          h3: ({node, ...props}) => <h3 className="mt-8 mb-3 text-xl font-semibold text-[#00c2cb]" {...props} />,
          p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-gray-200" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-5" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-5" {...props} />,
          li: ({node, ...props}) => <li className="mb-2" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#00c2cb] pl-4 italic text-gray-400 mb-5" {...props} />,
          img: ({node, ...props}) => <img className="rounded-lg my-8" {...props} />,
          a: ({node, ...props}) => <a className="text-[#00c2cb] underline hover:text-[#00a8b3]" {...props} />,
        }}
      >
        {content}
      </Markdown>
    </div>
  </article>
</main>
    </>
  );
}
