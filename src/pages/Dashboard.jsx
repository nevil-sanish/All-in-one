import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Utensils, FileText, Calendar, Code2, Briefcase, TrendingUp, Users, Star } from 'lucide-react';
import { DEFAULT_MESS_MENU, DAY_NAMES, MEAL_ICONS } from '../data/messMenu';

const quickLinks = [
  { label: 'Events & Clubs', icon: Zap, path: '/events', color: '#818cf8' },
  { label: 'Mess Food', icon: Utensils, path: '/mess', color: '#34d399' },
  { label: 'Question Papers', icon: FileText, path: '/papers', color: '#fbbf24' },
  { label: 'Calendar', icon: Calendar, path: '/calendar', color: '#f472b6' },
  { label: 'Hackathons', icon: Code2, path: '/hackathons', color: '#22d3ee' },
  { label: 'Internships', icon: Briefcase, path: '/internships', color: '#fb923c' },
];

export default function Dashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const today = DAY_NAMES[new Date().getDay()];
  const todayMenu = DEFAULT_MESS_MENU[today];
  const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="anim-in">
      {/* Welcome Banner */}
      <div style={{ background: 'var(--accent-gradient)', borderRadius: 'var(--radius-xl)', padding: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 8, position: 'relative' }}>{greeting}, {userData?.displayName?.split(' ')[0] || 'Student'}! 👋</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, position: 'relative', maxWidth: 500 }}>Welcome to CampusHub. Stay updated with events, mess menu, hackathons, and more.</p>
        {userData?.batch && <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: 12, display: 'inline-flex' }}>Batch {userData.batch} • {userData.rollNo}</span>}
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Active Events', value: '—', icon: Zap, bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
          { label: 'Hackathons', value: '—', icon: Code2, bg: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
          { label: 'Papers Shared', value: '—', icon: FileText, bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
          { label: 'Community', value: '—', icon: Users, bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
        ].map((s, i) => (
          <div key={i} className="card card--static stat-card">
            <div className="stat-card__icon" style={{ background: s.bg }}><s.icon size={22} style={{ color: s.color }} /></div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Star size={20} style={{ color: 'var(--accent)' }} /> Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {quickLinks.map(l => (
            <div key={l.path} onClick={() => navigate(l.path)} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 12px', cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              <l.icon size={28} style={{ color: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Menu Quick View */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Utensils size={20} style={{ color: 'var(--success)' }} /> Today's Mess Menu</h3>
        <div className="grid grid-4">
          {Object.entries(todayMenu || {}).map(([meal, items]) => (
            <div key={meal} className="card card--static" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, color: meal === 'breakfast' ? '#fbbf24' : meal === 'lunch' ? '#34d399' : meal === 'snacks' ? '#f472b6' : '#818cf8' }}>
                {MEAL_ICONS[meal]} {meal}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {items?.slice(0, 4).join(', ')}{items?.length > 4 ? ` +${items.length - 4} more` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
