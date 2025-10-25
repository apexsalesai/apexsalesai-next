/**
 * Dynamic Campaign Detail Page
 * Fixes 404 errors when clicking "View →" on campaign cards
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Target, TrendingUp, Users } from 'lucide-react';

// This will be replaced with actual Prisma query
async function getCampaign(id: string) {
  // Mock data for now - replace with:
  // const campaign = await prisma.campaign.findUnique({ where: { id } });
  
  return {
    id,
    name: `Campaign ${id.slice(0, 8)}`,
    goal: 'Increase brand awareness and generate qualified leads',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    channels: ['LinkedIn', 'X', 'Blog'],
    budget: 5000,
    spent: 1250,
    leads: 47,
    engagement: 892,
  };
}

export default async function CampaignDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const campaign = await getCampaign(params.id);
  
  if (!campaign) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/studio" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Studio
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {campaign.name}
              </h1>
              <p className="text-slate-400 text-lg">{campaign.goal}</p>
            </div>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 font-semibold">
                {campaign.status}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Leads Generated</span>
            </div>
            <div className="text-3xl font-bold text-cyan-300">{campaign.leads}</div>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Engagement</span>
            </div>
            <div className="text-3xl font-bold text-green-300">{campaign.engagement}</div>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Channels</span>
            </div>
            <div className="text-3xl font-bold text-purple-300">{campaign.channels.length}</div>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-400">Budget Used</span>
            </div>
            <div className="text-3xl font-bold text-orange-300">
              {Math.round((campaign.spent / campaign.budget) * 100)}%
            </div>
          </div>
        </div>

        {/* Content Generation Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generate Content for This Campaign</h2>
          <p className="text-slate-400 mb-6">
            Create AI-powered content optimized for your campaign goals and target channels.
          </p>
          
          {/* Content generation form will go here */}
          <div className="p-8 bg-slate-800/30 border border-slate-700/50 rounded-xl text-center">
            <p className="text-slate-400 mb-4">Content generation module coming soon</p>
            <Link 
              href="/studio/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all"
            >
              Go to Content Generator
            </Link>
          </div>
        </div>

        {/* Campaign Timeline */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Campaign Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold">Campaign Started</div>
                <div className="text-sm text-slate-400">
                  {campaign.startDate.toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold">First Content Published</div>
                <div className="text-sm text-slate-400">LinkedIn post went live</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold">Campaign Ends</div>
                <div className="text-sm text-slate-400">
                  {campaign.endDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
