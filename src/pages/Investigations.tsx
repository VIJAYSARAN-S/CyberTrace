import React, { useState, useEffect } from 'react';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare,
  FileCheck2,
  ListTodo
} from 'lucide-react';

export const Investigations: React.FC = () => {
  const { cases, investigators, updateInvestigation, currentUser } = useDb();
  const { showToast } = useToast();

  // Active selected case for updating
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Form states for updates
  const [progress, setProgress] = useState(0);
  const [findings, setFindings] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<typeof cases[0]['status']>('Under Investigation');

  // Filter cases depending on the logged-in user.
  const isInvestigator = currentUser?.role === 'Investigator';
  
  const investigatorProfile = investigators.find(
    inv => inv.email.toLowerCase() === currentUser?.email.toLowerCase()
  );

  const activeCases = cases.filter(c => {
    if (isInvestigator && investigatorProfile) {
      return c.assignedInvestigatorId === investigatorProfile.id && c.status !== 'Closed';
    }
    return c.status !== 'Closed';
  });

  // Sync state values when selected case changes
  useEffect(() => {
    if (selectedCaseId) {
      const c = cases.find(curr => curr.id === selectedCaseId);
      if (c) {
        setProgress(c.progress);
        setFindings(c.findings || '');
        setNotes(c.notes || '');
        setStatus(c.status);
      }
    } else if (activeCases.length > 0) {
      setSelectedCaseId(activeCases[0].id);
    }
  }, [selectedCaseId, cases]);

  const handleUpdate = () => {
    if (selectedCaseId) {
      updateInvestigation(selectedCaseId, progress, findings, notes, status);
      showToast(`Case ${selectedCaseId} progress logs updated successfully.`, 'success');
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'New': return <span className="badge-cyan">NEW</span>;
      case 'Assigned': return <span className="badge-blue">ASSIGNED</span>;
      case 'Under Investigation': return <span className="badge-status-investigating">INVESTIGATING</span>;
      case 'Evidence Collection': return <span className="badge-status-active">EVIDENCE COL</span>;
      case 'Closed': return <span className="badge-status-closed">CLOSED</span>;
      case 'Reopened': return <span className="badge-amber">REOPENED</span>;
      default: return <span className="badge-slate">{s.toUpperCase()}</span>;
    }
  };

  const currentSelectedCase = cases.find(c => c.id === selectedCaseId);

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Tactical Investigation Console
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            {isInvestigator 
              ? `Active probe console for ${investigatorProfile?.name || 'Tactical Officer'}. Log findings and progress.`
              : 'Operational overview of active investigations. Admin view permits audit updates.'}
          </p>
        </div>
      </div>

      {activeCases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]" style={{ gap: '1.25rem' }}>
          
          {/* Active Cases Column */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
              <ListTodo style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Assigned Worklist</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {activeCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                const investigatorName = investigators.find(i => i.id === c.assignedInvestigatorId)?.name || 'Unassigned';
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid rgba(99,130,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,130,255,0.06)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(17,17,17,0.03)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#60a5fa' }}>{c.id}</span>
                      {getStatusBadge(c.status)}
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111111', marginTop: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</h4>
                    
                    {/* Progress bar */}
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#4b4a48', fontWeight: 600 }}>
                        <span>Progress</span>
                        <span>{c.progress}%</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', height: '4px', overflow: 'hidden' }}>
                        <div style={{ background: '#3b82f6', height: '100%', width: `${c.progress}%`, borderRadius: '10px' }} />
                      </div>
                    </div>

                    {!isInvestigator && (
                      <span style={{ fontSize: '9px', color: '#5d5b57', display: 'block', marginTop: '0.5rem' }}>
                        Officer: <strong style={{ color: '#4b4a48' }}>{investigatorName}</strong>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Action Panel Column */}
          {currentSelectedCase ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxHeight: 'calc(100vh - 220px)',
              overflowY: 'auto'
            }}>
              
              {/* Header metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.875rem' }}>
                <div>
                  <span style={{ fontSize: '11.5px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#60a5fa' }}>{currentSelectedCase.id}</span>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111111', marginTop: '0.15rem' }}>{currentSelectedCase.title}</h3>
                </div>
                {getStatusBadge(status)}
              </div>

              {/* Progress Slider */}
              <div style={{
                background: '#f3f1ee',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                    Investigation Completion Rate
                  </h4>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#3b82f6' }}>{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.03)',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    accentColor: '#3b82f6'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#5d5b57', fontWeight: 600 }}>
                  <span>0% - Intake Registered</span>
                  <span>50% - Forensics Probe</span>
                  <span>100% - Docket Closed</span>
                </div>
              </div>

              {/* Action Fields Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Findings Registry */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
                    Forensic Findings (Evidence Indicators)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Log IP addresses, malicious domains, cryptocurrency wallet keys, or binary malware hashes found."
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
                    className="form-textarea"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Tactical Case Notes */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
                    Operational Case Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Log interviews, carrier subpoenas sent, or supervisor operational checkmarks."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-textarea"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Probe Status Selector */}
                <div style={{ maxWidth: '240px' }}>
                  <label className="form-label">Docket Probe Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    <option value="New">New</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Evidence Collection">Evidence Collection</option>
                    <option value="Closed">Closed</option>
                    <option value="Reopened">Reopened</option>
                  </select>
                </div>

              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={handleUpdate}
                  className="flat-btn-primary"
                  style={{ fontSize: '11.5px' }}
                >
                  Commit Investigation Logs
                </button>
              </div>

            </div>
          ) : null}

        </div>
      ) : (
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px' }}>
          <CheckCircle2 style={{ width: '36px', height: '36px', color: '#5d5b57', margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#5d5b57' }}>Zero active investigations assigned to your desk.</p>
          <p style={{ color: '#4b4a48', fontSize: '11px', marginTop: '0.2rem' }}>Check the case registry to assign active dossiers to your queue.</p>
        </div>
      )}
    </div>
  );
};

export default Investigations;
