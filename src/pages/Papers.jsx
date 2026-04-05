import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { Upload, FileText, ChevronDown, ChevronRight, Download, Trash2, Search, Eye } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'ECE', 'Cyber Security', 'AI & Data Science'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const EXAM_TYPES = ['Mid Semester', 'End Semester', 'Quiz', 'Assignment'];

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [openDepts, setOpenDepts] = useState({});
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ subject: '', semester: '1', year: new Date().getFullYear().toString(), examType: 'Mid Semester', department: 'CSE' });
  const [file, setFile] = useState(null);
  const { currentUser, isAdmin } = useAuth();

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'papers'), orderBy('createdAt', 'desc')));
      setPapers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const uploadPaper = async () => {
    if (!form.subject || !file) return showToast('Subject and file required', 'error');
    setUploading(true);
    try {
      const storageRef = ref(storage, `papers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'papers'), { ...form, fileUrl, fileName: file.name, uploadedBy: currentUser.uid, createdAt: new Date().toISOString() });
      showToast('Paper uploaded! 📄', 'success');
      setShowModal(false);
      setForm({ subject: '', semester: '1', year: new Date().getFullYear().toString(), examType: 'Mid Semester', department: 'CSE' });
      setFile(null);
      load();
    } catch (e) { showToast(e.message, 'error'); }
    setUploading(false);
  };

  const deletePaper = async (id) => {
    try { await deleteDoc(doc(db, 'papers', id)); load(); showToast('Paper deleted', 'info'); } catch (e) { showToast(e.message, 'error'); }
  };

  const toggleDept = (dept) => setOpenDepts(p => ({ ...p, [dept]: !p[dept] }));

  // Organize papers by dept > semester > subject
  const organized = {};
  const filtered = papers.filter(p => !search || p.subject?.toLowerCase().includes(search.toLowerCase()) || p.department?.toLowerCase().includes(search.toLowerCase()));
  filtered.forEach(p => {
    const dept = p.department || 'Other';
    const sem = `Semester ${p.semester || '?'}`;
    if (!organized[dept]) organized[dept] = {};
    if (!organized[dept][sem]) organized[dept][sem] = [];
    organized[dept][sem].push(p);
  });

  return (
    <div className="anim-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>Question Papers</h1><p>Upload and browse organized question papers</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Upload size={18} /> Upload Paper</button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', marginBottom: 24, maxWidth: 400 }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject or dept..." style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }} />
      </div>

      {Object.keys(organized).length === 0 ? (
        <div className="empty-state"><FileText size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} /><h3>No papers yet</h3><p>Upload a question paper to help your peers!</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(organized).map(([dept, semesters]) => (
            <div key={dept} className="card card--static" style={{ padding: 0, overflow: 'hidden' }}>
              <div onClick={() => toggleDept(dept)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer', transition: 'background 0.15s' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>
                  <FileText size={18} style={{ color: 'var(--accent)' }} />{dept}
                  <span className="badge badge-primary" style={{ marginLeft: 8 }}>{Object.values(semesters).flat().length}</span>
                </h3>
                {openDepts[dept] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
              {openDepts[dept] && (
                <div style={{ padding: '0 16px 16px' }}>
                  {Object.entries(semesters).sort().map(([sem, papers]) => (
                    <div key={sem} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>{sem}</div>
                      {papers.map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 'var(--radius-md)', transition: 'background 0.15s' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={18} style={{ color: '#ef4444' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.subject}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.examType} • {p.year}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {p.fileUrl && <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><Eye size={14} /> View</a>}
                            {p.fileUrl && <a href={p.fileUrl} download className="btn btn-ghost btn-sm"><Download size={14} /></a>}
                            {(isAdmin || p.uploadedBy === currentUser?.uid) && <button className="btn btn-ghost btn-sm" onClick={() => deletePaper(p.id)}><Trash2 size={14} /></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Question Paper" footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={uploadPaper} disabled={uploading}>{uploading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Uploading...</> : 'Upload'}</button></>}>
        <div className="input-group"><label>Subject Name</label><input className="input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g. Data Structures" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Department</label><select className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          <div className="input-group"><label>Semester</label><select className="input" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})}>{SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-group"><label>Year</label><input className="input" value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="2024" /></div>
          <div className="input-group"><label>Exam Type</label><select className="input" value={form.examType} onChange={e => setForm({...form, examType: e.target.value})}>{EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div className="input-group">
          <label>File (PDF)</label>
          <div onClick={() => document.getElementById('paper-file-input')?.click()} style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
            <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{file ? file.name : 'Click to select PDF file'}</p>
          </div>
          <input id="paper-file-input" type="file" accept=".pdf,.doc,.docx,.jpg,.png" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
        </div>
      </Modal>
    </div>
  );
}
