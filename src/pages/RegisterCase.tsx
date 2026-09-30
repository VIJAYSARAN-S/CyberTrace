import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import {
  AlertTriangle, ChevronRight, ChevronLeft, Check,
  User, ShieldAlert, FileText, HardDrive, Users, Clipboard
} from 'lucide-react';

interface FormData {
  title: string;
  crimeCategory: 'Phishing' | 'Identity Theft' | 'Ransomware' | 'Data Breach' | 'Online Banking Fraud' | 'Social Media Fraud' | 'Malware Attack' | 'Cyber Stalking' | 'Email Spoofing' | 'Cryptocurrency Scam';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Assigned' | 'Under Investigation' | 'Evidence Collection' | 'Closed' | 'Reopened';
  description: string;
  incidentDate: string;
  location: string;
  victimName: string;
  victimEmail: string;
  victimPhone: string;
  victimAddress: string;
  suspectName: string;
  suspectAlias: string;
  suspectNotes: string;
  evidenceSummary: string;
  assignedInvestigatorId: string;
  investigationNotes: string;
}

const STEPS = [
  { id: 1, label: 'Incident Details', icon: Clipboard },
  { id: 2, label: 'Victim Info', icon: User },
  { id: 3, label: 'Suspect Info', icon: ShieldAlert },
  { id: 4, label: 'Crime Description', icon: FileText },
  { id: 5, label: 'Evidence Summary', icon: HardDrive },
  { id: 6, label: 'Assignment', icon: Users },
];

