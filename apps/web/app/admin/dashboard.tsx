import { useEffect, useState } from 'react';

type Feedback = {
  timestamp: number | string;
  user?: { name?: string; email?: string };
  messageIdx?: number;
  feedback?: number;
};

type Escalation = {
  timestamp: number | string;
  user?: { name?: string; email?: string };
  reason?: string;
  transcript?: any;
};

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [chats, setChats] = useState<{ timestamp: number | string; user?: { name?: string; email?: string }; messages?: any }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [fRes, eRes, cRes] = await Promise.all([
          fetch('/feedback-log.json'),
          fetch('/escalation-log.json'),
          fetch('/chat-log.json'),
        ]);
        setFeedback(await fRes.json());
        setEscalations(await eRes.json());
        setChats(await cRes.json());
      } catch (err) {
        setError('Failed to load dashboard data.');
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: 32, fontFamily: 'Inter, sans-serif', background: '#181c20', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Max Admin Dashboard</h1>
      {error && <div style={{ color: '#ff4d4f', marginBottom: 16 }}>{error}</div>}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Feedback</h2>
        <table style={{ width: '100%', background: '#23272f', borderRadius: 8, marginBottom: 32 }}>
          <thead>
            <tr style={{ color: '#00c2cb' }}>
              <th>Time</th><th>User</th><th>MessageIdx</th><th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td>{new Date(f.timestamp).toLocaleString()}</td>
                <td>{f.user ? f.user.name || f.user.email || '' : ''}</td>
                <td>{f.messageIdx}</td>
                <td>{f.feedback === 1 ? '👍' : '👎'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Escalations</h2>
        <table style={{ width: '100%', background: '#23272f', borderRadius: 8, marginBottom: 32 }}>
          <thead>
            <tr style={{ color: '#ff4d4f' }}>
              <th>Time</th><th>User</th><th>Reason</th><th>Transcript</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map((e, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td>{new Date(e.timestamp).toLocaleString()}</td>
                <td>{e.user ? e.user.name || e.user.email || '' : ''}</td>
                <td>{e.reason || ''}</td>
                <td style={{ maxWidth: 320, overflow: 'auto', fontSize: 13 }}>{e.transcript ? JSON.stringify(e.transcript) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Chat Logs</h2>
        <table style={{ width: '100%', background: '#23272f', borderRadius: 8 }}>
          <thead>
            <tr style={{ color: '#00c2cb' }}>
              <th>Time</th><th>User</th><th>Messages</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td>{new Date(c.timestamp).toLocaleString()}</td>
                <td>{c.user ? c.user.name || c.user.email || '' : ''}</td>
                <td style={{ maxWidth: 400, overflow: 'auto', fontSize: 13 }}>{c.messages ? JSON.stringify(c.messages) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
