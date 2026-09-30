import React from 'react';
import { useDb } from '../context/DbContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Palette, 
  Terminal
} from 'lucide-react';

interface ProfileInput {
  name: string;
  email: string;
}

interface PasswordInput {
  currentPass: string;
  newPass: string;
  confirmPass: string;
}

export const Settings: React.FC = () => {
  const { currentUser, logAction } = useDb();
  const { showToast } = useToast();

  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm<ProfileInput>({
    defaultValues: {
      name: currentUser?.name || 'Administrator',
      email: currentUser?.email || 'admin@cybertrace.gov'
    }
  });

  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm<PasswordInput>();

  const onProfileSave = (data: ProfileInput) => {
    logAction(`Profile updated: Name=${data.name}, Email=${data.email}`, 'Success');
    showToast('Officer profile parameters updated in central roster.', 'success');
  };

  const onPasswordSave = (data: PasswordInput) => {
    if (data.newPass !== data.confirmPass) {
      showToast('Error: Passcode confirmation does not match.', 'error');
      return;
    }
    if (data.newPass.length < 6) {
      showToast('Error: New passcode must be at least 6 characters.', 'error');
      return;
    }

    logAction('Account passcode modified', 'Success');
    showToast('Secure credentials rotated successfully.', 'success');
    resetPassword();
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3b82f6, #6366f1)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Terminal Settings
            </h1>
          </div>
          <p style={{ fontSize: '11.5px', fontWeight: 400, color: '#5d5b57', marginLeft: '0.625rem', letterSpacing: '0.01em' }}>
            Configure profile credentials, passcode rotations, alert priorities, and security parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]" style={{ gap: '1.25rem' }}>
        
        {/* Left Columns: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Profile Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <User style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
              Officer Profile Credentials
            </h3>
            <form onSubmit={handleProfileSubmit(onProfileSave)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Official Name</label>
                  <input
                    type="text"
                    {...regProfile('name', { required: true })}
                    className="flat-input"
                  />
                </div>
                <div>
                  <label className="form-label">Assigned Email Coordinate</label>
                  <input
                    type="email"
                    {...regProfile('email', { required: true })}
                    className="flat-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="flat-btn-primary"
                  style={{ fontSize: '11.5px' }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Rotation Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <Lock style={{ width: '14px', height: '14px', color: '#6366f1' }} />
              Rotation of Tactical Passcode
            </h3>
            <form onSubmit={handlePasswordSubmit(onPasswordSave)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Current Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...regPassword('currentPass', { required: true })}
                    className="flat-input"
                  />
                </div>
                <div>
                  <label className="form-label">New Secure Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...regPassword('newPass', { required: true })}
                    className="flat-input"
                  />
                </div>
                <div>
                  <label className="form-label">Re-Confirm Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...regPassword('confirmPass', { required: true })}
                    className="flat-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="flat-btn-primary"
                  style={{ fontSize: '11.5px' }}
                >
                  Commit Passcode Rotation
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Security and Theme Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Alerts Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <Bell style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
              Alerts & Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px', color: '#4b4a48', fontWeight: 550 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer', marginTop: '1px' }}
                />
                <span style={{ lineHeight: 1.4 }}>Email notifications upon case assignment</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer', marginTop: '1px' }}
                />
                <span style={{ lineHeight: 1.4 }}>Push banners on CRITICAL/High threats</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer', marginTop: '1px' }}
                />
                <span style={{ lineHeight: 1.4 }}>Receive weekly tactical caseload digests</span>
              </label>
            </div>
          </div>

          {/* Secure Theme Enforced */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <Palette style={{ width: '14px', height: '14px', color: '#a5b4fc' }} />
              Appearance Directive
            </h3>
            <div style={{
              background: 'rgba(99,130,255,0.06)',
              border: '1px solid rgba(99,130,255,0.15)',
              borderRadius: '10px',
              padding: '0.75rem 1rem'
            }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#111111', letterSpacing: '0.05em', display: 'block', textTransform: 'uppercase' }}>Theme Directive</span>
              <p style={{ fontSize: '11.5px', color: '#4b4a48', lineHeight: 1.5, fontWeight: 500, marginTop: '0.25rem' }}>
                SYSTEM LOCK: CyberTrace Secure Forensic Theme is active. Visual profiles are managed by tactical command policy.
              </p>
            </div>
          </div>

          {/* Session limits */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#34d399' }} />
              Security Policy Controls
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Terminal Idle Timeout</label>
                <select
                  defaultValue="15"
                  className="form-select"
                  style={{ background: '#f3f1ee', fontSize: '12px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                >
                  <option value="5">5 Minutes Inactivity</option>
                  <option value="15">15 Minutes Inactivity (Standard)</option>
                  <option value="30">30 Minutes Inactivity</option>
                </select>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#4b4a48', fontWeight: 550, cursor: 'pointer' }}>
                <span>Enforce 2-Factor Authentication</span>
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '15px', height: '15px', accentColor: '#3b82f6', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
