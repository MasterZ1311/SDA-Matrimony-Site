'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { useAuthStore } from '@/stores/authStore';
import { BiodataModal } from '@/components/common/BiodataModal';
import { ReportModal } from '@/components/common/ReportModal';
import {
  Heart,
  FileDown,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
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
  Star,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

const SAMPLE_FAITH_PROMPTS = [
  {
    category: 'MY SABBATH WALK',
    question: 'A typical Sabbath afternoon for me consists of...',
    answer: 'Community service visitation with the youth, walking in nature to reflect on God’s creation, or singing hymns around a piano with fellowship members.',
  },
  {
    category: 'CHRISTIAN HOME',
    question: 'The non-negotiables in my future Adventist home are...',
    answer: 'Friday evening family sundown worship, a peaceful plant-based kitchen, open hospitality for church visitors, and a home filled with scripture and praise.',
  },
  {
    category: 'SPIRITUAL ANCHOR',
    question: 'A spiritual discipline that anchored my faith in Jesus...',
    answer: 'Consistent morning watch devotionals before touching any digital devices, and memorizing Bible promises during seasons of life decisions.',
  },
];

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const {
    candidates,
    interests,
    expressInterest,
    addToast,
    shortlist,
    toggleShortlist,
    fetchShortlist,
  } = useMatrimonyStore();
  const { user } = useAuthStore();
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [customMsgModal, setCustomMsgModal] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [introText, setIntroText] = useState('');

  useEffect(() => {
    fetchShortlist();
  }, [fetchShortlist]);

  // Resolve ID
  const effectiveId = params.id === 'me' ? (user?.id || 'demo-user-1') : params.id;
  const candidate = candidates.find(
    (c) => c.id === effectiveId || (params.id === 'me' && c.id === 'demo-user-1')
  );

  const isMe = params.id === 'me' || (user && user.id === candidate?.id);
  const isFav = candidate ? shortlist.includes(candidate.id) : false;

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

  const handlePromptLike = (question: string) => {
    setIntroText(`I really resonated with your response to: "${question}" — `);
    setCustomMsgModal(true);
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
    <div style={{ padding: '36px 0 60px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Share2 size={14} /> Share Profile
            </button>
            {!isMe && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                title="Confidential Pastoral Safety Report"
              >
                <ShieldAlert size={14} /> Report
              </button>
            )}
          </div>
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
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {!isMe && (
                  <>
                    {isMutual ? (
                      <Link href="/messages" className="btn btn-connect">
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
                        className="btn btn-connect"
                      >
                        <Heart size={16} fill="#FFFFFF" /> Connect Now (Express Interest)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleShortlist(candidate.id)}
                      className="btn btn-outline"
                      style={{
                        backgroundColor: isFav ? 'rgba(200, 155, 60, 0.15)' : 'transparent',
                        borderColor: isFav ? 'var(--accent-gold)' : 'var(--border-subtle)',
                        color: isFav ? '#8C6A1E' : 'var(--primary-900)',
                      }}
                      title={isFav ? 'Remove from shortlist' : 'Add to prayerful shortlist'}
                    >
                      <Star size={16} fill={isFav ? '#C5A059' : 'none'} color={isFav ? '#C5A059' : 'var(--text-muted)'} />
                      {isFav ? 'Shortlisted' : 'Shortlist'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setShowBiodataModal(true)}
                  className="btn btn-outline"
                >
                  <FileDown size={16} /> View & Print Biodata
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Profile Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
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
                    ALMA MATER (ADVENTIST COLLEGE)
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-800)' }}>{candidate.institution}</span>
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

        {/* Section 5: Hinge-Style Faith & Purpose Prompt Cards */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--accent-gold)" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                Faith & Calling Prompts
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Conversational answers reflecting Christian character and courtship aspirations
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {SAMPLE_FAITH_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                className="card animate-fade"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--accent-gold-dark, #8C6A1E)',
                      letterSpacing: '0.06em',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {prompt.category}
                  </span>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--primary-900)',
                      lineHeight: 1.4,
                      marginBottom: '12px',
                    }}
                  >
                    {prompt.question}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    "{prompt.answer}"
                  </p>
                </div>

                {!isMe && (
                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => handlePromptLike(prompt.question)}
                      style={{
                        backgroundColor: 'var(--primary-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '6px 14px',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        color: 'var(--primary-900)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Heart size={14} color="var(--shaadi-crimson, #E53935)" /> Reply to this Prompt
                    </button>
                  </div>
                )}
              </div>
            ))}
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

      {/* Confidential Pastoral Safety & Report Modal */}
      {reportModalOpen && (
        <ReportModal
          candidateId={candidate.id}
          candidateName={candidate.name}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
}
