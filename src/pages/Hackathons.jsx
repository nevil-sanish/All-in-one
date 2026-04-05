import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { Plus, ThumbsUp, Calendar, Users, Trophy, Clock, ExternalLink, Trash2, Globe, MapPin } from 'lucide-react';

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Past'];
const MODES = ['Online', 'Offline', 'Hybrid'];

function Countdown({ targetDate }) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown">
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, l]) => (
        <div key={k} className="countdown__unit"><div className="countdown__value">{time[k] || 0}</div><div className="countdown__label">{l}</div></div>
      ))}
    </div>
  );
}

export default function Hackathons() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', organizer: '', date: '', endDate: '', mode: 'Online', prizePool: '', teamSize: '', registrationLink: '', description: '' });
  const { currentUser, isAdmin } = useAuth();

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'hackathons'), orderBy('createdAt', 'desc')));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.date) return showToast('Name and date required', 'error');
    try {
      await addDoc(collection(db, 'hackathons'), { ...form, upvotes: [], createdBy: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Hackathon posted! 🚀', 'success');
      setShowModal(false);
      setForm({ name: '', organizer: '', date: '', endDate: '', mode: 'Online', prizePool: '', teamSize: '', registrationLink: '', description: '' });
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const toggleUpvote = async (item) => {
    const ref = doc(db, 'hackathons', item.id);
    const has = item.upvotes?.includes(currentUser.uid);
    try { await updateDoc(ref, { upvotes: has ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) }); load(); } catch (e) { showToast(e.message, 'error'); }
  };

  const now = new Date();
  const filtered = items.filter(i => {
    if (filter === 'All') return true;
    const start = new Date(i.date);
    const end = i.endDate ? new Date(i.endDate) : start;
    if (filter === 'Upcoming') return start > now;
    if (filter === 'Ongoing') return start <= now && end >= now;
    if (filter === 'Past') return end < now;
    return true;
  });

  return (
    <div className="anim-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>Hackathons</h1><p>Discover and share hackathon opportunities</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Post Hackathon</button>
      </div>

      <div className="filter-chips" style={{ marginBottom: 24 }}>
        {FILTERS.map(f => <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Trophy size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No hackathons yet</h3><p>Post a hackathon for your peers!</p></div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map(item => {
            const isUpcoming = new Date(item.date) > now;
            return (
              <div key={item.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: 16, right: 16, padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em',
                  background: item.mode === 'Online' ? 'rgba(6,182,212,0.12)' : item.mode === 'Offline' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: item.mode === 'Online' ? 'var(--info)' : item.mode === 'Offline' ? 'var(--success)' : 'var(--warning)' }}>
                  {item.mode === 'Online' ? <Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> : <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />}{item.mode}
                </span>

                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, paddingRight: 80 }}>{item.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{item.organizer}</p>

                {isUpcoming && <div style={{ marginBottom: 16 }}><Countdown targetDate={item.date} /></div>}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} style={{ color: 'var(--accent)' }} />{new Date(item.date).toLocaleDateString()}</span>
                  {item.teamSize && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} style={{ color: 'var(--accent)' }} />Team: <strong style={{ color: 'var(--text-primary)' }}>{item.teamSize}</strong></span>}
                </div>

                {item.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.prizePool && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--warning)' }}><Trophy size={18} />{item.prizePool}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`upvote-btn ${item.upvotes?.includes(currentUser?.uid) ? 'active' : ''}`} onClick={() => toggleUpvote(item)}><ThumbsUp size={16} /> {item.upvotes?.length || 0}</button>
                    {item.registrationLink && <a href={item.registrationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><ExternalLink size={14} /> Register</a>}
                    {(isAdmin || item.createdBy === currentUser?.uid) && <button className="btn btn-ghost btn-sm" onClick={async () => { await deleteDoc(doc(db, 'hackathons', item.id)); load(); }}><Trash2 size={14} /></button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post Hackathon" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Post</button></>}>
        <div className="input-group"><label>Hackathon Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Smart India Hackathon" /></div>
        <div className="input-group"><label>Organizer</label><input className="input" value={form.organizer} onChange={e => setForm({...form, organizer: e.target.value})} placeholder="e.g. AICTE" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Start Date</label><input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="input-group"><label>End Date</label><input className="input" type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Mode</label><select className="input" value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>{MODES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          <div className="input-group"><label>Prize Pool</label><input className="input" value={form.prizePool} onChange={e => setForm({...form, prizePool: e.target.value})} placeholder="₹1,00,000" /></div>
          <div className="input-group"><label>Team Size</label><input className="input" value={form.teamSize} onChange={e => setForm({...form, teamSize: e.target.value})} placeholder="2-5" /></div>
        </div>
        <div className="input-group"><label>Registration Link</label><input className="input" value={form.registrationLink} onChange={e => setForm({...form, registrationLink: e.target.value})} placeholder="https://..." /></div>
        <div className="input-group"><label>Description</label><textarea className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
      </Modal>
    </div>
  );
}
