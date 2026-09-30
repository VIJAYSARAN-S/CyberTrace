import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { 
  History, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Terminal
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useDb();

  // Search and filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filters logic
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.ipAddress.includes(searchQuery);

    const matchesAction = filterAction ? log.action.includes(filterAction) : true;
    const matchesRole = filterRole ? log.role === filterRole : true;
    const matchesStatus = filterStatus ? log.status === filterStatus : true;

    return matchesSearch && matchesAction && matchesRole && matchesStatus;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return (
          <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '9px', fontWeight: 800 }}>
            <CheckCircle2 style={{ width: '11px', height: '11px' }} />
            Success
          </span>
        );
      case 'Failed':
        return (
          <span className="badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '9px', fontWeight: 800 }}>
            <XCircle style={{ width: '11px', height: '11px' }} />
            Failed
          </span>
        );
      case 'Warning':
        return (
          <span className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '9px', fontWeight: 800 }}>
            <AlertTriangle style={{ width: '11px', height: '11px' }} />
            Warning
          </span>
        );
      default:
        return (
          <span className="badge-slate" style={{ fontSize: '9px', fontWeight: 800 }}>
            Unknown
          </span>
        );
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'badge-red';
      case 'Investigator': return 'badge-blue';
      case 'Forensic Analyst': return 'badge-indigo';
      default: return 'badge-slate';
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
              Security Audit Ledger
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Cryptographic compliance trail logging user authorization credentials, IP tracking, and dossier changes.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600, color: '#5d5b57' }}>
          <Terminal style={{ width: '14px', height: '14px', color: '#4b4a48' }} />
          <span>Ledger Integrity Sealed</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.25rem',
        gap: '0.75rem',
        position: 'relative'
      }}>
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
            placeholder="Search by User, IP address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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

        {/* Action filter */}
        <select
          value={filterAction}
          onChange={(e) => {
            setFilterAction(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
        >
          <option value="">Actions (All)</option>
          <option value="Login">User Login</option>
          <option value="Logout">User Logout</option>
          <option value="Case Creation">Case Creation</option>
          <option value="Case Update">Case Update</option>
          <option value="Evidence Upload">Evidence Upload</option>
          <option value="Report Generation">Report Generation</option>
        </select>

        {/* Role filter */}
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
        >
          <option value="">Duty Roles (All)</option>
          <option value="Admin">Admin</option>
          <option value="Investigator">Investigator</option>
          <option value="Forensic Analyst">Forensic Analyst</option>
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
        >
          <option value="">Alert Statuses (All)</option>
          <option value="Success">Success Only</option>
          <option value="Failed">Failed Alerts</option>
          <option value="Warning">Warnings</option>
        </select>
      </div>

      {/* Logs Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }} />
        
        <div style={{ overflowX: 'auto' }}>
          {currentLogs.length > 0 ? (
            <table className="flat-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>User Credentials</th>
                  <th>Duty Role</th>
                  <th>Action Event</th>
                  <th>IP Address</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id}>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#4b4a48', fontSize: '11px' }}>{log.id}</span></td>
                    <td style={{ color: '#111111', fontWeight: 700 }}>{log.user}</td>
                    <td>
                      <span className={getRoleColor(log.role)} style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        {log.role.toUpperCase()}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#cbd5e1' }}>{log.action}</span></td>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6b7280' }}>{log.ipAddress}</span></td>
                    <td>{getStatusBadge(log.status)}</td>
                    <td style={{ textAlign: 'right', color: '#6b7280', fontSize: '11px' }}>
                      <span style={{ display: 'block' }}>{log.date}</span>
                      <span style={{ display: 'block', fontSize: '9.5px', color: '#5d5b57', marginTop: '0.15rem' }}>{log.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
              <History style={{ width: '36px', height: '36px', color: '#5d5b57', margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#5d5b57' }}>No audit matches located in index ledger.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid rgba(255,255,255,0.04)'
          }} className="no-print">
            <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#4b4a48', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Page {currentPage} of {totalPages} ({filteredLogs.length} entries)
            </span>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flat-btn"
                style={{ padding: '0.4rem 0.75rem', opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flat-btn"
                style={{ padding: '0.4rem 0.75rem', opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AuditLogs;
