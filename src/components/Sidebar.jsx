import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Utensils, FileText, Code2, Briefcase, Zap, LogOut, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events', icon: Zap, label: 'Events & Clubs' },
  { to: '/internships', icon: Briefcase, label: 'Internships' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/mess', icon: Utensils, label: 'Mess Food' },
  { to: '/papers', icon: FileText, label: 'Question Papers' },
  { to: '/hackathons', icon: Code2, label: 'Hackathons' },
];

export default function Sidebar() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const initials = userData?.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <>
      <nav className={`sidebar ${open ? 'open' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-w)', height: '100vh',
        background: 'rgba(6,10,19,0.95)', borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', zIndex: 200,
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        transform: typeof window !== 'undefined' && window.innerWidth <= 768 && !open ? 'translateX(-100%)' : 'translateX(0)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 40, height: 40, background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CampusHub</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>IIIT Kottayam</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '8px 12px' }}>Menu</div>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 'var(--radius-md)', color: isActive ? '#818cf8' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: 500, marginBottom: 2, textDecoration: 'none',
                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}>
              <l.icon size={20} />
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userData?.displayName || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{userData?.role === 'admin' ? '👑 Admin' : userData?.rollNo || 'Student'}</div>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }} onClick={() => setOpen(false)} />}

      {/* Expose toggle for topbar */}
      <button id="sidebar-toggle" style={{ display: 'none' }} onClick={() => setOpen(p => !p)} />
    </>
  );
}
