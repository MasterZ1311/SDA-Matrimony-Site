'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, UserCheck, Church, Mail, Phone, FileText } from 'lucide-react';

interface VerificationItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  churchName: string;
  conferenceName: string;
  pastorName: string;
  pastorEmail: string;
  pastorPhone: string;
  referenceNotes: string;
  status: 'SUBMITTED_PENDING_PASTOR' | 'PASTOR_ENDORSED' | 'ADMIN_APPROVED' | 'REJECTED';
  submittedAt: string;
}

const mockVerifications: VerificationItem[] = [
  {
    id: 'ver-1',
    candidateName: 'David Miller',
    candidateEmail: 'david.miller@sda-matrimony.test',
    churchName: 'Loma Linda University Church',
    conferenceName: 'Southeastern California Conference',
    pastorName: 'Pastor Randy Roberts',
    pastorEmail: 'pastor.randy@lluc.org',
    pastorPhone: '+1 (909) 558-4570',
    referenceNotes: 'Brother David has been in good and regular standing, serves actively in Sabbath school and medical missionary work.',
    status: 'PASTOR_ENDORSED',
    submittedAt: 'August 14, 2026',
  },
  {
    id: 'ver-2',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@sda-matrimony.test',
    churchName: 'Spencerville SDA Church',
    conferenceName: 'Chesapeake Conference',
    pastorName: 'Pastor Chad Stuart',
    pastorEmail: 'pastor.chad@spencervillechurch.org',
    pastorPhone: '+1 (301) 384-2920',
    referenceNotes: 'Sister Sarah is an exemplary educator and youth leader. Highly recommended for godly Adventist courtship.',
    status: 'ADMIN_APPROVED',
    submittedAt: 'August 10, 2026',
  },
];

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationItem[]>(mockVerifications);

  const handleDecision = (id: string, newStatus: 'ADMIN_APPROVED' | 'REJECTED') => {
    setVerifications(
      verifications.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} color="var(--primary-700)" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Pastoral & Identity Verification Queue
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Review pastoral endorsements and confirm member verified badges for matrimonial integrity.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {verifications.map((item) => (
            <div key={item.id} className="card animate-fade" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    {item.candidateName}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {item.candidateEmail}
                  </span>
                </div>

                <div>
                  {item.status === 'ADMIN_APPROVED' ? (
                    <span className="badge badge-verified">
                      <CheckCircle2 size={13} /> Official Verified Member
                    </span>
                  ) : item.status === 'PASTOR_ENDORSED' ? (
                    <span className="badge badge-gold">
                      <Clock size={13} /> Pastor Endorsed • Awaiting Final Approval
                    </span>
                  ) : (
                    <span className="badge badge-primary">
                      <Clock size={13} /> Pending Pastor Contact
                    </span>
                  )}
                </div>
              </div>

              {/* Reference Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                backgroundColor: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '18px',
                fontSize: '0.875rem',
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Church size={13} /> HOME CHURCH & CONFERENCE
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--primary-900)', marginTop: '2px' }}>
                    {item.churchName} ({item.conferenceName})
                  </p>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <UserCheck size={13} /> REFERENCING PASTOR
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--primary-900)', marginTop: '2px' }}>
                    {item.pastorName}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {item.pastorEmail} • {item.pastorPhone}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                  <FileText size={13} /> PASTORAL ENDORSEMENT STATEMENT
                </span>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--primary-900)', marginTop: '4px' }}>
                  "{item.referenceNotes}"
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {item.status !== 'ADMIN_APPROVED' && (
                  <>
                    <button
                      onClick={() => handleDecision(item.id, 'REJECTED')}
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <XCircle size={15} color="var(--danger)" /> Reject Request
                    </button>
                    <button
                      onClick={() => handleDecision(item.id, 'ADMIN_APPROVED')}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                    >
                      <CheckCircle2 size={15} color="var(--accent-gold)" /> Grant "Verified Member" Badge
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
