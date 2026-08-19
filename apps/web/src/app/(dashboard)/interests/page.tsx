'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Heart,
  Check,
  X,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Compass,
} from 'lucide-react';

export default function InterestsPage() {
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const { interests, updateInterestStatus, withdrawInterest } = useMatrimonyStore();

  const receivedList = interests.filter((i) => i.type === 'RECEIVED');
  const sentList = interests.filter((i) => i.type === 'SENT');

  const currentList = tab === 'received' ? receivedList : sentList;

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Express Interest Hub
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage mutual connections and expressions of interest in Adventist matrimonial courtship.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            onClick={() => setTab('received')}
            style={{
              padding: '10px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === 'received' ? '2px solid var(--primary-800)' : '2px solid transparent',
              color: tab === 'received' ? 'var(--primary-900)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Received Interests
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: tab === 'received' ? 'var(--primary-100)' : '#E2E8F0',
                color: tab === 'received' ? 'var(--primary-800)' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              {receivedList.length}
            </span>
          </button>

          <button
            onClick={() => setTab('sent')}
            style={{
              padding: '10px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === 'sent' ? '2px solid var(--primary-800)' : '2px solid transparent',
              color: tab === 'sent' ? 'var(--primary-900)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Sent Requests
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: tab === 'sent' ? 'var(--primary-100)' : '#E2E8F0',
                color: tab === 'sent' ? 'var(--primary-800)' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              {sentList.length}
            </span>
          </button>
        </div>

        {/* Interests List */}
        {currentList.length === 0 ? (
          <div className="card animate-fade" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <Heart size={44} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
              No {tab === 'received' ? 'Received Interests' : 'Sent Requests'} Yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              {tab === 'received'
                ? 'When other Seventh-day Adventist members express matrimonial interest in your profile, their requests will appear here.'
                : 'You have not sent any interest requests yet. Browse verified Adventist candidates to start connecting.'}
            </p>
            <Link href="/discover" className="btn btn-primary" style={{ padding: '8px 20px' }}>
              <Compass size={16} /> Explore Adventist Candidates
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {currentList.map((item) => (
              <div key={item.id} className="card animate-fade" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <Link
                        href={`/profile/${item.candidateId}`}
                        style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)', textDecoration: 'none' }}
                      >
                        {item.candidateName}, {item.candidateAge}
                      </Link>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {item.date}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      {item.candidateOccupation} • {item.candidateLocation}
                    </p>

                    <div
                      style={{
                        backgroundColor: 'var(--primary-50)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                        color: 'var(--primary-900)',
                        fontStyle: 'italic',
                        marginBottom: '16px',
                        borderLeft: '3px solid var(--primary-700)',
                      }}
                    >
                      "{item.introMessage}"
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <span className="badge badge-primary">
                        {item.candidateDivision}
                      </span>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {item.type === 'RECEIVED' ? (
                          <>
                            {item.status === 'PENDING' ? (
                              <>
                                <button
                                  onClick={() => updateInterestStatus(item.id, 'DECLINED')}
                                  className="btn btn-outline"
                                  style={{ padding: '6px 14px', fontSize: '0.825rem' }}
                                >
                                  <X size={14} /> Decline
                                </button>
                                <button
                                  onClick={() => updateInterestStatus(item.id, 'ACCEPTED')}
                                  className="btn btn-gold"
                                  style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                                >
                                  <Check size={14} /> Accept & Unlock Chat
                                </button>
                              </>
                            ) : item.status === 'ACCEPTED' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="badge badge-verified">
                                  <CheckCircle2 size={13} /> Mutually Accepted
                                </span>
                                <Link
                                  href="/messages"
                                  className="btn btn-primary"
                                  style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                                >
                                  <MessageSquare size={14} /> Open Private Chat
                                </Link>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Declined</span>
                            )}
                          </>
                        ) : (
                          // Sent tab
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item.status === 'ACCEPTED' ? (
                              <>
                                <span className="badge badge-verified">
                                  <CheckCircle2 size={13} /> Accepted by Member
                                </span>
                                <Link
                                  href="/messages"
                                  className="btn btn-primary"
                                  style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                                >
                                  <MessageSquare size={14} /> Chat
                                </Link>
                              </>
                            ) : item.status === 'DECLINED' ? (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Request Declined</span>
                            ) : (
                              <>
                                <span className="badge badge-gold">
                                  <Clock size={12} /> Awaiting Response
                                </span>
                                <button
                                  onClick={() => withdrawInterest(item.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)' }}
                                  title="Withdraw expression"
                                >
                                  <Trash2 size={13} /> Withdraw
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
