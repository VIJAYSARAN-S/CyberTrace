import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    icon: CheckCircle,
    iconColor: '#34d399',
    border: 'rgba(16,185,129,0.25)',
    bg: 'rgba(16,185,129,0.08)',
    topLine: 'rgba(16,185,129,0.5)'
  },
  error: {
    icon: AlertCircle,
    iconColor: '#f87171',
    border: 'rgba(239,68,68,0.25)',
    bg: 'rgba(239,68,68,0.08)',
    topLine: 'rgba(239,68,68,0.5)'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: '#fbbf24',
    border: 'rgba(245,158,11,0.25)',
    bg: 'rgba(245,158,11,0.08)',
    topLine: 'rgba(245,158,11,0.5)'
  },
  info: {
    icon: Info,
    iconColor: '#60a5fa',
    border: 'rgba(59,130,246,0.25)',
    bg: 'rgba(59,130,246,0.08)',
    topLine: 'rgba(17,17,17,0.16)'
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => { removeToast(id); }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}

      {/* Toast Panel */}
      <div style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '360px',
        width: '100%',
        fontFamily: 'Inter, sans-serif'
      }}>
        <AnimatePresence>
          {toasts.map((toast) => {
            const cfg = toastConfig[toast.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: '#ffffff',
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${cfg.topLine}, transparent)`
                }} />

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: cfg.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon style={{ width: '15px', height: '15px', color: cfg.iconColor }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12.5px', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    background: 'none',
                    border: 'none',
                    color: '#5d5b57',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.04)'; (e.currentTarget as HTMLElement).style.color = '#5d5b57'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#5d5b57'; }}
                >
                  <X style={{ width: '13px', height: '13px' }} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
