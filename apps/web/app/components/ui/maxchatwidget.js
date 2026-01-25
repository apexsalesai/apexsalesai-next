'use client';

import { useState, useRef, useEffect } from 'react';
import { getJWT } from './jwt';

// Stub: Replace this with your real user session/auth integration
function getUserInfo() {
  // Try to get user info from localStorage
  if (typeof window !== 'undefined') {
    const name = localStorage.getItem('maxchat_name');
    const email = localStorage.getItem('maxchat_email');
    if (name) return { name, email };
  }
  return null;
}


export default function MaxChatWidget() {
  // Tooltip state for clear chat button
  const [showClearTooltip, setShowClearTooltip] = useState(false);

  // Inject premium styles for the chat widget
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!document.getElementById('maxchat-premium-styles')) {
        const style = document.createElement('style');
        style.id = 'maxchat-premium-styles';
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          .maxchat-premium-card {
            background: rgba(24,28,32,0.85);
            backdrop-filter: blur(18px) saturate(140%);
            border-radius: 22px;
            box-shadow: 0 8px 32px 0 rgba(0,194,203,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.13);
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            border: 1.5px solid rgba(0,194,203,0.14);
            overflow: hidden;
            transition: box-shadow 0.22s cubic-bezier(.4,0,.2,1);
          }
          .maxchat-premium-header {
            display: flex; align-items: center; gap: 13px;
            padding: 22px 24px 10px 24px;
            background: rgba(0,194,203,0.07);
            border-bottom: 1.5px solid rgba(0,194,203,0.13);
          }
          .maxchat-premium-avatar {
            width: 52px; height: 52px; border-radius: 50%;
            background: #fff; object-fit: cover;
            border: 2.5px solid #00c2cb;
            box-shadow: 0 2px 8px #00c2cb33;
          }
          .maxchat-premium-title {
            font-size: 1.22rem; font-weight: 700; color: #fff; letter-spacing: -0.5px;
          }
          .maxchat-premium-subtitle {
            font-size: 0.99rem; font-weight: 500; color: #00c2cb; margin-top: 2px;
          }
          .maxchat-premium-signin {
            margin: 0 0 12px 0; text-align: center;
          }
          .maxchat-premium-signin-btn {
            margin-left: 8px; color: #fff; background: linear-gradient(90deg,#00c2cb 10%,#0c8fff 90%);
            padding: 7px 22px; border-radius: 8px; font-weight: 700;
            text-decoration: none; box-shadow: 0 2px 12px #00c2cb33;
            border: none; outline: none; font-size: 1rem;
            transition: background 0.18s, box-shadow 0.18s;
            display: inline-block;
          }
          .maxchat-premium-signin-btn:hover {
            background: linear-gradient(90deg,#0c8fff 10%,#00c2cb 90%);
            box-shadow: 0 4px 18px #00c2cb55;
          }
          .maxchat-premium-input {
            flex: 1; padding: 13px; border-radius: 10px; border: none; outline: none;
            background: rgba(35,39,47,0.96); color: #fff; font-size: 1.08rem;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);
            margin-right: 8px;
            transition: box-shadow 0.18s;
          }
          .maxchat-premium-input:focus {
            box-shadow: 0 2px 8px #00c2cb55;
          }
          .maxchat-premium-send-btn {
            background: linear-gradient(90deg,#00c2cb 10%,#0c8fff 90%);
            color: #181c20; border: none; border-radius: 10px; padding: 0 28px;
            font-weight: 700; font-size: 1.08rem; cursor: pointer;
            transition: background 0.18s, box-shadow 0.18s;
          }
          .maxchat-premium-send-btn:disabled {
            opacity: 0.6; cursor: not-allowed;
          }
          .maxchat-premium-send-btn:hover:not(:disabled) {
            background: linear-gradient(90deg,#0c8fff 10%,#00c2cb 90%);
            box-shadow: 0 2px 12px #00c2cb33;
          }
          .maxchat-premium-messages {
            padding: 20px 24px 10px 24px; max-height: 340px; overflow-y: auto;
            background: transparent;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const [minimized, setMinimized] = useState(true);
  const [lastActive, setLastActive] = useState(Date.now());
  const [user, setUser] = useState(getUserInfo());
const [askingName, setAskingName] = useState(!getUserInfo());
const [nameInput, setNameInput] = useState('');

// Restore chat history from localStorage
const [messages, setMessages] = useState(() => {
  if (typeof window !== 'undefined') {
    const jwt = getJWT();
    if (!jwt) {
      const stored = localStorage.getItem('maxchat_history');
      if (stored) return JSON.parse(stored);
    }
    // If logged in, optionally fetch persistent history from backend (future enhancement)
  }
  // Initial greeting
  return [{
    role: 'assistant',
    content: user?.name
      ? `Hi ${user.name}! I'm Max, your executive AI assistant. How can I help you today?`
      : "Hi! I'm Max, your executive AI assistant. What's your name?",
    suggestions: [], media: [], escalation: false, feedback: false
  }];
});
const [suggestions, setSuggestions] = useState([]);
const [media, setMedia] = useState([]);
const [escalation, setEscalation] = useState(false);
const [feedbackGiven, setFeedbackGiven] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-minimize after 30s of inactivity
  useEffect(() => {
    if (!minimized) {
      const timer = setInterval(() => {
        if (Date.now() - lastActive > 30000) {
          setMinimized(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [minimized, lastActive]);

  // When chat is opened, scroll to latest message
  useEffect(() => {
    if (!minimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [minimized]);

  // Store chat history in localStorage on change
useEffect(() => {
  if (typeof window !== 'undefined') {
    const jwt = getJWT();
    if (!jwt) {
      localStorage.setItem('maxchat_history', JSON.stringify(messages));
    } else {
      // Optionally: POST to /api/max-chat-history to persist for logged-in users (future enhancement)
    }
  }
}, [messages]);

// Store user name in localStorage
useEffect(() => {
  if (user?.name && typeof window !== 'undefined') {
    localStorage.setItem('maxchat_name', user.name);
    if (user.email) localStorage.setItem('maxchat_email', user.email);
  }
}, [user]);

const handleUserActive = () => setLastActive(Date.now());

  const sendMessage = async (suggestion = null) => {
  if (askingName) {
    // User is providing their name
    if (!nameInput.trim()) return;
    setUser({ name: nameInput });
    setMessages(msgs => [...msgs, { role: 'user', content: nameInput }]);
    setAskingName(false);
    setNameInput('');
    return;
  }
  const userInput = suggestion || input;
  if (!userInput.trim()) return;
  setMessages(msgs => [...msgs, { role: 'user', content: userInput }]);
  setLoading(true);
  setError('');
  setSuggestions([]);
  setMedia([]);
  setEscalation(false);
  try {
      const jwt = getJWT();
      const res = await fetch('/api/max-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { 'Authorization': `Bearer ${jwt}` } : {})
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userInput }
          ],
          user: user || undefined
        })
      });
      const data = await res.json();
      if (res.status === 401) {
        // Only show session expired if the user is supposed to be authenticated
        if (user) {
          setError('Session expired. Please log in again for secure access.');
        } else {
          setError('Anonymous chat is temporarily unavailable. Please try again or log in.');
        }
        return;
      }
      if (res.ok && data.answer) {
        setMessages(msgs => [...msgs, { role: 'assistant', content: data.answer, suggestions: data.suggestions, media: data.media, escalation: data.escalation, feedback: data.feedback }]);
        setSuggestions(data.suggestions || []);
        setMedia(data.media || []);
        setEscalation(!!data.escalation);
      } else if (data.error) {
        setError(typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error)));
      } else {
        setError('AI did not respond.');
      }
    } catch (err) {
      setError('Network or server error.');
    } finally {
      setLoading(false);
      setInput('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFeedback = (msgIdx, value) => {
    setFeedbackGiven(fb => [...fb, msgIdx]);
    // Optionally send feedback to backend here
  };

  const handleEscalation = () => {
    setShowLeadForm(true);
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Send escalation with lead info to backend
      const res = await fetch('/api/max-chat-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: leadName, email: leadEmail },
          transcript: messages,
          reason: 'User requested sales/support via chat',
          timestamp: Date.now()
        })
      });
      if (!res.ok) throw new Error('Failed to submit lead');
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages(msgs => [...msgs, { role: 'assistant', content: `Thank you ${leadName}! A real person will follow up with you soon.`, suggestions: [], media: [], escalation: false, feedback: false }]);
    } catch (err) {
      setError('Could not submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function renderMedia(mediaArr) {
    if (!mediaArr || !mediaArr.length) return null;
    return (
      <div style={{ margin: '8px 0 0 0' }}>
        {mediaArr.map((m, i) => {
          if (m.startsWith('![')) {
            // Markdown image
            const alt = m.match(/!\[(.*?)\]/)?.[1] || '';
            const url = m.match(/\((.*?)\)/)?.[1] || '';
            return <img key={i} src={url} alt={alt} style={{ maxWidth: 260, borderRadius: 8, margin: '6px 0' }} />;
          } else if (m.startsWith('[')) {
            // Markdown link
            const text = m.match(/\[(.*?)\]/)?.[1] || '';
            const url = m.match(/\((.*?)\)/)?.[1] || '';
            return <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#00c2cb', textDecoration: 'underline', display: 'block', margin: '6px 0' }}>{text}</a>;
          }
          return null;
        })}
      </div>
    );
  }

  if (minimized) {
    return (
      <button
        onClick={() => { setMinimized(false); setLastActive(Date.now()); }}
        style={{
          background: '#181c20',
          border: 'none',
          borderRadius: 32,
          boxShadow: '0 4px 24px #0003',
          padding: 0,
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="Open Max Chat"
      >
        <img src="/images/happy-matu-magic-nqte.jpeg" alt="Max" style={{ width: 44, height: 44, borderRadius: '50%', marginRight: 0, border: '2.5px solid #00c2cb', objectFit: 'cover', boxShadow: '0 2px 8px #00c2cb44' }} />
      </button>
    );
  }

  return (
    <div
      className="max-chat-ui"
      style={{ width: 420, background: '#181c20', borderRadius: 12, boxShadow: '0 4px 24px #0002', padding: 16, color: '#fff', fontFamily: 'Inter, sans-serif', position: 'relative' }}
      onMouseMove={handleUserActive}
      onClick={handleUserActive}
    >
      <button
         onClick={() => setMinimized(true)}
         style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}
         aria-label="Minimize Chat"
       >
         &minus;
       </button>
       {/* Clear Chat Button */}
       <button
         aria-label="Clear chat history"
         style={{ position: 'absolute', top: 10, right: 48, background: 'rgba(0,194,203,0.14)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s', outline: 'none', boxShadow: '0 1.5px 8px 0 rgba(0,0,0,0.10)' }}
         onClick={() => {
           if (typeof window !== 'undefined') {
             localStorage.removeItem('maxchat_history');
             setMessages([{
               role: 'assistant',
               content: user?.name
                 ? `Hi ${user.name}! I'm Max, your executive AI assistant. How can I help you today?`
                 : "Hi! I'm Max, your executive AI assistant. What's your name?",
               suggestions: [], media: [], escalation: false, feedback: false
             }]);
           }
         }}
         onMouseEnter={() => setShowClearTooltip(true)}
         onMouseLeave={() => setShowClearTooltip(false)}
       >
         {/* Trash icon SVG */}
         <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
           <path d="M7.5 9V14" stroke="#00c2cb" strokeWidth="1.7" strokeLinecap="round"/>
           <path d="M12.5 9V14" stroke="#00c2cb" strokeWidth="1.7" strokeLinecap="round"/>
           <rect x="4.5" y="5.5" width="11" height="11" rx="2.5" stroke="#00c2cb" strokeWidth="1.7"/>
           <path d="M2 5.5H18" stroke="#00c2cb" strokeWidth="1.7" strokeLinecap="round"/>
           <path d="M8.5 2.5H11.5" stroke="#00c2cb" strokeWidth="1.7" strokeLinecap="round"/>
         </svg>
       </button>
       {/* Login Icon Button */}
       {!getJWT() && (
         <button
           aria-label="Sign in to save history"
           style={{ position: 'absolute', top: 10, right: 86, background: 'rgba(0,194,203,0.14)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s', outline: 'none', boxShadow: '0 1.5px 8px 0 rgba(0,0,0,0.10)' }}
           onClick={e => { e.stopPropagation(); window.open('/api/auth/login', '_blank'); }}
           onMouseEnter={() => setShowClearTooltip('login')}
           onMouseLeave={() => setShowClearTooltip(false)}
         >
           {/* User icon SVG */}
           <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
             <circle cx="10" cy="7" r="4" stroke="#00c2cb" strokeWidth="1.7"/>
             <path d="M3.5 16c1.5-3 11.5-3 13 0" stroke="#00c2cb" strokeWidth="1.7" strokeLinecap="round"/>
           </svg>
         </button>
       )}
       {/* Tooltip for clear/login */}
       {showClearTooltip && (
         <div style={{
           position: 'absolute',
           top: 6,
           right: showClearTooltip === 'login' ? 126 : 88,
           background: 'rgba(24,28,32,0.97)',
           color: '#fff',
           padding: '7px 14px',
           borderRadius: 7,
           fontSize: 13,
           fontWeight: 500,
           boxShadow: '0 2px 12px #00c2cb33',
           pointerEvents: 'none',
           zIndex: 10000,
           whiteSpace: 'nowrap',
           transition: 'opacity 0.18s',
         }}>
           {showClearTooltip === 'login' ? 'Sign in to save history' : 'Clear chat'}
         </div>
       )}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <img src="/images/happy-matu-magic-nqte.jpeg" alt="Max" style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 14, border: '2.5px solid #00c2cb', objectFit: 'cover', boxShadow: '0 2px 8px #00c2cb44' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 19, letterSpacing: 0.5 }}>Max</div>
          <div style={{ fontSize: 12, color: '#00c2cb', opacity: 0.85, marginTop: 2 }}>Executive AI Assistant</div>
        </div>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto', background: '#1a202c', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '8px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ background: msg.role === 'user' ? '#00c2cb' : '#23272f', color: msg.role === 'user' ? '#181c20' : '#fff', borderRadius: 8, padding: '8px 12px', display: 'inline-block', maxWidth: 320, wordBreak: 'break-word' }}>
              {msg.content}
              {msg.media && renderMedia(msg.media)}
            </span>
            {/* Feedback for assistant messages */}
            {msg.role === 'assistant' && msg.feedback && !feedbackGiven.includes(i) && (
              <div style={{ marginTop: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>Helpful?</span>
                <button aria-label="Thumbs up" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00c2cb', fontSize: 18 }} onClick={() => handleFeedback(i, 1)}>👍</button>
                <button aria-label="Thumbs down" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', fontSize: 18 }} onClick={() => handleFeedback(i, 0)}>👎</button>
              </div>
            )}
            {msg.role === 'assistant' && msg.feedback && feedbackGiven.includes(i) && (
              <div style={{ marginTop: 4, color: '#00c2cb', fontSize: 13 }}>Thank you for your feedback!</div>
            )}
            {/* Suggestions for assistant messages */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {msg.suggestions.map((s, si) => (
                  <button key={si} onClick={() => sendMessage(s)} style={{ background: '#23272f', color: '#00c2cb', border: '1px solid #00c2cb', borderRadius: 7, padding: '5px 12px', fontSize: 14, cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            )}
            {/* Escalation button */}
            {msg.role === 'assistant' && msg.escalation && (
              <div style={{ marginTop: 8 }}>
                <button onClick={handleEscalation} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}>Connect me with Sales/Support</button>
              </div>
            )}
            {/* Lead capture form */}
            {showLeadForm && (
              <div style={{ background: '#23272f', padding: 16, borderRadius: 8, marginTop: 12, maxWidth: 320 }}>
                <form onSubmit={submitLead}>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: 4 }}>Your Name</label>
                    <input type="text" value={leadName} onChange={e => setLeadName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: 'none', background: '#1a202c', color: '#fff' }} required />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: 4 }}>Your Email</label>
                    <input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: 'none', background: '#1a202c', color: '#fff' }} required />
                  </div>
                  <button type="submit" disabled={loading} style={{ background: '#00c2cb', color: '#181c20', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>Submit</button>
                  <button type="button" onClick={() => setShowLeadForm(false)} style={{ marginLeft: 10, background: 'none', color: '#fff', border: '1px solid #fff', borderRadius: 6, padding: '8px 14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                </form>
              </div>
            )}
            {leadSubmitted && (
              <div style={{ marginTop: 8, color: '#00c2cb', fontWeight: 600 }}>Your request has been received!</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <div style={{ color: '#ff4d4f', marginBottom: 8, background: '#23272f', borderRadius: 6, padding: '7px 12px', fontWeight: 500 }}>{error}</div>}
      {loading && (
        <div style={{ color: '#00c2cb', marginBottom: 8, fontStyle: 'italic', fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="max-typing-dot" style={{ display: 'inline-block', width: 8, height: 8, background: '#00c2cb', borderRadius: '50%', animation: 'blink 1.2s infinite alternate' }}></span>
          Max is typing...
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {askingName ? (
          <>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { sendMessage(); handleUserActive(); } }}
              placeholder="Enter your name to start..."
              style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', outline: 'none', background: '#23272f', color: '#fff' }}
              disabled={loading}
              autoFocus
            />
            <button
              onClick={() => { sendMessage(); handleUserActive(); }}
              disabled={loading || !nameInput.trim()}
              style={{ background: '#00c2cb', color: '#181c20', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); handleUserActive(); }}
              onKeyDown={e => { if (e.key === 'Enter') { sendMessage(); handleUserActive(); } }}
              placeholder="Type your message to Max... 💬"
              style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', outline: 'none', background: '#23272f', color: '#fff' }}
              disabled={loading}
            />
            <button
              onClick={() => { sendMessage(); handleUserActive(); }}
              disabled={loading || !input.trim()}
              style={{ background: '#00c2cb', color: '#181c20', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}