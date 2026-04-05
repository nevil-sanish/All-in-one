import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showModal, setShowModal] = useState(false);
  const [batchFilter, setBatchFilter] = useState('all');
  const [form, setForm] = useState({ title: '', date: '', batch: 'all', description: '' });
  const { currentUser, userData } = useAuth();

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, 'calendarEvents'));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const addEvent = async () => {
    if (!form.title || !form.date) return showToast('Title and date required', 'error');
    try {
      await addDoc(collection(db, 'calendarEvents'), { ...form, createdBy: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Calendar event added!', 'success');
      setShowModal(false);
      setForm({ title: '', date: '', batch: 'all', description: '' });
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      const matchDate = e.date === dateStr;
      const matchBatch = batchFilter === 'all' || e.batch === 'all' || e.batch === batchFilter;
      return matchDate && matchBatch;
    });
  };

  const selectedEvents = getEventsForDay(selectedDay);
  const selectedDateStr = `${MONTHS[month]} ${selectedDay}, ${year}`;

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const batches = ['all', '2021', '2022', '2023', '2024', '2025'];

  return (
    <div className="anim-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>Academic Calendar</h1><p>Batch-wise and year-wise events</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...form, date: `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` }); setShowModal(true); }}><Plus size={18} /> Add Activity</button>
      </div>

      {/* Batch filter */}
      <div className="filter-chips" style={{ marginBottom: 24 }}>
        {batches.map(b => <button key={b} className={`chip ${batchFilter === b ? 'active' : ''}`} onClick={() => setBatchFilter(b)}>{b === 'all' ? 'All Batches' : `Batch ${b}`}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Calendar grid */}
        <div className="card card--static">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{MONTHS[month]} {year}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-icon btn-icon-sm" onClick={prevMonth}><ChevronLeft size={18} /></button>
              <button className="btn-icon btn-icon-sm" onClick={nextMonth}><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const isSelected = selectedDay === day;
              return (
                <div key={day} onClick={() => setSelectedDay(day)} style={{
                  aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: isToday ? 700 : 500, cursor: 'pointer',
                  transition: 'all 0.15s', position: 'relative',
                  border: isToday ? '1px solid var(--accent)' : '1px solid transparent',
                  background: isSelected ? 'var(--accent-gradient)' : isToday ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-primary)'
                }}>
                  {day}
                  {dayEvents.length > 0 && <div style={{ width: dayEvents.length > 1 ? 12 : 5, height: 5, borderRadius: 3, background: isSelected ? 'white' : 'var(--accent)', position: 'absolute', bottom: 4 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card--static">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{selectedDateStr}</h3>
            {selectedEvents.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No events on this day</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.batch === 'all' ? 'All Batches' : `Batch ${ev.batch}`}</div>
                      {ev.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{ev.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 320px"]{grid-template-columns:1fr !important}}`}</style>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Calendar Activity" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={addEvent}>Add</button></>}>
        <div className="input-group"><label>Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Mid-semester Exam" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Date</label><input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="input-group"><label>Batch</label><select className="input" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})}>{batches.map(b=><option key={b} value={b}>{b === 'all' ? 'All Batches' : `Batch ${b}`}</option>)}</select></div>
        </div>
        <div className="input-group"><label>Description</label><textarea className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
      </Modal>
    </div>
  );
}
