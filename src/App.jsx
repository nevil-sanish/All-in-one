import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Chatbot from './components/Chatbot';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Internships from './pages/Internships';
import CalendarPage from './pages/CalendarPage';
import Mess from './pages/Mess';
import Papers from './pages/Papers';
import Hackathons from './pages/Hackathons';
import Toast from './components/Toast';
import './styles/index.css';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  return currentUser ? children : <Navigate to="/auth" />;
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/mess" element={<Mess />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/hackathons" element={<Hackathons />} />
          </Routes>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Toast />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
