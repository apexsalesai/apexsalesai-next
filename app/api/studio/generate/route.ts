/**
 * AI Content Generation Engine
 * Supports B2B (enterprise marketing) and B2C (personal branding/job hunting)
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Content type definitions for both B2B and B2C markets
type ContentChannel = 
  // B2B Channels
  | 'email-campaign' 
  | 'linkedin-post' 
  | 'blog-article' 
  | 'case-study'
  | 'whitepaper'
  | 'sales-deck'
  // B2C Channels
  | 'resume'
  | 'cover-letter'
  | 'linkedin-profile'
  | 'personal-brand-post'
  | 'job-application'
  | 'portfolio-description'
  // Universal
  | 'twitter-thread'
  | 'video-script'
  | 'instagram-caption'
  | 'tiktok-script';

type MarketMode = 'B2B' | 'B2C';

interface GenerationRequest {
  campaignId?: string;
  channel: ContentChannel;
  goal: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  targetAudience?: string;
  keywords?: string[];
  mode?: MarketMode;
  // B2C specific
  jobTitle?: string;
  industry?: string;
  experience?: string;
  // B2B specific
  companyName?: string;
  productName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerationRequest = await req.json();
    
    // Validate
    if (!body.channel || !body.goal) {
      return NextResponse.json(
        { error: 'channel and goal are required' },
        { status: 400 }
      );
    }

    // Check OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const mode = body.mode || (isB2CChannel(body.channel) ? 'B2C' : 'B2B');
    
    console.log(`[AI Engine] Generating ${body.channel} content for ${mode} market`);

    // Build system prompt based on market mode
    const systemPrompt = mode === 'B2B' 
      ? buildB2BSystemPrompt(body.channel)
      : buildB2CSystemPrompt(body.channel);

    // Build user prompt
    const userPrompt = buildUserPrompt(body);

    // Generate content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: getMaxTokens(body.length || 'medium'),
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    // Save to database if campaignId provided
    let assetId: string | undefined;
    if (body.campaignId) {
      try {
        const asset = await prisma.contentAsset.create({
          data: {
            campaignId: body.campaignId,
            type: mapChannelToAssetType(body.channel),
            title: extractTitle(generatedContent, body.goal),
            body: generatedContent, // ContentAsset uses 'body' not 'content'
            metadata: {
              channel: body.channel,
              mode,
              tone: body.tone,
              length: body.length,
              keywords: body.keywords,
            },
            status: 'draft', // lowercase status
          },
        });
        assetId = asset.id;
      } catch (dbError) {
        console.error('Failed to save asset:', dbError);
        // Continue even if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      output: generatedContent,
      content: generatedContent,
      metadata: {
        channel: body.channel,
        mode,
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4o',
        assetId,
      },
    });

  } catch (error: any) {
    console.error('[AI Engine] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Content generation failed', output: '' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions

function isB2CChannel(channel: ContentChannel): boolean {
  const b2cChannels: ContentChannel[] = [
    'resume',
    'cover-letter',
    'linkedin-profile',
    'personal-brand-post',
    'job-application',
    'portfolio-description',
  ];
  return b2cChannels.includes(channel);
}

function buildB2BSystemPrompt(channel: ContentChannel): string {
  const basePrompt = `You are an expert B2B marketing and sales content strategist. You create compelling, professional content that drives business outcomes.`;
  
  const channelSpecifics: Record<string, string> = {
    'email-campaign': 'You specialize in high-converting B2B email campaigns with clear CTAs.',
    'linkedin-post': 'You create engaging LinkedIn posts for business leaders that drive engagement and thought leadership.',
    'blog-article': 'You write authoritative, SEO-optimized blog articles that establish industry expertise.',
    'case-study': 'You craft compelling case studies with clear ROI and business impact metrics.',
    'whitepaper': 'You produce in-depth whitepapers that educate and position solutions as industry leaders.',
    'sales-deck': 'You design persuasive sales presentations that address pain points and showcase value.',
  };

  return `${basePrompt}\n\n${channelSpecifics[channel] || 'You create professional business content.'}`;
}

function buildB2CSystemPrompt(channel: ContentChannel): string {
  const basePrompt = `You are an expert career coach and personal branding strategist. You help individuals showcase their unique value and achieve their professional goals.`;
  
  const channelSpecifics: Record<string, string> = {
    'resume': 'You create ATS-optimized resumes that highlight achievements and get interviews.',
    'cover-letter': 'You write compelling cover letters that tell authentic stories and connect with hiring managers.',
    'linkedin-profile': 'You optimize LinkedIn profiles for visibility, credibility, and opportunity.',
    'personal-brand-post': 'You craft authentic personal brand content that builds professional reputation.',
    'job-application': 'You create tailored job applications that stand out and demonstrate fit.',
    'portfolio-description': 'You write compelling portfolio descriptions that showcase skills and results.',
  };

  return `${basePrompt}\n\n${channelSpecifics[channel] || 'You create professional personal branding content.'}`;
}

function buildUserPrompt(req: GenerationRequest): string {
  const parts: string[] = [];
  
  parts.push(`Goal: ${req.goal}`);
  
  if (req.targetAudience) {
    parts.push(`Target Audience: ${req.targetAudience}`);
  }
  
  if (req.tone) {
    parts.push(`Tone: ${req.tone}`);
  }
  
  if (req.length) {
    const lengthMap = {
      short: '200-400 words',
      medium: '500-800 words',
      long: '1000-1500 words',
    };
    parts.push(`Length: ${lengthMap[req.length]}`);
  }
  
  if (req.keywords && req.keywords.length > 0) {
    parts.push(`Keywords to include: ${req.keywords.join(', ')}`);
  }

  // B2C specific
  if (req.jobTitle) {
    parts.push(`Job Title: ${req.jobTitle}`);
  }
  if (req.industry) {
    parts.push(`Industry: ${req.industry}`);
  }
  if (req.experience) {
    parts.push(`Experience Level: ${req.experience}`);
  }

  // B2B specific
  if (req.companyName) {
    parts.push(`Company: ${req.companyName}`);
  }
  if (req.productName) {
    parts.push(`Product/Service: ${req.productName}`);
  }

  return parts.join('\n');
}

function getMaxTokens(length: 'short' | 'medium' | 'long'): number {
  const tokenMap = {
    short: 800,
    medium: 1500,
    long: 2500,
  };
  return tokenMap[length];
}

function mapChannelToAssetType(channel: ContentChannel): string {
  const typeMap: Record<string, string> = {
    'email-campaign': 'EMAIL',
    'linkedin-post': 'SOCIAL',
    'blog-article': 'BLOG',
    'case-study': 'DOCUMENT',
    'whitepaper': 'DOCUMENT',
    'sales-deck': 'PRESENTATION',
    'resume': 'DOCUMENT',
    'cover-letter': 'DOCUMENT',
    'linkedin-profile': 'PROFILE',
    'personal-brand-post': 'SOCIAL',
    'job-application': 'DOCUMENT',
    'portfolio-description': 'DOCUMENT',
    'twitter-thread': 'SOCIAL',
    'video-script': 'VIDEO',
    'instagram-caption': 'SOCIAL',
    'tiktok-script': 'VIDEO',
  };
  return typeMap[channel] || 'TEXT';
}

function extractTitle(content: string, goal: string): string {
  // Try to extract first line or heading
  const lines = content.split('\n').filter(l => l.trim());
  const firstLine = lines[0]?.replace(/^#+\s*/, '').trim();
  
  if (firstLine && firstLine.length < 100) {
    return firstLine;
  }
  
  // Fallback to goal
  return goal.substring(0, 100);
}
