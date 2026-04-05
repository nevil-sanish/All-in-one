import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { Plus, ThumbsUp, Briefcase, ExternalLink, Clock, DollarSign, Trash2 } from 'lucide-react';

const CATEGORIES = ['All', 'Internship', 'Fellowship', 'Research', 'Freelance', 'Volunteer'];

export default function Internships() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', stipend: '', duration: '', deadline: '', applyLink: '', category: 'Internship', description: '' });
  const { currentUser, isAdmin } = useAuth();

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'internships'), orderBy('createdAt', 'desc')));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.company || !form.role) return showToast('Company and role required', 'error');
    try {
      await addDoc(collection(db, 'internships'), { ...form, upvotes: [], createdBy: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Opportunity posted! 🚀', 'success');
      setShowModal(false);
      setForm({ company: '', role: '', stipend: '', duration: '', deadline: '', applyLink: '', category: 'Internship', description: '' });
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const toggleUpvote = async (item) => {
    const ref = doc(db, 'internships', item.id);
    const has = item.upvotes?.includes(currentUser.uid);
    try { await updateDoc(ref, { upvotes: has ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) }); load(); } catch (e) { showToast(e.message, 'error'); }
  };

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="anim-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>Internships & Opportunities</h1><p>Discover and share career opportunities</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Post Opportunity</button>
      </div>

      <div className="filter-chips" style={{ marginBottom: 24 }}>
        {CATEGORIES.map(c => <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Briefcase size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No opportunities posted</h3><p>Share an internship or opportunity with your peers!</p></div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map(item => (
            <div key={item.id} className="card">
              <span className="badge badge-primary" style={{ marginBottom: 12 }}>{item.category}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{item.role}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{item.company}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                {item.stipend && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} style={{ color: 'var(--success)' }} /><strong style={{ color: 'var(--text-primary)' }}>{item.stipend}</strong></span>}
                {item.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} style={{ color: 'var(--accent)' }} />{item.duration}</span>}
                {item.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>📅 Due: {item.deadline}</span>}
              </div>
              {item.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{item.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className={`upvote-btn ${item.upvotes?.includes(currentUser?.uid) ? 'active' : ''}`} onClick={() => toggleUpvote(item)}><ThumbsUp size={16} /> {item.upvotes?.length || 0}</button>
                  {item.applyLink && <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><ExternalLink size={14} /> Apply</a>}
                </div>
                {(isAdmin || item.createdBy === currentUser?.uid) && <button className="btn btn-ghost btn-sm" onClick={async () => { await deleteDoc(doc(db, 'internships', item.id)); load(); }}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post Opportunity" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Post</button></>}>
        <div className="input-group"><label>Company/Organization</label><input className="input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g. Google" /></div>
        <div className="input-group"><label>Role</label><input className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. SWE Intern" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Stipend</label><input className="input" value={form.stipend} onChange={e => setForm({...form, stipend: e.target.value})} placeholder="e.g. ₹25,000/month" /></div>
          <div className="input-group"><label>Duration</label><input className="input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 2 months" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Deadline</label><input className="input" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
          <div className="input-group"><label>Category</label><select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{CATEGORIES.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        </div>
        <div className="input-group"><label>Apply Link</label><input className="input" value={form.applyLink} onChange={e => setForm({...form, applyLink: e.target.value})} placeholder="https://..." /></div>
        <div className="input-group"><label>Description</label><textarea className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
      </Modal>
    </div>
  );
}
