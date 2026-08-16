import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconBorder: 'rgba(239, 68, 68, 0.25)',
      iconColor: '#f87171',
      btnBg: 'rgba(239,68,68,0.15)',
      btnHoverBg: 'rgba(239,68,68,0.25)',
      btnColor: '#f87171',
      btnBorder: 'rgba(239,68,68,0.3)',
      accentColor: 'rgba(239,68,68,0.3)'
    },
    warning: {
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconBorder: 'rgba(245, 158, 11, 0.25)',
      iconColor: '#fbbf24',
      btnBg: 'rgba(245,158,11,0.15)',
      btnHoverBg: 'rgba(245,158,11,0.25)',
      btnColor: '#fbbf24',
      btnBorder: 'rgba(245,158,11,0.3)',
      accentColor: 'rgba(245,158,11,0.3)'
    },
    info: {
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconBorder: 'rgba(59, 130, 246, 0.25)',
      iconColor: '#60a5fa',
      btnBg: 'rgba(59,130,246,0.15)',
      btnHoverBg: 'rgba(59,130,246,0.25)',
      btnColor: '#60a5fa',
      btnBorder: 'rgba(59,130,246,0.3)',
      accentColor: 'rgba(59,130,246,0.3)'
    }
  };

  const cfg = typeConfig[type];
  const Icon = type === 'info' ? Info : AlertTriangle;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)'
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              background: '#ffffff',
              border: `1px solid ${cfg.accentColor}`,
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)`
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                background: cfg.iconBg,
                border: `1px solid ${cfg.iconBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon style={{ width: '18px', height: '18px', color: cfg.iconColor }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111111', lineHeight: 1.3 }}>{title}</h3>
                <p style={{ marginTop: '0.5rem', fontSize: '12.5px', color: '#4b4a48', lineHeight: 1.6 }}>{message}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.625rem' }}>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6b7280',
                  background: 'rgba(17,17,17,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.05)'; (e.currentTarget as HTMLElement).style.color = '#5d5b57'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.03)'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => { onConfirm(); onCancel(); }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: cfg.btnColor,
                  background: cfg.btnBg,
                  border: `1px solid ${cfg.btnBorder}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = cfg.btnHoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = cfg.btnBg)}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
