'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMatrimonyStore, VerificationRequest } from '@/stores/matrimonyStore';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Church,
  Mail,
  Phone,
  FileText,
  Search,
  ExternalLink,
  RotateCcw,
  X,
} from 'lucide-react';

export default function AdminVerificationsPage() {
  const { verifications, updateVerificationStatus } = useMatrimonyStore();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASTOR_ENDORSED' | 'ADMIN_APPROVED' | 'SUBMITTED_PENDING_PASTOR' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForModal, setSelectedForModal] = useState<VerificationRequest | null>(null);

  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.candidateName.toLowerCase().includes(q);
        const matchChurch = v.churchName.toLowerCase().includes(q);
        const matchPastor = v.pastorName.toLowerCase().includes(q);
        if (!matchName && !matchChurch && !matchPastor) return false;
      }
      return true;
    });
  }, [verifications, statusFilter, searchQuery]);

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={28} color="var(--primary-700)" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Pastoral & Identity Verification Portal
              </h1>
            </div>
            <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.825rem' }}>
              Church Administration Desk
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Review pastoral recommendations, verify Adventist Church regular standing, and grant the official Verified Member badge.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate, church, or referencing pastor..."
              className="input-control"
              style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'ALL', label: 'All Queue' },
              { id: 'PASTOR_ENDORSED', label: 'Pastor Endorsed' },
              { id: 'ADMIN_APPROVED', label: 'Approved' },
              { id: 'SUBMITTED_PENDING_PASTOR', label: 'Pending Pastor' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Items List */}
        {filteredVerifications.length === 0 ? (
          <div className="card animate-fade" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <ShieldCheck size={44} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
              No Verifications Matching Filters
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
              There are currently no candidates matching the selected status or query.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Filter
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredVerifications.map((item) => (
              <div key={item.id} className="card animate-fade" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                        {item.candidateName}
                      </h3>
                      <Link
                        href={`/profile/${item.candidateId}`}
                        style={{ fontSize: '0.8rem', color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                      >
                        View Profile <ExternalLink size={12} />
                      </Link>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.candidateEmail} • Submitted {item.submittedAt}
                    </span>
                  </div>

                  <div>
                    {item.status === 'ADMIN_APPROVED' ? (
                      <span className="badge badge-verified">
                        <CheckCircle2 size={13} /> Official Verified Member
                      </span>
                    ) : item.status === 'PASTOR_ENDORSED' ? (
                      <span className="badge badge-gold">
                        <Clock size={13} /> Pastor Endorsed • Awaiting Admin Sign-off
                      </span>
                    ) : item.status === 'REJECTED' ? (
                      <span className="badge" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                        <XCircle size={13} /> Request Declined
                      </span>
                    ) : (
                      <span className="badge badge-primary">
                        <Clock size={13} /> Pending Pastor Contact
                      </span>
                    )}
                  </div>
                </div>

                {/* Reference Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '16px',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      <Church size={13} /> Home Church & Conference
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--primary-900)', marginTop: '2px' }}>
                      {item.churchName}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.conferenceName} ({item.divisionName})
                    </p>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      <UserCheck size={13} /> Referencing Pastor / Elder
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--primary-900)', marginTop: '2px' }}>
                      {item.pastorName}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.pastorEmail} • {item.pastorPhone}
                    </p>
                  </div>
                </div>

                {/* Pastoral Statement */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <FileText size={13} /> Pastoral Endorsement Statement
                  </span>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--primary-900)', marginTop: '4px', backgroundColor: '#FFF', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    "{item.referenceNotes}"
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedForModal(item)}
                    className="btn btn-outline"
                    style={{ padding: '6px 14px', fontSize: '0.825rem' }}
                  >
                    <Mail size={14} /> Contact Pastor Directly
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {item.status !== 'ADMIN_APPROVED' ? (
                      <>
                        <button
                          onClick={() => updateVerificationStatus(item.id, 'REJECTED')}
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '0.825rem' }}
                        >
                          <XCircle size={15} color="var(--danger)" /> Reject
                        </button>
                        <button
                          onClick={() => updateVerificationStatus(item.id, 'ADMIN_APPROVED')}
                          className="btn btn-primary"
                          style={{ padding: '8px 20px', fontSize: '0.825rem' }}
                        >
                          <CheckCircle2 size={15} color="var(--accent-gold)" /> Grant "Verified Member" Badge
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => updateVerificationStatus(item.id, 'PASTOR_ENDORSED')}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        Reopen Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pastoral Contact Modal */}
      {selectedForModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 25, 47, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedForModal(null)}
        >
          <div
            className="card animate-fade"
            style={{ width: '100%', maxWidth: '520px', padding: '32px', backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Church size={20} color="var(--primary-700)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  Contact Pastor / Reference
                </h3>
              </div>
              <button
                onClick={() => setSelectedForModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Direct contact details for verifying baptismal standing and church fellowship records:
            </p>

            <div style={{ backgroundColor: 'var(--primary-50)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.875rem' }}>
              <p><strong>Pastor:</strong> {selectedForModal.pastorName}</p>
              <p><strong>Church:</strong> {selectedForModal.churchName}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedForModal.pastorEmail}`} style={{ color: 'var(--primary-700)', textDecoration: 'underline' }}>{selectedForModal.pastorEmail}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${selectedForModal.pastorPhone}`} style={{ color: 'var(--primary-700)' }}>{selectedForModal.pastorPhone}</a></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedForModal(null)}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
