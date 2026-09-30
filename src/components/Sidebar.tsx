import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDb } from '../context/DbContext';
import {
  LayoutDashboard, Folder, PlusCircle, Search, Database,
  Link2, Users, FileText, BarChart3, Clock, Settings, LogOut, X, User, Shield
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const menuGroups = [
  {
    group: '',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'CASES',
    items: [
      { name: 'All Cases', path: '/cases', icon: Folder },
      { name: 'New Case', path: '/cases/new', icon: PlusCircle }
    ]
  },
  {
    group: 'INVESTIGATION',
    items: [
      { name: 'Investigation', path: '/investigations', icon: Search }
    ]
  },
  {
    group: 'EVIDENCE',
    items: [
      { name: 'Repository', path: '/evidence', icon: Database },
      { name: 'Chain of Custody', path: '/audit-logs?filter=evidence', icon: Link2 }
    ]
  },
  {
    group: 'MANAGEMENT',
    items: [
      { name: 'Investigators', path: '/investigators', icon: Users },
      { name: 'Victims', path: '/victims', icon: Users },
      { name: 'Suspects', path: '/suspects', icon: Users },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 }
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { name: 'Audit Logs', path: '/audit-logs', icon: Clock },
      { name: 'Settings', path: '/settings', icon: Settings }
    ]
  }
];

const SidebarContent: React.FC<{
  collapsed: boolean;
  onLinkClick?: () => void;
}> = ({ collapsed, onLinkClick }) => {
  const { currentUser, logout } = useDb();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{
      background: '#f3f1ee',
      borderRight: '1px solid #d9d3ce'
    }}>
      <div style={{
        display: 'flex',
        height: '64px',
        alignItems: 'center',
        padding: collapsed ? '0 1rem' : '0 1.25rem',
        borderBottom: '1px solid #d9d3ce',
        flexShrink: 0,
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '0.75rem'
      }}>
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-brand"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              style={{
                width: '36px',
                height: '36px',
                background: '#111111',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
            </motion.div>
          ) : (
            <motion.div
              key="full-brand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                background: '#111111',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#111111',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2
                }}>
                  CYBERTRACE
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '0.75rem', paddingBottom: '1rem' }}>
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: '0.25rem' }}>
            {!collapsed && group.group && (
              <div style={{
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#111111',
                textTransform: 'uppercase',
                padding: '0.625rem 1.25rem 0.3rem',
                whiteSpace: 'nowrap'
              }}>
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = item.path === '/dashboard'
                ? location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard')
                : location.pathname.startsWith(item.path.split('?')[0]);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onLinkClick}
                  title={collapsed ? item.name : undefined}
                  style={({ isActive: _ }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: collapsed ? '0.6rem' : '0.6rem 1rem',
                    margin: '0.1rem 0.5rem',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#111111' : '#494744',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    background: isActive ? '#efeee9' : 'transparent',
                    border: isActive ? '1px solid #d9d3ce' : '1px solid transparent',
                    transition: 'all 150ms ease',
                    whiteSpace: 'nowrap',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    position: 'relative'
                  })}
                  className={isActive ? 'sidebar-item-active' : ''}
                >
                  <item.icon style={{
                    width: '15px',
                    height: '15px',
                    flexShrink: 0,
                    color: isActive ? '#111111' : '#4b4a48'
                  }} />
                  {!collapsed && (
                    <span style={{ letterSpacing: '0.01em' }}>
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      {currentUser && (
        <div
          onClick={handleLogout}
          style={{
            borderTop: '1px solid rgba(99, 130, 255, 0.1)',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'background 150ms ease',
            flexShrink: 0,
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
          title="Click to sign out"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(17,17,17,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}>
            <User style={{ width: '16px', height: '16px', color: 'white' }} />
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #f3f1ee',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
            }} />
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#111111',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.3
                }}>
                  {currentUser.name}
                </p>
                <p style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#10b981',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  ONLINE
                </p>
              </div>
              <LogOut style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0 }} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileOpen && overlayRef.current && overlayRef.current === e.target) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed top-0 bottom-0 left-0 z-30 flex-col overflow-hidden transition-[width] duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ width: collapsed ? 72 : 260 }}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-64 h-full flex flex-col"
              style={{ background: '#f3f1ee' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-10"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'rgba(17,17,17,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
              <SidebarContent collapsed={false} onLinkClick={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
