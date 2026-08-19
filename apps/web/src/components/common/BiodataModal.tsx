'use client';

import React from 'react';
import { CandidateProfile } from '@/stores/matrimonyStore';
import { X, Printer, CheckCircle2, Heart, ShieldCheck, Download } from 'lucide-react';

interface BiodataModalProps {
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const BiodataModal: React.FC<BiodataModalProps> = ({ candidate, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
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
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          padding: '36px',
          position: 'relative',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary-700)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              Official Seventh-day Adventist Matrimonial Biodata
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Biodata Content */}
        <div id="printable-biodata" style={{ color: 'var(--text-main)' }}>
          {/* Header Banner */}
          <div
            style={{
              textAlign: 'center',
              padding: '20px 0',
              borderBottom: '2px solid var(--accent-gold)',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Heart size={20} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary-900)' }}>
                SEVENTH-DAY ADVENTIST MATRIMONIAL BIODATA
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              FAITH • PURPOSE • COVENANT • PASTORAL INTEGRITY
            </p>
          </div>

          {/* Profile Header Block */}
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '16px',
                backgroundImage: `url(${candidate.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '3px solid var(--accent-gold)',
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {candidate.name}
                </h2>
                {candidate.isPastoralVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={12} /> Pastoral Verified
                  </span>
                )}
                <span className="badge badge-gold">
                  {candidate.compatibilityScore}% Compatibility
                </span>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--primary-700)', fontWeight: 600, marginTop: '4px' }}>
                {candidate.occupation}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {candidate.city}{candidate.state ? `, ${candidate.state}` : ''}, {candidate.country} • Age: {candidate.age}
              </p>
            </div>
          </div>

          {/* Sections Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Section A: Faith Profile */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                1. Adventist Faith & Church Profile
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div><strong>Baptism Status:</strong> {candidate.baptismStatus} ({candidate.baptismYear})</div>
                <div><strong>Sabbath Observance:</strong> {candidate.sabbathObservance}</div>
                <div><strong>Church Division:</strong> {candidate.division}</div>
                {candidate.conference && <div><strong>Conference:</strong> {candidate.conference}</div>}
                <div><strong>Home Church:</strong> {candidate.localChurch}</div>
                <div><strong>Active Ministries:</strong> {candidate.activeMinistries.join(', ')}</div>
              </div>
            </div>

            {/* Section B: Lifestyle & Temperance */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                2. Lifestyle & Health Message
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div><strong>Dietary Standard:</strong> {candidate.diet}</div>
                <div><strong>Alcohol & Tobacco:</strong> {candidate.temperance}</div>
                <div><strong>Music Preferences:</strong> {candidate.musicPreferences}</div>
                <div><strong>Relocation:</strong> {candidate.relocationPreference}</div>
              </div>
            </div>

            {/* Section C: Education & Vocation */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                3. Education & Vocation
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div><strong>Highest Degree:</strong> {candidate.highestEducation}</div>
                {candidate.institution && <div><strong>Alma Mater:</strong> {candidate.institution}</div>}
                <div><strong>Current Profession:</strong> {candidate.occupation}</div>
              </div>
            </div>

            {/* Section D: Family Background */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                4. Family Heritage & Values
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div><strong>Heritage:</strong> {candidate.familyBackground.heritage}</div>
                <div><strong>Family:</strong> {candidate.familyBackground.familyStructure}</div>
                <div><strong>Traditions:</strong> {candidate.familyBackground.traditions}</div>
              </div>
            </div>
          </div>

          {/* Pastoral Reference Box */}
          {candidate.pastorReference && (
            <div
              style={{
                border: '1px dashed var(--primary-700)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                backgroundColor: 'var(--accent-gold-light)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Pastoral Reference Confirmation ({candidate.pastorReference.church})
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{candidate.pastorReference.notes}" — {candidate.pastorReference.name}
              </p>
            </div>
          )}

          {/* Scripture footer */}
          <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--primary-800)' }}>
              "{candidate.favoriteScripture}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
