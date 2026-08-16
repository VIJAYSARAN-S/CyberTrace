import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DbProvider } from './context/DbContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Cases } from './pages/Cases';
import { RegisterCase } from './pages/RegisterCase';
import { CaseDetails } from './pages/CaseDetails';
import { Evidence } from './pages/Evidence';
import { Investigations } from './pages/Investigations';
import { Investigators } from './pages/Investigators';
import { Victims } from './pages/Victims';
import { Suspects } from './pages/Suspects';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';
import { ShieldAlert } from 'lucide-react';

// Immersive 404 Page
const NotFound: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f1ee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>
      <div style={{
        maxWidth: '420px',
        background: '#ffffff',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)' }} />
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '14px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <ShieldAlert style={{ width: '24px', height: '24px', color: '#f87171' }} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111111', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
          Security Bypass Exception
        </h2>
        <p style={{ fontSize: '12px', color: '#5d5b57', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          SYSTEM ALARM: Requested dossier path is invalid or requires elevated clearance codes. Attempted bypass has been logged.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: '#111111',
            color: 'white',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
            transition: 'all 200ms ease'
          }}
        >
          Return to Command Center
        </Link>
      </div>
    </div>
  );
};


export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DbProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Authenticated Dashboard Core */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/new" element={<RegisterCase />} />
              <Route path="/cases/:id" element={<CaseDetails />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/investigations" element={<Investigations />} />
              <Route path="/investigators" element={<Investigators />} />
              <Route path="/victims" element={<Victims />} />
              <Route path="/suspects" element={<Suspects />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </DbProvider>
    </BrowserRouter>
  );
};
export default App;
