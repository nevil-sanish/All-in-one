import { Search, MessageCircle, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Topbar() {
  const { userData } = useAuth();
  const initials = userData?.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  const toggleSidebar = () => {
    document.getElementById('sidebar-toggle')?.click();
  };

  const toggleChatbot = () => {
    document.getElementById('chatbot-toggle-btn')?.click();
  };

  return (
    <div className="topbar">
      <button className="menu-toggle" onClick={toggleSidebar}><Menu size={24} /></button>
      <div className="topbar__search">
        <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input placeholder="Search events, papers, hackathons..." />
      </div>
      <div className="topbar__actions">
        <button className="btn-icon" onClick={toggleChatbot} title="Campus Assistant">
          <MessageCircle size={20} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', cursor: 'pointer' }} title={userData?.displayName || 'User'}>
          {initials}
        </div>
      </div>
    </div>
  );
}
