export interface Investigator {
  id: string;
  name: string;
  rank: string;
  specialty: string;
  email: string;
  phone: string;
  avatar: string;
  activeCases: number;
}

export interface Victim {
  id: string;
  name: string;
  contact: string;
  address: string;
  email: string;
  complaintHistory: string[]; // Case IDs
}

export interface Suspect {
  id: string;
  name: string;
  knownAlias: string;
  contact: string;
  previousCases: string[]; // Case IDs
  investigationStatus: string;
}

export interface CaseActivity {
  id: string;
  date: string;
  time: string;
  actor: string;
  action: string;
  notes: string;
}

export interface Case {
  id: string;
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
  progress: number; // 0 to 100
  findings: string;
  activities: CaseActivity[];
}

export interface Evidence {
  id: string;
  caseId: string;
  evidenceType: 'Document' | 'Image' | 'Audio' | 'Video' | 'Storage Drive' | 'Network Log' | 'Memory Dump' | 'Other';
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  sha256Hash: string;
  description: string;
  size: string; // e.g. "4.2 MB"
}

export interface AuditLog {
  id: string;
  user: string;
  role: 'Admin' | 'Investigator' | 'Forensic Analyst';
  action: string;
  date: string;
  time: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
}

// ==========================================
// 20 INVESTIGATORS
// ==========================================
export const initialInvestigators: Investigator[] = [
  { id: 'INV-001', name: 'Det. Sarah Jenkins', rank: 'Senior Inspector', specialty: 'Phishing & Email Spoofing', email: 's.jenkins@ccms.gov', phone: '+1-202-555-0101', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', activeCases: 3 },
  { id: 'INV-002', name: 'Det. Marcus Vance', rank: 'Lead Forensic Examiner', specialty: 'Ransomware & Malware Analysis', email: 'm.vance@ccms.gov', phone: '+1-202-555-0102', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', activeCases: 2 },
  { id: 'INV-003', name: 'Det. Elena Rostova', rank: 'Cyber Detective', specialty: 'Cryptocurrency Scams', email: 'e.rostova@ccms.gov', phone: '+1-202-555-0103', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', activeCases: 2 },
  { id: 'INV-004', name: 'Insp. David Kim', rank: 'Senior Cyber Forensic Analyst', specialty: 'Data Breach & Networks', email: 'd.kim@ccms.gov', phone: '+1-202-555-0104', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', activeCases: 2 },
  { id: 'INV-005', name: 'Inv. Aisha Bello', rank: 'Cyber Detective', specialty: 'Online Banking Fraud', email: 'a.bello@ccms.gov', phone: '+1-202-555-0105', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', activeCases: 2 },
  { id: 'INV-006', name: 'Insp. Thomas Wright', rank: 'Technical Analyst', specialty: 'Malware Attacks', email: 't.wright@ccms.gov', phone: '+1-202-555-0106', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', activeCases: 1 },
  { id: 'INV-007', name: 'Det. Chloe Dupont', rank: 'Investigator', specialty: 'Cyber Stalking & Social Media', email: 'c.dupont@ccms.gov', phone: '+1-202-555-0107', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', activeCases: 2 },
  { id: 'INV-008', name: 'Det. James Cooper', rank: 'Cyber Inspector', specialty: 'Identity Theft', email: 'j.cooper@ccms.gov', phone: '+1-202-555-0108', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', activeCases: 2 },
  { id: 'INV-009', name: 'Insp. Yuki Tanaka', rank: 'Senior Analyst', specialty: 'Network Forensics', email: 'y.tanaka@ccms.gov', phone: '+1-202-555-0109', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', activeCases: 1 },
  { id: 'INV-010', name: 'Det. Carlos Mendez', rank: 'Inspector', specialty: 'Cryptocurrency Scams', email: 'c.mendez@ccms.gov', phone: '+1-202-555-0110', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', activeCases: 1 },
  { id: 'INV-011', name: 'Inv. Liam O\'Connor', rank: 'Detective', specialty: 'Phishing', email: 'l.oconnor@ccms.gov', phone: '+1-202-555-0111', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', activeCases: 1 },
  { id: 'INV-012', name: 'Inv. Priya Patel', rank: 'Forensic Analyst', specialty: 'Identity Theft', email: 'p.patel@ccms.gov', phone: '+1-202-555-0112', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', activeCases: 1 },
  { id: 'INV-013', name: 'Det. Emma Watson', rank: 'Investigator', specialty: 'Ransomware', email: 'e.watson@ccms.gov', phone: '+1-202-555-0113', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150', activeCases: 1 },
  { id: 'INV-014', name: 'Inv. Omar Farooq', rank: 'Detective', specialty: 'Online Banking Fraud', email: 'o.farooq@ccms.gov', phone: '+1-202-555-0114', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', activeCases: 2 },
  { id: 'INV-015', name: 'Det. Sofia Lindstrom', rank: 'Senior Analyst', specialty: 'Data Breach', email: 's.lindstrom@ccms.gov', phone: '+1-202-555-0115', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150', activeCases: 1 },
  { id: 'INV-016', name: 'Inv. Hans Mueller', rank: 'Forensic Analyst', specialty: 'Malware Attack', email: 'h.mueller@ccms.gov', phone: '+1-202-555-0116', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', activeCases: 1 },
  { id: 'INV-017', name: 'Det. Alex Mercer', rank: 'Detective', specialty: 'Cyber Stalking', email: 'a.mercer@ccms.gov', phone: '+1-202-555-0117', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150', activeCases: 1 },
  { id: 'INV-018', name: 'Inv. Isabella Rossi', rank: 'Analyst', specialty: 'Social Media Fraud', email: 'i.rossi@ccms.gov', phone: '+1-202-555-0118', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', activeCases: 1 },
  { id: 'INV-019', name: 'Det. John Doe', rank: 'Inspector', specialty: 'Email Spoofing', email: 'j.doe@ccms.gov', phone: '+1-202-555-0119', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', activeCases: 0 },
  { id: 'INV-020', name: 'Inv. Lucas Silva', rank: 'Analyst', specialty: 'Cryptocurrency Scams', email: 'l.silva@ccms.gov', phone: '+1-202-555-0120', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', activeCases: 1 }
];

// ==========================================
// 15 VICTIMS
// ==========================================
export const initialVictims: Victim[] = [
  { id: 'VIC-001', name: 'Alice Green', contact: '+1-312-555-0143', address: '123 Pine St, Seattle, WA', email: 'alice.g@gmail.com', complaintHistory: ['CC-2026-0001', 'CC-2026-0015'] },
  { id: 'VIC-002', name: 'Robert Chen', contact: '+1-415-555-0298', address: '456 Oak Rd, San Francisco, CA', email: 'rchen.sf@yahoo.com', complaintHistory: ['CC-2026-0002'] },
  { id: 'VIC-003', name: 'Apex Solutions Corp', contact: '+1-512-555-0109', address: '789 Tech Blvd, Austin, TX', email: 'sec-breach@apexsolutions.com', complaintHistory: ['CC-2026-0003', 'CC-2026-0029'] },
  { id: 'VIC-004', name: 'Linda Thompson', contact: '+1-312-555-0187', address: '102 Maple Dr, Chicago, IL', email: 'linda.t77@hotmail.com', complaintHistory: ['CC-2026-0004'] },
  { id: 'VIC-005', name: 'Dr. James Peterson', contact: '+1-617-555-0245', address: '304 Elm Ct, Boston, MA', email: 'jpeterson.md@clinic.org', complaintHistory: ['CC-2026-0005'] },
  { id: 'VIC-006', name: 'Summit Healthcare Systems', contact: '+1-303-555-0312', address: '888 Care Way, Denver, CO', email: 'compliance@summithealth.org', complaintHistory: ['CC-2026-0006'] },
  { id: 'VIC-007', name: 'Emily Watson', contact: '+1-305-555-0456', address: '506 Cedar Ave, Miami, FL', email: 'emwatson.design@icloud.com', complaintHistory: ['CC-2026-0007'] },
  { id: 'VIC-008', name: 'Alpha Finance Ltd', contact: '+1-212-555-0550', address: '200 Wall St, New York, NY', email: 'audit-response@alphafin.com', complaintHistory: ['CC-2026-0008'] },
  { id: 'VIC-009', name: 'Marcus Sterling', contact: '+1-404-555-0678', address: '701 Birch Rd, Atlanta, GA', email: 'msterl.atl@outlook.com', complaintHistory: ['CC-2026-0009'] },
  { id: 'VIC-010', name: 'David Miller', contact: '+1-503-555-0789', address: '802 Spruce Dr, Portland, OR', email: 'dmiller.tech@spruce.io', complaintHistory: ['CC-2026-0010'] },
  { id: 'VIC-011', name: 'Karen Davis', contact: '+1-602-555-0890', address: '903 Ash St, Phoenix, AZ', email: 'kdavis.phx@gmail.com', complaintHistory: ['CC-2026-0011'] },
  { id: 'VIC-012', name: 'Joseph Martinez', contact: '+1-214-555-0901', address: '404 Willow Way, Dallas, TX', email: 'j.martinez@txbuild.com', complaintHistory: ['CC-2026-0012'] },
  { id: 'VIC-013', name: 'Helen Taylor', contact: '+1-215-555-0912', address: '605 Poplar Ave, Philadelphia, PA', email: 'htaylor.philly@gmail.com', complaintHistory: ['CC-2026-0013'] },
  { id: 'VIC-014', name: 'George Clark', contact: '+1-313-555-0923', address: '706 Beech Ct, Detroit, MI', email: 'gclark.detroit@yahoo.com', complaintHistory: ['CC-2026-0014'] },
  { id: 'VIC-015', name: 'Nancy Rodriguez', contact: '+1-713-555-0934', address: '807 Alder Dr, Houston, TX', email: 'nancy.rod@houstonschools.edu', complaintHistory: ['CC-2026-0020'] }
];

// ==========================================
// 15 SUSPECTS
// ==========================================
export const initialSuspects: Suspect[] = [
  { id: 'SUS-001', name: 'Kevin Vance', knownAlias: 'PhishKing', contact: '+1-312-555-9876, k.vance@mail.org', previousCases: ['CC-2026-0001', 'CC-2026-0011'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-002', name: 'Unknown', knownAlias: 'CryptoShadow', contact: 'Telegram @cryptoshadow_x', previousCases: ['CC-2026-0002', 'CC-2026-0017'], investigationStatus: 'Wanted' },
  { id: 'SUS-003', name: 'Viktor Rostova', knownAlias: 'BlackHat_99', contact: 'vrost@tor.onion, jabber: vrost99@xmpp.ru', previousCases: ['CC-2026-0003'], investigationStatus: 'Under Arrest' },
  { id: 'SUS-004', name: 'Dmitry Sidorov', knownAlias: 'LockByte_Dev', contact: 'dmitry@lockbyte.onion', previousCases: ['CC-2026-0006'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-005', name: 'John Miller', knownAlias: 'CarderPro', contact: '+1-917-555-8822', previousCases: ['CC-2026-0005', 'CC-2026-0020'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-006', name: 'Chloe Dupont (Jr.)', knownAlias: 'InstaHacker', contact: '+1-415-555-7733', previousCases: ['CC-2026-0007'], investigationStatus: 'Wanted' },
  { id: 'SUS-007', name: 'Liam Gallagher', knownAlias: 'SpoofMaster', contact: '+1-212-555-6644', previousCases: ['CC-2026-0009', 'CC-2026-0013'], investigationStatus: 'Wanted' },
  { id: 'SUS-008', name: 'Mark Henderson', knownAlias: 'RansomGoon', contact: '+1-773-555-5555', previousCases: ['CC-2026-0008'], investigationStatus: 'Under Arrest' },
  { id: 'SUS-009', name: 'Elena Petrov', knownAlias: 'DataSiphoner', contact: 'elena_p@protonmail.com', previousCases: ['CC-2026-0004'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-010', name: 'Tyler Higgins', knownAlias: 'StalkerX', contact: '+1-617-555-4433', previousCases: ['CC-2026-0010'], investigationStatus: 'Under Arrest' },
  { id: 'SUS-011', name: 'Raj Patel', knownAlias: 'CloneGod', contact: 'raj_clone@skiff.com', previousCases: ['CC-2026-0012'], investigationStatus: 'Wanted' },
  { id: 'SUS-012', name: 'Jessica Alvarez', knownAlias: 'PhonyRep', contact: '+1-305-555-2211', previousCases: ['CC-2026-0014'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-013', name: 'Kenji Takahashi', knownAlias: 'NetGhost', contact: 'kenji@proton.me', previousCases: ['CC-2026-0018'], investigationStatus: 'Wanted' },
  { id: 'SUS-014', name: 'Igor Smirnov', knownAlias: 'MalwareCoder', contact: 'igor_smir@mail.ru', previousCases: ['CC-2026-0016'], investigationStatus: 'Under Investigation' },
  { id: 'SUS-015', name: 'Arthur Pendelton', knownAlias: 'CoinManipulator', contact: 'arthur.p@skiff.com', previousCases: ['CC-2026-0019'], investigationStatus: 'Under Investigation' }
];

// ==========================================
// 30 CASES
// ==========================================
export const initialCases: Case[] = [
  {
    id: 'CC-2026-0001',
    title: 'Phishing Campaign targeting Chase Bank Users',
    complaintDate: '2026-06-15',
    incidentDate: '2026-06-12',
    crimeCategory: 'Phishing',
    crimeDescription: 'Victim received a spoofed SMS claiming account suspension, leading to a credential harvesting site where online banking details were leaked.',
    victimId: 'VIC-001',
    suspectId: 'SUS-001',
    assignedInvestigatorId: 'INV-001',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Seattle, WA',
    notes: 'Investigating domains registered on Namecheap by the suspect. DNS records indicate an IP address based in Russia.',
    progress: 45,
    findings: 'Credential harvesting template recovered from suspect server. Correlated IP addresses match Kevin Vance\'s local access patterns.',
    activities: [
      { id: 'ACT-001', date: '2026-06-15', time: '10:00', actor: 'Sys Admin', action: 'Case Created', notes: 'Initial intake filed.' },
      { id: 'ACT-002', date: '2026-06-16', time: '14:30', actor: 'Det. Sarah Jenkins', action: 'Investigator Assigned', notes: 'Assigned to Jenkins due to bank fraud specialty.' }
    ]
  },
  {
    id: 'CC-2026-0002',
    title: 'Cryptocurrency Pig Butchering Scam',
    complaintDate: '2026-06-18',
    incidentDate: '2026-05-10',
    crimeCategory: 'Cryptocurrency Scam',
    crimeDescription: 'Victim defrauded of 4.5 BTC over a 2-month period through a fake trading application (DeFi-SmartTrade).',
    victimId: 'VIC-002',
    suspectId: 'SUS-002',
    assignedInvestigatorId: 'INV-003',
    priority: 'Critical',
    status: 'Evidence Collection',
    location: 'San Francisco, CA',
    notes: 'Traced funds to a Binance intermediary wallet. Requesting exchange logs.',
    progress: 75,
    findings: 'Traced BTC through 4 mixers. Final destination wallet linked to TG user @cryptoshadow_x.',
    activities: [
      { id: 'ACT-003', date: '2026-06-18', time: '11:15', actor: 'Sys Admin', action: 'Case Created', notes: 'Victim reported loss of retirement funds.' },
      { id: 'ACT-004', date: '2026-06-19', time: '09:00', actor: 'Det. Elena Rostova', action: 'Wallet Traced', notes: 'Initial blockchain analysis completed.' }
    ]
  },
  {
    id: 'CC-2026-0003',
    title: 'Ransomware Attack on Apex Solutions',
    complaintDate: '2026-06-20',
    incidentDate: '2026-06-20',
    crimeCategory: 'Ransomware',
    crimeDescription: 'Apex Solutions domain controller encrypted by LockBit v3. Ransom of $1.2M demanded in Monero.',
    victimId: 'VIC-003',
    suspectId: 'SUS-003',
    assignedInvestigatorId: 'INV-002',
    priority: 'Critical',
    status: 'Under Investigation',
    location: 'Austin, TX',
    notes: 'Negotiator working with threat actor. Forensic team checking backup servers.',
    progress: 30,
    findings: 'Found compromised VPN credentials on the dark web used as initial access vector.',
    activities: [
      { id: 'ACT-005', date: '2026-06-20', time: '08:30', actor: 'Det. Marcus Vance', action: 'Forensic Copy Created', notes: 'Acquired memory dump of encrypted DC.' }
    ]
  },
  {
    id: 'CC-2026-0004',
    title: 'Data Breach of Customer Records - Thompson Retail',
    complaintDate: '2026-06-22',
    incidentDate: '2026-06-15',
    crimeCategory: 'Data Breach',
    crimeDescription: 'SQL injection attack on Thompson Retail API database, exposing 50,000 customers credit card numbers and passwords.',
    victimId: 'VIC-004',
    suspectId: 'SUS-009',
    assignedInvestigatorId: 'INV-004',
    priority: 'High',
    status: 'Evidence Collection',
    location: 'Chicago, IL',
    notes: 'Analyzing IIS logs from the breached application server.',
    progress: 60,
    findings: 'SQLi vulnerability identified in /api/v1/search endpoint. Payload originated from Tor node.',
    activities: [
      { id: 'ACT-006', date: '2026-06-22', time: '16:00', actor: 'Insp. David Kim', action: 'Log Extraction', notes: 'Pulled 15GB of web logs.' }
    ]
  },
  {
    id: 'CC-2026-0005',
    title: 'Identity Theft and Medical Billing Fraud',
    complaintDate: '2026-06-25',
    incidentDate: '2026-04-01',
    crimeCategory: 'Identity Theft',
    crimeDescription: 'Victims SSN was used to register false medical claims at Boston Hospital totaling $85,000.',
    victimId: 'VIC-005',
    suspectId: 'SUS-005',
    assignedInvestigatorId: 'INV-008',
    priority: 'Medium',
    status: 'Assigned',
    location: 'Boston, MA',
    notes: 'Suspect John Miller has previous record for medical card cloning.',
    progress: 20,
    findings: '',
    activities: [
      { id: 'ACT-007', date: '2026-06-25', time: '13:00', actor: 'Det. James Cooper', action: 'Case Assigned', notes: 'Assigned for suspect correlation.' }
    ]
  },
  {
    id: 'CC-2026-0006',
    title: 'Ransomware deployment - Summit Healthcare',
    complaintDate: '2026-06-27',
    incidentDate: '2026-06-26',
    crimeCategory: 'Ransomware',
    crimeDescription: 'BlackCat ransomware infected 200 clinical workstations. Critical medical operations disrupted.',
    victimId: 'VIC-006',
    suspectId: 'SUS-004',
    assignedInvestigatorId: 'INV-002',
    priority: 'Critical',
    status: 'Under Investigation',
    location: 'Denver, CO',
    notes: 'Decrypted shadow copies, recovering partial records. Suspect LockByte_Dev suspected of selling payload.',
    progress: 50,
    findings: 'Traced active beacon to domain summit-update.net, hosted on bulletproof server.',
    activities: [
      { id: 'ACT-008', date: '2026-06-27', time: '09:00', actor: 'Det. Marcus Vance', action: 'Triage Analysis', notes: 'Decrypted 15 crucial patient databases.' }
    ]
  },
  {
    id: 'CC-2026-0007',
    title: 'Cyber Stalking and Harassment Campaign',
    complaintDate: '2026-06-29',
    incidentDate: '2026-06-01',
    crimeCategory: 'Cyber Stalking',
    crimeDescription: 'Targeted swatting and harassment of influencer Emily Watson on Instagram/Twitter by anonymous accounts.',
    victimId: 'VIC-007',
    suspectId: 'SUS-006',
    assignedInvestigatorId: 'INV-007',
    priority: 'Medium',
    status: 'Under Investigation',
    location: 'Miami, FL',
    notes: 'Acquiring subpoenas for IP addresses from Meta and Twitter.',
    progress: 40,
    findings: 'Correlated harassing text messages with an online burner phone app service.',
    activities: []
  },
  {
    id: 'CC-2026-0008',
    title: 'BEC Wire Fraud on Alpha Finance',
    complaintDate: '2026-07-02',
    incidentDate: '2026-06-28',
    crimeCategory: 'Online Banking Fraud',
    crimeDescription: 'CEO email spoofed. CFO wire transferred $450,000 to an offshore shell company bank account in Cayman Islands.',
    victimId: 'VIC-008',
    suspectId: 'SUS-008',
    assignedInvestigatorId: 'INV-005',
    priority: 'High',
    status: 'Under Investigation',
    location: 'New York, NY',
    notes: 'Working with FinCEN to freeze the funds. Tracing email headers.',
    progress: 55,
    findings: 'Spoofed header originating from Nigerian server using fake SMTP configuration.',
    activities: []
  },
  {
    id: 'CC-2026-0009',
    title: 'Business Email Spoofing Campaign',
    complaintDate: '2026-07-03',
    incidentDate: '2026-07-01',
    crimeCategory: 'Email Spoofing',
    crimeDescription: 'Mass email spoofing of Sterling Legal partners containing a malicious HTML attachment that steals Office365 sessions.',
    victimId: 'VIC-009',
    suspectId: 'SUS-007',
    assignedInvestigatorId: 'INV-001',
    priority: 'High',
    status: 'Evidence Collection',
    location: 'Atlanta, GA',
    notes: 'Collected sample attachment for forensic testing in malware sandbox.',
    progress: 80,
    findings: 'Determined session token stealer (Evilginx2) configured on suspect-owned VPS.',
    activities: []
  },
  {
    id: 'CC-2026-0010',
    title: 'Social Media Hijacking and Extortion',
    complaintDate: '2026-07-05',
    incidentDate: '2026-07-04',
    crimeCategory: 'Social Media Fraud',
    crimeDescription: 'Victims account hijacked. Suspect demanding $5000 in gift cards or threatened to leak private messages.',
    victimId: 'VIC-010',
    suspectId: 'SUS-010',
    assignedInvestigatorId: 'INV-017',
    priority: 'Medium',
    status: 'Closed',
    location: 'Portland, OR',
    notes: 'Suspect Tyler Higgins was arrested and device seized. Account restored to victim.',
    progress: 100,
    findings: 'Suspect Higgins arrested on 2026-07-09. Phone contained victim credentials and direct blackmail chat history.',
    activities: [
      { id: 'ACT-009', date: '2026-07-05', time: '11:00', actor: 'Det. Alex Mercer', action: 'Seized Device Analysis', notes: 'Located password database.' },
      { id: 'ACT-010', date: '2026-07-10', time: '16:00', actor: 'Det. Alex Mercer', action: 'Case Closed', notes: 'Suspect pleaded guilty.' }
    ]
  },
  {
    id: 'CC-2026-0011',
    title: 'Phishing Outbreak - Phoenix Municipal Systems',
    complaintDate: '2026-07-06',
    incidentDate: '2026-07-05',
    crimeCategory: 'Phishing',
    crimeDescription: 'Credential harvest targeting City of Phoenix HR. 14 employee accounts compromised.',
    victimId: 'VIC-011',
    suspectId: 'SUS-001',
    assignedInvestigatorId: 'INV-011',
    priority: 'High',
    status: 'New',
    location: 'Phoenix, AZ',
    notes: 'Investigating credentials found in a public GitHub repository dump.',
    progress: 10,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0012',
    title: 'Identity Theft Carding Ring',
    complaintDate: '2026-07-08',
    incidentDate: '2026-06-10',
    crimeCategory: 'Identity Theft',
    crimeDescription: 'Ring stealing physical mail and cloning cards. Used at retail locations in Dallas for over $40k in losses.',
    victimId: 'VIC-012',
    suspectId: 'SUS-011',
    assignedInvestigatorId: 'INV-012',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Dallas, TX',
    notes: 'Reviewing surveillance cameras from Walmart and gas stations.',
    progress: 35,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0013',
    title: 'BEC Spear Phishing on Taylor Logis',
    complaintDate: '2026-07-10',
    incidentDate: '2026-07-08',
    crimeCategory: 'Email Spoofing',
    crimeDescription: 'Spear phishing emails impersonating vendor company. Payment redirected to hacker bank.',
    victimId: 'VIC-013',
    suspectId: 'SUS-007',
    assignedInvestigatorId: 'INV-001',
    priority: 'Medium',
    status: 'Assigned',
    location: 'Philadelphia, PA',
    notes: 'Traced bank account to a money mule in Florida.',
    progress: 25,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0014',
    title: 'Online Banking Takeover - George Clark',
    complaintDate: '2026-07-12',
    incidentDate: '2026-07-10',
    crimeCategory: 'Online Banking Fraud',
    crimeDescription: 'Sim swap attack leading to unauthorized login to Chase bank account. $15,000 transferred.',
    victimId: 'VIC-014',
    suspectId: 'SUS-012',
    assignedInvestigatorId: 'INV-014',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Detroit, MI',
    notes: 'Obtained cell carrier logs showing unauthorized SIM re-issuance from local retail store.',
    progress: 60,
    findings: 'SIM swap traced to retail employee bribe in Detroit store.',
    activities: []
  },
  {
    id: 'CC-2026-0015',
    title: 'Social Media Account Cloning - Alice Green',
    complaintDate: '2026-07-15',
    incidentDate: '2026-07-14',
    crimeCategory: 'Social Media Fraud',
    crimeDescription: 'Suspect cloned Facebook account of victim and solicited funds from her contact list under false pretenses.',
    victimId: 'VIC-001',
    suspectId: 'SUS-006',
    assignedInvestigatorId: 'INV-018',
    priority: 'Low',
    status: 'Closed',
    location: 'Seattle, WA',
    notes: 'Account removed by Meta. Suspect ID matched suspect from previous stalking case.',
    progress: 100,
    findings: 'Facebook cloned account disabled by Meta security. Suspect identified as Chloe Dupont Jr.',
    activities: [
      { id: 'ACT-011', date: '2026-07-16', time: '11:00', actor: 'Inv. Isabella Rossi', action: 'Case Closed', notes: 'Account deactivated. No financial transactions executed.' }
    ]
  },
  {
    id: 'CC-2026-0016',
    title: 'Trojan Keylogger Malware Campaign',
    complaintDate: '2026-07-17',
    incidentDate: '2026-07-15',
    crimeCategory: 'Malware Attack',
    crimeDescription: 'Infection of office network with a RedLine Stealer variant, scraping credentials and session cookies.',
    victimId: 'VIC-003',
    suspectId: 'SUS-014',
    assignedInvestigatorId: 'INV-016',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Austin, TX',
    notes: 'Forensic autopsy of malicious Excel file containing VBA macro.',
    progress: 40,
    findings: 'C2 server address extracted from binary config: 194.223.14.99.',
    activities: []
  },
  {
    id: 'CC-2026-0017',
    title: 'Crypto Smart Contract Exploit',
    complaintDate: '2026-07-19',
    incidentDate: '2026-07-18',
    crimeCategory: 'Cryptocurrency Scam',
    crimeDescription: 'Arbitrage flash-loan exploit on DeFi protocol, draining $250k in Ethereum liquidity pools.',
    victimId: 'VIC-008',
    suspectId: 'SUS-002',
    assignedInvestigatorId: 'INV-003',
    priority: 'High',
    status: 'Assigned',
    location: 'New York, NY',
    notes: 'Analyzing EVM transaction logs and decompiled Solidity contract bytecodes.',
    progress: 15,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0018',
    title: 'Corporate Data Leak - Alpha Fin IP',
    complaintDate: '2026-07-20',
    incidentDate: '2026-07-19',
    crimeCategory: 'Data Breach',
    crimeDescription: 'Proprietary source code and algorithmic trading files posted on dark web hacker forum BreachForums.',
    victimId: 'VIC-008',
    suspectId: 'SUS-013',
    assignedInvestigatorId: 'INV-015',
    priority: 'Critical',
    status: 'Under Investigation',
    location: 'New York, NY',
    notes: 'Acquiring forum archive, tracking poster alias NetGhost.',
    progress: 30,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0019',
    title: 'Fake ICO Investment Scam',
    complaintDate: '2026-07-22',
    incidentDate: '2026-05-01',
    crimeCategory: 'Cryptocurrency Scam',
    crimeDescription: 'Website offering fake token pre-sale. Collected $80,000 from victims and shut down.',
    victimId: 'VIC-005',
    suspectId: 'SUS-015',
    assignedInvestigatorId: 'INV-020',
    priority: 'Medium',
    status: 'New',
    location: 'Boston, MA',
    notes: 'Analyzing DNS registrar records and Cloudflare protection origins.',
    progress: 5,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0020',
    title: 'Skimming and Account Takeover - Nancy R.',
    complaintDate: '2026-07-24',
    incidentDate: '2026-07-23',
    crimeCategory: 'Online Banking Fraud',
    crimeDescription: 'ATM skimmer deployed at Shell gas station. Card cloned and account drained of $4,500.',
    victimId: 'VIC-015',
    suspectId: 'SUS-005',
    assignedInvestigatorId: 'INV-005',
    priority: 'Medium',
    status: 'Under Investigation',
    location: 'Houston, TX',
    notes: 'Found suspect John Miller matched physical description on Shell ATM camera logs.',
    progress: 50,
    findings: 'Recovered skimmer hardware with suspect fingerprints from local dumpster.',
    activities: []
  },
  {
    id: 'CC-2026-0021',
    title: 'Ransomware incident - Tech Solutions',
    complaintDate: '2026-07-25',
    incidentDate: '2026-07-25',
    crimeCategory: 'Ransomware',
    crimeDescription: 'Phobos ransomware deployment. Dev servers locked.',
    victimId: 'VIC-003',
    suspectId: 'SUS-003',
    assignedInvestigatorId: 'INV-002',
    priority: 'High',
    status: 'Reopened',
    location: 'Austin, TX',
    notes: 'Case reopened due to new IOCs matching suspect Viktor Rostova\'s group.',
    progress: 65,
    findings: 'Discovered decryption bypass vulnerability in ransomware payload.',
    activities: [
      { id: 'ACT-012', date: '2026-07-26', time: '10:00', actor: 'Det. Marcus Vance', action: 'Case Reopened', notes: 'New payload decryption method discovered.' }
    ]
  },
  {
    id: 'CC-2026-0022',
    title: 'Email Spoofing Campaign - Denver Hospital',
    complaintDate: '2026-07-26',
    incidentDate: '2026-07-25',
    crimeCategory: 'Email Spoofing',
    crimeDescription: 'Emails sent to employees pretending to be HR offering a bonus, redirecting to fake MS Outlook login.',
    victimId: 'VIC-006',
    suspectId: 'SUS-001',
    assignedInvestigatorId: 'INV-008',
    priority: 'High',
    status: 'Closed',
    location: 'Denver, CO',
    notes: 'Threat actor domain taken down. Credentials reset.',
    progress: 100,
    findings: 'Credential site disabled via domain registrar request. Host server shut down. Suspect Vance linked.',
    activities: [
      { id: 'ACT-013', date: '2026-07-28', time: '14:00', actor: 'Det. James Cooper', action: 'Case Closed', notes: 'Risk mitigated.' }
    ]
  },
  {
    id: 'CC-2026-0023',
    title: 'Cyber Stalking of Boston Medical Staff',
    complaintDate: '2026-07-27',
    incidentDate: '2026-07-20',
    crimeCategory: 'Cyber Stalking',
    crimeDescription: 'Physicians target of coordinated doxxing and threats online due to research publication.',
    victimId: 'VIC-005',
    suspectId: 'SUS-010',
    assignedInvestigatorId: 'INV-007',
    priority: 'Medium',
    status: 'Under Investigation',
    location: 'Boston, MA',
    notes: 'Analyzing forum threads on 4chan and Kiwi Farms.',
    progress: 30,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0024',
    title: 'Ransomware deployment on Phx Logistics',
    complaintDate: '2026-07-28',
    incidentDate: '2026-07-27',
    crimeCategory: 'Ransomware',
    crimeDescription: 'LockBit ransomware deployment. Shipping logs encrypted.',
    victimId: 'VIC-011',
    suspectId: 'SUS-004',
    assignedInvestigatorId: 'INV-006',
    priority: 'High',
    status: 'New',
    location: 'Phoenix, AZ',
    notes: 'Triage team conducting disk image acquisition.',
    progress: 0,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0025',
    title: 'Credential Stuffing - Philly Finance Corp',
    complaintDate: '2026-07-29',
    incidentDate: '2026-07-28',
    crimeCategory: 'Phishing',
    crimeDescription: 'Automated attacks logging into client portals using credential dumps.',
    victimId: 'VIC-013',
    suspectId: 'SUS-001',
    assignedInvestigatorId: 'INV-001',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Philadelphia, PA',
    notes: 'Blocked over 4,000 malicious IPs. Investigating attack server logs.',
    progress: 20,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0026',
    title: 'Malware Botnet node installation - Detroit Auto',
    complaintDate: '2026-07-30',
    incidentDate: '2026-07-29',
    crimeCategory: 'Malware Attack',
    crimeDescription: 'Servers compromised and added to Mirai botnet swarm.',
    victimId: 'VIC-014',
    suspectId: 'SUS-014',
    assignedInvestigatorId: 'INV-014',
    priority: 'Medium',
    status: 'Under Investigation',
    location: 'Detroit, MI',
    notes: 'Analyzing process hierarchy and socket states in server RAM.',
    progress: 40,
    findings: 'Found binary payload in /tmp/mirai.x86 configured to phone home to a suspect IP.',
    activities: []
  },
  {
    id: 'CC-2026-0027',
    title: 'Social Media Scam - Fake Charity',
    complaintDate: '2026-08-01',
    incidentDate: '2026-07-10',
    crimeCategory: 'Social Media Fraud',
    crimeDescription: 'Fake charity profile on Instagram requesting donations for hurricane relief, keeping funds.',
    victimId: 'VIC-007',
    suspectId: 'SUS-012',
    assignedInvestigatorId: 'INV-007',
    priority: 'Low',
    status: 'New',
    location: 'Miami, FL',
    notes: 'Obtaining payment provider records.',
    progress: 5,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0028',
    title: 'Cryptocurrency Rug Pull - SuperCoins',
    complaintDate: '2026-08-02',
    incidentDate: '2026-07-30',
    crimeCategory: 'Cryptocurrency Scam',
    crimeDescription: 'Creators minted token, pumped value, and removed all liquidity, resulting in $120,000 loss.',
    victimId: 'VIC-002',
    suspectId: 'SUS-015',
    assignedInvestigatorId: 'INV-010',
    priority: 'High',
    status: 'Assigned',
    location: 'San Francisco, CA',
    notes: 'Reviewing blockchain records on Etherscan.',
    progress: 25,
    findings: '',
    activities: []
  },
  {
    id: 'CC-2026-0029',
    title: 'Data Breach of Apex Internal Wiki',
    complaintDate: '2026-08-03',
    incidentDate: '2026-08-02',
    crimeCategory: 'Data Breach',
    crimeDescription: 'Confluence server exploit used to download company proprietary roadmap.',
    victimId: 'VIC-003',
    suspectId: 'SUS-013',
    assignedInvestigatorId: 'INV-004',
    priority: 'High',
    status: 'Under Investigation',
    location: 'Austin, TX',
    notes: 'Exploited Confluence vulnerability CVE-2026-1033. Restricting server traffic.',
    progress: 35,
    findings: 'Found server logs pointing to Tor exit node downloads.',
    activities: []
  },
  {
    id: 'CC-2026-0030',
    title: 'Identity Theft via Credit Bureau spoof',
    complaintDate: '2026-08-04',
    incidentDate: '2026-08-03',
    crimeCategory: 'Identity Theft',
    crimeDescription: 'Victim received fake email from Experian requesting credit score check. SSN and bank details cloned.',
    victimId: 'VIC-010',
    suspectId: 'SUS-005',
    assignedInvestigatorId: 'INV-008',
    priority: 'High',
    status: 'New',
    location: 'Portland, OR',
    notes: 'Victims credit files locked. Analyzing email header routing.',
    progress: 0,
    findings: '',
    activities: []
  }
];

// ==========================================
// 50 EVIDENCE FILES
// ==========================================
export const initialEvidence: Evidence[] = Array.from({ length: 50 }).map((_, i) => {
  const id = `EVID-${String(i + 1).padStart(4, '0')}`;
  const caseIndex = i % 30; // Spread across the 30 cases
  const caseId = initialCases[caseIndex].id;

  const fileTypes: Evidence['evidenceType'][] = ['Document', 'Image', 'Audio', 'Video', 'Storage Drive', 'Network Log', 'Memory Dump', 'Other'];
  const evidenceType = fileTypes[i % fileTypes.length];

  let fileName = '';
  let size = '';
  switch (evidenceType) {
    case 'Network Log':
      fileName = `pcap_capture_stream_${i}_auth.log`;
      size = `${(1.2 * (i + 1)).toFixed(1)} MB`;
      break;
    case 'Memory Dump':
      fileName = `mem_dump_lsass_${i}_win10.dmp`;
      size = `${(512 + i * 20)} MB`;
      break;
    case 'Image':
      fileName = `screenshot_phish_site_${i}.png`;
      size = `${(120 + i * 15)} KB`;
      break;
    case 'Document':
      fileName = `demand_letter_negotiation_${i}.pdf`;
      size = `${(45 + i * 2)} KB`;
      break;
    case 'Video':
      fileName = `cctv_retail_store_cloning_${i}.mp4`;
      size = `${(12.4 * (i + 1)).toFixed(1)} MB`;
      break;
    case 'Storage Drive':
      fileName = `hdd_dd_clone_physical_drive_${i}.raw`;
      size = `${(40 + i * 20)} GB`;
      break;
    case 'Audio':
      fileName = `recorded_extortion_call_${i}.wav`;
      size = `${(4.8 * (i + 1)).toFixed(1)} MB`;
      break;
    default:
      fileName = `binary_payload_sandbox_${i}.bin`;
      size = `${(250 + i * 12)} KB`;
  }

  const investigators = ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova', 'David Kim', 'Aisha Bello', 'Thomas Wright', 'Chloe Dupont'];
  const uploadedBy = investigators[i % investigators.length];

  // Helper to generate simulated SHA256 hashes
  const sha256Hash = Array.from({ length: 64 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

  const months = ['06', '07', '08'];
  const days = String((i % 28) + 1).padStart(2, '0');
  const month = months[i % months.length];
  const uploadDate = `2026-${month}-${days}`;

  const descriptions = [
    'Acquired from primary target server during forensics audit.',
    'Supplied by victim via email submission portal.',
    'Seized device physical forensic extract.',
    'Extracted from volatile RAM dump on infected endpoint.',
    'Network capture taken at local firewall boundary during anomalous spike.',
    'Threat actor communication log exported from dark web forum.',
    'ATM surveillance feed snippet showing suspect transaction.',
    'Decrypted source code snippet found in malware payload repository.'
  ];
  const description = descriptions[i % descriptions.length];

  return {
    id,
    caseId,
    evidenceType,
    fileName,
    uploadDate,
    uploadedBy,
    sha256Hash,
    description,
    size
  };
});

// ==========================================
// AUDIT LOGS
// ==========================================
export const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-001', user: 'admin@ccms.gov', role: 'Admin', action: 'User Login', date: '2026-08-05', time: '08:30:12', ipAddress: '192.168.10.45', status: 'Success' },
  { id: 'LOG-002', user: 'm.vance@ccms.gov', role: 'Investigator', action: 'User Login', date: '2026-08-05', time: '08:42:01', ipAddress: '192.168.10.88', status: 'Success' },
  { id: 'LOG-003', user: 'm.vance@ccms.gov', role: 'Investigator', action: 'Case Update', date: '2026-08-05', time: '08:55:34', ipAddress: '192.168.10.88', status: 'Success' },
  { id: 'LOG-004', user: 's.jenkins@ccms.gov', role: 'Investigator', action: 'User Login', date: '2026-08-05', time: '09:02:11', ipAddress: '192.168.12.19', status: 'Success' },
  { id: 'LOG-005', user: 's.jenkins@ccms.gov', role: 'Investigator', action: 'Evidence Upload', date: '2026-08-05', time: '09:12:45', ipAddress: '192.168.12.19', status: 'Success' },
  { id: 'LOG-006', user: 'e.rostova@ccms.gov', role: 'Investigator', action: 'User Login', date: '2026-08-05', time: '09:15:00', ipAddress: '192.168.10.99', status: 'Success' },
  { id: 'LOG-007', user: 'e.rostova@ccms.gov', role: 'Investigator', action: 'Report Generation', date: '2026-08-05', time: '09:20:18', ipAddress: '192.168.10.99', status: 'Success' },
  { id: 'LOG-008', user: 'forensic.analyst@ccms.gov', role: 'Forensic Analyst', action: 'User Login', date: '2026-08-05', time: '09:22:33', ipAddress: '192.168.10.12', status: 'Success' },
  { id: 'LOG-009', user: 'forensic.analyst@ccms.gov', role: 'Forensic Analyst', action: 'Evidence Upload', date: '2026-08-05', time: '09:25:01', ipAddress: '192.168.10.12', status: 'Success' },
  { id: 'LOG-010', user: 'unknown@ccms.gov', role: 'Admin', action: 'Failed Login Attempt', date: '2026-08-05', time: '09:27:00', ipAddress: '103.22.45.19', status: 'Failed' },
  { id: 'LOG-011', user: 'admin@ccms.gov', role: 'Admin', action: 'Case Creation', date: '2026-08-05', time: '09:28:11', ipAddress: '192.168.10.45', status: 'Success' }
];
