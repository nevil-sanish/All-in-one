import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { DEFAULT_MESS_MENU, DAY_NAMES, DAY_LABELS, MEAL_TYPES, MEAL_ICONS } from '../data/messMenu';
import { Star, MessageSquare, AlertTriangle, Plus, BarChart3, PieChart, Send } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const chartOptions = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } };

export default function Mess() {
  const [tab, setTab] = useState('today');
  const [ratings, setRatings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [userComplaints, setUserComplaints] = useState([]);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [rateForm, setRateForm] = useState({ item: '', rating: 0, review: '' });
  const [complaintText, setComplaintText] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Mess');
  const { currentUser, isAdmin } = useAuth();

  const todayIndex = new Date().getDay();
  const todayName = DAY_NAMES[todayIndex];
  const todayMenu = DEFAULT_MESS_MENU[todayName];

  const loadData = async () => {
    try {
      const rSnap = await getDocs(query(collection(db, 'foodRatings'), orderBy('createdAt', 'desc')));
      setRatings(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const cSnap = await getDocs(query(collection(db, 'complaints'), orderBy('createdAt', 'desc')));
      const allComplaints = cSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setComplaints(allComplaints);
      setUserComplaints(allComplaints.filter(c => c.userId === currentUser?.uid));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, [currentUser]);

  const submitRating = async () => {
    if (!rateForm.item || rateForm.rating === 0) return showToast('Select item and rating', 'error');
    try {
      await addDoc(collection(db, 'foodRatings'), { ...rateForm, day: todayName, userId: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Rating submitted! ⭐', 'success');
      setShowRateModal(false);
      setRateForm({ item: '', rating: 0, review: '' });
      loadData();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const submitComplaint = async () => {
    const words = complaintText.trim().split(/\s+/).filter(Boolean).length;
    if (words > 200) return showToast('Max 200 words allowed', 'error');
    if (!complaintText.trim()) return showToast('Enter complaint text', 'error');
    if (userComplaints.filter(c => c.status !== 'Resolved').length >= 2) return showToast('You can have max 2 active complaints', 'error');
    try {
      await addDoc(collection(db, 'complaints'), { text: complaintText, category: complaintCategory, userId: currentUser.uid, status: 'Pending', createdAt: new Date().toISOString() });
      showToast('Complaint submitted', 'success');
      setShowComplaintModal(false);
      setComplaintText('');
      loadData();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const updateComplaintStatus = async (id, status) => {
    try { await updateDoc(doc(db, 'complaints', id), { status }); loadData(); showToast('Status updated', 'success'); } catch (e) { showToast(e.message, 'error'); }
  };

  // Compute rating stats
  const itemRatings = {};
  ratings.forEach(r => {
    if (!itemRatings[r.item]) itemRatings[r.item] = [];
    itemRatings[r.item].push(r.rating);
  });
  const avgRatings = Object.entries(itemRatings).map(([item, vals]) => ({ item, avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1), count: vals.length })).sort((a, b) => b.avg - a.avg);

  const wordCount = complaintText.trim().split(/\s+/).filter(Boolean).length;

  // Get all today food items
  const allTodayItems = todayMenu ? Object.values(todayMenu).flat() : [];

  return (
    <div className="anim-in">
      <div className="page-header"><h1>Mess Food & Reviews</h1><p>Today's menu, food ratings, and complaints</p></div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {['today', 'weekly', 'rate', 'complaints', ...(isAdmin ? ['analytics'] : [])].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* TODAY */}
      {tab === 'today' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ color: 'var(--success)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>🍽️ {DAY_LABELS[todayIndex]}'s Menu</h3>
            <div className="grid grid-4">
              {MEAL_TYPES.map(meal => (
                <div key={meal} className="card card--static" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, color: meal === 'breakfast' ? '#fbbf24' : meal === 'lunch' ? '#34d399' : meal === 'snacks' ? '#f472b6' : '#818cf8' }}>
                    {MEAL_ICONS[meal]} {meal}
                  </div>
                  <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, listStyle: 'none' }}>
                    {todayMenu?.[meal]?.map((item, i) => <li key={i}><span style={{ color: 'var(--accent)', marginRight: 8 }}>•</span>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setShowRateModal(true)}><Star size={16} /> Rate Food</button>
            <button className="btn btn-secondary" onClick={() => setShowComplaintModal(true)}><AlertTriangle size={16} /> File Complaint</button>
          </div>
        </div>
      )}

      {/* WEEKLY */}
      {tab === 'weekly' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {DAY_NAMES.map((day, i) => (
            <div key={day} className="card card--static" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ padding: 12, textAlign: 'center', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--border)', background: i === todayIndex ? 'var(--accent-gradient)' : 'transparent', color: i === todayIndex ? 'white' : 'var(--text-primary)' }}>{DAY_LABELS[i]}</div>
              <div style={{ padding: 12 }}>
                {MEAL_TYPES.map(meal => (
                  <div key={meal} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{MEAL_ICONS[meal]} {meal}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{DEFAULT_MESS_MENU[day]?.[meal]?.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RATE */}
      {tab === 'rate' && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Food Ratings Overview</h3>
          {avgRatings.length === 0 ? (
            <div className="empty-state"><Star size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No ratings yet</h3><p>Be the first to rate today's food!</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {avgRatings.map(r => (
                <div key={r.item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{r.item}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="stars">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(r.avg) ? '#f59e0b' : 'none'} color={s <= Math.round(r.avg) ? '#f59e0b' : 'var(--text-muted)'} />)}</div>
                    <span style={{ fontSize: 14, color: 'var(--warning)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", minWidth: 36, textAlign: 'right' }}>{r.avg}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({r.count})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowRateModal(true)}><Star size={16} /> Rate Food Item</button>
        </div>
      )}

      {/* COMPLAINTS */}
      {tab === 'complaints' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{isAdmin ? 'All Complaints' : 'Your Complaints'} ({userComplaints.length}/2 active)</h3>
            <button className="btn btn-primary" onClick={() => setShowComplaintModal(true)} disabled={userComplaints.filter(c => c.status !== 'Resolved').length >= 2}><Plus size={16} /> New Complaint</button>
          </div>
          {(isAdmin ? complaints : userComplaints).length === 0 ? (
            <div className="empty-state"><MessageSquare size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No complaints</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(isAdmin ? complaints : userComplaints).map(c => (
                <div key={c.id} style={{ padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className={`badge ${c.status === 'Pending' ? 'badge-warning' : c.status === 'Resolved' ? 'badge-success' : 'badge-info'}`}>{c.status}</span>
                    <span className="badge badge-primary">{c.category}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.text}</p>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {['Pending', 'Under Review', 'Resolved'].map(s => (
                        <button key={s} className={`btn btn-sm ${c.status === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => updateComplaintStatus(c.id, s)}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS (Admin only) */}
      {tab === 'analytics' && isAdmin && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📊 Food Analytics</h3>
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            <div className="card card--static">
              <h4 style={{ marginBottom: 12 }}>Average Rating per Item</h4>
              {avgRatings.length > 0 ? (
                <Bar data={{ labels: avgRatings.slice(0, 10).map(r => r.item), datasets: [{ label: 'Avg Rating', data: avgRatings.slice(0, 10).map(r => parseFloat(r.avg)), backgroundColor: 'rgba(99,102,241,0.6)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 4 }] }} options={chartOptions} />
              ) : <p style={{ color: 'var(--text-muted)' }}>No data</p>}
            </div>
            <div className="card card--static">
              <h4 style={{ marginBottom: 12 }}>Complaint Status Distribution</h4>
              {complaints.length > 0 ? (
                <Pie data={{ labels: ['Pending', 'Under Review', 'Resolved'], datasets: [{ data: ['Pending', 'Under Review', 'Resolved'].map(s => complaints.filter(c => c.status === s).length), backgroundColor: ['rgba(245,158,11,0.7)', 'rgba(6,182,212,0.7)', 'rgba(16,185,129,0.7)'], borderWidth: 0 }] }} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
              ) : <p style={{ color: 'var(--text-muted)' }}>No data</p>}
            </div>
          </div>
          <h4 style={{ marginBottom: 12 }}>All Reviews</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ratings.filter(r => r.review).map(r => (
              <div key={r.id} style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{r.item}</strong>
                  <div className="stars">{[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : 'var(--text-muted)'} />)}</div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate Modal */}
      <Modal isOpen={showRateModal} onClose={() => setShowRateModal(false)} title="Rate Food Item" footer={<><button className="btn btn-secondary" onClick={() => setShowRateModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submitRating}>Submit</button></>}>
        <div className="input-group">
          <label>Food Item</label>
          <select className="input" value={rateForm.item} onChange={e => setRateForm({...rateForm, item: e.target.value})}>
            <option value="">Select item...</option>
            {allTodayItems.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Rating</label>
          <div className="stars" style={{ gap: 4 }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={28} fill={s <= rateForm.rating ? '#f59e0b' : 'none'} color={s <= rateForm.rating ? '#f59e0b' : 'var(--text-muted)'} style={{ cursor: 'pointer' }} onClick={() => setRateForm({...rateForm, rating: s})} />)}
          </div>
        </div>
        <div className="input-group"><label>Review (optional)</label><textarea className="input" value={rateForm.review} onChange={e => setRateForm({...rateForm, review: e.target.value})} rows={3} placeholder="How was the food?" /></div>
      </Modal>

      {/* Complaint Modal */}
      <Modal isOpen={showComplaintModal} onClose={() => setShowComplaintModal(false)} title="File Complaint" footer={<><button className="btn btn-secondary" onClick={() => setShowComplaintModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submitComplaint}>Submit</button></>}>
        <div className="input-group">
          <label>Category</label>
          <select className="input" value={complaintCategory} onChange={e => setComplaintCategory(e.target.value)}>
            {['Mess', 'Hostel', 'Academics', 'Infrastructure'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Complaint</label>
          <textarea className="input" value={complaintText} onChange={e => setComplaintText(e.target.value)} rows={4} placeholder="Describe your concern..." maxLength={2000} />
          <div className={`word-count ${wordCount > 180 ? 'near-limit' : ''} ${wordCount >= 200 ? 'at-limit' : ''}`}>{wordCount}/200 words</div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>⚠️ Max 2 active complaints per user. Max 200 words per complaint.</p>
      </Modal>
    </div>
  );
}
