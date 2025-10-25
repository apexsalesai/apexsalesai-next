'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Edit2, 
  Save, 
  X, 
  Sparkles,
  Upload,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Globe,
  ArrowLeft,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

interface CareerProfile {
  id: string;
  headline: string;
  bio: string;
  skills: string[];
  portfolioUrls: string[];
  socialLinks: any;
  resumeUrl: string | null;
  visibility: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  role: string;
  outcome: string;
  url?: string;
}

const skillCategories = {
  Leadership: ['Team Management', 'Strategic Planning', 'Stakeholder Management'],
  AI: ['Machine Learning', 'GPT-4', 'Prompt Engineering', 'AI Strategy'],
  Tech: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  Design: ['UI/UX', 'Figma', 'Design Systems', 'User Research'],
};

const categoryColors = {
  Leadership: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300',
  AI: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
  Tech: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300',
  Design: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300',
};

export default function CareerCompanionEnhanced() {
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof skillCategories>('AI');

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'AI Sales Platform',
      description: 'Built enterprise-grade AI platform for B2B sales automation',
      imageUrl: '/api/placeholder/400/300',
      role: 'Lead Engineer',
      outcome: '300% increase in pipeline velocity',
      url: 'https://apexsalesai.com'
    },
    {
      id: '2',
      title: 'Revenue Intelligence Dashboard',
      description: 'Real-time analytics and forecasting system',
      imageUrl: '/api/placeholder/400/300',
      role: 'Product Lead',
      outcome: '$2M ARR generated',
    },
  ]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/career/profile', {
        headers: {
          'x-user-id': 'demo-user',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setHeadline(data.profile.headline);
          setBio(data.profile.bio);
          setSkills(data.profile.skills);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/career/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          headline,
          bio,
          skills,
          portfolioUrls: [],
          visibility: 'private',
        }),
      });

      if (res.ok) {
        await fetchProfile();
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const getSkillCategory = (skill: string): keyof typeof skillCategories => {
    for (const [category, categorySkills] of Object.entries(skillCategories)) {
      if (categorySkills.includes(skill)) {
        return category as keyof typeof skillCategories;
      }
    }
    return 'Tech';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-7xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="text-slate-400 text-lg">Loading your career profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <div className="relative z-10 p-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              href="/studio" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Studio
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Career Companion
                </h1>
                <p className="text-slate-400 text-lg">Your AI-powered career growth platform</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-300">{skills.length}</div>
                  <div className="text-sm text-slate-400">Skills Mastered</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Briefcase className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-300">{portfolioItems.length}</div>
                  <div className="text-sm text-slate-400">Portfolio Projects</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-300">92%</div>
                  <div className="text-sm text-slate-400">Profile Strength</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Profile</h2>
                  {!editing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditing(false);
                          fetchProfile();
                        }}
                        className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800/80 rounded-xl font-semibold transition-all border border-slate-700/50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveProfile}
                        disabled={saving}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30 flex items-center gap-2"
                      >
                        {saving ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Avatar with growth rings */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Growth rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 opacity-20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.1, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.05, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-6xl shadow-2xl">
                      👤
                    </div>
                  </motion.div>
                </div>

                {/* Headline */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Headline</label>
                  {editing ? (
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g., Senior Product Manager at Tech Startup"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {profile?.headline || 'Add your professional headline'}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    />
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {profile?.bio || 'Add a bio to tell your story'}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-slate-800/50">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Connect</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: Linkedin, color: 'from-blue-500 to-blue-600', label: 'LinkedIn' },
                      { icon: Github, color: 'from-gray-700 to-gray-800', label: 'GitHub' },
                      { icon: Twitter, color: 'from-cyan-500 to-blue-500', label: 'Twitter' },
                      { icon: Globe, color: 'from-purple-500 to-pink-500', label: 'Website' },
                    ].map((social, idx) => (
                      <motion.button
                        key={social.label}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 bg-gradient-to-br ${social.color} rounded-xl shadow-lg hover:shadow-xl transition-all`}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Skills & Portfolio */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills Matrix */}
              <motion.div variants={itemVariants}>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Skills Matrix
                    </h2>
                    {editing && (
                      <div className="flex gap-2">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value as keyof typeof skillCategories)}
                          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm"
                        >
                          {Object.keys(skillCategories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {editing && (
                    <div className="mb-4 flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addSkill(newSkill)}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {Object.entries(skillCategories).map(([category, categorySkills]) => {
                      const userSkillsInCategory = skills.filter(skill => categorySkills.includes(skill));
                      if (userSkillsInCategory.length === 0 && !editing) return null;

                      return (
                        <div key={category}>
                          <h3 className="text-sm font-semibold text-slate-400 mb-2">{category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {userSkillsInCategory.map((skill, idx) => (
                              <motion.span
                                key={skill}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className={`px-4 py-2 bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-xl text-sm font-semibold border flex items-center gap-2 shadow-lg`}
                              >
                                {skill}
                                {editing && (
                                  <button
                                    onClick={() => removeSkill(skill)}
                                    className="hover:text-red-400 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Resume Section */}
              <motion.div variants={itemVariants}>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-cyan-400" />
                    Resume
                  </h2>
                  
                  {profile?.resumeUrl ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-300">Resume uploaded</p>
                            <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                          </div>
                          <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                          >
                            Download
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        Optimize with AI
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-6">Upload your resume to get started</p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 mx-auto"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Resume
                      </motion.button>
                      <p className="text-xs text-slate-500 mt-4">Supports PDF, DOC, DOCX (max 10MB)</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Portfolio Grid */}
              <motion.div variants={itemVariants}>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-purple-400" />
                      Portfolio
                    </h2>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Project
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group relative bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                      >
                        <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-slate-600" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-400 mb-2">{item.role}</p>
                          <p className="text-sm text-slate-300 mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {item.outcome}
                            </span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
