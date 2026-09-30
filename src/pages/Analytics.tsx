import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  HardDrive 
} from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(17,17,17,0.08)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        fontSize: '11.5px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <p style={{ color: '#4b4a48', fontWeight: 700, marginBottom: '0.35rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey || p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color || p.fill, flexShrink: 0 }} />
            <span style={{ color: '#5d5b57' }}>{p.dataKey || p.name}:</span>
            <span style={{ color: '#111111', fontWeight: 700 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Analytics: React.FC = () => {
  const { cases, investigators, evidence } = useDb();

  // State to filter charts
  const [analyticsFilter, setAnalyticsFilter] = useState('all');

  // Colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#ec4899', '#f97316', '#64748b', '#14b8a6'];

  // 1. Calculations: Cases by Month (Area)
  const monthlyData: { [key: string]: { total: number; closed: number } } = {
    'June': { total: 0, closed: 0 },
    'July': { total: 0, closed: 0 },
    'August': { total: 0, closed: 0 }
  };
  cases.forEach(c => {
    const month = c.complaintDate.split('-')[1];
    let name = 'June';
    if (month === '07') name = 'July';
    if (month === '08') name = 'August';
    
    monthlyData[name].total++;
    if (c.status === 'Closed') monthlyData[name].closed++;
  });
  const monthlyChartData = Object.keys(monthlyData).map(key => ({
    name: key,
    'Incidents Logged': monthlyData[key].total,
    'Cases Solved': monthlyData[key].closed
  }));

  // 2. Calculations: Crime Categories (Horizontal Bar)
  const categoryDataMap: { [key: string]: number } = {};
  cases.forEach(c => {
    categoryDataMap[c.crimeCategory] = (categoryDataMap[c.crimeCategory] || 0) + 1;
  });
  const categoryChartData = Object.keys(categoryDataMap).map(key => ({
    category: key,
    Incidents: categoryDataMap[key]
  })).sort((a, b) => b.Incidents - a.Incidents);

  // 3. Calculations: Solved vs Pending (Stacked Column)
  const solvedPendingMap: { [key: string]: { solved: number; pending: number } } = {
    'Phishing': { solved: 0, pending: 0 },
    'Ransomware': { solved: 0, pending: 0 },
    'Cryptocurrency Scam': { solved: 0, pending: 0 },
    'Data Breach': { solved: 0, pending: 0 },
    'Identity Theft': { solved: 0, pending: 0 }
  };
  cases.forEach(c => {
    if (solvedPendingMap[c.crimeCategory]) {
      if (c.status === 'Closed') solvedPendingMap[c.crimeCategory].solved++;
      else solvedPendingMap[c.crimeCategory].pending++;
    }
  });
  const solvedPendingChartData = Object.keys(solvedPendingMap).map(key => ({
    name: key.length > 10 ? `${key.substring(0, 10)}...` : key,
    Solved: solvedPendingMap[key].solved,
    Pending: solvedPendingMap[key].pending
  }));

  // 4. Calculations: Investigator Performance
  const investigatorChartData = investigators.map(inv => {
    const invCases = cases.filter(c => c.assignedInvestigatorId === inv.id);
    const solved = invCases.filter(c => c.status === 'Closed').length;
    return {
      name: inv.name.replace('Det. ', '').replace('Insp. ', '').replace('Inv. ', ''),
      Assigned: invCases.length,
      Solved: solved
    };
  }).slice(0, 8);

  // 5. Calculations: Evidence Uploaded (Line Chart)
  const evidenceUploadedDataMap: { [key: string]: number } = { 'June': 0, 'July': 0, 'August': 0 };
  evidence.forEach(e => {
    const month = e.uploadDate.split('-')[1];
    let name = 'June';
    if (month === '07') name = 'July';
    if (month === '08') name = 'August';
    evidenceUploadedDataMap[name]++;
  });
  const evidenceUploadedChartData = Object.keys(evidenceUploadedDataMap).map(key => ({
    name: key,
    'Evidence Uploaded': evidenceUploadedDataMap[key]
  }));

  // 6. Calculations: Priority Distribution (Donut Pie Chart)
  const priorityMap: { [key: string]: number } = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
  cases.forEach(c => {
    priorityMap[c.priority]++;
  });
  const priorityChartData = Object.keys(priorityMap).map(key => ({
    name: key,
    value: priorityMap[key]
  }));

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Title Panel */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Threat Analytics
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Multi-dimensional Recharts visualization overlays mapping system threats, log registries, and operational metrics.
          </p>
        </div>

        {/* Filter selection */}
        <select
          value={analyticsFilter}
          onChange={(e) => setAnalyticsFilter(e.target.value)}
          className="form-select"
          style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem', width: '220px', borderColor: 'rgba(17,17,17,0.04)' }}
        >
          <option value="all">All Cyber Task Forces</option>
          <option value="financial">Financial Crimes Unit</option>
          <option value="forensic">Digital Forensics Lab</option>
        </select>
      </div>

      {/* Summary Highlight Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1rem' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            width: '36px', height: '36px',
            borderRadius: '9px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><TrendingUp style={{ width: '16px', height: '16px', color: '#3b82f6' }} /></span>
          <div>
            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Peak Month Activity</span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', marginTop: '0.15rem', display: 'block' }}>July (14 cases)</span>
          </div>
        </div>
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            width: '36px', height: '36px',
            borderRadius: '9px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} /></span>
          <div>
            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Case Resolution Rate</span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', marginTop: '0.15rem', display: 'block' }}>
              {((cases.filter(c => c.status === 'Closed').length / cases.length) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            width: '36px', height: '36px',
            borderRadius: '9px',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><Clock style={{ width: '16px', height: '16px', color: '#f59e0b' }} /></span>
          <div>
            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Average Resolution</span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', marginTop: '0.15rem', display: 'block' }}>12.4 Days</span>
          </div>
        </div>
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            width: '36px', height: '36px',
            borderRadius: '9px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><HardDrive style={{ width: '16px', height: '16px', color: '#6366f1' }} /></span>
          <div>
            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Forensic Assets</span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111111', marginTop: '0.15rem', display: 'block' }}>50 Files Ledger</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1.25rem' }}>
        
        {/* 1. Monthly Trends Area Chart */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '1.25rem' }}>Monthly Incident Trend vs Resolution</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Incidents Logged" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="Cases Solved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Horizontal Crime Categories */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '1.25rem' }}>Crime Category Threat Load</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryChartData.slice(0, 6)} margin={{ top: 0, right: 10, left: 25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} allowDecimals={false} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" stroke="#5d5b57" tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 550 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Incidents" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10}>
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Stacked Solved vs Pending */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '1.25rem' }}>Solved vs Pending Incidents</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solvedPendingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Solved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={14} />
                <Bar dataKey="Pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Investigator Performance */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '1.25rem' }}>Officer Assignments vs Resolution</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investigatorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Assigned" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="Solved" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Evidence Upload Line Chart */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', marginBottom: '1.25rem' }}>Monthly Evidence Acquisition</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evidenceUploadedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5d5b57" tick={{ fontSize: 10, fill: '#5d5b57', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Evidence Uploaded" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Donut Priority Distribution */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative'
        }} className="flex-col md:flex-row">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.08), transparent)' }} />
          <div style={{ flex: 1, width: '100%' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>Tactical Priority Load</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }} className="w-full md:w-44 text-xs font-semibold text-slate-400">
            {priorityChartData.map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', color: '#5d5b57' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                <span>{item.name} Priority ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
