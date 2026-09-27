'use client';

import React, { useState, useMemo } from 'react';
import { useMatrimonyStore, CandidateProfile } from '@/stores/matrimonyStore';
import {
  Sparkles,
  Search,
  Check,
  X,
  User,
  Church,
  MapPin,
  Briefcase,
  Heart,
  Loader2,
} from 'lucide-react';

interface SuggestMatchModalProps {
  targetCandidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestMatchModal: React.FC<SuggestMatchModalProps> = ({
  targetCandidate,
  isOpen,
  onClose,
}) => {
  const { candidates, createMatchSuggestion, isMatchmakingLoading } = useMatrimonyStore();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Available candidates for pairing (excluding target candidate)
  const availableCandidates = useMemo(() => {
    return candidates.filter((c) => c.id !== targetCandidate.id);
  }, [candidates, targetCandidate.id]);

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return availableCandidates;
    const q = searchQuery.toLowerCase();
    return availableCandidates.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.occupation.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.localChurch.toLowerCase().includes(q) ||
        c.division.toLowerCase().includes(q)
      );
    });
  }, [availableCandidates, searchQuery]);

  const selectedCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId);
  }, [candidates, selectedCandidateId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;

    const success = await createMatchSuggestion(
      targetCandidate.id,
      selectedCandidateId,
      adminNote.trim() || undefined
    );

    if (success) {
      setSelectedCandidateId('');
      setAdminNote('');
      setSearchQuery('');
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.72)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-800)',
                }}
              >
                <Sparkles size={18} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Suggest Match (Admin Matchmaker)
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Introduce two SDA members with an encouraging pastoral note. Both will see this recommendation on their dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Candidate A Card (Target) */}
        <div
          style={{
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundImage: `url(${targetCandidate.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
              border: '2px solid #FFF',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--primary-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
              }}
            >
              Candidate 1 (Active Profile)
            </span>
            <p style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '1rem', margin: '1px 0' }}>
              {targetCandidate.name}, {targetCandidate.age}
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {targetCandidate.occupation} • {targetCandidate.city}, {targetCandidate.country}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Member 2 Selector */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary-900)',
                marginBottom: '6px',
              }}
            >
              Pair With Second Member <span style={{ color: 'var(--danger)' }}>*</span>
            </label>

            {selectedCandidate ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid var(--primary-700)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundImage: `url(${selectedCandidate.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.925rem' }}>
                      {selectedCandidate.name}, {selectedCandidate.age}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {selectedCandidate.occupation} • {selectedCandidate.city}, {selectedCandidate.country}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidateId('');
                    setSearchQuery('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Change Member
                </button>
              </div>
            ) : (
              <div>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search candidate by name, city, or ministry..."
                    className="input-control"
                    style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Dropdown Options */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      maxHeight: '220px',
                      overflowY: 'auto',
                      zIndex: 20,
                      marginTop: '4px',
                    }}
                  >
                    {filteredCandidates.length === 0 ? (
                      <div style={{ padding: '14px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        No members found matching "{searchQuery}"
                      </div>
                    ) : (
                      filteredCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          onClick={() => {
                            setSelectedCandidateId(candidate.id);
                            setDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundImage: `url(${candidate.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.875rem' }}>
                                {candidate.name}, {candidate.age}
                              </p>
                              <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                                {candidate.gender}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {candidate.occupation} • {candidate.city}, {candidate.country}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Encouraging Note */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--primary-900)',
                }}
              >
                Personal Matchmaker Note (Visible to both members)
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {adminNote.length} characters
              </span>
            </div>

            <textarea
              rows={4}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Both active in youth ministry and share a deep passion for Adventist missionary outreach! I believe your family values align wonderfully."
              className="input-control"
              style={{
                fontSize: '0.875rem',
                resize: 'none',
                lineHeight: 1.5,
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              A thoughtful note explaining why leadership thinks they are compatible increases response rates.
            </span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isMatchmakingLoading}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCandidateId || isMatchmakingLoading}
              className="btn btn-primary"
              style={{
                padding: '8px 22px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !selectedCandidateId || isMatchmakingLoading ? 0.6 : 1,
                cursor: !selectedCandidateId || isMatchmakingLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isMatchmakingLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting Suggestion...
                </>
              ) : (
                <>
                  <Sparkles size={16} color="var(--accent-gold)" /> Submit Match Suggestion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
