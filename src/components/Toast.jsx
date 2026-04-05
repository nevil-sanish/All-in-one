import { useState, createContext, useContext, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);
let toastFn = null;

export function useToast() {
  return useCallback((message, type = 'info') => {
    if (toastFn) toastFn(message, type);
  }, []);
}

export function showToast(message, type = 'info') {
  if (toastFn) toastFn(message, type);
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  toastFn = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
