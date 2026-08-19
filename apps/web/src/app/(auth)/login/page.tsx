'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { Heart, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { addToast } = useMatrimonyStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const isAdmin = email.toLowerCase().includes('admin');
      const user = {
        id: isAdmin ? 'demo-admin-1' : 'demo-user-1',
        email,
        role: isAdmin ? 'ADMIN' : 'VERIFIED_MEMBER',
        firstName: isAdmin ? 'Elder Admin' : 'David',
        lastName: isAdmin ? 'Pastor' : 'Miller',
        isEmailVerified: true,
      };

      setAuth(user, 'mock-jwt-token-active');
      setLoading(false);

      addToast({
        title: 'Welcome Back! 👋',
        description: `Signed in as ${user.firstName} ${user.lastName}.`,
        type: 'success',
      });

      if (isAdmin) {
        router.push('/admin/verifications');
      } else {
        router.push('/discover');
      }
    }, 500);
  };

  const handleQuickDemo = (demoType: 'david' | 'sarah' | 'admin') => {
    setErrorMessage('');
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
      addToast({ title: 'Signed in as David Miller (Physician)', type: 'success' });
      router.push('/discover');
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
      addToast({ title: 'Signed in as Sarah Johnson (Educator)', type: 'success' });
      router.push('/discover');
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
      addToast({ title: 'Signed in as Pastoral Administrator', type: 'info' });
      router.push('/admin/verifications');
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 150px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div className="card animate-fade" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-800)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              marginBottom: '12px',
            }}
          >
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
        <div
          style={{
            backgroundColor: 'var(--primary-50)',
            border: '1px dashed var(--primary-600)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '24px',
          }}
        >
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

        {/* Error Alert */}
        {errorMessage && (
          <div
            className="animate-fade"
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

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
              <button
                type="button"
                onClick={() => addToast({ title: 'Password Reset', description: 'Demo password reset instructions sent to your email.', type: 'info' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}
              >
                Forgot?
              </button>
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
