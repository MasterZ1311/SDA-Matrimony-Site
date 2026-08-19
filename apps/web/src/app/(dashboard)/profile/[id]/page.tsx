'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { useAuthStore } from '@/stores/authStore';
import { BiodataModal } from '@/components/common/BiodataModal';
import {
  Heart,
  FileDown,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Briefcase,
  BookOpen,
  Utensils,
  GraduationCap,
  Users,
  ArrowLeft,
  Share2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const { candidates, interests, expressInterest, addToast } = useMatrimonyStore();
  const { user } = useAuthStore();
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [customMsgModal, setCustomMsgModal] = useState(false);
  const [introText, setIntroText] = useState('');

  // Resolve ID
  const effectiveId = params.id === 'me' ? (user?.id || 'demo-user-1') : params.id;
  const candidate = candidates.find(
    (c) => c.id === effectiveId || (params.id === 'me' && c.id === 'demo-user-1')
  );

  const isMe = params.id === 'me' || (user && user.id === candidate?.id);

  const alreadySent = interests.some(
    (i) => i.candidateId === candidate?.id && i.type === 'SENT'
  );

  const isMutual = interests.some(
    (i) => i.candidateId === candidate?.id && i.status === 'ACCEPTED'
  );

  const handleSendInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidate) return;
    expressInterest(candidate.id, introText);
    setCustomMsgModal(false);
    setIntroText('');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Profile Link Copied',
        description: 'Biodata shareable link copied to clipboard.',
        type: 'info',
      });
    }
  };

  if (!candidate) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <div className="card animate-fade" style={{ padding: '40px' }}>
            <AlertCircle size={48} color="var(--warning)" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '8px' }}>
              Candidate Profile Not Found
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              The requested Seventh-day Adventist member biodata is unavailable or has been made private.
            </p>
            <Link href="/discover" className="btn btn-primary">
              <ArrowLeft size={16} /> Return to Candidate Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Navigation back and Share */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <Link
            href="/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              color: 'var(--primary-700)',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Candidates Directory
          </Link>

          <button
            onClick={handleCopyLink}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <Share2 size={14} /> Share Profile
          </button>
        </div>

        {/* Profile Header Banner Card */}
        <div className="card animate-fade" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                backgroundImage: `url(${candidate.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {candidate.name}, {candidate.age}
                </h1>
                {candidate.isPastoralVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Pastoral Verified
                  </span>
                )}
                <span className="badge badge-gold">
                  {candidate.compatibilityScore}% Compatibility
                </span>
                {isMe && (
                  <span className="badge badge-primary">
                    Logged-in Profile
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '14px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Briefcase size={15} color="var(--primary-700)" /> {candidate.occupation}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="var(--primary-700)" /> {candidate.city}{candidate.state ? `, ${candidate.state}` : ''}, {candidate.country}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <BookOpen size={15} color="var(--primary-700)" /> Baptized SDA ({candidate.baptismYear})
                </span>
              </div>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {candidate.bioSnippet}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {!isMe && (
                  <>
                    {isMutual ? (
                      <Link href="/messages" className="btn btn-primary">
                        <MessageSquare size={16} /> Open Matrimonial Chat
                      </Link>
                    ) : alreadySent ? (
                      <button type="button" disabled className="btn btn-outline">
                        <CheckCircle2 size={16} color="var(--success)" /> Interest Expressed
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCustomMsgModal(true)}
                        className="btn btn-gold"
                      >
                        <Heart size={16} /> Express Matrimonial Interest
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setShowBiodataModal(true)}
                  className="btn btn-primary"
                >
                  <FileDown size={16} /> View & Print Biodata
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Profile Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Section 1: Spiritual Profile */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <BookOpen size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Adventist Faith & Church Life
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  BAPTISM & SABBATH
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.baptismStatus} ({candidate.baptismYear}) • {candidate.sabbathObservance}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  CHURCH HIERARCHY
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.division}{candidate.conference ? ` → ${candidate.conference}` : ''}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  HOME CHURCH
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.localChurch}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  ACTIVE MINISTRIES
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {candidate.activeMinistries.map((m, idx) => (
                    <span key={idx} className="badge badge-primary">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  FAVORITE SCRIPTURE
                </span>
                <p style={{ fontStyle: 'italic', color: 'var(--primary-800)', marginTop: '2px' }}>
                  "{candidate.favoriteScripture}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Lifestyle & Health */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Utensils size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Lifestyle & Health Message
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  DIETARY PRACTICE
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.diet}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  TEMPERANCE & ABSTINENCE
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.temperance}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  MUSIC & LEISURE
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.musicPreferences}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  RELOCATION WILLINGNESS
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.relocationPreference}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Education & Profession */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <GraduationCap size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Education & Vocation
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  HIGHEST DEGREE
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.highestEducation}</span>
              </div>
              {candidate.institution && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    ALMA MATER
                  </span>
                  <span style={{ fontWeight: 600 }}>{candidate.institution}</span>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  OCCUPATION
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.occupation}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Family Background & Pastoral Endorsement */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Users size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Family Heritage & Pastoral Reference
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  ADVENTIST HERITAGE
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.familyBackground.heritage}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  FAMILY TRADITIONS
                </span>
                <span style={{ fontWeight: 600 }}>{candidate.familyBackground.traditions}</span>
              </div>
              {candidate.pastorReference && (
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'var(--accent-gold-light)', borderRadius: 'var(--radius-sm)', border: '1px solid #EAD8B1' }}>
                  <span style={{ color: '#8C6D2B', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <ShieldCheck size={14} /> PASTORAL ENDORSEMENT
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-900)', fontStyle: 'italic', marginTop: '4px' }}>
                    "{candidate.pastorReference.notes}"
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                    — {candidate.pastorReference.name} ({candidate.pastorReference.church})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Express Interest Custom Message Modal */}
      {customMsgModal && (
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
          onClick={() => setCustomMsgModal(false)}
        >
          <div
            className="card animate-fade"
            style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Heart size={22} color="var(--accent-gold)" fill="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Express Interest to {candidate.name}
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Share a respectful, faith-centered introductory note. Once mutual interest is confirmed, direct private messaging unlocks.
            </p>

            <form onSubmit={handleSendInterest}>
              <textarea
                rows={4}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                placeholder={`Greetings ${candidate.name}, I reviewed your faith profile and appreciated your dedication to Christ and church ministry...`}
                className="input-control"
                style={{ resize: 'none', marginBottom: '20px', fontSize: '0.875rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCustomMsgModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <Heart size={15} /> Send Expression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Biodata Modal */}
      <BiodataModal
        candidate={candidate}
        isOpen={showBiodataModal}
        onClose={() => setShowBiodataModal(false)}
      />
    </div>
  );
}
