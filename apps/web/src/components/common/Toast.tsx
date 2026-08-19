'use client';

import React from 'react';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMatrimonyStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="animate-fade"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${
                isSuccess
                  ? '#86EFAC'
                  : isError
                  ? '#FCA5A5'
                  : isWarning
                  ? '#FCD34D'
                  : 'var(--border-subtle)'
              }`,
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-main)',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {isSuccess ? (
                <CheckCircle2 size={18} color="var(--success)" />
              ) : isError ? (
                <AlertCircle size={18} color="var(--danger)" />
              ) : isWarning ? (
                <AlertTriangle size={18} color="var(--warning)" />
              ) : (
                <Info size={18} color="var(--primary-700)" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: isError ? 'var(--danger)' : 'var(--primary-900)',
                  marginBottom: toast.description ? '2px' : 0,
                }}
              >
                {toast.title}
              </h4>
              {toast.description && (
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
