import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import { marked } from 'marked';
import { redirect } from 'next/navigation';

// Server-side session check placeholder (replace with your real auth logic)
function isUserLoggedIn() {
  // In a real app, use cookies, JWT, or NextAuth
  // For now, block access (simulate private route)
  return false;
}

export default async function KnowledgeBasePage() {
  // Server-side auth check (replace with your real auth logic)
  if (!isUserLoggedIn()) {
    redirect('/'); // Block access if not logged in
  }

  // List all markdown files in /knowledge-base
  const kbDir = path.join(process.cwd(), 'knowledge-base');
  const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.md'));

  const docs = files.map(file => {
    const filePath = path.join(kbDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: mdContent } = matter(content);
    return {
      name: file.replace(/\.md$/, ''),
      title: data.title || file.replace(/-/g, ' ').replace(/\.md$/, ''),
      content: marked.parse(mdContent)
    };
  });

  // Render
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24, background: '#181c20', borderRadius: 12, color: '#fff' }}>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>ApexSalesAI Knowledge Base</h1>
      <ul style={{ marginBottom: 40 }}>
        {docs.map(doc => (
          <li key={doc.name} style={{ marginBottom: 12 }}>
            <a href={`#${doc.name}`} style={{ color: '#00c2cb', fontWeight: 600, fontSize: 20 }}>{doc.title}</a>
          </li>
        ))}
      </ul>
      {docs.map(doc => (
        <section key={doc.name} id={doc.name} style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#00c2cb', borderBottom: '1px solid #23272f', paddingBottom: 8 }}>{doc.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: typeof doc.content === 'string' ? doc.content : '' }} />
        </section>
      ))}
    </div>
  );
}
