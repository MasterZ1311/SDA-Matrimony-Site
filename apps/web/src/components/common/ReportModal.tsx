'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { useMatrimonyStore } from '@/stores/matrimonyStore';

interface ReportModalProps {
  candidateId: string;
  candidateName: string;
  onClose: () => void;
  onBlocked?: () => void;
}

const REPORT_REASONS = [
  'Inappropriate Behavior / Communication',
  'Fake Profile / False Identity',
  'Commercial Solicitation / Financial Scam',
  'Non-Adventist Misrepresentation',
  'Harassment or Unwanted Messages',
  'Safety or Boundary Concern',
  'Other Pastoral Concern',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  candidateId,
  candidateName,
  onClose,
  onBlocked,
}) => {
  const { reportCandidate, blockCandidate } = useMatrimonyStore();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reportCandidate(candidateId, reason, details);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlock = async () => {
    if (
      !window.confirm(
        `Are you sure you want to block ${candidateName}? They will no longer appear in your searches, and all communication will be blocked.`
      )
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await blockCandidate(candidateId);
      if (onBlocked) onBlocked();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', margin: 0 }}>
                Safety & Pastoral Report
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                Confidential review regarding {candidateName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#16A34A', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
              Report Received
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '340px', margin: '0 auto' }}>
              Your concern has been submitted confidentially to Pastoral Administration. Thank you for helping keep our Adventist community safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReport} style={{ padding: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--primary-900)',
                  marginBottom: '6px',
                }}
              >
                Reason for Safety Concern *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem',
                  color: '#1E293B',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--primary-900)',
                  marginBottom: '6px',
                }}
              >
                Confidential Context (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide any additional details or messages that will assist pastoral review..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem',
                  color: '#1E293B',
                  resize: 'vertical',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#64748B',
                marginBottom: '24px',
              }}
            >
              <Lock size={14} style={{ flexShrink: 0, color: '#94A3B8' }} />
              <span>Reports are strictly confidential and reviewed by Pastoral Administration.</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '16px',
              }}
            >
              <button
                type="button"
                onClick={handleBlock}
                disabled={submitting}
                style={{
                  background: 'none',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Block Member
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#DC2626',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
