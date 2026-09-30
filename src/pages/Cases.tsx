import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen,
  X,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';

interface CaseFormInput {
  title: string;
  complaintDate: string;
  incidentDate: string;
  crimeCategory: 'Phishing' | 'Identity Theft' | 'Ransomware' | 'Data Breach' | 'Online Banking Fraud' | 'Social Media Fraud' | 'Malware Attack' | 'Cyber Stalking' | 'Email Spoofing' | 'Cryptocurrency Scam';
  crimeDescription: string;
  victimId: string;
  suspectId: string;
  assignedInvestigatorId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Assigned' | 'Under Investigation' | 'Evidence Collection' | 'Closed' | 'Reopened';
  location: string;
  notes: string;
}

export const Cases: React.FC = () => {
  const { 
    cases, 
    investigators, 
    victims, 
    suspects, 
    updateCase, 
    deleteCase 
  } = useDb();
  
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modals & Panels State
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  
  // Deletion Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterInvestigator, setFilterInvestigator] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // React Hook Form for CRUD
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<CaseFormInput>();

  // Check URL params for direct action triggers
  useEffect(() => {
    const action = searchParams.get('action');
    const directId = searchParams.get('id');

    if (action === 'new') {
      navigate('/cases/new');
    }
    if (directId) {
      navigate(`/cases/${directId}`);
    }
  }, [searchParams, setSearchParams, navigate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterPriority, filterStatus, filterInvestigator]);

  // Filters logic
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory ? c.crimeCategory === filterCategory : true;
    const matchesPriority = filterPriority ? c.priority === filterPriority : true;
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesInvestigator = filterInvestigator ? c.assignedInvestigatorId === filterInvestigator : true;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesInvestigator;
  });

  // Sort logic
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.complaintDate).getTime() - new Date(a.complaintDate).getTime();
    if (sortBy === 'oldest') return new Date(a.complaintDate).getTime() - new Date(b.complaintDate).getTime();
    if (sortBy === 'id-asc') return a.id.localeCompare(b.id);
    if (sortBy === 'id-desc') return b.id.localeCompare(a.id);
    return 0;
  });

  // Pagination slice
  const totalPages = Math.ceil(sortedCases.length / itemsPerPage) || 1;
  const currentCases = sortedCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Form Submit (Edit Case)
  const onEditSubmit = (data: CaseFormInput) => {
    if (editingCaseId) {
      updateCase(editingCaseId, data);
      showToast(`Case ${editingCaseId} details updated successfully.`, 'success');
      setEditingCaseId(null);
      reset();
    }
  };

  // Trigger Edit Form Pre-fill
  const handleStartEdit = (c: typeof cases[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCaseId(c.id);
    reset();
    
    // Set form fields
    setValue('title', c.title);
    setValue('complaintDate', c.complaintDate);
    setValue('incidentDate', c.incidentDate);
    setValue('crimeCategory', c.crimeCategory);
    setValue('crimeDescription', c.crimeDescription);
    setValue('victimId', c.victimId);
    setValue('suspectId', c.suspectId);
    setValue('assignedInvestigatorId', c.assignedInvestigatorId);
    setValue('priority', c.priority);
    setValue('status', c.status);
    setValue('location', c.location);
    setValue('notes', c.notes);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteCase(deleteConfirmId);
      showToast(`Case ${deleteConfirmId} permanently purged.`, 'success');
      setDeleteConfirmId(null);
    }
  };

  const renderPriorityBadge = (priority: string) => {
    if (priority === 'Critical') return <span className="badge-priority-critical">CRITICAL</span>;
    if (priority === 'High') return <span className="badge-priority-high">HIGH</span>;
    if (priority === 'Medium') return <span className="badge-priority-medium">MEDIUM</span>;
    return <span className="badge-priority-low">LOW</span>;
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Closed') return <span className="badge-status-closed">CLOSED</span>;
    if (status === 'Under Investigation') return <span className="badge-status-investigating">INVESTIGATING</span>;
    if (status === 'Evidence Collection') return <span className="badge-status-active">EVIDENCE COL</span>;
    return <span className="badge-status-pending">{status.toUpperCase()}</span>;
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Dossier Management
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Manage and monitor registered cybercrime investigations.
          </p>
        </div>
        <button
          onClick={() => navigate('/cases/new')}
          className="flat-btn-primary"
          style={{ fontSize: '11.5px' }}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
          <span>Create Case</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }} />
        
        {/* Search & Sort */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem' }} className="flex-col md:flex-row">
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="Search cases by ID, title, or location..."
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                paddingTop: '0.55rem',
                paddingBottom: '0.55rem',
                fontSize: '12px',
                minWidth: '150px',
                background: '#f3f1ee',
                borderColor: 'rgba(17,17,17,0.04)'
              }}
            >
              <option value="newest">Newest Intake</option>
              <option value="oldest">Oldest Intake</option>
              <option value="id-asc">ID Ascending</option>
              <option value="id-desc">ID Descending</option>
            </select>
          </div>
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select"
            style={{
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              fontSize: '12px',
              background: '#f3f1ee',
              borderColor: 'rgba(17,17,17,0.04)'
            }}
          >
            <option value="">Crime Type (All)</option>
            <option value="Phishing">Phishing</option>
            <option value="Identity Theft">Identity Theft</option>
            <option value="Ransomware">Ransomware</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Online Banking Fraud">Online Banking Fraud</option>
            <option value="Social Media Fraud">Social Media Fraud</option>
            <option value="Malware Attack">Malware Attack</option>
            <option value="Cyber Stalking">Cyber Stalking</option>
            <option value="Email Spoofing">Email Spoofing</option>
            <option value="Cryptocurrency Scam">Cryptocurrency Scam</option>
          </select>

          {/* Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="form-select"
            style={{
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              fontSize: '12px',
              background: '#f3f1ee',
              borderColor: 'rgba(17,17,17,0.04)'
            }}
          >
            <option value="">Priority (All)</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              fontSize: '12px',
              background: '#f3f1ee',
              borderColor: 'rgba(17,17,17,0.04)'
            }}
          >
            <option value="">Status (All)</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Evidence Collection">Evidence Collection</option>
            <option value="Closed">Closed</option>
            <option value="Reopened">Reopened</option>
          </select>

          {/* Investigator */}
          <select
            value={filterInvestigator}
            onChange={(e) => setFilterInvestigator(e.target.value)}
            className="form-select"
            style={{
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              fontSize: '12px',
              background: '#f3f1ee',
              borderColor: 'rgba(17,17,17,0.04)'
            }}
          >
            <option value="">Investigator (All)</option>
            {investigators.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Table Panel */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }} />
        
        <div style={{ overflowX: 'auto' }}>
          {currentCases.length > 0 ? (
            <table className="flat-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Crime Type</th>
                  <th>Victim / Target</th>
                  <th>Investigator</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'center' }} className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCases.map((c) => {
                  const investigator = investigators.find(i => i.id === c.assignedInvestigatorId);
                  const linkedVic = victims.find(v => v.id === c.victimId);

                  return (
                    <tr 
                      key={c.id} 
                      onClick={() => navigate(`/cases/${c.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            color: '#60a5fa',
                            fontSize: '12px',
                            transition: 'color 120ms ease'
                          }}
                        >
                          {c.id}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1', fontWeight: 500 }}>{c.title}</td>
                      <td style={{ color: '#6b7280' }}>{linkedVic?.name || 'Nexus Logistics Corp.'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            height: '22px',
                            width: '22px',
                            borderRadius: '6px',
                            background: 'rgba(17,17,17,0.08)',
                            border: '1px solid rgba(99,130,255,0.15)',
                            color: '#a5b4fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '9.5px',
                            flexShrink: 0
                          }}>
                            {getInitials(investigator?.name || 'UA')}
                          </span>
                          <span style={{ color: '#6b7280', fontWeight: 500 }}>
                            {investigator?.name || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td>{renderPriorityBadge(c.priority)}</td>
                      <td>{renderStatusBadge(c.status)}</td>
                      <td style={{ color: '#5d5b57', fontSize: '11.5px' }}>{formatDate(c.complaintDate)}</td>
                      <td style={{ textAlign: 'center' }} className="no-print" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                          <button
                            onClick={() => navigate(`/cases/${c.id}`)}
                            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                            title="View Case"
                          >
                            <Eye style={{ width: '15px', height: '15px' }} />
                          </button>
                          <button
                            onClick={(e) => handleStartEdit(c, e)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#3b82f6')}
                            title="Edit Case"
                          >
                            <Edit2 style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(c.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}
                            title="Delete Case"
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
              <FolderOpen style={{ width: '36px', height: '36px', color: '#5d5b57', margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#5d5b57' }}>No cases match filters.</p>
              <p style={{ color: '#4b4a48', fontSize: '11px', marginTop: '0.2rem' }}>Try updating your filters or search query.</p>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            userSelect: 'none'
          }}>
            <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#4b4a48', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flat-btn"
                style={{ padding: '0.4rem 0.6rem', minWidth: 0, opacity: currentPage === 1 ? 0.3 : 1 }}
              >
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className="flat-btn"
                  style={{
                    padding: '0.4rem 0.75rem',
                    minWidth: 0,
                    background: currentPage === i + 1 ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.15))' : 'rgba(255,255,255,0.03)',
                    borderColor: currentPage === i + 1 ? 'rgba(99, 130, 255, 0.2)' : 'rgba(17,17,17,0.04)',
                    color: currentPage === i + 1 ? '#60a5fa' : '#5d5b57',
                    fontWeight: currentPage === i + 1 ? 700 : 500
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flat-btn"
                style={{ padding: '0.4rem 0.6rem', minWidth: 0, opacity: currentPage === totalPages ? 0.3 : 1 }}
              >
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Case Modal */}
      {editingCaseId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setEditingCaseId(null)} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            background: '#ffffff',
            border: '1px solid rgba(99,130,255,0.15)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            maxHeight: '90vh',
            overflowY: 'auto',
            fontFamily: 'Inter, sans-serif'
          }}>
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,130,255,0.3), transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Modify Case Record — {editingCaseId}
              </h3>
              <button 
                onClick={() => setEditingCaseId(null)}
                style={{ background: 'none', border: 'none', color: '#4b4a48', cursor: 'pointer', padding: '0.25rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#cbd5e1')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                
                {/* Title */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Case Title</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Case title is required' })}
                    className="flat-input"
                  />
                  {errors.title && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.title.message}</span>}
                </div>

                {/* Dates */}
                <div>
                  <label className="form-label">Complaint Intake Date</label>
                  <input
                    type="date"
                    {...register('complaintDate', { required: true })}
                    className="flat-input"
                    style={{ color: '#cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">Estimated Incident Date</label>
                  <input
                    type="date"
                    {...register('incidentDate', { required: true })}
                    className="flat-input"
                    style={{ color: '#cbd5e1' }}
                  />
                </div>

                {/* Category & Location */}
                <div>
                  <label className="form-label">Crime Category</label>
                  <select
                    {...register('crimeCategory', { required: true })}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    <option value="Phishing">Phishing</option>
                    <option value="Identity Theft">Identity Theft</option>
                    <option value="Ransomware">Ransomware</option>
                    <option value="Data Breach">Data Breach</option>
                    <option value="Online Banking Fraud">Online Banking Fraud</option>
                    <option value="Social Media Fraud">Social Media Fraud</option>
                    <option value="Malware Attack">Malware Attack</option>
                    <option value="Cyber Stalking">Cyber Stalking</option>
                    <option value="Email Spoofing">Email Spoofing</option>
                    <option value="Cryptocurrency Scam">Cryptocurrency Scam</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="flat-input"
                  />
                  {errors.location && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.location.message}</span>}
                </div>

                {/* Victims & Suspects selectors */}
                <div>
                  <label className="form-label">Victim Profile Link</label>
                  <select
                    {...register('victimId', { required: true })}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    {victims.map(vic => (
                      <option key={vic.id} value={vic.id}>{vic.id} - {vic.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Primary Suspect Link</label>
                  <select
                    {...register('suspectId', { required: true })}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    {suspects.map(sus => (
                      <option key={sus.id} value={sus.id}>{sus.id} - {sus.name} ({sus.knownAlias})</option>
                    ))}
                  </select>
                </div>

                {/* Investigator & Priority */}
                <div>
                  <label className="form-label">Assign Lead Investigator</label>
                  <select
                    {...register('assignedInvestigatorId', { required: true })}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    {investigators.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.name} ({inv.rank})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Priority Level</label>
                  <select
                    {...register('priority', { required: true })}
                    className="form-select"
                    style={{ background: '#f3f1ee' }}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Docket Status</label>
                  <select
                    {...register('status', { required: true })}
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

                {/* Description & Notes */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Incident Description Overview</label>
                  <textarea
                    rows={3}
                    {...register('crimeDescription', { required: 'Description is required' })}
                    className="form-textarea"
                  />
                  {errors.crimeDescription && <span style={{ color: '#f87171', fontSize: '10px', display: 'block', marginTop: '0.25rem' }}>{errors.crimeDescription.message}</span>}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Operational Forensics Notes</label>
                  <textarea
                    rows={2}
                    {...register('notes')}
                    className="form-textarea"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  type="button"
                  onClick={() => setEditingCaseId(null)}
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

      {/* Confirmation Dialog for Case Delete */}
      <ConfirmationDialog
        isOpen={deleteConfirmId !== null}
        title="Purge Case Record"
        message={`Are you absolutely sure you want to permanently delete case ${deleteConfirmId}? This action will permanently remove the incident file, purge the linked digital evidence files from the system, and cannot be undone.`}
        confirmText="Confirm Purge"
        cancelText="Keep Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        type="danger"
      />
    </div>
  );
};

export default Cases;
