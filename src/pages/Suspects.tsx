import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { 
  UserX, 
  Search, 
  Plus, 
  ShieldAlert, 
  MessageSquare, 
  Edit3, 
  X,
  Fingerprint
} from 'lucide-react';

interface SuspectFormInput {
  name: string;
  knownAlias: string;
  contact: string;
  investigationStatus: string;
}

export const Suspects: React.FC = () => {
  const { suspects, addSuspect, updateSuspect } = useDb();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Modal and detail states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSusId, setEditingSusId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Suspect (from search or link)
  const [selectedSusId, setSelectedSusId] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<SuspectFormInput>();

  useEffect(() => {
    const directId = searchParams.get('id');
    if (directId) {
      setSelectedSusId(directId);
    }
  }, [searchParams]);

  const onAddSubmit = (data: SuspectFormInput) => {
    addSuspect(data);
    showToast(`Suspect profile logged for ${data.name} ("${data.knownAlias}").`, 'success');
    setShowAddModal(false);
    reset();
  };

  const onEditSubmit = (data: SuspectFormInput) => {
    if (editingSusId) {
      updateSuspect(editingSusId, data);
      showToast(`Suspect profile ${editingSusId} details updated.`, 'success');
      setEditingSusId(null);
      reset();
    }
  };

  const handleStartEdit = (sus: typeof suspects[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSusId(sus.id);
    reset();
    setValue('name', sus.name);
    setValue('knownAlias', sus.knownAlias);
    setValue('contact', sus.contact);
    setValue('investigationStatus', sus.investigationStatus);
  };

  // Filter suspects
  const filteredSuspects = suspects.filter(sus => 
    sus.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sus.knownAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sus.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Arrest': return <span className="badge-priority-critical">UNDER ARREST</span>;
      case 'Wanted': return <span className="badge-priority-high">WANTED / FUGITIVE</span>;
      case 'Under Investigation': return <span className="badge-status-investigating">INVESTIGATING</span>;
      default: return <span className="badge-slate">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Suspect Watchlist
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Audit threat actors, online handles, active aliases, and arrest logs.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowAddModal(true);
          }}
          className="flat-btn-primary"
          style={{ fontSize: '11.5px' }}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
          <span>Log Suspect</span>
        </button>
      </div>

      {/* Filter panel */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }} className="flex-col sm:flex-row gap-3">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
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
            placeholder="Search by ID, name, handles/aliases..."
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
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Tracking {filteredSuspects.length} suspected actors
        </span>
      </div>

      {/* Suspect Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="grid-cols-kpi">
        {filteredSuspects.map((sus) => {
          const isHighlighted = sus.id === selectedSusId;
          return (
            <div
              key={sus.id}
              onClick={() => setSelectedSusId(sus.id)}
              style={{
                background: '#ffffff',
                border: isHighlighted ? '1px solid rgba(99,130,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isHighlighted ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={e => {
                if (!isHighlighted) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,130,255,0.15)';
              }}
              onMouseLeave={e => {
                if (!isHighlighted) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(17,17,17,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Fingerprint style={{ width: '15px', height: '15px', color: '#6366f1' }} />
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48' }}>{sus.id}</span>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', margin: 0 }}>{sus.name || 'Unknown Identification'}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '10.5px', color: '#4b4a48', fontWeight: 550 }}>Alias:</span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#cbd5e1',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '5px'
                    }}>
                      "{sus.knownAlias}"
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <ShieldAlert style={{ width: '13px', height: '13px', color: '#4b4a48', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Intelligence Status</span>
                        <div style={{ marginTop: '0.25rem' }}>
                          {getStatusBadge(sus.investigationStatus)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <MessageSquare style={{ width: '13px', height: '13px', color: '#4b4a48', marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Cyber Contacts</span>
                        <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#6b7280', display: 'block', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sus.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Cases Footer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Investigated Dockets</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                    {sus.previousCases.length > 0 ? (
                      sus.previousCases.map(cid => (
                        <button
                          key={cid}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cases?id=${cid}`);
                          }}
                          style={{
                            fontSize: '9.5px',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            color: '#60a5fa',
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.15)',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 120ms ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                        >
                          {cid}
                        </button>
                      ))
                    ) : (
                      <span style={{ fontSize: '11px', color: '#5d5b57' }}>No prior records</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleStartEdit(sus, e)}
                  style={{
                    background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.35rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                  title="Modify Profile"
                >
                  <Edit3 style={{ width: '13px', height: '13px' }} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setShowAddModal(false)} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            border: '1px solid rgba(99,130,255,0.15)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,130,255,0.3), transparent)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserX style={{ width: '16px', height: '16px', color: '#60a5fa' }} /> Log Suspect
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Real Name (Use 'Unknown' if anonymous)</label>
                <input
                  type="text"
                  placeholder="e.g. Dmitry Sidorov"
                  {...register('name', { required: 'Name is required' })}
                  className="flat-input"
                />
                {errors.name && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.name.message}</span>}
              </div>

              <div>
                <label className="form-label">Known Handle / Alias</label>
                <input
                  type="text"
                  placeholder="e.g. LockByte_Dev"
                  {...register('knownAlias', { required: 'Alias is required' })}
                  className="flat-input"
                />
                {errors.knownAlias && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.knownAlias.message}</span>}
              </div>

              <div>
                <label className="form-label">Intel Status</label>
                <select
                  {...register('investigationStatus', { required: true })}
                  className="form-select"
                  style={{ background: '#f3f1ee' }}
                >
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Wanted">Wanted / Fugitive</option>
                  <option value="Under Arrest">Under Arrest / Custody</option>
                  <option value="Exonerated">Exonerated</option>
                </select>
              </div>

              <div>
                <label className="form-label">Known Online Contacts (Telegram, Jabber, Onion mail)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Telegram @cryptoshadow_x, dmitry@lockbyte.onion"
                  {...register('contact', { required: 'Contact info is required' })}
                  className="form-textarea"
                  style={{ resize: 'none' }}
                />
                {errors.contact && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.contact.message}</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flat-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flat-btn-primary"
                >
                  Log Suspect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSusId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setEditingSusId(null)} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            border: '1px solid rgba(99,130,255,0.15)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,130,255,0.3), transparent)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 style={{ width: '16px', height: '16px', color: '#60a5fa' }} /> Modify Profile — {editingSusId}
              </h3>
              <button onClick={() => setEditingSusId(null)} style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Real Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Alias</label>
                <input
                  type="text"
                  {...register('knownAlias', { required: 'Alias is required' })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Intel Status</label>
                <select
                  {...register('investigationStatus', { required: true })}
                  className="form-select"
                  style={{ background: '#f3f1ee' }}
                >
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Wanted">Wanted</option>
                  <option value="Under Arrest">Under Arrest</option>
                  <option value="Exonerated">Exonerated</option>
                </select>
              </div>

              <div>
                <label className="form-label">Online Contact Coordinates</label>
                <textarea
                  rows={2}
                  {...register('contact', { required: 'Contact info is required' })}
                  className="form-textarea"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingSusId(null)}
                  className="flat-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flat-btn-primary"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suspects;
