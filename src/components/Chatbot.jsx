import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { CHATBOT_QA, CHATBOT_SUGGESTIONS } from '../data/chatbotKnowledge';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function findAnswer(input) {
  const q = input.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;
  for (const qa of CHATBOT_QA) {
    for (const keyword of qa.q) {
      const kw = keyword.toLowerCase();
      if (q.includes(kw) || kw.includes(q)) {
        const score = kw.length;
        if (score > bestScore) { bestScore = score; bestMatch = qa.a; }
      }
    }
  }
  return bestMatch || "I'm not sure about that. Try asking about courses, facilities, clubs, placement, admission, or mess menu! Type 'help' to see what I can do. 🤔";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! 👋 I'm your IIIT Kottayam Campus Assistant. Ask me anything about the campus!" }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Load chat history
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const d = await getDoc(doc(db, 'chatHistory', currentUser.uid));
        if (d.exists() && d.data().messages?.length) {
          setMessages(d.data().messages);
        }
      } catch (e) { /* ignore */ }
    })();
  }, [currentUser]);

  // Save chat history
  useEffect(() => {
    if (!currentUser || messages.length <= 1) return;
    const timer = setTimeout(() => {
      setDoc(doc(db, 'chatHistory', currentUser.uid), { messages: messages.slice(-50) }).catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [messages, currentUser]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(p => [...p, { from: 'user', text: msg }]);
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { from: 'bot', text: findAnswer(msg) }]);
    }, 500 + Math.random() * 500);
  };

  return (
    <>
      <button id="chatbot-toggle-btn" style={{ display: 'none' }} onClick={() => setOpen(p => !p)} />
      <div style={{
        position: 'fixed', bottom: 24, right: 24, width: 380, maxHeight: 560,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--accent-gradient)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Campus Assistant</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online</div>
            </div>
          </div>
          <button className="btn-icon btn-icon-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }} onClick={() => setOpen(false)}><X size={16} /></button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 300 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, maxWidth: '85%', alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', flexDirection: m.from === 'user' ? 'row-reverse' : 'row', animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.from === 'bot' ? 'var(--accent-gradient)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                {m.from === 'bot' ? <Bot size={14} color="white" /> : '👤'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-lg)', fontSize: 14, lineHeight: 1.5, background: m.from === 'bot' ? 'var(--bg-elevated)' : 'var(--accent-gradient)', color: m.from === 'bot' ? 'var(--text-primary)' : 'white', whiteSpace: 'pre-wrap', borderBottomLeftRadius: m.from === 'bot' ? 4 : undefined, borderBottomRightRadius: m.from === 'user' ? 4 : undefined }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', flexWrap: 'wrap' }}>
            {CHATBOT_SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about campus..."
            style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '8px 16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
          <button onClick={() => send()} style={{ width: 36, height: 36, border: 'none', borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