const CRIME_CATEGORIES = [
  'Phishing', 'Identity Theft', 'Ransomware', 'Data Breach',
  'Online Banking Fraud', 'Malware Attack', 'Email Spoofing',
  'Cryptocurrency Scam', 'Social Media Fraud', 'Cyber Stalking',
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

export const RegisterCase: React.FC = () => {
  const { addCase, investigators, victims, suspects } = useDb();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      priority: 'Medium',
      status: 'New',
      crimeCategory: 'Phishing',
    }
  });

  const goNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const saveDraft = () => {
    setSavedDraft(true);
    showToast('Draft saved successfully.', 'info');
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    
    const linkedVictim = victims.find(v => v.name.toLowerCase() === data.victimName.toLowerCase());
    const linkedSuspect = suspects.find(s => s.name.toLowerCase() === data.suspectName.toLowerCase());
    
    addCase({
      title: data.title,
      crimeCategory: data.crimeCategory,
      priority: data.priority,
      status: data.status,
      crimeDescription: data.description,
      incidentDate: data.incidentDate || new Date().toISOString().split('T')[0],
      location: data.location,
      assignedInvestigatorId: data.assignedInvestigatorId || investigators[0]?.id || '',
      notes: data.investigationNotes || '',
      complaintDate: new Date().toISOString().split('T')[0],
      victimId: linkedVictim ? linkedVictim.id : (victims[0]?.id || 'VIC-001'),
      suspectId: linkedSuspect ? linkedSuspect.id : (suspects[0]?.id || 'SUS-001'),
    });
    showToast('Case registered successfully!', 'success');
    navigate('/cases');
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Dossier Registration
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
        </div>
        <button
          onClick={saveDraft}
          className="flat-btn"
          style={{
            fontSize: '11.5px',
            background: savedDraft ? 'rgba(16,185,129,0.1)' : 'rgba(17,17,17,0.03)',
            borderColor: savedDraft ? 'rgba(16,185,129,0.2)' : 'rgba(17,17,17,0.05)',
            color: savedDraft ? '#34d399' : '#cbd5e1'
          }}
        >
          {savedDraft ? <><Check style={{ width: '13px', height: '13px' }} /> Saved!</> : 'Save Draft'}
        </button>
      </div>

      {/* Step Progress Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: done ? '#10b981' : active ? '#111111' : 'rgba(255,255,255,0.02)',
                  border: done ? '1px solid rgba(16,185,129,0.3)' : active ? '1px solid rgba(99,130,255,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  color: done || active ? 'white' : '#5d5b57',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px',
                  boxShadow: active ? '0 0 15px rgba(99,102,241,0.35)' : 'none',
                  transition: 'all 200ms ease'
                }}>
                  {done ? <Check style={{ width: '14px', height: '14px' }} /> : <Icon style={{ width: '14px', height: '14px' }} />}
                </div>
                <span style={{
                  fontSize: '8.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  color: active ? '#60a5fa' : done ? '#34d399' : '#5d5b57'
                }} className="hidden md:block">{s.label}</span>
              </div>
            );
          })}
        </div>
        {/* Progress line */}
        <div style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, bottom: 0, left: 0,
              background: 'linear-gradient(90deg, #3b82f6, #10b981)',
              borderRadius: '2px'
            }}
            animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          overflow: 'hidden',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Form Section Label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            {React.createElement(STEPS[step - 1].icon, { style: { width: '15px', height: '15px', color: '#3b82f6' } })}
            <h2 style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{STEPS[step - 1].label}</h2>
          </div>

          <div style={{ padding: '1.5rem', flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* STEP 1: Incident Details */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Incident Docket Title *</label>
                      <input {...register('title', { required: 'Title is required' })}
                        placeholder="e.g. Phishing Attack on Apex Logistics Inc." className="flat-input" />
                      {errors.title && <p style={{ color: '#f87171', fontSize: '10.5px', marginTop: '0.25rem', fontWeight: 550 }}>{errors.title.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                      <div>
                        <label className="form-label">Crime Category Classification *</label>
                        <select {...register('crimeCategory')} className="form-select" style={{ background: '#f3f1ee' }}>
                          {CRIME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Priority Level *</label>
                        <select {...register('priority')} className="form-select" style={{ background: '#f3f1ee' }}>
                          {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p} Priority</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                      <div>
                        <label className="form-label">Incident Date</label>
                        <input {...register('incidentDate')} type="date" className="flat-input" style={{ color: '#111111' }} />
                      </div>
                      <div>
                        <label className="form-label">Incident Location / Jurisdiction</label>
                        <input {...register('location')} placeholder="e.g. Bangalore, Karnataka" className="flat-input" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Docket Status</label>
                      <select {...register('status')} className="form-select" style={{ background: '#f3f1ee' }}>
                        {['New', 'Assigned', 'Under Investigation', 'Evidence Collection', 'Closed', 'Reopened'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    {/* Warning card */}
                    {getValues('priority') === 'Critical' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.625rem',
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginTop: '0.5rem'
                      }}>
                        <AlertTriangle style={{ width: '14px', height: '14px', color: '#f87171', flexShrink: 0, marginTop: '1px' }} />
                        <p style={{ fontSize: '11px', color: '#f87171', fontWeight: 500, lineHeight: 1.5 }}>
                          Critical priority dossiers immediately alert supervisors and are fast-tracked for action.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Victim Information */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Victim Full Name *</label>
                      <input {...register('victimName', { required: 'Victim name is required' })}
                        placeholder="e.g. Ramesh Kumar Sharma" className="flat-input" />
                      {errors.victimName && <p style={{ color: '#f87171', fontSize: '10.5px', marginTop: '0.25rem', fontWeight: 550 }}>{errors.victimName.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input {...register('victimEmail')} type="email" placeholder="victim@email.com" className="flat-input" />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input {...register('victimPhone')} type="tel" placeholder="+91 XXXXX XXXXX" className="flat-input" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Residential Address</label>
                      <textarea {...register('victimAddress')} rows={3} placeholder="Complete physical address..."
                        className="form-textarea" style={{ resize: 'none' }} />
                    </div>
                  </div>
                )}

                {/* STEP 3: Suspect Information */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.15)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}>
                      <AlertTriangle style={{ width: '13px', height: '13px', color: '#fbbf24', flexShrink: 0 }} />
                      <p style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 500 }}>
                        Suspect details are optional and can be updated as the case progresses.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                      <div>
                        <label className="form-label">Suspect Name</label>
                        <input {...register('suspectName')} placeholder="Known or alias name" className="flat-input" />
                      </div>
                      <div>
                        <label className="form-label">Known Handle / Alias</label>
                        <input {...register('suspectAlias')} placeholder="e.g. @ghost_hacker" className="flat-input" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Operational Notes & Behavioral Patterns</label>
                      <textarea {...register('suspectNotes')} rows={4} placeholder="IP addresses, observed online activity, encryption keys used..."
                        className="form-textarea" style={{ resize: 'none' }} />
                    </div>
                  </div>
                )}

                {/* STEP 4: Crime Description */}
                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Detailed Incident Dossier Description *</label>
                      <textarea {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Minimum 50 characters required.' } })}
                        rows={8} placeholder="Provide a comprehensive narrative of the incident, malware vectors, data leaked, or banking paths used..."
                        className="form-textarea" style={{ resize: 'none' }} />
                      {errors.description && <p style={{ color: '#f87171', fontSize: '10.5px', marginTop: '0.25rem', fontWeight: 550 }}>{errors.description.message}</p>}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(59,130,246,0.06)',
                      border: '1px solid rgba(59,130,246,0.15)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}>
                      <span style={{ fontSize: '11px', color: '#60a5fa' }}>💡</span>
                      <p style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 500 }}>
                        Include technical items: transaction hashes, wallet addresses, and router timestamps if available.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 5: Evidence Summary */}
                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Forensic Evidence Summary Checklist</label>
                      <textarea {...register('evidenceSummary')} rows={4}
                        placeholder="List initial digital files collected (e.g. Wireshark PCAPs, system log exports)..."
                        className="form-textarea" style={{ resize: 'none' }} />
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      textAlign: 'center'
                    }}>
                      <HardDrive style={{ width: '32px', height: '32px', color: '#5d5b57', margin: '0 auto 0.5rem' }} />
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#5d5b57' }}>Forensic File Intake Portal</p>
                      <p style={{ fontSize: '11px', color: '#4b4a48', marginTop: '0.2rem' }}>Physical media files can be attached after creating this dossier via the Evidence module.</p>
                      <button type="button" onClick={() => navigate('/evidence')}
                        style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#3b82f6', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        Navigate to Evidence Manager →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: Assignment */}
                {step === 6 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Assign Lead Investigator *</label>
                      <select {...register('assignedInvestigatorId', { required: 'Please assign an investigator' })}
                        className="form-select" style={{ background: '#f3f1ee' }}>
                        <option value="">— Select Officer —</option>
                        {investigators.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name} • Specialty: {inv.specialty} • Active Dossiers: {inv.activeCases}
                          </option>
                        ))}
                      </select>
                      {errors.assignedInvestigatorId && <p style={{ color: '#f87171', fontSize: '10.5px', marginTop: '0.25rem', fontWeight: 550 }}>{errors.assignedInvestigatorId.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Initial Operational Directives</label>
                      <textarea {...register('investigationNotes')} rows={4}
                        placeholder="Operational guidance, team assignments, or critical timelines..."
                        className="form-textarea" style={{ resize: 'none' }} />
                    </div>
                    {/* Summary preview */}
                    <div style={{
                      background: '#f3f1ee',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                        <Check style={{ width: '13px', height: '13px', color: '#10b981' }} /> Case Dossier Preview
                      </p>
                      {[
                        { label: 'Title', value: getValues('title') || 'Not entered' },
                        { label: 'Category', value: getValues('crimeCategory') },
                        { label: 'Priority', value: getValues('priority') },
                        { label: 'Status', value: getValues('status') },
                        { label: 'Victim Target', value: getValues('victimName') || 'Not entered' },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', gap: '0.5rem', fontSize: '11.5px' }}>
                          <span style={{ color: '#4b4a48', fontWeight: 650, width: '100px', flexShrink: 0 }}>{label}:</span>
                          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            className="flat-btn"
            style={{ opacity: step === 1 ? 0.3 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft style={{ width: '14px', height: '14px' }} /> Previous Step
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="flat-btn-primary"
            >
              Next Step <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flat-btn-primary"
              style={{
                background: isSubmitting ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                borderColor: 'rgba(16,185,129,0.3)',
                boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(16,185,129,0.25)'
              }}
            >
              {isSubmitting ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Registering…
                </>
              ) : (
                <><Check style={{ width: '14px', height: '14px' }} /> Register Dossier</>
              )}
            </button>
          )}
        </div>
      </form>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RegisterCase;
