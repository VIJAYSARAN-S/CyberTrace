import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDb } from '../context/DbContext';
import { Bell, Search, ChevronDown, LogOut, Settings, Menu, ChevronRight, Shield } from 'lucide-react';

interface TopBarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ sidebarCollapsed, setSidebarCollapsed, setMobileOpen }) => {
  const { currentUser, logout, changeRole, cases, victims, suspects } = useDb();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; id: string; name: string }[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState([
    { id: 1, title: 'New Ransomware Alert', desc: 'Apex Solutions DC encrypted.', time: '5m', read: false },
    { id: 2, title: 'Evidence Hash Verified', desc: 'SHA-256 matched for EVID-0012.', time: '1h', read: false },
    { id: 3, title: 'Failed Login Attempt', desc: 'IP 103.22.45.19 flagged.', time: '2h', read: true },
    { id: 4, title: 'Report Export Complete', desc: 'Weekly Summary exported.', time: '1d', read: true },
  ]);
  const [readAll, setReadAll] = useState(false);
  const unreadCount = readAll ? 0 : notifications.filter(n => !n.read).length;

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(Boolean);
    if (!pathnames.length) return [{ name: 'Dashboard', path: '/dashboard' }];

    const crumbs: { name: string; path: string }[] = [];
    if (pathnames[0] === 'dashboard') {
      crumbs.push({ name: 'Dashboard', path: '/dashboard' });
      pathnames.slice(1).forEach((val, idx) => {
        const path = `/${pathnames.slice(0, idx + 2).join('/')}`;
        let name = val.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (val.startsWith('CC-')) name = val;
        crumbs.push({ name, path });
      });
      return crumbs;
    }

    const initial = [{ name: 'System', path: '/dashboard' }];
    pathnames.forEach((val, idx) => {
      const path = `/${pathnames.slice(0, idx + 1).join('/')}`;
      let name = val.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (val.startsWith('CC-')) name = val;
      initial.push({ name, path });
    });
    return initial;
  };

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results: typeof searchResults = [];
    cases.forEach(c => {
      if (c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
        results.push({ type: 'Case', id: c.id, name: `${c.id} — ${c.title}` });
    });
    victims.forEach(v => {
      if (v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q))
        results.push({ type: 'Victim', id: v.id, name: `${v.id} — ${v.name}` });
    });
    suspects.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.knownAlias.toLowerCase().includes(q))
        results.push({ type: 'Suspect', id: s.id, name: `${s.id} — ${s.name} (${s.knownAlias})` });
    });
    setSearchResults(results.slice(0, 7));
  }, [searchQuery, cases, victims, suspects]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (type: string, id: string) => {
    setSearchQuery('');
    setShowSearch(false);
    if (type === 'Case') navigate(`/cases/${id}`);
    else if (type === 'Victim') navigate(`/victims?id=${id}`);
    else navigate(`/suspects?id=${id}`);
  };

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header style={{
      height: '64px',
      position: 'fixed',
      top: 0,
      right: 0,
      left: isDesktop ? (sidebarCollapsed ? 72 : 260) : 0,
      transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 20,
      background: '#f3f1ee',
      borderBottom: '1px solid #d9d3ce',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      gap: '0.75rem'
    }}>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden"
        style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(17,17,17,0.03)',
          color: '#6b7280',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <Menu style={{ width: '16px', height: '16px' }} />
      </button>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="hidden md:flex"
        style={{
          width: '32px',
          height: '32px',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
          border: '1px solid #d9d3ce',
          background: '#f7f5f1',
          color: '#4b4a48',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 150ms ease'
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#efeee9'; (e.currentTarget as HTMLElement).style.color = '#111111'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f7f5f1'; (e.currentTarget as HTMLElement).style.color = '#4b4a48'; }}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          {sidebarCollapsed
            ? <path d="M2 4h12v1.5H2V4zm0 3.25h12v1.5H2v-1.5zM2 10.5h12V12H2v-1.5z"/>
            : <path d="M2 4h12v1.5H2V4zm0 3.25h7v1.5H2v-1.5zM2 10.5h12V12H2v-1.5z"/>
          }
        </svg>
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '0.375rem', fontSize: '11px', fontWeight: 500, color: '#5d5b57', userSelect: 'none', flexShrink: 0 }}>
        {getBreadcrumbs().map((bc, idx, arr) => (
          <React.Fragment key={bc.path}>
            {idx > 0 && (
              <ChevronRight style={{ width: '12px', height: '12px', color: '#111111', flexShrink: 0 }} />
            )}
            {idx === arr.length - 1 ? (
              <span style={{ color: '#5d5b57', fontWeight: 600 }}>{bc.name}</span>
            ) : (
              <Link to={bc.path} style={{ color: '#5d5b57', textDecoration: 'none', transition: 'color 120ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5d5b57')}
              >{bc.name}</Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Global Search */}
      <div ref={searchRef} style={{ position: 'relative' }} className="hidden sm:block">
        <Search style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '13px',
          height: '13px',
          color: '#5d5b57'
        }} />
        <input
          type="text"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
          onFocus={() => setShowSearch(true)}
          style={{
            width: '220px',
            paddingLeft: '2.1rem',
            paddingRight: '0.75rem',
            paddingTop: '0.45rem',
            paddingBottom: '0.45rem',
            background: '#f7f5f1',
            border: '1px solid #d9d3ce',
            borderRadius: '8px',
            fontSize: '11.5px',
            fontWeight: 400,
            color: '#111111',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'all 150ms ease'
          }}

        />
        <AnimatePresence>
          {showSearch && searchQuery.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid rgba(99,130,255,0.15)',
                borderRadius: '10px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                zIndex: 50,
                minWidth: '300px'
              }}
            >
              {searchResults.length > 0 ? (
                <>
                  <div style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {searchResults.length} Results
                    </span>
                  </div>
                  {searchResults.map(r => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={() => handleResultClick(r.type, r.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.875rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background 120ms ease',
                        gap: '0.75rem'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(17,17,17,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: '12px', color: '#5d5b57', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '5px', background: 'rgba(17,17,17,0.08)', color: '#a5b4fc', border: '1px solid rgba(17,17,17,0.08)', flexShrink: 0 }}>{r.type}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div style={{ padding: '1.25rem', textAlign: 'center', fontSize: '12px', color: '#5d5b57' }}>No records found.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div ref={notifyRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(17,17,17,0.03)',
            color: '#6b7280',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.05)'; (e.currentTarget as HTMLElement).style.color = '#5d5b57'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.03)'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
        >
          <Bell style={{ width: '15px', height: '15px' }} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '7px',
              height: '7px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '1.5px solid #0a0e1a',
              boxShadow: '0 0 6px rgba(239,68,68,0.6)',
              animation: 'pulse-dot 2s infinite'
            }} />
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: '300px',
                background: '#ffffff',
                border: '1px solid rgba(99,130,255,0.15)',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                zIndex: 50
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Alerts {unreadCount > 0 && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.1rem 0.35rem', borderRadius: '5px', border: '1px solid rgba(239,68,68,0.2)' }}>{unreadCount}</span>}
                </span>
                <button
                  onClick={() => setReadAll(true)}
                  style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                >
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: (!n.read && !readAll) ? 'rgba(59,130,246,0.04)' : 'transparent',
                    transition: 'background 120ms ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.3, flex: 1 }}>{n.title}</p>
                      <span style={{ fontSize: '9px', color: '#5d5b57', flexShrink: 0 }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: '10.5px', color: '#4b4a48', marginTop: '0.2rem' }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      {currentUser && (
        <div ref={profileRef} style={{ position: 'relative', userSelect: 'none' }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.625rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(17,17,17,0.03)',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(17,17,17,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(17,17,17,0.03)')}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              background: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield style={{ width: '13px', height: '13px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#5d5b57', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </span>
            <ChevronDown style={{ width: '12px', height: '12px', color: '#4b4a48', flexShrink: 0 }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '220px',
                  background: '#ffffff',
                  border: '1px solid rgba(99,130,255,0.15)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  zIndex: 50
                }}
              >
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clearance Code</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#5d5b57', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </p>
                </div>

                <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '8.5px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.25rem 0.375rem 0.35rem' }}>
                    Clearance Override
                  </p>
                  {(['Admin', 'Investigator', 'Forensic Analyst'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => { changeRole(r); setShowProfile(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.625rem',
                        borderRadius: '7px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textAlign: 'left',
                        background: currentUser.role === r
                          ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))'
                          : 'transparent',
                        color: currentUser.role === r ? '#60a5fa' : '#6b7280',
                        border: currentUser.role === r ? '1px solid rgba(17,17,17,0.08)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 120ms ease'
                      }}
                    >
                      {r}
                      {currentUser.role === r && <ChevronRight style={{ width: '11px', height: '11px' }} />}
                    </button>
                  ))}
                </div>

                <Link
                  to="/settings"
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#6b7280',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.03)'; (e.currentTarget as HTMLElement).style.color = '#5d5b57'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
                >
                  <Settings style={{ width: '13px', height: '13px' }} /> System Settings
                </Link>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#f87171',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut style={{ width: '13px', height: '13px' }} /> Terminate Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  );
};

export default TopBar;
