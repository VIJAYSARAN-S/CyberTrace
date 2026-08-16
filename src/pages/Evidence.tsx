import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  FileAudio, 
  Video as VideoIcon, 
  Database, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  History, 
  X,
  FileDown
} from 'lucide-react';

interface EvidenceFormInput {
  caseId: string;
  evidenceType: 'Document' | 'Image' | 'Audio' | 'Video' | 'Storage Drive' | 'Network Log' | 'Memory Dump' | 'Other';
  fileName: string;
  description: string;
  size: string;
}

export const Evidence: React.FC = () => {
  const { cases, evidence, addEvidence, deleteEvidence } = useDb();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Selected Evidence detail modal
  const [selectedEvId, setSelectedEvId] = useState<string | null>(null);
  
  // File Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Deletion state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCaseId, setFilterCaseId] = useState(searchParams.get('caseId') || '');

  // Chain of custody timeline selector
  const [timelineCaseId, setTimelineCaseId] = useState<string>(cases[0]?.id || '');

  // Form hooks
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<EvidenceFormInput>();

  const onSubmit = (data: EvidenceFormInput) => {
    if (!data.fileName) {
      showToast('File name is required for registration.', 'error');
      return;
    }

    addEvidence({
      caseId: data.caseId,
      evidenceType: data.evidenceType,
      fileName: data.fileName,
      description: data.description,
      size: data.size || '1.5 MB'
    });

    showToast(`Evidence successfully logged under case ${data.caseId}. SHA-256 generated.`, 'success');
    setShowUploadModal(false);
    reset();
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteEvidence(deleteConfirmId);
      showToast(`Evidence ${deleteConfirmId} permanently purged.`, 'success');
      setDeleteConfirmId(null);
      if (selectedEvId === deleteConfirmId) {
        setSelectedEvId(null);
      }
    }
  };

  const handleDownload = (ev: typeof evidence[0], e: React.MouseEvent) => {
    e.stopPropagation();
    
    const fileContent = `CCMS SECURE FORENSIC RECORD
---------------------------
Evidence ID: ${ev.id}
Case ID: ${ev.caseId}
File Name: ${ev.fileName}
Evidence Type: ${ev.evidenceType}
SHA-256 Hash Integrity: ${ev.sha256Hash}
Uploaded By: ${ev.uploadedBy}
Upload Timestamp: ${ev.uploadDate}
Description: ${ev.description}
Size: ${ev.size}
---------------------------
C-CCMS SECURED EXPORT`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CCMS_${ev.id}_${ev.fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`Forensic manifest CCMS_${ev.id}.txt downloaded successfully.`, 'success');
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileText style={{ width: '16px', height: '16px', color: '#60a5fa' }} />;
      case 'Image': return <ImageIcon style={{ width: '16px', height: '16px', color: '#34d399' }} />;
      case 'Audio': return <FileAudio style={{ width: '16px', height: '16px', color: '#fbbf24' }} />;
      case 'Video': return <VideoIcon style={{ width: '16px', height: '16px', color: '#f87171' }} />;
      case 'Storage Drive': return <Database style={{ width: '16px', height: '16px', color: '#a5b4fc' }} />;
      case 'Network Log': return <Activity style={{ width: '16px', height: '16px', color: '#22d3ee' }} />;
      case 'Memory Dump': return <Cpu style={{ width: '16px', height: '16px', color: '#c084fc' }} />;
      default: return <FileText style={{ width: '16px', height: '16px', color: '#5d5b57' }} />;
    }
  };

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType ? e.evidenceType === filterType : true;
    const matchesCase = filterCaseId ? e.caseId === filterCaseId : true;

    return matchesSearch && matchesType && matchesCase;
  });

  const timelineEvidence = evidence
    .filter(e => e.caseId === timelineCaseId)
    .sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());

  const selectedEv = evidence.find(e => e.id === selectedEvId);

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Evidence Repository
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Audit, register, and verify digital assets, packet captures, and volatile memory dumps.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flat-btn-primary"
          style={{ fontSize: '11.5px' }}
        >
          <Upload style={{ width: '14px', height: '14px' }} />
          <span>Upload File</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }} className="flex-col lg:flex-row">
        
        {/* Main Evidence Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Filters Panel */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            position: 'relative'
          }} className="grid-cols-kpi">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }} />
            
            <div style={{ position: 'relative' }}>
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
                placeholder="Search file name..."
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

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
              style={{
                paddingTop: '0.55rem',
                paddingBottom: '0.55rem',
                fontSize: '12px',
                background: '#f3f1ee',
                borderColor: 'rgba(17,17,17,0.04)'
              }}
            >
              <option value="">Evidence Types (All)</option>
              <option value="Document">Documents (.pdf, .docx)</option>
              <option value="Image">Screenshots / Images</option>
              <option value="Audio">Audio Recordings</option>
              <option value="Video">Video Files (.mp4)</option>
              <option value="Storage Drive">Storage Drive Images (.raw, .dd)</option>
              <option value="Network Log">Network Logs (.pcap, .log)</option>
              <option value="Memory Dump">Memory Dumps (.dmp, .raw)</option>
              <option value="Other">Other Binary Artifacts</option>
            </select>

            <select
              value={filterCaseId}
              onChange={(e) => setFilterCaseId(e.target.value)}
              className="form-select"
              style={{
                paddingTop: '0.55rem',
                paddingBottom: '0.55rem',
                fontSize: '12px',
                background: '#f3f1ee',
                borderColor: 'rgba(17,17,17,0.04)'
              }}
            >
              <option value="">Case ID (All)</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.id}</option>
              ))}
            </select>
          </div>

          {/* Evidence Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="grid-cols-kpi">
            {filteredEvidence.length > 0 ? (
              filteredEvidence.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvId(ev.id)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getEvidenceIcon(ev.evidenceType)}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48' }}>{ev.id}</span>
                    </div>
                    
                    <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ev.fileName}>
                      {ev.fileName}
                    </h4>
                    <p style={{ fontSize: '9.5px', fontFamily: "'JetBrains Mono', monospace", color: '#3b82f6', marginTop: '0.15rem' }}>{ev.caseId}</p>
                    <p style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '0.5rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ev.description}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#5d5b57', fontWeight: 500 }}>
                      <span>Size: {ev.size}</span>
                      <span>{ev.uploadDate}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '9px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#4b4a48',
                        padding: '0.15rem 0.4rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '5px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}>
                        SHA: {ev.sha256Hash}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDownload(ev, e)}
                          style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                          title="Export Manifest"
                        >
                          <Download style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ev.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}
                          title="Purge Asset"
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 2', padding: '4rem 1.5rem', textAlign: 'center', background: '#ffffff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                <Database style={{ width: '36px', height: '36px', color: '#5d5b57', margin: '0 auto 0.75rem' }} />
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#5d5b57' }}>No evidence items logged.</p>
                <p style={{ color: '#4b4a48', fontSize: '11px', marginTop: '0.2rem' }}>Adjust filters or upload a new file.</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Column: Evidence Intake Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
              <History style={{ width: '15px', height: '15px', color: '#6366f1' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Evidence Intake Ledger</h3>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Select Case Target</label>
              <select
                value={timelineCaseId}
                onChange={(e) => setTimelineCaseId(e.target.value)}
                className="form-select"
                style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.id} - {c.title.substring(0, 24)}...</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {timelineEvidence.length > 0 ? (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem' }}>
                  <div style={{ position: 'absolute', left: '3px', top: '6px', bottom: '6px', width: '1px', background: 'rgba(17,17,17,0.03)' }} />
                  {timelineEvidence.map((ev) => (
                    <div key={ev.id} style={{ position: 'relative', fontSize: '12px' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-16px',
                        top: '5px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#6366f1',
                        border: '1px solid #111827',
                        zIndex: 1
                      }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 650, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '140px' }}>{ev.fileName}</span>
                        <span style={{ fontSize: '9px', color: '#5d5b57', fontWeight: 600, flexShrink: 0 }}>{ev.uploadDate}</span>
                      </div>
                      <p style={{ fontSize: '9.5px', color: '#4b4a48', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.15rem' }}>{ev.id} • {ev.evidenceType}</p>
                      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.25rem', lineHeight: 1.4 }}>{ev.description}</p>
                      <span style={{ fontSize: '9px', color: '#5d5b57', display: 'block', marginTop: '0.25rem' }}>Uploaded by: <strong style={{ color: '#4b4a48' }}>{ev.uploadedBy}</strong></span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', color: '#5d5b57', fontSize: '11.5px' }}>
                  No evidence records linked to this dossier.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Evidence Detail Modal */}
      {selectedEv && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setSelectedEvId(null)} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '480px',
            background: '#ffffff',
            border: '1px solid rgba(99,130,255,0.15)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,130,255,0.3), transparent)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48' }}>{selectedEv.id}</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>{selectedEv.fileName}</h3>
              </div>
              <button 
                onClick={() => setSelectedEvId(null)}
                style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedEv.evidenceType === 'Image' ? (
                <div style={{ height: '180px', background: '#f3f1ee', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <ImageIcon style={{ width: '32px', height: '32px', color: '#5d5b57', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#5d5b57' }}>Forensic Decrypted Attachment</p>
                    <p style={{ fontSize: '9.5px', color: '#4b4a48', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.2rem' }}>{selectedEv.fileName}</p>
                  </div>
                </div>
              ) : (
                <div style={{ height: '110px', background: '#f3f1ee', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <FileText style={{ width: '28px', height: '28px', color: '#5d5b57', margin: '0 auto 0.35rem' }} />
                    <p style={{ fontSize: '11px', fontWeight: 650, color: '#5d5b57' }}>Forensic Cryptographic Ledger</p>
                    <p style={{ fontSize: '9.5px', color: '#4b4a48', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.15rem' }}>SHA-256 Integrity Verified</p>
                  </div>
                </div>
              )}

              {/* Metadata details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '12px' }}>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case Docket Link</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#60a5fa', display: 'block', marginTop: '0.2rem' }}>{selectedEv.caseId}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence Classification</span>
                  <span style={{ fontWeight: 600, color: '#cbd5e1', display: 'block', marginTop: '0.2rem' }}>{selectedEv.evidenceType}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged By Officer</span>
                  <span style={{ fontWeight: 600, color: '#cbd5e1', display: 'block', marginTop: '0.2rem' }}>{selectedEv.uploadedBy}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intake Date</span>
                  <span style={{ fontWeight: 600, color: '#cbd5e1', display: 'block', marginTop: '0.2rem' }}>{selectedEv.uploadDate}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SHA-256 Signature Code</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#4b4a48',
                    background: '#f3f1ee',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.03)',
                    display: 'block',
                    marginTop: '0.2rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {selectedEv.sha256Hash}
                  </span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incident Context</span>
                  <p style={{ color: '#cbd5e1', marginTop: '0.2rem', lineHeight: 1.5 }}>{selectedEv.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDeleteConfirmId(selectedEv.id)}
                  className="flat-btn"
                  style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
                >
                  <Trash2 style={{ width: '13px', height: '13px' }} /> Purge Asset
                </button>
                <button
                  onClick={(e) => handleDownload(selectedEv, e)}
                  className="flat-btn-primary"
                >
                  <FileDown style={{ width: '14px', height: '14px' }} /> Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setShowUploadModal(false)} />
          
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
                <ShieldCheck style={{ width: '16px', height: '16px', color: '#60a5fa' }} /> Upload Forensic Asset
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Link Case Docket</label>
                <select
                  {...register('caseId', { required: true })}
                  className="form-select"
                  style={{ background: '#f3f1ee' }}
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.id} - {c.title.substring(0, 24)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Evidence Type Classification</label>
                <select
                  {...register('evidenceType', { required: true })}
                  className="form-select"
                  style={{ background: '#f3f1ee' }}
                >
                  <option value="Document">Document (.pdf, .txt, .docx)</option>
                  <option value="Image">Image (.png, .jpeg, screenshot)</option>
                  <option value="Audio">Audio (.wav, .mp3 recording)</option>
                  <option value="Video">Video (.mp4, cctv tape)</option>
                  <option value="Storage Drive">Storage Drive Clone (.dd, .raw)</option>
                  <option value="Network Log">Network Log (.pcap, firewall log)</option>
                  <option value="Memory Dump">Memory Dump (.dmp, volatile RAM)</option>
                  <option value="Other">Other Binary / Payload</option>
                </select>
              </div>

              <div>
                <label className="form-label">Asset File Name</label>
                <input
                  type="text"
                  placeholder="e.g. system_ram_dump.dmp"
                  {...register('fileName', { required: 'File name is required' })}
                  className="flat-input"
                />
                {errors.fileName && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.fileName.message}</span>}
              </div>

              <div>
                <label className="form-label">Logical Size (e.g., 15.4 MB)</label>
                <input
                  type="text"
                  placeholder="e.g. 15.4 MB"
                  {...register('size', { required: true })}
                  className="flat-input"
                />
              </div>

              <div>
                <label className="form-label">Forensic Summary Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain device source, acquisition tools (FTK, Volatility), and chain notes."
                  {...register('description', { required: 'Description is required' })}
                  className="form-textarea"
                />
                {errors.description && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.description.message}</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flat-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flat-btn-primary"
                >
                  Verify & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmId !== null}
        title="Purge Forensic Asset"
        message={`Are you sure you want to permanently delete evidence file ${deleteConfirmId}? This action removes it from the secure ledger and case registry. It cannot be recovered.`}
        confirmText="Confirm Purge"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        type="danger"
      />
    </div>
  );
};

export default Evidence;
