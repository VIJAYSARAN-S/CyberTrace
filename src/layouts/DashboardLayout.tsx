import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDb } from '../context/DbContext';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { PageWrapper } from '../components/PageWrapper';

export const DashboardLayout: React.FC = () => {
  const { currentUser } = useDb();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentUser) return <Navigate to="/login" replace />;

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#f3f1ee' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'relative',
          zIndex: 1,
          marginLeft: isDesktop ? sidebarWidth : 0,
          transition: 'margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main style={{
          flexGrow: 1,
          paddingTop: '82px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingBottom: '2rem',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}>
          <AnimatePresence mode="wait" initial={false}>
            <PageWrapper key={location.pathname}>
              <Outlet />
            </PageWrapper>
          </AnimatePresence>
        </main>

        <footer className="no-print" style={{
          padding: '0.875rem 1.5rem',
          textAlign: 'center',
          fontSize: '9px',
          color: '#111111',
          borderTop: '1px solid #d9d3ce',
          background: 'transparent',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          CYBERTRACE • CENTRALIZED CYBER CRIME CASE MANAGEMENT AND DIGITAL FORENSICS SYSTEM
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
