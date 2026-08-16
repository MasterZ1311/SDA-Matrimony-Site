import React from 'react';
import Link from 'next/link';
import { Heart, Shield, BookOpen, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-900)',
      color: '#FFFFFF',
      padding: '60px 0 30px 0',
      marginTop: '80px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Heart size={22} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF' }}>
                SDA MATRIMONY
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.7 }}>
              Dedicated to building godly Seventh-day Adventist families through faith-aligned matchmaking, pastoral verification, and Christian marital values.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px', letterSpacing: '0.05em' }}>
              FAITH PILLARS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <li>Sabbath Observance Principles</li>
              <li>Adventist Health Message & Diet</li>
              <li>Pastoral Reference Verification</li>
              <li>Spirit of Prophecy Alignment</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px', letterSpacing: '0.05em' }}>
              QUICK ACCESS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <li><Link href="/discover" style={{ color: '#CBD5E1' }}>Browse Profiles</Link></li>
              <li><Link href="/interests" style={{ color: '#CBD5E1' }}>Express Interest Hub</Link></li>
              <li><Link href="/admin/verifications" style={{ color: '#CBD5E1' }}>Pastoral Verification</Link></li>
              <li><Link href="/login" style={{ color: '#CBD5E1' }}>Member Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px', letterSpacing: '0.05em' }}>
              TRUST & SAFETY
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '12px' }}>
              Every profile is protected by multi-tier privacy safeguards. Unsolicited contact sharing is strictly filtered until mutual consent.
            </p>
            <div style={{ display: 'flex', gap: '10px', color: 'var(--accent-gold)', fontSize: '0.8rem' }}>
              <Shield size={16} /> 100% Verified Community
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#64748B',
        }}>
          <p>© {new Date().getFullYear()} Seventh-day Adventist Matrimony Platform. All rights reserved.</p>
          <p>Built for the Global Seventh-day Adventist Church Community.</p>
        </div>
      </div>
    </footer>
  );
};
