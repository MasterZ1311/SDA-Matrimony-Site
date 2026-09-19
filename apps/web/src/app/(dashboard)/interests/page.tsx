'use client';

import React, { useState, useEffect } from 'react';
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
  Star,
  Eye,
  Building2,
  Church,
  Sparkles,
} from 'lucide-react';

export default function InterestsPage() {
  const [tab, setTab] = useState<'received' | 'sent' | 'shortlisted'>('received');
  const {
    interests,
    candidates,
    shortlist,
    fetchCandidates,
    fetchShortlist,
    toggleShortlist,
    updateInterestStatus,
    withdrawInterest,
    expressInterest,
  } = useMatrimonyStore();

  useEffect(() => {
    fetchCandidates();
    fetchShortlist();
  }, [fetchCandidates, fetchShortlist]);

  const receivedList = interests.filter((i) => i.type === 'RECEIVED');
  const sentList = interests.filter((i) => i.type === 'SENT');
  const shortlistedCandidates = candidates.filter((c) => shortlist.includes(c.id));

  const isSent = (candidateId: string) => {
    return interests.some((i) => i.candidateId === candidateId && i.type === 'SENT');
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Express Interest Hub
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage mutual connections, received proposals, and profiles saved for prayerful consideration.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px', overflowX: 'auto' }}>
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
              whiteSpace: 'nowrap',
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
              whiteSpace: 'nowrap',
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

          <button
            onClick={() => setTab('shortlisted')}
            style={{
              padding: '10px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === 'shortlisted' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: tab === 'shortlisted' ? 'var(--primary-900)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Star size={16} fill={tab === 'shortlisted' ? 'var(--accent-gold)' : 'none'} color="var(--accent-gold)" />
            Shortlisted (Prayerful)
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: tab === 'shortlisted' ? 'rgba(200, 155, 60, 0.2)' : '#E2E8F0',
                color: tab === 'shortlisted' ? 'var(--accent-gold-dark, #8C6A1E)' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              {shortlistedCandidates.length}
            </span>
          </button>
        </div>

        {/* Tab 3: Shortlisted Profiles */}
        {tab === 'shortlisted' ? (
          shortlistedCandidates.length === 0 ? (
            <div className="card animate-fade" style={{ padding: '50px 20px', textAlign: 'center' }}>
              <Star size={44} color="var(--accent-gold)" style={{ margin: '0 auto 16px auto', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
                No Shortlisted Candidates Yet
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                Star profiles on the Discover page to save them for personal prayer, parental consultation, and consideration.
              </p>
              <Link href="/discover" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <Compass size={16} /> Browse Adventist Candidates
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {shortlistedCandidates.map((candidate) => {
                const sent = isSent(candidate.id);

                return (
                  <div key={candidate.id} className="card animate-fade" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '12px',
                          backgroundImage: `url(${candidate.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        {candidate.isPastoralVerified && (
                          <div style={{ position: 'absolute', bottom: '-6px', right: '-6px' }}>
                            <span className="badge badge-verified" style={{ padding: '2px 4px', fontSize: '0.65rem' }}>
                              <CheckCircle2 size={10} />
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <Link
                              href={`/profile/${candidate.id}`}
                              style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)', textDecoration: 'none' }}
                            >
                              {candidate.name}, {candidate.age} yrs
                            </Link>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                              {candidate.occupation} • {candidate.city}, {candidate.country}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                              <Sparkles size={11} /> {candidate.compatibilityScore}% Match
                            </span>
                            <button
                              onClick={() => toggleShortlist(candidate.id)}
                              className="btn btn-outline"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                              title="Remove from shortlist"
                            >
                              <X size={13} /> Remove
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', margin: '12px 0', flexWrap: 'wrap' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            <Building2 size={12} /> {candidate.division.split(' ')[0]} Division
                          </span>
                          <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                            <Church size={12} /> {candidate.localChurch}
                          </span>
                          <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                            🥗 {candidate.diet}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px' }}>
                          "{candidate.bioSnippet}"
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <Link
                            href={`/profile/${candidate.id}`}
                            className="btn btn-outline"
                            style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                          >
                            <Eye size={14} /> Full Biodata
                          </Link>
                          <button
                            onClick={() => expressInterest(candidate.id)}
                            disabled={sent}
                            className={sent ? 'btn btn-outline' : 'btn btn-connect'}
                            style={{ padding: '6px 18px', fontSize: '0.825rem', fontWeight: 700 }}
                          >
                            <Heart size={14} fill={sent ? 'none' : '#FFFFFF'} />
                            {sent ? 'Interest Sent' : 'Express Interest'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Tabs 1 & 2: Received or Sent Interests */
          (tab === 'received' ? receivedList : sentList).length === 0 ? (
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
              {(tab === 'received' ? receivedList : sentList).map((item) => (
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
                                    className="btn btn-connect"
                                    style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                                  >
                                    <Check size={14} /> Accept & Connect
                                  </button>
                                </>
                              ) : item.status === 'ACCEPTED' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span className="badge badge-verified">
                                    <CheckCircle2 size={13} /> Mutually Accepted
                                  </span>
                                  <Link
                                    href="/messages"
                                    className="btn btn-connect"
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
          )
        )}
      </div>
    </div>
  );
}
