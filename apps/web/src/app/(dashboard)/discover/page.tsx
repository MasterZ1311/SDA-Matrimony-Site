'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Filter, CheckCircle2, ShieldCheck, Sparkles, MapPin, Briefcase, BookOpen, Send } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  city: string;
  country: string;
  division: string;
  conference: string;
  diet: string;
  sabbath: string;
  isPastoralVerified: boolean;
  compatibilityScore: number;
  imageUrl: string;
  bioSnippet: string;
}

const mockCandidates: Candidate[] = [
  {
    id: 'demo-user-2',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'FEMALE',
    occupation: 'Secondary Science Teacher (M.Ed)',
    city: 'Silver Spring',
    country: 'United States',
    division: 'North American Division',
    conference: 'Chesapeake Conference',
    diet: 'Lacto-Ovo Vegetarian',
    sabbath: 'Sunset to Sunset',
    isPastoralVerified: true,
    compatibilityScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Adventist academy educator passionate about youth ministry, pathfinders, literature evangelism, and family worship.',
  },
  {
    id: 'demo-user-3',
    name: 'Rachel Vance',
    age: 26,
    gender: 'FEMALE',
    occupation: 'Registered Nurse (BSN)',
    city: 'Loma Linda',
    country: 'United States',
    division: 'North American Division',
    conference: 'Southeastern California',
    diet: 'Strict Vegan',
    sabbath: 'Sunset to Sunset',
    isPastoralVerified: true,
    compatibilityScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Serving in medical healthcare, dedicated to the Adventist 8 laws of health, classical music, and church choir.',
  },
  {
    id: 'demo-user-4',
    name: 'Rebecca Mthembu',
    age: 29,
    gender: 'FEMALE',
    occupation: 'Software Engineer',
    city: 'Johannesburg',
    country: 'South Africa',
    division: 'Southern Africa-Indian Ocean',
    conference: 'Trans-Orange Conference',
    diet: 'Lacto-Ovo Vegetarian',
    sabbath: 'Sunset to Sunset',
    isPastoralVerified: true,
    compatibilityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Adventist Youth leader, tech ministry advocate, loves Bible prophecy studies and nature photography.',
  },
];

export default function DiscoverPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [expressSent, setExpressSent] = useState<Record<string, boolean>>({});

  const handleSendInterest = (candidateId: string) => {
    setExpressSent({ ...expressSent, [candidateId]: true });
  };

  const filteredCandidates = candidates.filter((c) => {
    if (selectedDivision !== 'ALL' && !c.division.includes(selectedDivision)) return false;
    if (selectedDiet !== 'ALL' && !c.diet.toLowerCase().includes(selectedDiet.toLowerCase())) return false;
    if (onlyVerified && !c.isPastoralVerified) return false;
    return true;
  });

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Candidate Discovery
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Browse verified Seventh-day Adventist members matching your spiritual and lifestyle standards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <aside className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Filter size={18} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Faith & Lifestyle Filters
              </h2>
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
                  <option value="North American">North American Division (NAD)</option>
                  <option value="Southern Asia">Southern Asia Division (SUD)</option>
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
                  <option value="ALL">Any Diet</option>
                  <option value="Vegan">Strict Vegan</option>
                  <option value="Vegetarian">Lacto-Ovo Vegetarian</option>
                  <option value="Clean">Levitical Clean Only</option>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Showing {filteredCandidates.length} Matches
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="card animate-fade" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    height: '240px',
                    backgroundImage: `url(${candidate.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                          {candidate.name}, {candidate.age}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <Briefcase size={14} color="var(--primary-700)" />
                        {candidate.occupation}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        <MapPin size={14} color="var(--primary-700)" />
                        {candidate.city}, {candidate.country}
                      </div>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {candidate.bioSnippet}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <span className="badge badge-primary">{candidate.division.split(' ')[0]} Division</span>
                        <span className="badge badge-primary">{candidate.diet}</span>
                        <span className="badge badge-primary">Sabbath Keeper</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link href={`/profile/${candidate.id}`} className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>
                        Biodata
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleSendInterest(candidate.id)}
                        disabled={expressSent[candidate.id]}
                        className={expressSent[candidate.id] ? 'btn btn-outline' : 'btn btn-gold'}
                        style={{ flex: 1.4, fontSize: '0.85rem' }}
                      >
                        {expressSent[candidate.id] ? (
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
          </div>
        </div>
      </div>
    </div>
  );
}
