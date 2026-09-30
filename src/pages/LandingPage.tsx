import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ChevronRight, FileText, Lock, ShieldCheck, Shield, Activity, History, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: 'Secure Case Management',
    description: 'Centralize cybercrime complaints, investigations, victims, suspects, and case records.',
    icon: ShieldCheck,
  },
  {
    title: 'Digital Evidence Integrity',
    description: 'Protect evidence using cryptographic hashing and integrity verification.',
    icon: Lock,
  },
  {
    title: 'Chain of Custody',
    description: 'Maintain a complete history of evidence handling and access.',
    icon: History,
  },
  {
    title: 'Investigation Tracking',
    description: 'Track investigation progress, activities, and timelines.',
    icon: Activity,
  },
  {
    title: 'Forensic Analytics',
    description: 'Analyze cases, evidence, crime patterns, and investigation activity.',
    icon: BarChart3,
  },
  {
    title: 'Audit & Accountability',
    description: 'Maintain detailed activity logs for every important system action.',
    icon: FileText,
  },
];

const steps = [
  { id: '01', title: 'Register', description: 'Create and organize a cybercrime case.' },
  { id: '02', title: 'Collect', description: 'Upload and securely manage digital evidence.' },
  { id: '03', title: 'Investigate', description: 'Track investigators, activities, findings, and evidence.' },
  { id: '04', title: 'Resolve', description: 'Generate reports and close the investigation with a complete history.' },
];

