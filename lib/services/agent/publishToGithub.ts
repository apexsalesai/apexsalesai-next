import { Octokit } from 'octokit';

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';
const branch = process.env.BLOG_TARGET_BRANCH || 'main';
const contentDir = process.env.BLOG_CONTENT_DIR || 'content/blog';

function toBase64(content: string): string {
  return Buffer.from(content, 'utf8').toString('base64');
}

export interface PublishOptions {
  title: string;
  slug?: string;
  frontmatter: Record<string, any>;
  body: string;
}

export async function publishMarkdown({
  title,
  slug,
  frontmatter,
  body,
}: PublishOptions) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured');
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // Generate safe slug
  const safeSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const date = new Date().toISOString().slice(0, 10);
  const filename = `${date}-${safeSlug}.md`;
  const path = `${contentDir}/${filename}`;

  // Build frontmatter
  const fm =
    '---\n' +
    Object.entries(frontmatter)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: [${v.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(', ')}]`;
        }
        return `${k}: "${String(v).replace(/"/g, '\\"')}"`;
      })
      .join('\n') +
    '\n---\n\n';

  const content = `${fm}${body.trim()}\n`;

  try {
    // Check if file already exists
    let sha: string | undefined;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (err: any) {
      // File doesn't exist, that's fine
      if (err.status !== 404) {
        throw err;
      }
    }

    // Create or update file
    const result = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message: sha 
        ? `chore(blog): update ${filename}` 
        : `chore(blog): publish ${filename}`,
      content: toBase64(content),
      ...(sha ? { sha } : {}),
      committer: {
        name: 'Max Content Agent',
        email: 'bot@apexsalesai.com',
      },
      author: {
        name: 'Max Content Agent',
        email: 'bot@apexsalesai.com',
      },
    });

    return {
      filename,
      path,
      branch,
      sha: result.data.content?.sha,
      url: result.data.content?.html_url,
    };
  } catch (error: any) {
    console.error('GitHub publish error:', error);
    throw new Error(`Failed to publish to GitHub: ${error.message}`);
  }
}
