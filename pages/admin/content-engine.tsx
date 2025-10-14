import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { MaxContentAgent } from '../../app/components/MaxContentAgent';
import { ContentGeneratorPanel } from '../../app/components/ContentGeneratorPanel';

/**
 * Admin-Only Content Engine Dashboard
 * Protected route for generating and scheduling content
 */
export default function ContentEngineDashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'generate' | 'schedule' | 'history'>('generate');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login?returnTo=/admin/content-engine');
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#4299e1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '14px', color: '#718096' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if no user
  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7fafc',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              🤖 Max Content Engine
            </h1>
            <p style={{ fontSize: '16px', color: '#718096' }}>
              Generate and schedule content for apexsalesai.com/blog
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#4a5568'
            }}>
              👤 {user.name || user.email}
            </div>
            <a
              href="/api/auth/logout"
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#e53e3e',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Logout
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          {(['generate', 'schedule', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? '#4299e1' : '#718096',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #4299e1' : 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: '-2px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {activeTab === 'generate' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Simple Generator */}
            <div>
              <ContentGeneratorPanel 
                onContentGenerated={(content) => {
                  console.log('Content generated:', content);
                  // Optionally refresh history
                }}
              />
            </div>

            {/* Max Agent */}
            <div>
              <MaxContentAgent 
                onContentCreated={(content) => {
                  console.log('Content created:', content);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '24px',
              color: '#1a202c'
            }}>
              Content Schedule
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#2d3748' }}>
                      📱 Daily Social Media Updates
                    </h3>
                    <p style={{ fontSize: '14px', color: '#718096' }}>
                      LinkedIn, Twitter, Facebook - 9:00 AM EST
                    </p>
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#4a5568' }}>Enabled</span>
                  </label>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#2d3748' }}>
                      📝 Weekly Blog Posts
                    </h3>
                    <p style={{ fontSize: '14px', color: '#718096' }}>
                      Every Monday - 10:00 AM EST → apexsalesai.com/blog
                    </p>
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#4a5568' }}>Enabled</span>
                  </label>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#2d3748' }}>
                      🎥 Bi-weekly YouTube Videos
                    </h3>
                    <p style={{ fontSize: '14px', color: '#718096' }}>
                      Every other Wednesday - 2:00 PM EST
                    </p>
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#4a5568' }}>Disabled</span>
                  </label>
                </div>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#4299e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Save Schedule Settings
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '24px',
              color: '#1a202c'
            }}>
              Content History
            </h2>
            
            <p style={{ fontSize: '14px', color: '#718096', textAlign: 'center', padding: '40px' }}>
              Content history will appear here once you start generating posts.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
