'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [minimized, setMinimized] = useState(true);
  const [lastActive, setLastActive] = useState(Date.now());
  const [user, setUser] = useState(getUserInfo());
const [askingName, setAskingName] = useState(!getUserInfo());
const [nameInput, setNameInput] = useState('');

// Restore chat history from localStorage
const [messages, setMessages] = useState(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('maxchat_history');
    if (stored) return JSON.parse(stored);
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
    localStorage.setItem('maxchat_history', JSON.stringify(messages));
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
      const res = await fetch('/api/max-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userInput }
          ],
          user: user || undefined
        })
      });
      const data = await res.json();
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
      </div>
    </div>
  );
}