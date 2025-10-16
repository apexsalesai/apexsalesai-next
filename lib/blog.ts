import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog posts from content/blog directory
 */
export function getAllBlogPosts(): BlogPost[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(contentDirectory)) {
      console.warn('Blog content directory does not exist:', contentDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'ApexSalesAI Editorial Team',
          excerpt: data.excerpt || content.substring(0, 200) + '...',
          image: data.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          tags: data.tags || [],
          content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
        } as BlogPost;
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'ApexSalesAI Editorial Team',
      excerpt: data.excerpt || content.substring(0, 200) + '...',
      image: data.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      tags: data.tags || [],
      content,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get fallback/default blog posts (for when content directory is empty)
 */
export function getDefaultBlogPosts(): BlogPost[] {
  return [
    {
      slug: 'ai-revenue-teams',
      title: 'The Rise of Autonomous Revenue Teams',
      date: '2025-04-22',
      author: 'ApexSalesAI Editorial',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Discover how AI agents are reshaping go-to-market operations, helping teams do more with less — and scale without headcount.',
      tags: ['AI Agents', 'Revenue Operations', 'Enterprise Strategy'],
      content: '',
    },
    {
      slug: 'ai-sales-future',
      title: 'The Future of Sales: How AI is Reshaping Revenue Operations',
      date: '2025-05-15',
      author: 'Dr. Sarah Chen, AI Strategy Director',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'The convergence of AI and sales operations is creating unprecedented opportunities for revenue growth.',
      tags: ['AI', 'Sales Strategy', 'Revenue Operations'],
      content: '',
    },
    {
      slug: 'predictive-analytics',
      title: 'Maximizing ROI with Predictive Sales Intelligence',
      date: '2025-05-10',
      author: 'Michael Thompson, Chief Revenue Officer',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Discover how leading enterprises are leveraging predictive analytics to identify high-value opportunities.',
      tags: ['Analytics', 'ROI', 'Sales Optimization'],
      content: '',
    },
  ];
}
