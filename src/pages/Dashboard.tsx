import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDb } from '../context/DbContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Folder, PlusCircle, Database, FileText, ArrowRight, Clock, TrendingUp, AlertTriangle, Shield, Activity
} from 'lucide-react';
import { SkeletonDashboard } from '../components/SkeletonLoader';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(17,17,17,0.08)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <p style={{ color: '#4b4a48', fontWeight: 700, marginBottom: '0.35rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ color: '#5d5b57' }}>{p.dataKey}:</span>
            <span style={{ color: '#111111', fontWeight: 700 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const { cases, investigators, evidence, victims, suspects, auditLogs } = useDb();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="py-4"><SkeletonDashboard /></div>;

  const totalCases = cases.length;
  const openCases = cases.filter(c => c.status !== 'Closed').length;
  const closedCases = cases.filter(c => c.status === 'Closed').length;
  const highPriority = cases.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
  const evidenceCount = evidence.length;

  const kpiCards = [
    {
      label: 'Total Cases',
      value: totalCases,
      trend: 'Total intake',
      icon: Folder,
      color: '#3b82f6',
      gradientFrom: 'rgba(59, 130, 246, 0.08)',
      gradientTo: 'transparent',
      borderGlow: 'rgba(59, 130, 246, 0.2)'
    },
    {
      label: 'Active Cases',
      value: openCases,
      trend: 'Currently assigned',
      icon: Activity,
      color: '#6366f1',
      gradientFrom: 'rgba(99, 102, 241, 0.08)',
      gradientTo: 'transparent',
      borderGlow: 'rgba(99, 102, 241, 0.2)'
    },
    {
      label: 'Evidence Items',
      value: evidenceCount,
      trend: 'Files stored securely',
      icon: Shield,
      color: '#06b6d4',
      gradientFrom: 'rgba(6, 182, 212, 0.08)',
      gradientTo: 'transparent',
      borderGlow: 'rgba(6, 182, 212, 0.2)'
    },
    {
      label: 'Critical Cases',
      value: highPriority,
      trend: 'Requires attention',
      icon: AlertTriangle,
      color: '#ef4444',
      gradientFrom: 'rgba(239, 68, 68, 0.08)',
      gradientTo: 'transparent',
      borderGlow: 'rgba(239, 68, 68, 0.2)',
      isCritical: true
    },
  ];

  const renderPriorityBadge = (priority: string) => {
    if (priority === 'Critical') return <span className="badge-priority-critical">CRITICAL</span>;
    if (priority === 'High') return <span className="badge-priority-high">HIGH</span>;
    if (priority === 'Medium') return <span className="badge-priority-medium">MEDIUM</span>;
    return <span className="badge-priority-low">LOW</span>;
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Active') return <span className="badge-status-active">{status}</span>;
    if (status === 'Investigating') return <span className="badge-status-investigating">{status}</span>;
    if (status === 'Pending') return <span className="badge-status-pending">{status}</span>;
    return <span className="badge-status-closed">{status}</span>;
  };

  const chartData = [
    { name: 'Jan', Reported: 12, Closed: 8 },
    { name: 'Feb', Reported: 25, Closed: 15 },
    { name: 'Mar', Reported: 20, Closed: 18 },
    { name: 'Apr', Reported: 48, Closed: 30 },
    { name: 'May', Reported: 32, Closed: 25 },
    { name: 'Jun', Reported: 58, Closed: 40 },
  ];

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.complaintDate).getTime() - new Date(a.complaintDate).getTime())
    .slice(0, 5);

  const recentLogs = [...auditLogs]
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
    .slice(0, 5);

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Dashboard
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Overview of cybercrime investigations, evidence, and case activity.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link to="/cases/new" className="flat-btn-primary" style={{ fontSize: '11.5px' }}>
            <PlusCircle style={{ width: '14px', height: '14px' }} />
            <span>Create Case</span>
          </Link>
          <Link to="/evidence" className="flat-btn" style={{ fontSize: '11.5px' }}>
            <Database style={{ width: '14px', height: '14px' }} />
            <span>Repository</span>
          </Link>
          <Link to="/reports" className="flat-btn" style={{ fontSize: '11.5px' }}>
            <FileText style={{ width: '14px', height: '14px' }} />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1rem' }}>
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                background: `linear-gradient(135deg, ${card.gradientFrom}, #111827)`,
                border: `1px solid ${card.borderGlow}`,
                borderRadius: '14px',
                padding: '1.375rem 1.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 200ms ease',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 36px ${card.isCritical ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.4)'}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* top accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                opacity: 0.8
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <p style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: card.isCritical ? '#ef4444' : '#4b4a48'
                }}>
                  {card.label}
                </p>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: `rgba(${card.isCritical ? '239,68,68' : card.color === '#3b82f6' ? '59,130,246' : card.color === '#6366f1' ? '99,102,241' : '6,182,212'}, 0.12)`,
                  border: `1px solid ${card.borderGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '15px', height: '15px', color: card.color }} />
                </div>
              </div>

              <p style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                lineHeight: 1,
                background: card.isCritical
                  ? 'linear-gradient(135deg, #ef4444, #f87171)'
                  : `linear-gradient(135deg, #111111, #5d5b57)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}>
                {card.value}
              </p>

              <p style={{ fontSize: '10px', fontWeight: 500, color: '#111111' }}>
                {card.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]" style={{ gap: '1.25rem' }}>
        {/* Case Activity Area Chart */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Case Activity</h3>
              </div>
              <p style={{ fontSize: '10px', color: '#5d5b57', marginTop: '0.2rem' }}>Monthly reported vs closed</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '10px', fontWeight: 600, color: '#4b4a48' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px rgba(59,130,246,0.6)', flexShrink: 0 }} />
                Reported
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.6)', flexShrink: 0 }} />
                Closed
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Reported" stroke="#3b82f6" strokeWidth={2} fill="url(#gradReported)" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#3b82f6', stroke: 'rgba(59,130,246,0.3)', strokeWidth: 4 }} />
              <Area type="monotone" dataKey="Closed" stroke="#10b981" strokeWidth={2} fill="url(#gradClosed)" dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981', stroke: 'rgba(16,185,129,0.3)', strokeWidth: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Activity style={{ width: '15px', height: '15px', color: '#6366f1' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Recent Activity</h3>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '5px', top: '8px', bottom: '8px', width: '1px', background: 'rgba(17,17,17,0.03)' }} />

            {recentLogs.map((log, idx) => (
              <div key={log.id} style={{ display: 'flex', gap: '0.875rem', paddingBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '4px',
                  width: '11px',
                  height: '11px',
                  borderRadius: '50%',
                  border: `2px solid ${idx === 0 ? '#3b82f6' : 'rgba(17,17,17,0.08)'}`,
                  background: idx === 0 ? '#3b82f6' : '#ffffff',
                  boxShadow: idx === 0 ? '0 0 10px rgba(17,17,17,0.16)' : 'none',
                  zIndex: 1
                }} />
                <div>
                  <p style={{ fontSize: '11.5px', fontWeight: 500, color: '#5d5b57', lineHeight: 1.4 }}>
                    {log.action}
                  </p>
                  <p style={{ fontSize: '9.5px', color: '#5d5b57', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock style={{ width: '9px', height: '9px' }} />
                    {log.date} {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/audit-logs" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '10.5px',
            fontWeight: 600,
            color: '#4b4a48',
            textDecoration: 'none',
            marginTop: '0.5rem',
            transition: 'color 150ms ease'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
          >
            View All Logs <ArrowRight style={{ width: '12px', height: '12px' }} />
          </Link>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Folder style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Recent Cases</h3>
          </div>
          <Link to="/cases" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '10.5px',
            fontWeight: 600,
            color: '#4b4a48',
            textDecoration: 'none',
            transition: 'color 150ms ease'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b4a48')}
          >
            View All <ArrowRight style={{ width: '12px', height: '12px' }} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="flat-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Crime Type</th>
                <th>Victim</th>
                <th>Investigator</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => {
                const assignedInv = investigators.find(i => i.id === c.assignedInvestigatorId);
                const linkedVic = victims.find(v => v.id === c.victimId);

                return (
                  <tr key={c.id}>
                    <td>
                      <Link
                        to={`/cases/${c.id}`}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          color: '#60a5fa',
                          textDecoration: 'none',
                          fontSize: '12px',
                          transition: 'color 120ms ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#60a5fa')}
                      >
                        {c.id}
                      </Link>
                    </td>
                    <td style={{ color: '#111111', fontWeight: 500 }}>{c.crimeCategory}</td>
                    <td style={{ color: '#6b7280' }}>{linkedVic?.name || 'Unknown'}</td>
                    <td style={{ color: '#6b7280' }}>{assignedInv?.name || 'Unassigned'}</td>
                    <td>{renderPriorityBadge(c.priority)}</td>
                    <td>{renderStatusBadge(c.status)}</td>
                    <td style={{ color: '#5d5b57', fontSize: '11.5px' }}>{c.complaintDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
