import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { showToast } from '../components/Toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) { navigate('/'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!email.endsWith('@iiitkottayam.ac.in')) {
          showToast('Only @iiitkottayam.ac.in emails are allowed', 'error');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          showToast('Password must be at least 6 characters', 'error');
          setLoading(false);
          return;
        }
        await register(email, password);
        showToast('Account created! Verification email sent. You can start using CampusHub.', 'success');
        navigate('/');
      } else {
        await login(email, password);
        showToast('Welcome back! 👋', 'success');
        navigate('/');
      }
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Email already registered. Try logging in.' :
        err.code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        err.code === 'auth/weak-password' ? 'Password too weak (min 6 chars).' :
        err.message || 'Something went wrong';
      showToast(msg, 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Orb effects */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(100px)', top: -200, left: -100, animation: 'orbFloat 20s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(100px)', bottom: -150, right: -100, animation: 'orbFloat 20s ease-in-out infinite 8s' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)', filter: 'blur(100px)', top: '50%', left: '60%', animation: 'orbFloat 20s ease-in-out infinite 15s' }} />

      <style>{`@keyframes orbFloat { 0%,100%{transform:translate(0,0)scale(1)} 25%{transform:translate(30px,-40px)scale(1.1)} 50%{transform:translate(-20px,20px)scale(0.95)} 75%{transform:translate(40px,30px)scale(1.05)} }`}</style>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, padding: 16 }}>
        <div style={{ background: 'rgba(12,18,32,0.8)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 40, backdropFilter: 'blur(30px)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', animation: 'fadeInUp 0.5s ease' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, background: 'var(--accent-gradient)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px var(--accent-glow)' }}>
              <GraduationCap size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>CampusHub</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>IIIT Kottayam Student Portal</p>
          </div>

          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--accent-gradient)' }} />
            <div style={{ flex: 1, height: 4, borderRadius: 'var(--radius-full)', background: mode === 'register' ? 'var(--accent-gradient)' : 'var(--bg-elevated)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="input-group">
              <label><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />College Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname25BCD11@iiitkottayam.ac.in" required />
            </div>

            <div className="input-group">
              <label><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                💡 Your <strong>name</strong>, <strong>roll number</strong>, and <strong>batch year</strong> will be auto-extracted from your college email.
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '12px 24px', fontSize: 15 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ padding: '0 12px' }}>Or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                await loginWithGoogle();
                showToast('Welcome back! 👋', 'success');
                navigate('/');
              } catch (err) {
                if (err.message === 'Only @iiitkottayam.ac.in emails are allowed') {
                  showToast('Access denied: You must use an @iiitkottayam.ac.in email', 'error');
                } else if (err.code !== 'auth/popup-closed-by-user') {
                  showToast(err.message || 'Failed to sign in with Google', 'error');
                }
              }
              setLoading(false);
            }}
            disabled={loading}
            style={{ 
              width: '100%', padding: '12px 24px', fontSize: 15, background: 'white', color: '#333', 
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 600, transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <a onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
              {mode === 'login' ? 'Register' : 'Sign In'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
