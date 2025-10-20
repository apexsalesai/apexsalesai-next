'use client';

import React, { useState } from 'react';
import { SocialPostGenerator } from './SocialPostGenerator';

/**
 * Max Content Agent - OpenAI ChatKit Integration
 * This component embeds the Content Engine agent built with OpenAI's Agent Builder
 */

interface MaxContentAgentProps {
  agentId?: string;
  apiKey?: string;
  onContentCreated?: (content: any) => void;
}

export function MaxContentAgent({ 
  agentId = 'your-agent-id', 
  apiKey,
  onContentCreated 
}: MaxContentAgentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'schedule' | 'history'>('chat');
  const [showSocialGenerator, setShowSocialGenerator] = useState(false);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '2px solid #4299e1',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🤖
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px', color: '#1a202c' }}>
                Max - Content Engine
              </h2>
              <p style={{ fontSize: '13px', color: '#718096' }}>
                Autonomous content creation & scheduling
              </p>
            </div>
          </div>
          
          <div style={{
            padding: '6px 12px',
            backgroundColor: '#48bb78',
            color: '#ffffff',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600
          }}>
            ● ACTIVE
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '8px'
      }}>
        {(['chat', 'schedule', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#4299e1' : '#718096',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #4299e1' : 'none',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div>
          {/* ChatKit Embed */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#f7fafc',
            minHeight: '400px',
            marginBottom: '16px'
          }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
                🔌 ChatKit Agent Integration
              </p>
              <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '20px' }}>
                Embed your OpenAI Agent Builder workflow here
              </p>
              
              {/* Placeholder for ChatKit embed */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px dashed #cbd5e0',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <code style={{
                  fontSize: '12px',
                  color: '#4a5568',
                  backgroundColor: '#edf2f7',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {`<script src="https://platform.openai.com/chatkit/${agentId}"></script>`}
                </code>
                <p style={{ fontSize: '12px', color: '#a0aec0' }}>
                  Replace with your actual ChatKit embed code
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/dashboard/operator-agent-fixed'}
              style={{
                padding: '12px',
                backgroundColor: '#4299e1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📝 Generate Blog Post
            </button>
            <button 
              onClick={() => setShowSocialGenerator(true)}
              style={{
                padding: '12px',
                backgroundColor: '#48bb78',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📱 Create Social Posts
            </button>
          </div>
          
          {/* Social Post Generator Modal */}
          <SocialPostGenerator 
            isOpen={showSocialGenerator}
            onClose={() => setShowSocialGenerator(false)}
          />
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div>
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#2d3748' }}>
              Content Schedule
            </h3>
            
            {/* Daily Social Media */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>
                    📱 Daily Social Media Updates
                  </p>
                  <p style={{ fontSize: '12px', color: '#718096' }}>
                    LinkedIn, Twitter, Facebook - 9:00 AM EST
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                  <span style={{ fontSize: '12px', color: '#4a5568' }}>Enabled</span>
                </label>
              </div>
            </div>

            {/* Weekly Blog Posts */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>
                    📝 Weekly Blog Posts
                  </p>
                  <p style={{ fontSize: '12px', color: '#718096' }}>
                    Every Monday - 10:00 AM EST
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                  <span style={{ fontSize: '12px', color: '#4a5568' }}>Enabled</span>
                </label>
              </div>
            </div>

            {/* YouTube Videos */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>
                    🎥 YouTube Videos
                  </p>
                  <p style={{ fontSize: '12px', color: '#718096' }}>
                    Bi-weekly - Wednesday 2:00 PM EST
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ marginRight: '8px' }} />
                  <span style={{ fontSize: '12px', color: '#4a5568' }}>Enabled</span>
                </label>
              </div>
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#fef5e7',
                border: '1px solid #f9e79f',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#7d6608'
              }}>
                ⚠️ Video generation requires additional setup
              </div>
            </div>
          </div>

          {/* Add New Schedule */}
          <button style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#ffffff',
            color: '#4299e1',
            border: '2px dashed #4299e1',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            + Add New Schedule
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div style={{
            backgroundColor: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#2d3748' }}>
              Recent Content
            </h3>
            
            {/* Content History Items */}
            {[
              { type: 'Blog', title: 'How AI Agents Transform Revenue Operations', date: 'Today, 10:00 AM', status: 'Published' },
              { type: 'Social', title: 'LinkedIn post about AI ROI', date: 'Today, 9:00 AM', status: 'Published' },
              { type: 'Social', title: 'Twitter thread on sales automation', date: 'Yesterday, 9:00 AM', status: 'Published' },
              { type: 'Blog', title: 'The Future of Autonomous Sales', date: '2 days ago', status: 'Published' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: item.type === 'Blog' ? '#ebf8ff' : '#f0fff4',
                      color: item.type === 'Blog' ? '#2c5282' : '#22543d',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2d3748' }}>
                      {item.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#718096' }}>
                    {item.date}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#c6f6d5',
                  color: '#22543d',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#2d3748' }}>127</p>
          <p style={{ fontSize: '12px', color: '#718096' }}>Posts Created</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#2d3748' }}>18</p>
          <p style={{ fontSize: '12px', color: '#718096' }}>Blog Articles</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#2d3748' }}>4.2K</p>
          <p style={{ fontSize: '12px', color: '#718096' }}>Engagement</p>
        </div>
      </div>
    </div>
  );
}
