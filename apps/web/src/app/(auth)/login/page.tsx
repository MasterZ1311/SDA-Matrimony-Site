'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Heart, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setAuth(
        {
          id: 'user-logged-in-1',
          email: email || 'david.miller@sda-matrimony.test',
          role: 'VERIFIED_MEMBER',
          firstName: 'David',
          lastName: 'Miller',
          isEmailVerified: true,
        },
        'mock-jwt-token-active'
      );
      setLoading(false);
      router.push('/discover');
    }, 600);
  };

  const handleQuickDemo = (demoType: 'david' | 'sarah' | 'admin') => {
    if (demoType === 'david') {
      setEmail('david.miller@sda-matrimony.test');
      setPassword('Password123!');
      setAuth(
        {
          id: 'demo-user-1',
          email: 'david.miller@sda-matrimony.test',
          role: 'VERIFIED_MEMBER',
          firstName: 'David',
          lastName: 'Miller',
          isEmailVerified: true,
        },
        'token-david'
      );
    } else if (demoType === 'sarah') {
      setEmail('sarah.johnson@sda-matrimony.test');
      setPassword('Password123!');
      setAuth(
        {
          id: 'demo-user-2',
          email: 'sarah.johnson@sda-matrimony.test',
          role: 'VERIFIED_MEMBER',
          firstName: 'Sarah',
          lastName: 'Johnson',
          isEmailVerified: true,
        },
        'token-sarah'
      );
    } else {
      setEmail('admin@sda-matrimony.org');
      setPassword('Password123!');
      setAuth(
        {
          id: 'demo-admin-1',
          email: 'admin@sda-matrimony.org',
          role: 'ADMIN',
          firstName: 'Elder',
          lastName: 'Admin',
          isEmailVerified: true,
        },
        'token-admin'
      );
    }
    router.push('/discover');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: 'var(--bg-page)',
    }}>
      <div className="card animate-fade" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-800)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            marginBottom: '12px',
          }}>
            <Heart size={22} fill="var(--accent-gold)" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Member Sign In
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Welcome back to the SDA Matrimonial Community
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px dashed var(--primary-600)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Quick Demo Auto-Fill:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('david')}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#FFF' }}
            >
              David (Physician)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('sarah')}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#FFF' }}
            >
              Sarah (Teacher)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#FFF' }}
            >
              Elder Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@adventist.org"
                className="input-control"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Password
              </label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                Forgot?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-control"
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
            Create SDA Profile
          </Link>
        </p>
      </div>
    </div>
  );
}
