import React, { useState, useEffect } from 'react';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Printer, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'case-summary' | 'investigator-perf' | 'crime-category';

export const Reports: React.FC = () => {
  const { cases, investigators, evidence, logAction } = useDb();
  const { showToast } = useToast();
  
  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-08-31');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledReport, setCompiledReport] = useState<any>(null);

  // Compile reports logic
  const handleCompile = () => {
    setIsCompiling(true);
    
    // Simulate compilation latency
    setTimeout(() => {
      const filteredCases = cases.filter(c => {
        const cdate = new Date(c.complaintDate);
        return cdate >= new Date(dateFrom) && cdate <= new Date(dateTo);
      });

      let summary: any = {};

      if (reportType === 'daily' || reportType === 'weekly' || reportType === 'monthly') {
        const open = filteredCases.filter(c => c.status !== 'Closed').length;
        const closed = filteredCases.filter(c => c.status === 'Closed').length;
        const newIntake = filteredCases.filter(c => c.status === 'New').length;
        const criticalCount = filteredCases.filter(c => c.priority === 'Critical').length;
        const evidenceAdded = evidence.filter(e => {
          const edate = new Date(e.uploadDate);
          return edate >= new Date(dateFrom) && edate <= new Date(dateTo);
        }).length;

        summary = {
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Incident Intake Summary`,
          period: `${dateFrom} to ${dateTo}`,
          metrics: [
            { label: 'Incident Reports Intake', value: filteredCases.length },
            { label: 'Newly Registered (Unassigned)', value: newIntake },
            { label: 'Investigations Completed', value: closed },
            { label: 'Active Probes (Pending)', value: open },
            { label: 'Critical Priority Threats', value: criticalCount },
            { label: 'Digital Assets Seized', value: evidenceAdded }
          ],
          casesList: filteredCases.map(c => ({
            id: c.id,
            title: c.title,
            category: c.crimeCategory,
            priority: c.priority,
            status: c.status,
            date: c.complaintDate
          })).slice(0, 15) // Limit preview to 15 cases
        };
      } 
      else if (reportType === 'case-summary') {
        const categories: { [key: string]: number } = {};
        filteredCases.forEach(c => {
          categories[c.crimeCategory] = (categories[c.crimeCategory] || 0) + 1;
        });

        summary = {
          title: 'Case Category Threat Assessment Report',
          period: `${dateFrom} to ${dateTo}`,
          categoriesList: Object.keys(categories).map(cat => ({
            category: cat,
            count: categories[cat],
            percentage: ((categories[cat] / (filteredCases.length || 1)) * 100).toFixed(1)
          })).sort((a, b) => b.count - a.count)
        };
      }
      else if (reportType === 'investigator-perf') {
        const perfData = investigators.map(inv => {
          const assignedCases = cases.filter(c => c.assignedInvestigatorId === inv.id);
          const solved = assignedCases.filter(c => c.status === 'Closed').length;
          const open = assignedCases.filter(c => c.status !== 'Closed').length;
          const totalProgress = assignedCases.reduce((sum, c) => sum + c.progress, 0);
          const avgProgress = assignedCases.length > 0 ? (totalProgress / assignedCases.length).toFixed(0) : '0';

          return {
            id: inv.id,
            name: inv.name,
            rank: inv.rank,
            specialty: inv.specialty,
            assigned: assignedCases.length,
            solved,
            open,
            avgProgress: `${avgProgress}%`
          };
        }).sort((a, b) => b.solved - a.solved);

        summary = {
          title: 'Unit Investigator Performance & Capacity Audit',
          period: `${dateFrom} to ${dateTo}`,
          perfList: perfData
        };
      }
      else if (reportType === 'crime-category') {
        const catMap: { [key: string]: { total: number; closed: number; open: number } } = {};
        cases.forEach(c => {
          if (!catMap[c.crimeCategory]) {
            catMap[c.crimeCategory] = { total: 0, closed: 0, open: 0 };
          }
          catMap[c.crimeCategory].total++;
          if (c.status === 'Closed') catMap[c.crimeCategory].closed++;
          else catMap[c.crimeCategory].open++;
        });

        summary = {
          title: 'Cybercrime Distribution & Resolution Analysis',
          period: 'All Time Historical Summary',
          catList: Object.keys(catMap).map(key => ({
            name: key,
            ...catMap[key],
            resolutionRate: ((catMap[key].closed / catMap[key].total) * 100).toFixed(0) + '%'
          })).sort((a, b) => b.total - a.total)
        };
      }

      setCompiledReport(summary);
      setIsCompiling(false);
      logAction(`Report generated: ${reportType}`, 'Success');
      showToast('Incident audit ledger compiled successfully.', 'success');
    }, 600);
  };

  useEffect(() => {
    handleCompile();
  }, [reportType]);

  const handleExportCSV = () => {
    if (!compiledReport) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `C-CCMS INCIDENT REPORT,${compiledReport.title}\n`;
    csvContent += `Report Period,${compiledReport.period}\n`;
    csvContent += `Generated On,${new Date().toISOString().replace('T', ' ').substring(0, 19)}\n\n`;

    if (compiledReport.metrics) {
      csvContent += "Operational Metric,Value\n";
      compiledReport.metrics.forEach((m: any) => {
        csvContent += `"${m.label}",${m.value}\n`;
      });
      csvContent += "\n";
    }

    if (compiledReport.casesList) {
      csvContent += "Case ID,Title,Category,Priority,Status,Date\n";
      compiledReport.casesList.forEach((c: any) => {
        csvContent += `${c.id},"${c.title}",${c.category},${c.priority},${c.status},${c.date}\n`;
      });
    }

    if (compiledReport.categoriesList) {
      csvContent += "Category,Case Count,Percentage\n";
      compiledReport.categoriesList.forEach((c: any) => {
        csvContent += `"${c.category}",${c.count},${c.percentage}%\n`;
      });
    }

    if (compiledReport.perfList) {
      csvContent += "Investigator ID,Name,Rank,Specialty,Assigned,Solved,Open,Avg Progress\n";
      compiledReport.perfList.forEach((p: any) => {
        csvContent += `${p.id},"${p.name}",${p.rank},"${p.specialty}",${p.assigned},${p.solved},${p.open},${p.avgProgress}\n`;
      });
    }

    if (compiledReport.catList) {
      csvContent += "Crime Category,Total Cases,Open Probe,Closed,Resolution Rate\n";
      compiledReport.catList.forEach((cl: any) => {
        csvContent += `"${cl.name}",${cl.total},${cl.open},${cl.closed},${cl.resolutionRate}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ccms_report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logAction(`Report exported to CSV: ${reportType}`, 'Success');
    showToast('Report CSV successfully exported to disk.', 'success');
  };

  const handlePrint = () => {
    window.print();
    logAction(`Report Printed: ${reportType}`, 'Success');
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Title & Export Panel */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="no-print">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Intelligence Reports
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Select parameters to build detailed incident summaries and unit performance evaluations.
          </p>
        </div>
        
        {/* Export Deck */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleExportCSV}
            disabled={!compiledReport}
            className="flat-btn"
            style={{ fontSize: '11.5px', opacity: !compiledReport ? 0.4 : 1 }}
          >
            <FileSpreadsheet style={{ width: '14px', height: '14px', color: '#10b981' }} />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={!compiledReport}
            className="flat-btn-primary"
            style={{ fontSize: '11.5px', opacity: !compiledReport ? 0.4 : 1 }}
          >
            <Printer style={{ width: '14px', height: '14px' }} />
            Print Report
          </button>
        </div>
      </div>

      {/* Control panel & Report Preview canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem' }} className="flex-col lg:flex-row">
        
        {/* Configuration Column */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: 'fit-content'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
            <Activity style={{ width: '15px', height: '15px', color: '#3b82f6' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Parameters</h3>
          </div>

          {/* Type Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label className="form-label" style={{ marginBottom: '0.15rem' }}>Report Format</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { type: 'weekly', label: 'Weekly Summary' },
                { type: 'daily', label: 'Daily Log' },
                { type: 'monthly', label: 'Monthly Assessment' },
                { type: 'case-summary', label: 'Threat Categories' },
                { type: 'investigator-perf', label: 'Investigator Performance' },
                { type: 'crime-category', label: 'Historical Resolution' }
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setReportType(opt.type as ReportType)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    textAlign: 'left',
                    background: reportType === opt.type 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.15))' 
                      : 'rgba(255,255,255,0.02)',
                    color: reportType === opt.type ? '#60a5fa' : '#6b7280',
                    border: reportType === opt.type ? '1px solid rgba(99, 130, 255, 0.2)' : '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  {opt.label}
                  <ChevronRight style={{ width: '13px', height: '13px' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
            <div>
              <label className="form-label">Date Boundary From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flat-input"
                style={{ fontSize: '11.5px', color: '#cbd5e1' }}
              />
            </div>
            <div>
              <label className="form-label">Date Boundary To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flat-input"
                style={{ fontSize: '11.5px', color: '#cbd5e1' }}
              />
            </div>
          </div>

          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flat-btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', fontSize: '11.5px' }}
          >
            {isCompiling ? 'Compiling Ledgers...' : 'Compile Audit Ledgers'}
          </button>
        </div>

        {/* Report Output Preview canvas */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '520px'
        }}>
          
          {isCompiling ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
              <div style={{ textAlign: 'center' }}>
                <span className="spinner" style={{
                  animation: 'spin 1s linear infinite',
                  width: '28px',
                  height: '28px',
                  border: '3px solid #3b82f6',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }} />
                <p style={{ fontSize: '12px', fontWeight: 650, color: '#5d5b57' }}>Compiling official intelligence report...</p>
              </div>
            </div>
          ) : compiledReport ? (
            <div style={{ padding: '2rem' }} className="print-card">
              {/* Document Header (Letterhead) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #5d5b57', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.05em' }}>DEPARTMENT OF CYBER CRIMES</h2>
                  <p style={{ color: '#4b4a48', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>Federal Forensic Analysis Division</p>
                  <p style={{ fontSize: '9.5px', color: '#5d5b57', fontWeight: 500, marginTop: '0.15rem' }}>Document Ref: C-CCMS-SEC-9988</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    display: 'inline-block',
                    letterSpacing: '0.05em'
                  }}>
                    CONFIDENTIAL
                  </div>
                  <p style={{ fontSize: '9px', color: '#4b4a48', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.4rem' }}>Generated: {new Date().toISOString().substring(0, 10)}</p>
                </div>
              </div>

              {/* Title & Period */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111111' }}>{compiledReport.title}</h3>
                <p style={{ fontSize: '11px', color: '#4b4a48', fontWeight: 600, marginTop: '0.25rem' }}>Assessment Period: {compiledReport.period}</p>
              </div>

              {/* Report specific renderings */}
              {/* 1. Daily/Weekly/Monthly metrics */}
              {compiledReport.metrics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1.25rem' }} className="grid-cols-kpi">
                    {compiledReport.metrics.map((m: any) => (
                      <div key={m.label} style={{ padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)', borderRadius: '10px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>{m.label}</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111111', display: 'block', marginTop: '0.25rem' }}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Incident List preview */}
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      <TrendingUp style={{ width: '13px', height: '13px', color: '#3b82f6' }} />
                      Incident Registry Excerpts
                    </h4>
                    <table className="flat-table" style={{ fontSize: '11.5px' }}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Docket Title</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compiledReport.casesList.map((c: any) => (
                          <tr key={c.id}>
                            <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#60a5fa' }}>{c.id}</td>
                            <td style={{ color: '#cbd5e1', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                            <td style={{ color: '#6b7280' }}>{c.category}</td>
                            <td style={{ color: c.priority === 'Critical' || c.priority === 'High' ? '#f87171' : '#cbd5e1', fontWeight: 700 }}>{c.priority.toUpperCase()}</td>
                            <td style={{ color: '#6b7280' }}>{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. Threat Categories */}
              {compiledReport.categoriesList && (
                <div>
                  <table className="flat-table" style={{ fontSize: '11.5px' }}>
                    <thead>
                      <tr>
                        <th>Cyber Threat Category</th>
                        <th style={{ textAlign: 'center' }}>Incident Count</th>
                        <th style={{ textAlign: 'right' }}>Operational Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compiledReport.categoriesList.map((c: any) => (
                        <tr key={c.category}>
                          <td style={{ color: '#cbd5e1', fontWeight: 600 }}>{c.category}</td>
                          <td style={{ textAlign: 'center', color: '#cbd5e1' }}>{c.count}</td>
                          <td style={{ textAlign: 'right', color: '#60a5fa', fontWeight: 700 }}>{c.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. Investigator Performance */}
              {compiledReport.perfList && (
                <div>
                  <table className="flat-table" style={{ fontSize: '11.5px' }}>
                    <thead>
                      <tr>
                        <th>Officer Name & Rank</th>
                        <th>Duty Specialty</th>
                        <th style={{ textAlign: 'center' }}>Assigned</th>
                        <th style={{ textAlign: 'center' }}>Closed</th>
                        <th style={{ textAlign: 'center' }}>Open</th>
                        <th style={{ textAlign: 'right' }}>Avg Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compiledReport.perfList.map((p: any) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{p.name}</div>
                            <div style={{ fontSize: '9.5px', color: '#4b4a48', marginTop: '0.15rem' }}>{p.rank}</div>
                          </td>
                          <td style={{ color: '#6b7280' }}>{p.specialty}</td>
                          <td style={{ textAlign: 'center', color: '#cbd5e1', fontWeight: 700 }}>{p.assigned}</td>
                          <td style={{ textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{p.solved}</td>
                          <td style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 700 }}>{p.open}</td>
                          <td style={{ textAlign: 'right', color: '#a5b4fc', fontWeight: 700 }}>{p.avgProgress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 4. Historical resolution */}
              {compiledReport.catList && (
                <div>
                  <table className="flat-table" style={{ fontSize: '11.5px' }}>
                    <thead>
                      <tr>
                        <th>Incident Classification</th>
                        <th style={{ textAlign: 'center' }}>Total Registered</th>
                        <th style={{ textAlign: 'center' }}>Active Probe</th>
                        <th style={{ textAlign: 'center' }}>Resolved Docket</th>
                        <th style={{ textAlign: 'right' }}>Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compiledReport.catList.map((cl: any) => (
                        <tr key={cl.name}>
                          <td style={{ color: '#cbd5e1', fontWeight: 700 }}>{cl.name}</td>
                          <td style={{ textAlign: 'center', color: '#cbd5e1' }}>{cl.total}</td>
                          <td style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 750 }}>{cl.open}</td>
                          <td style={{ textAlign: 'center', color: '#34d399', fontWeight: 750 }}>{cl.closed}</td>
                          <td style={{ textAlign: 'right', color: '#60a5fa', fontWeight: 700 }}>{cl.resolutionRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Document Signoff Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem', borderTop: '1px solid #5d5b57', paddingTop: '1.25rem', marginTop: '3rem', fontSize: '9px', color: '#4b4a48', fontWeight: 700, letterSpacing: '0.05em' }}>
                <div>
                  <p>INTEGRITY SEAL VERIFICATION: SECURE</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#5d5b57', marginTop: '0.15rem' }}>BLOCK_LOCK_HASH: 99x0012bcfe89</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p>COMMAND DIRECT APPROVAL</p>
                  <div style={{ width: '130px', borderBottom: '1px solid #5d5b57', marginLeft: 'auto', marginTop: '1.25rem' }} />
                </div>
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b4a48', fontSize: '12.5px' }}>
              Select parameters and click compile to populate the report canvas.
            </div>
          )}
        </div>

      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Reports;
