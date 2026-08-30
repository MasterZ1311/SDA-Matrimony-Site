'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import { Heart, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { addToast } = useMatrimonyStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Real API Authentication
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: cleanEmail,
        password: cleanPassword,
      });

      const { user, accessToken } = res.data;

      setAuth(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName || 'Adventist',
          lastName: user.lastName || 'Member',
          isEmailVerified: user.isEmailVerified ?? true,
        },
        accessToken
      );

      addToast({
        title: 'Welcome Back! 👋',
        description: `Signed in successfully.`,
        type: 'success',
      });

      if (user.role === 'ADMIN' || user.role === 'PASTOR_VERIFIER') {
        router.push('/admin/verifications');
      } else {
        router.push('/discover');
      }
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        'Authentication failed. Please verify your email and password.';
      setErrorMessage(typeof serverMsg === 'string' ? serverMsg : 'Invalid login credentials.');
    } finally {
      setLoading(false);
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
            Enter your Seventh-day Adventist credentials to access your account
          </p>
        </div>

        {/* Security Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--primary-800)',
            marginBottom: '20px',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={16} /> 256-Bit Encrypted Secure Authentication
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
                autoComplete="email"
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
                onClick={() => addToast({ title: 'Password Reset', description: 'Enter your registered email and click reset to receive a secure recovery link.', type: 'info' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                autoComplete="current-password"
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
            {loading ? 'Authenticating...' : 'Sign In Securely'} <ArrowRight size={16} />
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
