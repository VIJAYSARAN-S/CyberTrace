import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Shield, Lock, Mail, ChevronRight, Activity, Globe, Zap, CheckCircle } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
  role: 'Admin' | 'Investigator' | 'Forensic Analyst';
}

const featureItems = [
  { icon: Shield, label: 'End-to-End Encrypted', desc: 'Military-grade AES-256 case data encryption' },
  { icon: Activity, label: 'Real-time Monitoring', desc: 'Live case activity and alert notifications' },
  { icon: Globe, label: 'INTERPOL Integrated', desc: 'Cross-border cybercrime coordination' },
  { icon: Zap, label: 'AI-Assisted Analysis', desc: 'Automated pattern recognition and threat scoring' },
];

const stats = [
  { label: 'Active Cases', value: '2,847' },
  { label: 'Investigators', value: '342' },
  { label: 'Evidence Items', value: '18.4K' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export const Login: React.FC = () => {
  const { login } = useDb();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: 'admin@cybertrace.gov', role: 'Admin' }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const success = login(data.email, data.email.split('@')[0].toUpperCase(), data.role);
    if (success) {
      showToast('Authentication successful. Welcome back.', 'success');
      navigate('/dashboard');
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#f3f1ee', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glows */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          display: 'none',
          width: '50%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
          position: 'relative',
          zIndex: 1,
          borderRight: '1px solid rgba(99,130,255,0.08)'
        }}
        className="lg:flex"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#111111',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(59,130,246,0.15)'
          }}>
            <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ color: '#111111', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              CyberTrace
            </h1>
            <p style={{ color: '#5d5b57', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Centralized Forensics &amp; Case Management
            </p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h2 style={{ color: '#111111', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            CyberTrace<br />
            <span style={{ background: '#111111', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Forensic Portal
            </span>
          </h2>
          <p style={{ color: '#5d5b57', fontSize: '13px', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2rem' }}>
            Centralized cyber crime incident management platform and digital forensics system. Secure. Defensible. Scalable.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '9px', fontWeight: 600, color: '#5d5b57', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.3rem' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Feature items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {featureItems.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <f.icon style={{ width: '15px', height: '15px', color: '#60a5fa' }} />
                </div>
                <div>
                  <p style={{ color: '#111111', fontSize: '11.5px', fontWeight: 600 }}>{f.label}</p>
                  <p style={{ color: '#5d5b57', fontSize: '10px', marginTop: '0.1rem' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p style={{ color: '#111111', fontSize: '9.5px', fontWeight: 500, letterSpacing: '0.02em' }}>
          © 2026 CyberTrace – Centralized Cyber Crime Case Management and Digital Forensics System. All Rights Reserved.
        </p>
      </motion.div>

      {/* Right Panel – Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: '420px' }}
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }} className="lg:hidden">
            <div style={{
              width: '40px', height: '40px',
              background: '#111111',
              borderRadius: '11px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>
              <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ color: '#111111', fontWeight: 900, fontSize: '18px' }}>CyberTrace</h1>
              <p style={{ color: '#5d5b57', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Case Management &amp; Forensics Portal</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.01em' }}>Secure Sign In</h2>
            <p style={{ color: '#5d5b57', fontSize: '12px', marginTop: '0.35rem' }}>
              Enter your authorized credentials to access the case management portal.
            </p>
          </motion.div>

          {/* Security notice */}
          <motion.div variants={itemVariants} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem'
          }}>
            <Lock style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '10.5px', color: '#b45309', fontWeight: 500, lineHeight: 1.5 }}>
              Restricted access. All activity is monitored and logged under Federal Sec. §45-C.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4b4a48', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Official Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#5d5b57' }} />
                <input
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email.' }
                  })}
                  type="email"
                  placeholder="officer@cybertrace.gov"
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.7rem',
                    paddingBottom: '0.7rem',
                    background: 'rgba(17,17,17,0.03)',
                    border: errors.email ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#111111',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 150ms ease'
                  }}
                />
              </div>
              {errors.email && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '0.35rem', fontWeight: 500 }}>{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4b4a48', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Access Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#5d5b57' }} />
                <input
                  {...register('password', {
                    required: 'Passcode is required.',
                    minLength: { value: 6, message: 'Minimum 6 characters.' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.75rem',
                    paddingTop: '0.7rem',
                    paddingBottom: '0.7rem',
                    background: 'rgba(17,17,17,0.03)',
                    border: errors.password ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#111111',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 150ms ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5d5b57',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '0.35rem', fontWeight: 500 }}>{errors.password.message}</p>}
            </motion.div>

            {/* Role */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#4b4a48', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Access Role
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  {...register('role')}
                  style={{
                    width: '100%',
                    paddingLeft: '1rem',
                    paddingRight: '2rem',
                    paddingTop: '0.7rem',
                    paddingBottom: '0.7rem',
                    background: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#111111',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <option value="Admin">System Administrator</option>
                  <option value="Investigator">Cyber Investigator</option>
                  <option value="Forensic Analyst">Forensic Analyst</option>
                </select>
                <ChevronRight style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', width: '14px', height: '14px', color: '#5d5b57', pointerEvents: 'none' }} />
              </div>
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11.5px', color: '#4b4a48', fontWeight: 500 }}>Remember this device</span>
              </label>
              <button type="button" style={{ fontSize: '11.5px', color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot credentials?
              </button>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: isLoading ? 'rgba(17,17,17,0.16)' : '#111111',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(99,130,255,0.3)',
                  boxShadow: isLoading ? 'none' : '0 4px 20px rgba(17,17,17,0.12)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 200ms ease',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em'
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>Authenticate & Enter Portal <ChevronRight style={{ width: '15px', height: '15px' }} /></>
                )}
              </button>
            </motion.div>

            {/* Demo hint */}
            <motion.div variants={itemVariants} style={{
              background: 'rgba(16,185,129,0.05)',
              border: '1px solid rgba(16,185,129,0.12)',
              borderRadius: '10px',
              padding: '0.75rem 1rem'
            }}>
              <p style={{ fontSize: '10.5px', color: '#5d5b57', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle style={{ width: '12px', height: '12px', color: '#10b981', flexShrink: 0 }} />
                <span>Demo: Use <strong style={{ color: '#4b4a48' }}>admin@cybertrace.gov</strong> + any 6-char password</span>
              </p>
            </motion.div>
          </form>

          <motion.p
            variants={itemVariants}
            style={{ textAlign: 'center', fontSize: '10px', color: '#111111', marginTop: '1.75rem', fontWeight: 400, lineHeight: 1.6 }}
          >
            Unauthorized access attempts are punishable under the Information Technology Act, 2000.<br />
            Session activity is recorded for security purposes.
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
