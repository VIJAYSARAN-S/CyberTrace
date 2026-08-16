import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { 
  Search, 
  Mail, 
  Phone, 
  Shield, 
  FolderOpen
} from 'lucide-react';

export const Investigators: React.FC = () => {
  const { investigators } = useDb();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter investigators by search query
  const filteredInvestigators = investigators.filter(inv => 
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.rank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Workload color picker
  const getWorkloadStatus = (cases: number) => {
    if (cases >= 3) return { label: 'High Capacity', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' };
    if (cases === 2) return { label: 'Medium Capacity', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' };
    if (cases === 1) return { label: 'Low Capacity', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' };
    return { label: 'Available', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399', border: 'rgba(16, 185, 129, 0.2)' };
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Tactical Duty Roster
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Operational status, contact credentials, and caseload capacity metrics of active unit agents.
          </p>
        </div>
        
        {/* Search Input */}
        <div style={{ position: 'relative', width: '260px' }} className="w-full sm:w-72">
          <Search style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '14px',
            color: '#5d5b57'
          }} />
          <input
            type="text"
            placeholder="Search name, rank, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.25rem',
              paddingRight: '0.75rem',
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              background: 'rgba(17,17,17,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#cbd5e1',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'all 150ms ease'
            }}
          />
        </div>
      </div>

      {/* Roster Grid */}
      {filteredInvestigators.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="grid-cols-kpi">
          {filteredInvestigators.map((inv) => {
            const workload = getWorkloadStatus(inv.activeCases);
            const loadPercent = Math.min((inv.activeCases / 4) * 100, 100);

            return (
              <div 
                key={inv.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(17,17,17,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(17,17,17,0.03)';
                }}
              >
                <div>
                  {/* Top line: Avatar + Role Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#111111',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getInitials(inv.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.name}</h4>
                      <p style={{ fontSize: '10px', color: '#4b4a48', fontWeight: 600, margin: '0.15rem 0 0 0' }}>{inv.rank}</p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11.5px', fontWeight: 600, color: '#5d5b57' }}>
                    <Shield style={{ width: '14px', height: '14px', color: '#3b82f6', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.specialty}</span>
                  </div>

                  {/* Caseload indicator */}
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '0.875rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontWeight: 700 }}>
                      <span style={{ color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Caseload</span>
                      <span style={{
                        padding: '0.15rem 0.4rem',
                        borderRadius: '5px',
                        background: workload.bg,
                        border: `1px solid ${workload.border}`,
                        color: workload.text,
                        fontWeight: 800
                      }}>
                        {inv.activeCases} {inv.activeCases === 1 ? 'Case' : 'Cases'}
                      </span>
                    </div>
                    
                    {/* Capacity bar */}
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', height: '5px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${loadPercent}%`, 
                          background: workload.color,
                          borderRadius: '10px',
                          transition: 'width 300ms ease'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#5d5b57', fontWeight: 600 }}>
                      <span>Status: {workload.label}</span>
                      <span>Max: 4</span>
                    </div>
                  </div>
                </div>

                {/* Contact Footer */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '11.5px', fontWeight: 600 }}>
                  <a href={`mailto:${inv.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', textDecoration: 'none', transition: 'color 120ms ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                  >
                    <Mail style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.email}</span>
                  </a>
                  <a href={`tel:${inv.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', textDecoration: 'none', transition: 'color 120ms ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                  >
                    <Phone style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0 }} />
                    <span>{inv.phone}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px' }}>
          <FolderOpen style={{ width: '36px', height: '36px', color: '#5d5b57', margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#5d5b57' }}>No agents found matching the query.</p>
          <p style={{ color: '#4b4a48', fontSize: '11px', marginTop: '0.2rem' }}>Verify name spelling or specialty keywords.</p>
        </div>
      )}
    </div>
  );
};

export default Investigators;
