'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Heart,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  Lock,
  Compass,
  Flame,
  Star,
  Quote,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { candidates } = useMatrimonyStore();
  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [ageFrom, setAgeFrom] = useState('21');
  const [ageTo, setAgeTo] = useState('32');
  const [division, setDivision] = useState('ALL');
  const [diet, setDiet] = useState('ALL');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/discover?gender=${lookingFor}&minAge=${ageFrom}&maxAge=${ageTo}&division=${division}&diet=${diet}`);
  };

  return (
    <div className="animate-fade">
      {/* Shaadi-Style Hero Section with Quick-Search Box */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A192F 0%, #0F2942 50%, #1B3B6F 100%)',
          color: '#FFFFFF',
          padding: '60px 0 90px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(229, 57, 53, 0.18)',
                border: '1px solid rgba(229, 57, 53, 0.4)',
                color: '#FFCDD2',
                fontSize: '0.825rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '20px',
              }}
            >
              <Heart size={15} fill="#E53935" color="#E53935" /> WORLD'S #1 SEVENTH-DAY ADVENTIST MATRIMONY PLATFORM
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Find Your Christ-Centered <br />
              <span style={{ color: 'var(--accent-gold)' }}>Adventist Life Partner</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#E2E8F0',
                lineHeight: 1.6,
                fontWeight: 400,
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              Over 10,000+ verified Seventh-day Adventist singles united in holy covenant. Matched by Sabbath devotion, church standing, dietary health, and shared gospel ministry.
            </p>
          </div>

          {/* Shaadi-Style Interactive Quick Search Widget */}
          <div
            className="card hero-quicksearch animate-fade"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '24px 28px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <form
              onSubmit={handleQuickSearch}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 160px',
                gap: '16px',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  I'm looking for a
                </label>
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value as any)}
                  className="input-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="FEMALE">Woman / Adventist Bride</option>
                  <option value="MALE">Man / Adventist Groom</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Age Range
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={ageFrom}
                    onChange={(e) => setAgeFrom(e.target.value)}
                    className="input-control"
                    style={{ fontWeight: 600 }}
                  >
                    {[18, 20, 22, 24, 26, 28, 30, 35, 40, 50].map((a) => (
                      <option key={a} value={a}>{a} yrs</option>
                    ))}
                  </select>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
                  <select
                    value={ageTo}
                    onChange={(e) => setAgeTo(e.target.value)}
                    className="input-control"
                    style={{ fontWeight: 600 }}
                  >
                    {[25, 28, 30, 32, 35, 40, 45, 55, 65].map((a) => (
                      <option key={a} value={a}>{a} yrs</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Church Division
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="input-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="ALL">All 13 GC Divisions</option>
                  <option value="NAD">North American Division (NAD)</option>
                  <option value="SUD">Southern Asia Division (SUD)</option>
                  <option value="EUD">Inter-European Division (EUD)</option>
                  <option value="IAD">Inter-American Division (IAD)</option>
                  <option value="SID">Southern Africa-Indian Ocean (SID)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Diet & Health Lifestyle
                </label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="input-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="ALL">Any Adventist Diet</option>
                  <option value="STRICT_VEGAN">Strict Vegan (Plant-Based)</option>
                  <option value="LACTO_OVO">Lacto-Ovo Vegetarian</option>
                  <option value="CLEAN_BIBLICAL">Biblical Clean Foods Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-connect"
                style={{
                  height: '46px',
                  width: '100%',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                Let's Begin <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Shaadi-Style Trust & Value Stats Bar */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>100% Pastoral Verified</h4>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Official church standing confirmation</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--shaadi-crimson-light)', color: 'var(--shaadi-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>Biblical Compatibility</h4>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Sabbath, diet, & ministry matching</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>100% Privacy Control</h4>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Photos visible only on approval</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>Zero Astrological Superstition</h4>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Scriptural faith & prayer alone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps: How SDA Matrimony Works */}
      <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--shaadi-crimson)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Simple & Faith-Aligned Process
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-900)', marginTop: '6px' }}>
              How SDA Matrimony Works
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Experience a modern, dignified matrimonial path that respects Seventh-day Adventist values from initial discovery to pastoral blessing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '10px' }}>
                1. Create Your Faith Profile
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Highlight your baptism year, church conference, Sabbath observance practices, and active ministries (AY, Pathfinders, Choir, Health).
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--shaadi-crimson-light)',
                  color: 'var(--shaadi-crimson)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '10px' }}>
                2. Connect & Express Interest
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Browse verified candidates filtered by division, profession, and dietary standards. Send formal expressions of interest with personal spiritual intros.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '10px' }}>
                3. Communicate & Court
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Once both members accept, unlock encrypted 1-on-1 conversations, download complete family biodatas, and begin pastoral-guided courtship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Candidates Showcase */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--shaadi-crimson)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Verified Member Profiles
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-900)', marginTop: '4px' }}>
                Featured Adventist Matches
              </h2>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Active church leaders, educators, healthcare professionals, and missionaries ready for marriage.
              </p>
            </div>
            <Link href="/discover" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Matches <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card animate-fade" style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'var(--bg-page)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Compass size={30} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '8px' }}>
              Explore the Global Adventist Candidate Directory
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Filter by General Conference Division, local union, educational background, vegetarian dietary discipline, and pastoral endorsement.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-connect" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Register Free Profile <ArrowRight size={16} />
              </Link>
              <Link href="/discover" className="btn btn-outline" style={{ padding: '12px 24px' }}>
                Explore Candidates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shaadi-Style Blessed Unions / Testimonial Section */}
      <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Matrimonial Testimonies
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-900)', marginTop: '4px' }}>
              Stories of God's Providential Leading
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {/* Story 1 */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
                  "Finding someone who truly honored the Sabbath hours from sunset Friday and shared a passion for lifestyle health was our biggest prayer. SDA Matrimony connected us across two different conferences, and our local pastors verified our profiles before we even exchanged our first message."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-800)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  J & R
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-900)' }}>Jonathan & Rebecca</h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Married 2025 • Loma Linda University Church</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
                  "The focus on missionary calling and active church ministries set this platform completely apart. We weren't looking for superficial swipe profiles; we wanted a partner dedicated to Christ's third angel message and family worship. God truly blessed our union."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--shaadi-crimson)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  M & S
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-900)' }}>Marcus & Sarah</h4>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Married 2026 • Spencerville SDA Church</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Ribbon */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F2942 0%, #0A192F 100%)',
          color: '#FFFFFF',
          padding: '60px 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '12px' }}>
            Your Adventist Life Partner is Waiting
          </h2>
          <p style={{ fontSize: '1rem', color: '#CBD5E1', marginBottom: '28px', lineHeight: 1.6 }}>
            Join thousands of Seventh-day Adventist singles seeking a prayerful, Christ-centered marriage.
          </p>
          <Link href="/register" className="btn btn-connect" style={{ padding: '14px 36px', fontSize: '1.05rem', fontWeight: 800 }}>
            Register Free Profile Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
