import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { Plus, ThumbsUp, Calendar, Clock, Tag, Trash2, TrendingUp } from 'lucide-react';

const CLUBS = ['All', 'Technical', 'Cultural', 'Sports', 'Trendles', 'Cyber Security', 'Mind Quest', 'IEEE', 'ACM', 'Other'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', club: 'Technical', date: '', time: '', description: '', category: 'Workshop' });
  const { currentUser, isAdmin } = useAuth();

  const loadEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadEvents(); }, []);

  const addEvent = async () => {
    if (!form.title || !form.date) return showToast('Title and date required', 'error');
    try {
      await addDoc(collection(db, 'events'), { ...form, upvotes: [], createdBy: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Event added! 🎉', 'success');
      setShowModal(false);
      setForm({ title: '', club: 'Technical', date: '', time: '', description: '', category: 'Workshop' });
      loadEvents();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const toggleUpvote = async (ev) => {
    const ref = doc(db, 'events', ev.id);
    const hasUpvoted = ev.upvotes?.includes(currentUser.uid);
    try {
      await updateDoc(ref, { upvotes: hasUpvoted ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) });
      loadEvents();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const deleteEvent = async (id) => {
    try { await deleteDoc(doc(db, 'events', id)); loadEvents(); showToast('Event deleted', 'info'); } catch (e) { showToast(e.message, 'error'); }
  };

  const filtered = filter === 'All' ? events : events.filter(e => e.club === filter);

  return (
    <div className="anim-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>Events & Activities</h1><p>Discover sessions, workshops, and club activities</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Add Event</button>
      </div>

      <div className="filter-chips" style={{ marginBottom: 24 }}>
        {CLUBS.map(c => <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Calendar size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No events yet</h3><p>Be the first to add an event for your club!</p></div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map(ev => (
            <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ev.club}</span>
                {(ev.upvotes?.length || 0) >= 5 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}><TrendingUp size={12} /> Trending</span>}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{ev.title}</h3>
              {ev.description && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{ev.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                {ev.date && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} />{ev.date}</span>}
                {ev.time && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} />{ev.time}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={14} />{ev.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <button className={`upvote-btn ${ev.upvotes?.includes(currentUser?.uid) ? 'active' : ''}`} onClick={() => toggleUpvote(ev)}>
                  <ThumbsUp size={16} /> {ev.upvotes?.length || 0}
                </button>
                {(isAdmin || ev.createdBy === currentUser?.uid) && <button className="btn btn-ghost btn-sm" onClick={() => deleteEvent(ev.id)}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Event" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={addEvent}>Add Event</button></>}>
        <div className="input-group"><label>Event Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Coding Workshop" /></div>
        <div className="input-group"><label>Club</label><select className="input" value={form.club} onChange={e => setForm({...form, club: e.target.value})}>{CLUBS.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Date</label><input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="input-group"><label>Time</label><input className="input" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
        </div>
        <div className="input-group"><label>Category</label><select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{['Workshop', 'Session', 'Competition', 'Meetup', 'Cultural', 'Sports', 'Other'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="input-group"><label>Description</label><textarea className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the event..." rows={3} /></div>
      </Modal>
    </div>
  );
}
