import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import React from 'react';
import Markdown from 'react-markdown';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'app', 'blog');
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  return files.map(filename => ({ slug: filename.replace(/\.md$/, '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'app', 'blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return {};
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
  const filePath = path.join(process.cwd(), 'app', 'blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

  return (
    <>
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
      <main className="max-w-3xl mx-auto px-4 py-12">
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
