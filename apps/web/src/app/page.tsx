import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, BookOpen, Sparkles, Award, ArrowRight, CheckCircle2, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #0A192F 0%, #0F2942 100%)',
        color: '#FFFFFF',
        padding: '90px 0 110px 0',
        position: 'relative',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(197, 160, 89, 0.15)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            color: 'var(--accent-gold)',
            fontSize: '0.825rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '24px',
          }}>
            <ShieldCheck size={16} /> TRUSTED BY GLOBAL SEVENTH-DAY ADVENTIST BELIEVERS
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
          }}>
            Where Christ-Centered Faith Meets Lifelong Partnership.
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#CBD5E1',
            lineHeight: 1.6,
            marginBottom: '36px',
            fontWeight: 400,
          }}>
            A dignified, faith-aligned matrimonial platform matching Adventist singles based on Sabbath observance, health principles, church ministry involvement, and shared missionary calling.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-gold" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Create Your Profile <ArrowRight size={18} />
            </Link>
            <Link href="/discover" className="btn btn-outline" style={{
              padding: '14px 28px',
              fontSize: '1.05rem',
              color: '#FFFFFF',
              borderColor: 'rgba(255,255,255,0.25)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}>
              Browse Verified Candidates
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Faith Matching */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-900)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Built for the Adventist Lifestyle
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Unlike generic dating apps, our matching framework is grounded in biblical principles and Adventist community values.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px',
          }}>
            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-900)' }}>
                Sabbath & Doctrinal Unity
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Connect with partners who cherish sacred Friday-to-Saturday sunset Sabbath hours, spirit of prophecy, and biblical doctrines.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-900)' }}>
                Health & Temperance
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Match by dietary preferences (Vegan, Vegetarian, Clean Foods) and strict abstinence from alcohol and tobacco.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-900)' }}>
                Pastoral Endorsement
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Optional verification by local church pastors and elders adds an unmatched tier of trust and integrity for families.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-900)' }}>
                Church Hierarchy Directory
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Categorized by General Conference Divisions, Unions, Conferences, and local congregations across the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Profile Showcase */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', letterSpacing: '-0.02em' }}>
                Featured Adventist Profiles
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Verified Adventist professionals and church ministry leaders.
              </p>
            </div>
            <Link href="/discover" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View All Candidates <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}>
            {/* Card 1 */}
            <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '240px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Pastoral Verified
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                  <span className="badge badge-gold">94% Compatibility</span>
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                    David Miller, 30
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Physician (MD) • Loma Linda, California
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Passionate about medical missionary work, classical sacred music, and healthy plant-based living.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span className="badge badge-primary">North American Division</span>
                    <span className="badge badge-primary">Strict Vegan</span>
                    <span className="badge badge-primary">Sunset Sabbath</span>
                  </div>
                </div>
                <Link href="/profile/demo-user-1" className="btn btn-primary" style={{ width: '100%' }}>
                  View Full Profile & Biodata
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '240px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Pastoral Verified
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                  <span className="badge badge-gold">92% Compatibility</span>
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                    Sarah Johnson, 28
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Educator (M.Ed) • Silver Spring, Maryland
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Adventist academy teacher passionate about youth ministry, literature evangelism, and family worship.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span className="badge badge-primary">Columbia Union</span>
                    <span className="badge badge-primary">Lacto-Ovo Veg</span>
                    <span className="badge badge-primary">AY Youth Leader</span>
                  </div>
                </div>
                <Link href="/profile/demo-user-2" className="btn btn-primary" style={{ width: '100%' }}>
                  View Full Profile & Biodata
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
