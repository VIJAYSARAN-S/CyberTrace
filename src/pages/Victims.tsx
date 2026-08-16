import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { 
  HeartHandshake, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  X,
  UserCheck
} from 'lucide-react';

interface VictimFormInput {
  name: string;
  contact: string;
  address: string;
  email: string;
}

export const Victims: React.FC = () => {
  const { victims, addVictim, updateVictim } = useDb();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dialog States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVicId, setEditingVicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected victim (e.g. from global search)
  const [selectedVicId, setSelectedVicId] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<VictimFormInput>();

  useEffect(() => {
    const directId = searchParams.get('id');
    if (directId) {
      setSelectedVicId(directId);
    }
  }, [searchParams]);

  const onAddSubmit = (data: VictimFormInput) => {
    addVictim(data);
    showToast(`Victim record for ${data.name} created.`, 'success');
    setShowAddModal(false);
    reset();
  };

  const onEditSubmit = (data: VictimFormInput) => {
    if (editingVicId) {
      updateVictim(editingVicId, data);
      showToast(`Victim record ${editingVicId} updated successfully.`, 'success');
      setEditingVicId(null);
      reset();
    }
  };

  const handleStartEdit = (vic: typeof victims[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVicId(vic.id);
    reset();
    setValue('name', vic.name);
    setValue('contact', vic.contact);
    setValue('address', vic.address);
    setValue('email', vic.email);
  };

  // Filter list
  const filteredVictims = victims.filter(vic => 
    vic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    vic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vic.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Victim Profiles
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Manage victim records, contact ledgers, and docket link counts.
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
          <span>Create Profile</span>
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
            placeholder="Search by ID, name, email address..."
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
          Showing {filteredVictims.length} of {victims.length} profiles
        </span>
      </div>

      {/* Victim Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="grid-cols-kpi">
        {filteredVictims.map((vic) => {
          const isHighlighted = vic.id === selectedVicId;
          return (
            <div
              key={vic.id}
              onClick={() => setSelectedVicId(vic.id)}
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
                    <UserCheck style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48' }}>{vic.id}</span>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', margin: 0 }}>{vic.name}</h4>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '11.5px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                      <Mail style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vic.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                      <Phone style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0 }} />
                      <span>{vic.contact}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#6b7280' }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#5d5b57', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '11px', color: '#4b4a48', lineHeight: 1.4 }}>{vic.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case History Footer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Associated Cases</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                    {vic.complaintHistory.length > 0 ? (
                      vic.complaintHistory.map(cid => (
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
                      <span style={{ fontSize: '11px', color: '#5d5b57' }}>No active complaints</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleStartEdit(vic, e)}
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
                <HeartHandshake style={{ width: '16px', height: '16px', color: '#60a5fa' }} /> Create Victim Profile
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alice Green"
                  {...register('name', { required: 'Name is required' })}
                  className="flat-input"
                />
                {errors.name && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.name.message}</span>}
              </div>

              <div>
                <label className="form-label">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1-312-555-0143"
                  {...register('contact', { required: 'Contact is required' })}
                  className="flat-input"
                />
                {errors.contact && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.contact.message}</span>}
              </div>

              <div>
                <label className="form-label">Primary Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. alice@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className="flat-input"
                />
                {errors.email && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.email.message}</span>}
              </div>

              <div>
                <label className="form-label">Physical Address / Headquarters</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 123 Pine St, Seattle, WA"
                  {...register('address', { required: 'Address is required' })}
                  className="form-textarea"
                  style={{ resize: 'none' }}
                />
                {errors.address && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.address.message}</span>}
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
                  Confirm Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVicId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setEditingVicId(null)} />
          
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
                <Edit3 style={{ width: '16px', height: '16px', color: '#60a5fa' }} /> Modify Profile — {editingVicId}
              </h3>
              <button onClick={() => setEditingVicId(null)} style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  {...register('contact', { required: 'Contact is required' })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Primary Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Physical Address</label>
                <textarea
                  rows={2}
                  {...register('address', { required: 'Address is required' })}
                  className="form-textarea"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingVicId(null)}
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

export default Victims;
