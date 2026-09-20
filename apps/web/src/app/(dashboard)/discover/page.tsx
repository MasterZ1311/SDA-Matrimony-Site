'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { ReportModal } from '@/components/common/ReportModal';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import {
  Heart,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Users,
  Building2,
  Church,
  Calendar,
  Utensils,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Star,
  LayoutGrid,
  List,
  Eye,
  Send,
} from 'lucide-react';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const paramGender = searchParams?.get('gender');
  const paramDivision = searchParams?.get('division');
  const paramDiet = searchParams?.get('diet');
  const paramInstitution = searchParams?.get('institution');

  const {
    candidates,
    interests,
    expressInterest,
    fetchCandidates,
    shortlist,
    toggleShortlist,
    fetchShortlist,
    isLoading,
  } = useMatrimonyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState(
    paramDivision && paramDivision !== 'ALL' ? paramDivision : 'ALL'
  );
  const [selectedDiet, setSelectedDiet] = useState(
    paramDiet && paramDiet !== 'ALL' ? paramDiet : 'ALL'
  );
  const [selectedInstitution, setSelectedInstitution] = useState(
    paramInstitution && paramInstitution !== 'ALL' ? paramInstitution : 'ALL'
  );
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'FEMALE' | 'MALE'>(
    paramGender === 'FEMALE' || paramGender === 'MALE' ? paramGender : 'ALL'
  );
  const [sortBy, setSortBy] = useState<'compatibility' | 'age' | 'name'>('compatibility');
  const [viewMode, setViewMode] = useState<'detailed' | 'grid'>('detailed');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Safety & Report Modal State
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchCandidates();
    fetchShortlist();
  }, [fetchCandidates, fetchShortlist]);

  const filteredAndSortedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        // Gender filter
        if (genderFilter !== 'ALL' && c.gender !== genderFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchOcc = c.occupation.toLowerCase().includes(q);
          const matchCity = c.city.toLowerCase().includes(q);
          const matchChurch = c.localChurch.toLowerCase().includes(q);
          const matchDivision = c.division.toLowerCase().includes(q);
          const matchInst = c.institution ? c.institution.toLowerCase().includes(q) : false;
          if (!matchName && !matchOcc && !matchCity && !matchChurch && !matchDivision && !matchInst) {
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

        // Adventist Institution / Alumni
        if (selectedInstitution !== 'ALL') {
          if (!c.institution || !c.institution.toLowerCase().includes(selectedInstitution.toLowerCase())) {
            return false;
          }
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
  }, [candidates, genderFilter, searchQuery, selectedDivision, selectedDiet, selectedInstitution, onlyVerified, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('ALL');
    setSelectedDiet('ALL');
    setSelectedInstitution('ALL');
    setOnlyVerified(false);
    setGenderFilter('ALL');
    setSortBy('compatibility');
  };

  const isSent = (candidateId: string) => {
    return interests.some((i) => i.candidateId === candidateId && i.type === 'SENT');
  };

  return (
    <div style={{ padding: '32px 0 60px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container">
        {/* Shaadi-Style Top Banner / Navigation Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-900)' }}>
                  Adventist Matches
                </h1>
                <span className="badge badge-crimson" style={{ fontSize: '0.85rem', padding: '3px 10px' }}>
                  {filteredAndSortedCandidates.length} Active Profiles
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Members verified by Seventh-day Adventist pastoral standards and lifestyle principles
              </p>
            </div>

            {/* View Mode Toggle & Mobile Filter Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'detailed' ? 'var(--primary-50)' : 'transparent',
                    color: viewMode === 'detailed' ? 'var(--primary-800)' : 'var(--text-secondary)',
                  }}
                >
                  <List size={14} /> Shaadi View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'grid' ? 'var(--primary-50)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--primary-800)' : 'var(--text-secondary)',
                  }}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="btn btn-outline nav-mobile-toggle"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Discover Layout */}
        <div
          className="discover-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '24px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Sidebar: Filter Accordion Panel */}
          <aside
            className={`card discover-sidebar ${showMobileFilters ? 'active' : ''}`}
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={18} color="var(--primary-800)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  Refine Search
                </h3>
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--shaadi-crimson)',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Keyword Search */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Search by Keyword
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, church, city, doctor..."
                    className="input-control"
                    style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Looking for Bride / Groom */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Candidate Gender
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setGenderFilter('ALL')}
                    className={genderFilter === 'ALL' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ flex: 1, padding: '6px 0', fontSize: '0.775rem' }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter('FEMALE')}
                    className={genderFilter === 'FEMALE' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ flex: 1, padding: '6px 0', fontSize: '0.775rem' }}
                  >
                    Brides
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter('MALE')}
                    className={genderFilter === 'MALE' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ flex: 1, padding: '6px 0', fontSize: '0.775rem' }}
                  >
                    Grooms
                  </button>
                </div>
              </div>

              {/* Verified Only Checkbox */}
              <div
                style={{
                  backgroundColor: 'var(--primary-50)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--shaadi-crimson)' }}
                  />
                  <span>🛡️ Pastoral Verified Only</span>
                </label>
              </div>

              {/* GC Division */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  General Conference Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="ALL">All 13 GC Divisions</option>
                  <option value="North American">North American Division (NAD)</option>
                  <option value="Southern Asia">Southern Asia Division (SUD)</option>
                  <option value="Inter-European">Inter-European Division (EUD)</option>
                  <option value="Inter-American">Inter-American Division (IAD)</option>
                  <option value="Southern Africa">Southern Africa-Indian Ocean (SID)</option>
                </select>
              </div>

              {/* Diet & Health Lifestyle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Diet & Health Principles
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
                  <option value="Clean">Biblical Clean Foods Only</option>
                </select>
              </div>

              {/* Adventist College / University Alumni */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Adventist College / Alumni
                </label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="ALL">All Colleges / Universities</option>
                  <option value="Spicer">Spicer Adventist University</option>
                  <option value="Andrews">Andrews University</option>
                  <option value="Loma Linda">Loma Linda University</option>
                  <option value="Oakwood">Oakwood University</option>
                  <option value="Southern">Southern Adventist University</option>
                  <option value="Southwestern">Southwestern Adventist University</option>
                  <option value="Walla Walla">Walla Walla University</option>
                  <option value="Lowry">Lowry Memorial College</option>
                  <option value="Roorkee">Roorkee Adventist College</option>
                  <option value="Flaiz">Flaiz Adventist College</option>
                  <option value="Northeast">Northeast Adventist College</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Sort Candidate Feed By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="compatibility">AI Compatibility Score</option>
                  <option value="age">Age: Youngest First</option>
                  <option value="name">Name: Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Main Candidate List */}
          <main style={{ minWidth: 0, flex: 1 }}>
            {filteredAndSortedCandidates.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '60px 24px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '8px' }}>
                  No matching candidates found
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 24px auto', fontSize: '0.9rem' }}>
                  Try relaxing your division, dietary, or college filters to view more profiles across the global church fellowship.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-outline"
                    style={{ padding: '8px 20px', fontSize: '0.875rem' }}
                  >
                    <RotateCcw size={14} /> Reset Filters
                  </button>
                  <Link href="/register" className="btn btn-connect" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
                    Create Profile
                  </Link>
                </div>
              </div>
            ) : viewMode === 'detailed' ? (
              /* Signature Detailed Horizontal Card */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredAndSortedCandidates.map((candidate) => {
                  const sent = isSent(candidate.id);
                  const isFav = shortlist.includes(candidate.id);

                  return (
                    <div
                      key={candidate.id}
                      className="card animate-fade"
                      style={{
                        padding: '0',
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateColumns: '240px 1fr',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {/* Left Photo & Badges */}
                      <div
                        style={{
                          position: 'relative',
                          backgroundImage: `url(${candidate.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '260px',
                        }}
                      >
                        {candidate.isPastoralVerified && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                            <span className="badge badge-verified">
                              <CheckCircle2 size={12} /> Pastoral Verified
                            </span>
                          </div>
                        )}

                        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                          <span className="badge badge-gold">
                            <Sparkles size={11} /> {candidate.compatibilityScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Right Body */}
                      <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)', lineHeight: 1.2 }}>
                                {candidate.name}, {candidate.age} yrs
                              </h3>
                              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Briefcase size={14} color="var(--primary-700)" />
                                <span style={{ fontWeight: 600 }}>{candidate.occupation}</span> • {candidate.highestEducation}
                              </p>
                            </div>

                            {/* Top Right Actions: Star Shortlist & Shield Report */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => toggleShortlist(candidate.id)}
                                title={isFav ? 'Remove from Shortlist' : 'Add to Shortlist'}
                                style={{
                                  background: isFav ? 'rgba(200, 155, 60, 0.15)' : '#FFFFFF',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: '50%',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                aria-label="Shortlist profile"
                              >
                                <Star size={18} fill={isFav ? '#C5A059' : 'none'} color={isFav ? '#C5A059' : 'var(--text-muted)'} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setReportTarget({ id: candidate.id, name: candidate.name })}
                                title="Report Profile / Confidential Pastoral Safety"
                                style={{
                                  background: '#FFFFFF',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: '50%',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'var(--text-muted)',
                                  transition: 'all 0.2s ease',
                                }}
                                aria-label="Report candidate profile"
                              >
                                <ShieldAlert size={17} />
                              </button>
                            </div>
                          </div>

                          {/* 4-Item Fact Grid */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                              gap: '10px',
                              margin: '16px 0',
                            }}
                          >
                            <div className="fact-pill">
                              <Building2 size={14} color="var(--primary-700)" />
                              <span>{candidate.division.split(' ')[0]} Division</span>
                            </div>
                            <div className="fact-pill">
                              <Church size={14} color="var(--primary-700)" />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.localChurch}</span>
                            </div>
                            <div className="fact-pill">
                              <Calendar size={14} color="var(--primary-700)" />
                              <span>Sunset Sabbath Keeper</span>
                            </div>
                            <div className="fact-pill">
                              <Utensils size={14} color="var(--primary-700)" />
                              <span>{candidate.diet}</span>
                            </div>
                          </div>

                          {/* Bio Excerpt */}
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', fontStyle: 'italic' }}>
                            "{candidate.bioSnippet}"
                          </p>
                        </div>

                        {/* Bottom Action Bar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            borderTop: '1px solid var(--border-subtle)',
                            paddingTop: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <MapPin size={14} />
                            <span>{candidate.city}, {candidate.country}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <Link
                              href={`/profile/${candidate.id}`}
                              className="btn btn-outline"
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              <Eye size={14} /> View Biodata
                            </Link>

                            <button
                              type="button"
                              onClick={() => expressInterest(candidate.id)}
                              disabled={sent}
                              className={sent ? 'btn btn-outline' : 'btn btn-connect'}
                              style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700 }}
                            >
                              <Heart size={14} fill={sent ? 'none' : '#FFFFFF'} />
                              {sent ? 'Interest Sent' : 'Connect Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Grid View */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredAndSortedCandidates.map((candidate) => {
                  const sent = isSent(candidate.id);
                  const isFav = shortlist.includes(candidate.id);

                  return (
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
                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => toggleShortlist(candidate.id)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Star size={16} fill={isFav ? '#C5A059' : 'none'} color={isFav ? '#C5A059' : 'var(--text-muted)'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportTarget({ id: candidate.id, name: candidate.name })}
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <ShieldAlert size={15} />
                          </button>
                        </div>
                        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                          <span className="badge badge-gold">
                            <Sparkles size={11} /> {candidate.compatibilityScore}% Match
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '4px' }}>
                            {candidate.name}, {candidate.age}
                          </h3>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            {candidate.occupation} • {candidate.city}, {candidate.country}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                            {candidate.bioSnippet}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            href={`/profile/${candidate.id}`}
                            className="btn btn-outline"
                            style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
                          >
                            Biodata
                          </Link>
                          <button
                            type="button"
                            onClick={() => expressInterest(candidate.id)}
                            disabled={sent}
                            className={sent ? 'btn btn-outline' : 'btn btn-connect'}
                            style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            {sent ? 'Sent' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Pastoral Safety & Report Modal */}
      {reportTarget && (
        <ReportModal
          candidateId={reportTarget.id}
          candidateName={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading Adventist Candidates..." />}>
      <DiscoverContent />
    </Suspense>
  );
}
