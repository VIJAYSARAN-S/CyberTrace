import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { Case } from '../data/mockData';
import {
  ArrowLeft, Edit2, Trash2, Printer, FileText, HardDrive,
  User, Shield, Clock, MapPin, Calendar, AlertTriangle,
  CheckCircle2, Activity, Briefcase, Save, X
} from 'lucide-react';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cases, investigators, evidence, auditLogs, victims, suspects, updateCase, deleteCase } = useDb();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const caseItem = cases.find(c => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(caseItem?.notes || '');
  const [editStatus, setEditStatus] = useState<Case['status']>(caseItem?.status || 'New');

  if (!caseItem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1rem', fontFamily: 'Inter, sans-serif' }}>
        <Briefcase style={{ width: '48px', height: '48px', color: '#111111' }} />
        <p style={{ color: '#5d5b57', fontWeight: 700, fontSize: '13px' }}>Case dossier not found.</p>
        <Link to="/cases" style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>← Back to Dossiers</Link>
      </div>
    );
  }

  const investigator = investigators.find(inv => inv.id === caseItem.assignedInvestigatorId);
  const caseEvidence = evidence.filter(e => e.caseId === caseItem.id);
  const caseLogs = auditLogs.filter(l => l.action.includes(caseItem.id))
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
    .slice(0, 8);
  const linkedVictim = victims.find(v => v.id === caseItem.victimId);
  const linkedSuspect = suspects.find(s => s.id === caseItem.suspectId);

  const handleSave = () => {
    updateCase(caseItem.id, { notes: editNotes, status: editStatus });
    setIsEditing(false);
    showToast('Case updated successfully.', 'success');
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete case ${caseItem.id}? This action is irreversible.`)) return;
    deleteCase(caseItem.id);
    showToast(`Case ${caseItem.id} deleted permanently.`, 'info');
    navigate('/cases');
  };

  const renderPriorityBadge = (p: string) => {
    if (p === 'Critical') return <span className="badge-priority-critical">CRITICAL</span>;
    if (p === 'High') return <span className="badge-priority-high">HIGH</span>;
    if (p === 'Medium') return <span className="badge-priority-medium">MEDIUM</span>;
    return <span className="badge-priority-low">LOW</span>;
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Closed') return <span className="badge-status-closed">CLOSED</span>;
    if (status === 'Under Investigation') return <span className="badge-status-investigating">INVESTIGATING</span>;
    if (status === 'Evidence Collection') return <span className="badge-status-active">EVIDENCE COL</span>;
    return <span className="badge-status-pending">{status.toUpperCase()}</span>;
  };

  const timelineItems = [
    { date: caseItem.complaintDate, label: 'Case Registered', desc: 'Registered on Portal', icon: Briefcase, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { date: caseItem.incidentDate, label: 'Incident Occurred', desc: caseItem.location, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    ...(investigator ? [{ date: caseItem.complaintDate, label: 'Investigator Assigned', desc: investigator.name, icon: User, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' }] : []),
    ...(caseEvidence.length > 0 ? [{ date: caseEvidence[0].uploadDate, label: 'First Evidence Uploaded', desc: caseEvidence[0].fileName, icon: HardDrive, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' }] : []),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navigation and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }} className="flex-col sm:flex-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/cases')}
            style={{
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '11px',
              fontWeight: 650,
              color: '#4b4a48',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 120ms ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
          >
            <ArrowLeft style={{ width: '13px', height: '13px' }} /> BACK TO DOSSIERS
          </button>
          <span style={{ color: '#111111' }}>|</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: '#60a5fa',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px'
          }}>
            {caseItem.id}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="flat-btn-primary"
                style={{ fontSize: '11.5px' }}
              >
                <Save style={{ width: '14px', height: '14px' }} /> Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flat-btn"
                style={{ fontSize: '11.5px' }}
              >
                <X style={{ width: '14px', height: '14px' }} /> Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => window.print()} 
                className="flat-btn no-print"
                style={{ fontSize: '11.5px' }}
              >
                <Printer style={{ width: '14px', height: '14px' }} /> Print Dossier
              </button>
              <button 
                onClick={() => setIsEditing(true)} 
                className="flat-btn no-print"
                style={{ fontSize: '11.5px', color: '#60a5fa', borderColor: 'rgba(59,130,246,0.2)' }}
              >
                <Edit2 style={{ width: '13px', height: '13px' }} /> Edit Details
              </button>
              <button 
                onClick={handleDelete} 
                className="flat-btn no-print"
                style={{ fontSize: '11.5px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
              >
                <Trash2 style={{ width: '13px', height: '13px' }} /> Delete Case
              </button>
            </>
          )}
        </div>
      </div>

      {/* Case Header Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }} className="print-card">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }} className="flex-col sm:flex-row">
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.01em', marginBottom: '0.625rem' }}>
              {caseItem.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {renderPriorityBadge(caseItem.priority)}
              {renderStatusBadge(caseItem.status)}
              <span className="badge-cyan" style={{ fontSize: '9px', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(6,182,212,0.2)' }}>
                {caseItem.crimeCategory.toUpperCase()}
              </span>
            </div>
          </div>
          {isEditing && (
            <div style={{ flexShrink: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Update Docket Status</label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as typeof editStatus)}
                className="form-select"
                style={{ background: '#f3f1ee', minWidth: '160px', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '12px' }}
              >
                {['New', 'Assigned', 'Under Investigation', 'Evidence Collection', 'Closed', 'Reopened'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Metadata info row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)' }} className="grid-cols-kpi">
          {[
            { icon: Calendar, label: 'Date Filed', value: new Date(caseItem.complaintDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: AlertTriangle, label: 'Incident Date', value: new Date(caseItem.incidentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: MapPin, label: 'Jurisdiction', value: caseItem.location },
            { icon: User, label: 'Reporting Source', value: 'System Portal' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <m.icon style={{ width: '14px', height: '14px', color: '#4b4a48' }} />
              </div>
              <div>
                <p style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
                <p style={{ fontSize: '11.5px', fontWeight: 650, color: '#cbd5e1', marginTop: '0.15rem' }}>{m.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main details and sidebar info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }} className="flex-col xl:flex-row">
        
        {/* Left Side: Description, Notes & Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Incident Description */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative'
          }} className="print-card">
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: '#3b82f6', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FileText style={{ width: '15px', height: '15px', color: '#3b82f6' }} /> Incident Dossier Overview
            </h3>
            <p style={{ fontSize: '12px', color: '#5d5b57', lineHeight: 1.6, fontWeight: 400 }}>
              {caseItem.crimeDescription}
            </p>
          </div>

          {/* Investigation Notes */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }} className="print-card">
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Edit2 style={{ width: '14px', height: '14px', color: '#6366f1' }} /> Case Operations Log & Notes
            </h3>
            {isEditing ? (
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                rows={6}
                className="form-textarea"
                style={{ resize: 'none' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#5d5b57', lineHeight: 1.6, fontWeight: 400 }}>
                {caseItem.notes || 'No investigation notes recorded in this file.'}
              </p>
            )}
          </div>

          {/* Connected Digital Evidence */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            overflow: 'hidden'
          }} className="print-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HardDrive style={{ width: '15px', height: '15px', color: '#06b6d4' }} /> Associated Evidence Files ({caseEvidence.length})
              </h3>
              <Link to="/evidence" style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >Manage Files →</Link>
            </div>
            {caseEvidence.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {caseEvidence.slice(0, 6).map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <HardDrive style={{ width: '13px', height: '13px', color: '#06b6d4' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '11.5px', fontWeight: 650, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.fileName}</p>
                      <p style={{ fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48', marginTop: '0.15rem' }}>SHA256: {ev.sha256Hash.slice(0, 16)}…</p>
                    </div>
                    <span style={{ fontSize: '10px', color: '#5d5b57', fontWeight: 500, flexShrink: 0 }}>
                      {new Date(ev.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '12px', color: '#5d5b57' }}>
                No digital evidence linked to this case file.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Metadata Tables & Vertical Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Assigned Investigator */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#3b82f6' }} /> Lead Case Officer
            </h3>
            {investigator ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#111111',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getInitials(investigator.name)}
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>{investigator.name}</p>
                  <p style={{ fontSize: '10px', color: '#4b4a48', marginTop: '0.15rem' }}>{investigator.rank} — {investigator.specialty}</p>
                  <p style={{ fontSize: '10px', color: '#5d5b57', marginTop: '0.15rem' }}>{investigator.email}</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '11.5px', color: '#5d5b57', fontWeight: 500 }}>No lead investigator assigned.</p>
            )}
          </div>

          {/* Victim profile */}
          {linkedVictim && (
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <User style={{ width: '14px', height: '14px', color: '#ef4444' }} /> Victim Target
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>{linkedVictim.name}</p>
              <p style={{ fontSize: '10.5px', color: '#4b4a48', marginTop: '0.2rem' }}>{linkedVictim.email}</p>
              <p style={{ fontSize: '10.5px', color: '#5d5b57', marginTop: '0.2rem' }}>{linkedVictim.contact}</p>
              {linkedVictim.address && (
                <p style={{ fontSize: '10px', color: '#5d5b57', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {linkedVictim.address}
                </p>
              )}
            </div>
          )}

          {/* Suspect Profile */}
          {linkedSuspect && (
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle style={{ width: '14px', height: '14px', color: '#f59e0b' }} /> Prime Suspect
              </h3>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>{linkedSuspect.name}</p>
              <p style={{ fontSize: '10.5px', color: '#4b4a48', marginTop: '0.2rem' }}>Alias: {linkedSuspect.knownAlias}</p>
              <span className="badge-amber" style={{
                fontSize: '8.5px',
                fontWeight: 800,
                padding: '0.15rem 0.4rem',
                borderRadius: '5px',
                marginTop: '0.5rem',
                display: 'inline-block'
              }}>
                {linkedSuspect.investigationStatus.toUpperCase()}
              </span>
            </div>
          )}

          {/* Vertical Case Timeline */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock style={{ width: '14px', height: '14px', color: '#6366f1' }} /> Case Timeline
            </h3>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'absolute', left: '13px', top: '8px', bottom: '8px', width: '1px', background: 'rgba(17,17,17,0.03)' }} />
              {timelineItems.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: t.bg,
                    border: `1px solid rgba(${t.color === '#ef4444' ? '239,68,68' : t.color === '#3b82f6' ? '59,130,246' : t.color === '#6366f1' ? '99,102,241' : '6,182,212'}, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    flexShrink: 0
                  }}>
                    <t.icon style={{ width: '12px', height: '12px', color: t.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 650, color: '#cbd5e1' }}>{t.label}</p>
                    <p style={{ fontSize: '9.5px', color: '#4b4a48', marginTop: '0.15rem' }}>{t.desc}</p>
                    <p style={{ fontSize: '9px', color: '#5d5b57', marginTop: '0.15rem' }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Activity style={{ width: '14px', height: '14px', color: '#10b981' }} /> Incident Activity Logs
            </h3>
            {caseLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {caseLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(17,17,17,0.08)', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10.5px', fontWeight: 550, color: '#5d5b57', lineHeight: 1.3, wordBreak: 'break-word' }}>{log.action}</p>
                      <p style={{ fontSize: '8.5px', color: '#5d5b57', marginTop: '0.15rem' }}>{log.date} {log.time}</p>
                    </div>
                    <span style={{
                      fontSize: '8px',
                      fontWeight: 800,
                      padding: '0.1rem 0.3rem',
                      borderRadius: '4px',
                      background: log.status === 'Success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: log.status === 'Success' ? '#34d399' : '#f87171',
                      border: `1px solid ${log.status === 'Success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                      flexShrink: 0
                    }}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '11px', color: '#5d5b57', fontWeight: 500 }}>No activity logged for this dossier.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
