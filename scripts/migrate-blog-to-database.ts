/**
 * Migration Script: Markdown Blog Posts → Database
 * 
 * This script migrates existing markdown blog posts from the filesystem
 * to the Prisma database, preserving all metadata and content.
 * 
 * Usage:
 *   npx tsx scripts/migrate-blog-to-database.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

interface MarkdownPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

/**
 * Read all markdown files from content/blog and app/blog directories
 */
function getAllMarkdownPosts(): MarkdownPost[] {
  const posts: MarkdownPost[] = [];
  const directories = [
    path.join(process.cwd(), 'content', 'blog'),
    path.join(process.cwd(), 'app', 'blog'),
  ];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    console.log(`📁 Found ${files.length} markdown files in ${dir}`);

    for (const filename of files) {
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      // Extract slug from filename (remove date prefix if present)
      let slug = filename.replace(/\.md$/, '');
      slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, ''); // Remove YYYY-MM-DD- prefix

      posts.push({
        slug,
        title: data.title || slug,
        content,
        excerpt: data.excerpt || content.substring(0, 200),
        date: data.date || new Date().toISOString(),
        author: data.author || 'ApexSalesAI Editorial Team',
        image: data.image,
        tags: Array.isArray(data.tags) ? data.tags : [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
      });
    }
  }

  // Remove duplicates (same slug from different directories)
  const uniquePosts = posts.reduce((acc, post) => {
    if (!acc.find(p => p.slug === post.slug)) {
      acc.push(post);
    }
    return acc;
  }, [] as MarkdownPost[]);

  return uniquePosts;
}

/**
 * Migrate posts to database
 */
async function migratePosts() {
  console.log('🚀 Starting blog migration to database...\n');

  try {
    // Read all markdown posts
    const posts = getAllMarkdownPosts();
    console.log(`📊 Found ${posts.length} unique blog posts to migrate\n`);

    if (posts.length === 0) {
      console.log('⚠️  No posts found to migrate');
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      try {
        // Check if post already exists
        const existing = await prisma.blogPost.findUnique({
          where: { slug: post.slug }
        });

        if (existing) {
          console.log(`⏭️  Skipping "${post.title}" (already exists)`);
          skippedCount++;
          continue;
        }

        // Create post in database
        await prisma.blogPost.create({
          data: {
            slug: post.slug,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            image: post.image,
            author: post.author,
            tags: post.tags,
            keywords: post.keywords || [],
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            status: 'PUBLISHED', // Existing posts are published
            publishedAt: new Date(post.date),
            createdBy: 'migration-script',
            createdByEmail: 'system@apexsalesai.com',
            generatedBy: 'Migration Script',
            generationModel: 'legacy-markdown',
            complianceChecked: true,
            complianceStatus: 'approved',
          }
        });

        console.log(`✅ Migrated: "${post.title}"`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error migrating "${post.title}":`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total posts processed: ${posts.length}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('🎉 Migration completed successfully!');
      console.log('💡 Next steps:');
      console.log('   1. Verify posts in database');
      console.log('   2. Update blog routes to use database');
      console.log('   3. Deploy to production\n');
    }

  } catch (error: any) {
    console.error('💥 Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Verify migration
 */
async function verifyMigration() {
  console.log('🔍 Verifying migration...\n');

  try {
    const totalPosts = await prisma.blogPost.count();
    const publishedPosts = await prisma.blogPost.count({
      where: { status: 'PUBLISHED' }
    });
    const draftPosts = await prisma.blogPost.count({
      where: { status: 'DRAFT' }
    });

    console.log('📊 Database Statistics:');
    console.log(`   Total posts: ${totalPosts}`);
    console.log(`   Published: ${publishedPosts}`);
    console.log(`   Drafts: ${draftPosts}\n`);

    // Show sample posts
    const samplePosts = await prisma.blogPost.findMany({
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
      }
    });

    console.log('📝 Sample Posts:');
    for (const post of samplePosts) {
      console.log(`   - ${post.title}`);
      console.log(`     Slug: ${post.slug}`);
      console.log(`     Status: ${post.status}`);
      console.log(`     Published: ${post.publishedAt?.toLocaleDateString() || 'N/A'}\n`);
    }

  } catch (error: any) {
    console.error('❌ Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'verify') {
    await verifyMigration();
  } else if (command === 'migrate') {
    await migratePosts();
  } else {
    console.log('📖 Usage:');
    console.log('   npx tsx scripts/migrate-blog-to-database.ts migrate  - Run migration');
    console.log('   npx tsx scripts/migrate-blog-to-database.ts verify   - Verify migration\n');
    
    // Default: run migration
    await migratePosts();
  }
}

main()
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