const trustFlow = [
  'Evidence',
  'SHA-256 Hash',
  'Chain of Custody',
  'Integrity Verification',
  'Forensic Record',
];

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f1ee', color: '#111111', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #d9d3ce', background: 'rgba(243,241,238,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#111111' }}>
            <div style={{ width: '38px', height: '38px', background: '#111111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: '18px', height: '18px', color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>CyberTrace</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '12px', color: '#4b4a48', flexWrap: 'wrap' }}>
            <a href="#features" style={{ textDecoration: 'none', color: '#4b4a48' }}>Features</a>
            <a href="#security" style={{ textDecoration: 'none', color: '#4b4a48' }}>Security</a>
            <a href="#docs" style={{ textDecoration: 'none', color: '#4b4a48' }}>Documentation</a>
            <a href="#contact" style={{ textDecoration: 'none', color: '#4b4a48' }}>Contact</a>
          </nav>

          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.72rem 1.1rem', borderRadius: '10px', background: '#111111', color: '#ffffff', fontSize: '12px', fontWeight: 700, textDecoration: 'none', border: '1px solid #111111' }}>
            Sign In
          </Link>
        </div>
      </header>

      <main>
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 1.5rem 2rem' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '999px', padding: '0.4rem 0.7rem', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b4a48' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#111111' }} />
                Trusted forensic workflow
              </div>

              <h1 style={{ marginTop: '1.2rem', fontSize: 'clamp(2.8rem, 5vw, 5rem)', lineHeight: '0.96', letterSpacing: '-0.06em', fontWeight: 900 }}>
                CyberTrace
              </h1>

              <h2 style={{ marginTop: '1rem', fontSize: 'clamp(1.1rem, 2vw, 1.75rem)', lineHeight: '1.3', letterSpacing: '-0.04em', fontWeight: 700, color: '#4b4a48' }}>
                Centralized Cyber Crime Case Management and Digital Forensics System
              </h2>

              <p style={{ maxWidth: '620px', marginTop: '1.1rem', color: '#5d5b57', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Securely manage cybercrime cases, digital evidence, investigations, and forensic workflows from a single centralized platform.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '2rem' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#111111', color: '#ffffff', borderRadius: '12px', padding: '0.9rem 1.4rem', fontWeight: 700, textDecoration: 'none', border: '1px solid #111111', boxShadow: '0 16px 30px rgba(17,17,17,0.16)' }}>
                  Sign In
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>
                <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#ffffff', color: '#111111', border: '1px solid #d9d3ce', borderRadius: '12px', padding: '0.9rem 1.4rem', fontWeight: 700, textDecoration: 'none' }}>
                  Explore Features
                </a>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '22px', boxShadow: '0 40px 90px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111111' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d9d3ce' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d9d3ce' }} />
                    </div>
                    <div style={{ background: '#f7f5f1', border: '1px solid #d9d3ce', padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b4a48' }}>
                      Secure Console
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#f7f5f1', border: '1px solid #d9d3ce', borderRadius: '14px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5d5b57' }}>Active cases</div>
                      <div style={{ marginTop: '0.5rem', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.05em' }}>248</div>
                    </div>
                    <div style={{ background: '#111111', borderRadius: '14px', padding: '0.9rem', color: '#ffffff' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Evidence verified</div>
                      <div style={{ marginTop: '0.5rem', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.05em' }}>98.4%</div>
                    </div>
                  </div>

                  <div style={{ background: '#f7f5f1', border: '1px solid #d9d3ce', borderRadius: '14px', padding: '0.9rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b4a48' }}>
                      <span>Investigation timeline</span>
                      <span>Last 6 months</span>
                    </div>
                    <div style={{ height: '120px', display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                      {[40, 58, 44, 76, 64, 92].map((height, i) => (
                        <div key={i} style={{ flex: 1, height: `${height}%`, background: i % 2 === 0 ? '#d9d3ce' : '#111111', borderRadius: '999px 999px 0 0' }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', paddingBottom: '1rem' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '14px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5d5b57', marginBottom: '0.7rem' }}>Case queue</div>
                      {[{ title: 'CC-2026-0148', status: 'Investigating' }, { title: 'CC-2026-0145', status: 'Pending' }, { title: 'CC-2026-0139', status: 'Closed' }].map((item) => (
                        <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid #f1efeb' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#111111' }}>{item.title}</span>
                          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#4b4a48', background: '#f7f5f1', border: '1px solid #d9d3ce', padding: '0.2rem 0.45rem', borderRadius: '6px' }}>{item.status}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: '#f7f5f1', border: '1px solid #d9d3ce', borderRadius: '14px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5d5b57', marginBottom: '0.7rem' }}>Evidence integrity</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
                        <span style={{ fontSize: '11px', color: '#4b4a48' }}>SHA-256</span>
                        <span style={{ fontSize: '10px', color: '#111111', fontWeight: 700 }}>Verified</span>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: '86%', height: '100%', background: '#111111' }} />
                      </div>
                      <div style={{ marginTop: '0.8rem', fontSize: '10px', color: '#5d5b57', lineHeight: 1.5 }}>
                        Chain of custody maintained across collection, access, transfer, and verification events.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.4rem' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5d5b57' }}>Platform features</p>
            <h3 style={{ marginTop: '0.6rem', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.05em', fontWeight: 800 }}>Built for secure digital investigations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.2rem' }}>
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} style={{ background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '18px', padding: '1.4rem', boxShadow: '0 18px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '42px', height: '42px', background: '#f7f5f1', border: '1px solid #d9d3ce', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}>
                  <Icon style={{ width: '18px', height: '18px', color: '#111111' }} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.45rem' }}>{title}</h4>
                <p style={{ fontSize: '0.96rem', color: '#5d5b57', lineHeight: 1.7, margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5d5b57' }}>How it works</p>
            <h3 style={{ marginTop: '0.6rem', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.05em', fontWeight: 800 }}>From intake to resolution</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1rem' }}>
            {steps.map((step) => (
              <div key={step.id} style={{ padding: '1.2rem', background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', color: '#5d5b57', marginBottom: '0.9rem' }}>{step.id}</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#5d5b57', lineHeight: 1.65, margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 1.5rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #d9d3ce', borderRadius: '24px', padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.04)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2rem', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5d5b57' }}>Forensic trust</p>
                <h3 style={{ marginTop: '0.65rem', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.05em', fontWeight: 800 }}>Built for Digital Evidence Integrity</h3>
                <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#5d5b57', lineHeight: 1.75 }}>
                  Every evidence artifact can be tracked through its lifecycle to ensure authenticity, accountability, and defensible investigation outcomes.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
                {trustFlow.map((item, index) => (
                  <React.Fragment key={item}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#111111', boxShadow: '0 0 0 5px rgba(17,17,17,0.06)' }} />
                      <div style={{ background: '#f7f5f1', border: '1px solid #d9d3ce', borderRadius: '12px', padding: '0.7rem 1rem', minWidth: '220px', fontSize: '0.96rem', fontWeight: 600, color: '#111111' }}>
                        {item}
                      </div>
                    </div>
                    {index < trustFlow.length - 1 && (
                      <ChevronRight style={{ width: '18px', height: '18px', color: '#5d5b57', marginLeft: '5px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 2rem' }}>
          <div style={{ background: '#111111', borderRadius: '26px', padding: '2.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, letterSpacing: '-0.04em' }}>Ready to manage cybercrime investigations more efficiently?</p>
            </div>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#ffffff', color: '#111111', borderRadius: '12px', padding: '0.9rem 1.4rem', fontWeight: 800, textDecoration: 'none', border: '1px solid #ffffff' }}>
              Sign In to CyberTrace
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </section>
      </main>

      <footer id="docs" style={{ borderTop: '1px solid #d9d3ce', background: 'rgba(255,255,255,0.12)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 3rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.7rem' }}>
              <div style={{ width: '34px', height: '34px', background: '#111111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield style={{ width: '16px', height: '16px', color: '#ffffff' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>CyberTrace</div>
            </div>
            <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: '#5d5b57', margin: 0 }}>Centralized Cyber Crime Case Management and Digital Forensics System</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', color: '#4b4a48', fontSize: '0.95rem' }}>
            <a href="#features" style={{ textDecoration: 'none', color: '#4b4a48' }}>Features</a>
            <a href="#security" style={{ textDecoration: 'none', color: '#4b4a48' }}>Security</a>
            <a href="#docs" style={{ textDecoration: 'none', color: '#4b4a48' }}>Documentation</a>
            <a id="contact" href="mailto:hello@cybertrace.gov" style={{ textDecoration: 'none', color: '#4b4a48' }}>Contact</a>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 2rem', borderTop: '1px solid #d9d3ce' }}>
          <div style={{ paddingTop: '1rem', fontSize: '0.82rem', color: '#5d5b57' }}>© 2026 CyberTrace. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
