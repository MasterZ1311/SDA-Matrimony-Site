'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Sparkles,
  Check,
  X,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Briefcase,
  ExternalLink,
  Heart,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function MemberCuratedMatchesPage() {
  const {
    curatedSuggestions,
    fetchCuratedSuggestions,
    respondToMatchSuggestion,
    isMatchmakingLoading,
  } = useMatrimonyStore();
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCuratedSuggestions();
  }, [fetchCuratedSuggestions]);

  const handleRespond = async (suggestionId: string, accepted: boolean) => {
    setRespondingId(suggestionId);
    await respondToMatchSuggestion(suggestionId, accepted);
    setRespondingId(null);
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header Banner */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-900)',
              }}
            >
              <Sparkles size={20} color="var(--primary-800)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              Curated for You
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Personal match recommendations thoughtfully introduced by church elders and pastors who know your spiritual background.
          </p>
        </div>

        {/* Curated Matches List */}
        {curatedSuggestions.length === 0 ? (
          <div className="card animate-fade" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Sparkles size={32} color="var(--primary-700)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '8px' }}>
              No Pending Leadership Suggestions
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                maxWidth: '460px',
                margin: '0 auto 20px auto',
                lineHeight: 1.5,
              }}
            >
              When a church pastor or administrator identifies a compatible believer and introduces you with a personal note, their suggestion will appear here for your review.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link href="/discover" className="btn btn-primary" style={{ padding: '8px 22px' }}>
                <Compass size={16} /> Explore Member Directory
              </Link>
              <Link href="/interests" className="btn btn-outline" style={{ padding: '8px 18px' }}>
                <Heart size={16} /> View Expressed Interests
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {curatedSuggestions.map((item) => {
              const candidate = item.otherUser || item.suggestedUser;
              const profile = candidate?.profile;
              const name = profile ? `${profile.firstName} ${profile.lastName}` : 'Adventist Member';
              const location = profile
                ? `${profile.residenceCity}, ${profile.residenceCountry}`
                : 'Adventist Community';

              const photoUrl =
                profile?.photos && profile.photos.length > 0 && profile.photos[0].url
                  ? profile.photos[0].url
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

              const isActing = respondingId === item.id;

              return (
                <div
                  key={item.id}
                  className="card animate-fade"
                  style={{
                    padding: '28px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {/* Candidate Photo */}
                    <div
                      style={{
                        width: '92px',
                        height: '92px',
                        borderRadius: '16px',
                        backgroundImage: `url(${photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                        border: '3px solid #FFFFFF',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    />

                    {/* Member Details */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            href={`/profile/${candidate?.id || item.suggestedUserId}`}
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 800,
                              color: 'var(--primary-900)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {name} <ExternalLink size={14} color="var(--primary-700)" />
                          </Link>
                          {profile?.verificationStatus === 'ADMIN_APPROVED' && (
                            <span className="badge badge-verified" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                              <CheckCircle2 size={12} /> Verified
                            </span>
                          )}
                        </div>

                        <span
                          className="badge badge-gold"
                          style={{
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Sparkles size={12} /> Leadership Suggestion
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '14px',
                          flexWrap: 'wrap',
                          fontSize: '0.825rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '14px',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--primary-700)" /> {location}
                        </span>
                        {profile?.maritalStatus && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Heart size={14} color="var(--primary-700)" /> {profile.maritalStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Admin Note Box */}
                      <div
                        style={{
                          backgroundColor: 'var(--primary-50)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '14px 18px',
                          fontSize: '0.875rem',
                          color: 'var(--primary-900)',
                          marginBottom: '20px',
                          borderLeft: '4px solid var(--accent-gold)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Sparkles size={14} color="var(--primary-800)" />
                          <span
                            style={{
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--primary-800)',
                              letterSpacing: '0.04em',
                            }}
                          >
                            Pastoral & Leadership Recommendation
                          </span>
                        </div>
                        <p style={{ fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                          "{item.adminNote || 'Both of you actively serve the Adventist church and share aligned Christian family expectations. We encourage you to connect.'}"
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <Link
                          href={`/profile/${candidate?.id || item.suggestedUserId}`}
                          className="btn btn-outline"
                          style={{ padding: '7px 16px', fontSize: '0.825rem' }}
                        >
                          View Full Biodata
                        </Link>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <button
                            type="button"
                            disabled={isActing || isMatchmakingLoading}
                            onClick={() => handleRespond(item.id, false)}
                            className="btn btn-outline"
                            style={{
                              padding: '8px 16px',
                              fontSize: '0.825rem',
                              opacity: isActing ? 0.6 : 1,
                            }}
                          >
                            <X size={15} color="var(--text-muted)" /> Politely Decline
                          </button>

                          <button
                            type="button"
                            disabled={isActing || isMatchmakingLoading}
                            onClick={() => handleRespond(item.id, true)}
                            className="btn btn-connect"
                            style={{
                              padding: '8px 20px',
                              fontSize: '0.825rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              opacity: isActing ? 0.6 : 1,
                            }}
                          >
                            {isActing ? (
                              <>
                                <Loader2 size={15} className="animate-spin" /> Processing...
                              </>
                            ) : (
                              <>
                                <Check size={16} /> Accept Introduction
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
