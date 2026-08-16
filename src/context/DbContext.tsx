import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Investigator,
  Victim,
  Suspect,
  Case,
  Evidence,
  AuditLog,
  CaseActivity,
  initialInvestigators,
  initialVictims,
  initialSuspects,
  initialCases,
  initialEvidence,
  initialAuditLogs
} from '../data/mockData';

interface DbContextType {
  investigators: Investigator[];
  victims: Victim[];
  suspects: Suspect[];
  cases: Case[];
  evidence: Evidence[];
  auditLogs: AuditLog[];
  currentUser: { email: string; role: 'Admin' | 'Investigator' | 'Forensic Analyst'; name: string } | null;
  login: (email: string, name: string, role: 'Admin' | 'Investigator' | 'Forensic Analyst') => boolean;
  logout: () => void;
  addCase: (caseData: Omit<Case, 'id' | 'progress' | 'findings' | 'activities'>) => void;
  updateCase: (caseId: string, caseData: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  addEvidence: (evidenceData: Omit<Evidence, 'id' | 'sha256Hash' | 'uploadDate' | 'uploadedBy'>) => void;
  deleteEvidence: (evidenceId: string) => void;
  updateInvestigation: (caseId: string, progress: number, findings: string, notes: string, status: Case['status']) => void;
  addVictim: (victim: Omit<Victim, 'id' | 'complaintHistory'>) => void;
  updateVictim: (victimId: string, victimData: Partial<Victim>) => void;
  addSuspect: (suspect: Omit<Suspect, 'id' | 'previousCases'>) => void;
  updateSuspect: (suspectId: string, suspectData: Partial<Suspect>) => void;
  changeRole: (role: 'Admin' | 'Investigator' | 'Forensic Analyst') => void;
  logAction: (action: string, status: 'Success' | 'Failed' | 'Warning') => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or fallback to defaults
  const [investigators, setInvestigators] = useState<Investigator[]>(() => {
    const saved = localStorage.getItem('ccms_investigators');
    return saved ? JSON.parse(saved) : initialInvestigators;
  });

  const [victims, setVictims] = useState<Victim[]>(() => {
    const saved = localStorage.getItem('ccms_victims');
    return saved ? JSON.parse(saved) : initialVictims;
  });

  const [suspects, setSuspects] = useState<Suspect[]>(() => {
    const saved = localStorage.getItem('ccms_suspects');
    return saved ? JSON.parse(saved) : initialSuspects;
  });

  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem('ccms_cases');
    return saved ? JSON.parse(saved) : initialCases;
  });

  const [evidence, setEvidence] = useState<Evidence[]>(() => {
    const saved = localStorage.getItem('ccms_evidence');
    return saved ? JSON.parse(saved) : initialEvidence;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ccms_auditLogs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'Admin' | 'Investigator' | 'Forensic Analyst'; name: string } | null>(() => {
    const saved = localStorage.getItem('ccms_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync state with localStorage on any change
  useEffect(() => {
    localStorage.setItem('ccms_investigators', JSON.stringify(investigators));
  }, [investigators]);

  useEffect(() => {
    localStorage.setItem('ccms_victims', JSON.stringify(victims));
  }, [victims]);

  useEffect(() => {
    localStorage.setItem('ccms_suspects', JSON.stringify(suspects));
  }, [suspects]);

  useEffect(() => {
    localStorage.setItem('ccms_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('ccms_evidence', JSON.stringify(evidence));
  }, [evidence]);

  useEffect(() => {
    localStorage.setItem('ccms_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ccms_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ccms_currentUser');
    }
  }, [currentUser]);

  // Helper to generate simulated IP Address
  const getIpAddress = () => {
    return '192.168.10.' + Math.floor(Math.random() * 200 + 10);
  };

  // Helper to log actions
  const logAction = (action: string, status: 'Success' | 'Failed' | 'Warning') => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      user: currentUser?.email || 'anonymous@ccms.gov',
      role: currentUser?.role || 'Admin',
      action,
      date: dateStr,
      time: timeStr,
      ipAddress: getIpAddress(),
      status
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (email: string, name: string, role: 'Admin' | 'Investigator' | 'Forensic Analyst') => {
    const userSession = { email, role, name };
    setCurrentUser(userSession);
    
    // Log the successful login
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      user: email,
      role: role,
      action: 'User Login',
      date: dateStr,
      time: timeStr,
      ipAddress: getIpAddress(),
      status: 'Success'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      logAction('User Logout', 'Success');
    }
    setCurrentUser(null);
  };

  const changeRole = (role: 'Admin' | 'Investigator' | 'Forensic Analyst') => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      logAction(`Role Switched to ${role}`, 'Success');
    }
  };

  const addCase = (caseData: Omit<Case, 'id' | 'progress' | 'findings' | 'activities'>) => {
    const nextNum = Math.max(...cases.map((c) => parseInt(c.id.split('-')[2] || '0')), 0) + 1;
    const newId = `CC-2026-${String(nextNum).padStart(4, '0')}`;

    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toTimeString().split(' ')[0];

    const initialActivity: CaseActivity = {
      id: 'ACT-001',
      date: today,
      time: todayTime,
      actor: currentUser?.name || 'System',
      action: 'Case Created',
      notes: 'Initial intake file recorded.'
    };

    const newCase: Case = {
      ...caseData,
      id: newId,
      progress: caseData.status === 'Closed' ? 100 : 0,
      findings: '',
      activities: [initialActivity]
    };

    // Update active cases for assigned investigator
    setInvestigators((prev) =>
      prev.map((inv) =>
        inv.id === caseData.assignedInvestigatorId ? { ...inv, activeCases: inv.activeCases + 1 } : inv
      )
    );

    // Update case lists for victim
    setVictims((prev) =>
      prev.map((vic) =>
        vic.id === caseData.victimId ? { ...vic, complaintHistory: [...vic.complaintHistory, newId] } : vic
      )
    );

    // Update case lists for suspect
    setSuspects((prev) =>
      prev.map((sus) =>
        sus.id === caseData.suspectId ? { ...sus, previousCases: [...sus.previousCases, newId] } : sus
      )
    );

    setCases((prev) => [newCase, ...prev]);
    logAction(`Case ${newId} Registered`, 'Success');
  };

  const updateCase = (caseId: string, caseData: Partial<Case>) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toTimeString().split(' ')[0];

    let oldInvId = '';
    let newInvId = caseData.assignedInvestigatorId;

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          oldInvId = c.assignedInvestigatorId;
          const newActivities = [...c.activities];
          
          // Log changes inside activities list
          if (caseData.status && caseData.status !== c.status) {
            newActivities.push({
              id: `ACT-${newActivities.length + 1}`,
              date: today,
              time: todayTime,
              actor: currentUser?.name || 'System',
              action: 'Status Updated',
              notes: `Status changed from ${c.status} to ${caseData.status}.`
            });
          }

          if (caseData.assignedInvestigatorId && caseData.assignedInvestigatorId !== c.assignedInvestigatorId) {
            newActivities.push({
              id: `ACT-${newActivities.length + 1}`,
              date: today,
              time: todayTime,
              actor: currentUser?.name || 'System',
              action: 'Investigator Reassigned',
              notes: `Assigned investigator changed.`
            });
          }

          return { ...c, ...caseData, activities: newActivities };
        }
        return c;
      })
    );

    // Handle investigator active case balance
    if (newInvId && oldInvId && newInvId !== oldInvId) {
      setInvestigators((prev) =>
        prev.map((inv) => {
          if (inv.id === oldInvId) return { ...inv, activeCases: Math.max(0, inv.activeCases - 1) };
          if (inv.id === newInvId) return { ...inv, activeCases: inv.activeCases + 1 };
          return inv;
        })
      );
    }

    logAction(`Case ${caseId} Updated`, 'Success');
  };

  const deleteCase = (caseId: string) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    // Decrement investigator active count
    setInvestigators((prev) =>
      prev.map((inv) =>
        inv.id === targetCase.assignedInvestigatorId ? { ...inv, activeCases: Math.max(0, inv.activeCases - 1) } : inv
      )
    );

    // Remove case ID from victim history
    setVictims((prev) =>
      prev.map((vic) =>
        vic.id === targetCase.victimId ? { ...vic, complaintHistory: vic.complaintHistory.filter((id) => id !== caseId) } : vic
      )
    );

    // Remove case ID from suspect history
    setSuspects((prev) =>
      prev.map((sus) =>
        sus.id === targetCase.suspectId ? { ...sus, previousCases: sus.previousCases.filter((id) => id !== caseId) } : sus
      )
    );

    // Remove linked evidence files
    setEvidence((prev) => prev.filter((ev) => ev.caseId !== caseId));

    setCases((prev) => prev.filter((c) => c.id !== caseId));
    logAction(`Case ${caseId} Deleted`, 'Success');
  };

  const addEvidence = (evidenceData: Omit<Evidence, 'id' | 'sha256Hash' | 'uploadDate' | 'uploadedBy'>) => {
    const nextNum = Math.max(...evidence.map((e) => parseInt(e.id.split('-')[1] || '0')), 0) + 1;
    const newId = `EVID-${String(nextNum).padStart(4, '0')}`;

    // Create simulated SHA-256 hash
    const hash = Array.from({ length: 64 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');

    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toTimeString().split(' ')[0];

    const newEvidence: Evidence = {
      ...evidenceData,
      id: newId,
      sha256Hash: hash,
      uploadDate: today,
      uploadedBy: currentUser?.name || 'Forensic Analyst'
    };

    setEvidence((prev) => [newEvidence, ...prev]);

    // Add activity log to the target case
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === evidenceData.caseId) {
          return {
            ...c,
            activities: [
              ...c.activities,
              {
                id: `ACT-${c.activities.length + 1}`,
                date: today,
                time: todayTime,
                actor: currentUser?.name || 'System',
                action: 'Evidence Added',
                notes: `Uploaded evidence: ${evidenceData.fileName} (${evidenceData.evidenceType})`
              }
            ]
          };
        }
        return c;
      })
    );

    logAction(`Evidence ${newId} Uploaded`, 'Success');
  };

  const deleteEvidence = (evidenceId: string) => {
    const targetEv = evidence.find((e) => e.id === evidenceId);
    if (!targetEv) return;

    setEvidence((prev) => prev.filter((e) => e.id !== evidenceId));

    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toTimeString().split(' ')[0];

    // Log deletion on Case activities
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === targetEv.caseId) {
          return {
            ...c,
            activities: [
              ...c.activities,
              {
                id: `ACT-${c.activities.length + 1}`,
                date: today,
                time: todayTime,
                actor: currentUser?.name || 'System',
                action: 'Evidence Deleted',
                notes: `Removed evidence: ${targetEv.fileName}`
              }
            ]
          };
        }
        return c;
      })
    );

    logAction(`Evidence ${evidenceId} Deleted`, 'Success');
  };

  const updateInvestigation = (
    caseId: string,
    progress: number,
    findings: string,
    notes: string,
    status: Case['status']
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toTimeString().split(' ')[0];

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newActivities = [...c.activities];
          
          if (c.progress !== progress) {
            newActivities.push({
              id: `ACT-${newActivities.length + 1}`,
              date: today,
              time: todayTime,
              actor: currentUser?.name || 'Investigator',
              action: 'Investigation Progress',
              notes: `Progress updated to ${progress}%.`
            });
          }

          if (c.status !== status) {
            newActivities.push({
              id: `ACT-${newActivities.length + 1}`,
              date: today,
              time: todayTime,
              actor: currentUser?.name || 'Investigator',
              action: 'Status Updated',
              notes: `Status changed to ${status}.`
            });
          }

          return {
            ...c,
            progress,
            findings,
            notes,
            status,
            activities: newActivities
          };
        }
        return c;
      })
    );

    logAction(`Investigation ${caseId} updated by Investigator`, 'Success');
  };

  const addVictim = (victimData: Omit<Victim, 'id' | 'complaintHistory'>) => {
    const nextNum = Math.max(...victims.map((v) => parseInt(v.id.split('-')[1] || '0')), 0) + 1;
    const newId = `VIC-${String(nextNum).padStart(3, '0')}`;
    const newVictim: Victim = {
      ...victimData,
      id: newId,
      complaintHistory: []
    };
    setVictims((prev) => [...prev, newVictim]);
    logAction(`Victim Profile Created for ${victimData.name}`, 'Success');
  };

  const updateVictim = (victimId: string, victimData: Partial<Victim>) => {
    setVictims((prev) => prev.map((v) => (v.id === victimId ? { ...v, ...victimData } : v)));
    logAction(`Victim Profile ${victimId} Updated`, 'Success');
  };

  const addSuspect = (suspectData: Omit<Suspect, 'id' | 'previousCases'>) => {
    const nextNum = Math.max(...suspects.map((s) => parseInt(s.id.split('-')[1] || '0')), 0) + 1;
    const newId = `SUS-${String(nextNum).padStart(3, '0')}`;
    const newSuspect: Suspect = {
      ...suspectData,
      id: newId,
      previousCases: []
    };
    setSuspects((prev) => [...prev, newSuspect]);
    logAction(`Suspect Profile Created for ${suspectData.name}`, 'Success');
  };

  const updateSuspect = (suspectId: string, suspectData: Partial<Suspect>) => {
    setSuspects((prev) => prev.map((s) => (s.id === suspectId ? { ...s, ...suspectData } : s)));
    logAction(`Suspect Profile ${suspectId} Updated`, 'Success');
  };

  return (
    <DbContext.Provider
      value={{
        investigators,
        victims,
        suspects,
        cases,
        evidence,
        auditLogs,
        currentUser,
        login,
        logout,
        addCase,
        updateCase,
        deleteCase,
        addEvidence,
        deleteEvidence,
        updateInvestigation,
        addVictim,
        updateVictim,
        addSuspect,
        updateSuspect,
        changeRole,
        logAction
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
