'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Heart,
  Filter,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

export default function DiscoverPage() {
  const { candidates, interests, expressInterest } = useMatrimonyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'compatibility' | 'age' | 'name'>('compatibility');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredAndSortedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchOcc = c.occupation.toLowerCase().includes(q);
          const matchCity = c.city.toLowerCase().includes(q);
          const matchChurch = c.localChurch.toLowerCase().includes(q);
          const matchDivision = c.division.toLowerCase().includes(q);
          if (!matchName && !matchOcc && !matchCity && !matchChurch && !matchDivision) {
            return false;
          }
        }

        // Division
        if (selectedDivision !== 'ALL' && !c.division.toLowerCase().includes(selectedDivision.toLowerCase())) {
          return false;
        }

        // Diet
        if (selectedDiet !== 'ALL' && !c.diet.toLowerCase().includes(selectedDiet.toLowerCase())) {
          return false;
        }

        // Verified only
        if (onlyVerified && !c.isPastoralVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'compatibility') return b.compatibilityScore - a.compatibilityScore;
        if (sortBy === 'age') return a.age - b.age;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [candidates, searchQuery, selectedDivision, selectedDiet, onlyVerified, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('ALL');
    setSelectedDiet('ALL');
    setOnlyVerified(false);
    setSortBy('compatibility');
  };

  const isSent = (candidateId: string) => {
    return interests.some((i) => i.candidateId === candidateId && i.type === 'SENT');
  };

  return (
    <div style={{ padding: '36px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container">
        {/* Header Title and Search Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Candidate Discovery
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Browse verified Seventh-day Adventist members matching your spiritual, dietary, and church standards.
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="btn btn-outline nav-mobile-toggle"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <SlidersHorizontal size={16} /> Filters {selectedDivision !== 'ALL' || selectedDiet !== 'ALL' || onlyVerified ? '(Active)' : ''}
            </button>
          </div>

          {/* Search & Sort Controls Bar */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, occupation, church, division, or city..."
                className="input-control"
                style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-control"
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="compatibility">Highest Compatibility</option>
                <option value="age">Age (Youngest First)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="discover-layout" style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <aside
            className={`card discover-sidebar ${showMobileFilters ? 'block' : ''}`}
            style={{
              padding: '24px',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="var(--primary-800)" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Faith & Lifestyle
                </h2>
              </div>

              {(selectedDivision !== 'ALL' || selectedDiet !== 'ALL' || onlyVerified || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-700)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Church Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="ALL">All World Divisions</option>
                  <option value="North American">North American (NAD)</option>
                  <option value="Southern Asia">Southern Asia (SUD)</option>
                  <option value="Southern Africa">Southern Africa-Indian Ocean (SID)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Dietary Standard
                </label>
                <select
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="ALL">Any Adventist Diet</option>
                  <option value="Vegan">Strict Vegan (Plant-Based)</option>
                  <option value="Vegetarian">Lacto-Ovo Vegetarian</option>
                  <option value="Clean">Levitical Clean Foods</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-800)' }}
                  />
                  Pastoral Verified Only
                </label>
              </div>
            </div>
          </aside>

          {/* Candidates Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Showing {filteredAndSortedCandidates.length} Adventist {filteredAndSortedCandidates.length === 1 ? 'Match' : 'Matches'}
              </span>
            </div>

            {filteredAndSortedCandidates.length === 0 ? (
              <div className="card animate-fade" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Users size={44} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
                  No Matching Adventist Profiles Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                  Try adjusting your keywords, broadening division selections, or clearing dietary filters to see more candidates.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.875rem' }}
                >
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                {filteredAndSortedCandidates.map((candidate) => (
                  <div key={candidate.id} className="card animate-fade" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        height: '240px',
                        backgroundImage: `url(${candidate.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    >
                      {candidate.isPastoralVerified && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                          <span className="badge badge-verified">
                            <CheckCircle2 size={12} /> Pastoral Verified
                          </span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                        <span className="badge badge-gold">
                          <Sparkles size={12} /> {candidate.compatibilityScore}% Compatibility
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '4px' }}>
                          {candidate.name}, {candidate.age}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <Briefcase size={14} color="var(--primary-700)" />
                          {candidate.occupation}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                          <MapPin size={14} color="var(--primary-700)" />
                          {candidate.city}, {candidate.country}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                          {candidate.bioSnippet}
                        </p>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                          <span className="badge badge-primary">{candidate.division.split(' ')[0]} Div</span>
                          <span className="badge badge-primary">{candidate.diet.split(' ')[0]}</span>
                          <span className="badge badge-primary">Sabbath Keeper</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          href={`/profile/${candidate.id}`}
                          className="btn btn-outline"
                          style={{ flex: 1, fontSize: '0.85rem' }}
                        >
                          Biodata
                        </Link>

                        <button
                          type="button"
                          onClick={() => expressInterest(candidate.id)}
                          disabled={isSent(candidate.id)}
                          className={isSent(candidate.id) ? 'btn btn-outline' : 'btn btn-gold'}
                          style={{ flex: 1.4, fontSize: '0.85rem' }}
                        >
                          {isSent(candidate.id) ? (
                            <>
                              <CheckCircle2 size={15} color="var(--success)" /> Interest Sent
                            </>
                          ) : (
                            <>
                              <Heart size={15} /> Express Interest
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
