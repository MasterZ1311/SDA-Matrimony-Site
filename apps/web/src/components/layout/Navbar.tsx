'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Heart, ShieldCheck, MessageSquare, Compass, User, LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
          }}>
            <Heart size={20} fill="var(--accent-gold)" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)', letterSpacing: '-0.02em' }}>
              SDA MATRIMONY
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-2px' }}>
              FAITH • PURPOSE • COVENANT
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            href="/discover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/discover' ? 'var(--primary-700)' : 'var(--text-secondary)',
            }}
          >
            <Compass size={18} />
            Discover
          </Link>

          <Link
            href="/interests"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/interests' ? 'var(--primary-700)' : 'var(--text-secondary)',
            }}
          >
            <Heart size={18} />
            Interests
          </Link>

          <Link
            href="/messages"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/messages' ? 'var(--primary-700)' : 'var(--text-secondary)',
            }}
          >
            <MessageSquare size={18} />
            Messages
          </Link>

          <Link
            href="/admin/verifications"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname.startsWith('/admin') ? 'var(--primary-700)' : 'var(--text-secondary)',
            }}
          >
            <ShieldCheck size={18} />
            Pastoral Portal
          </Link>
        </nav>

        {/* User Profile / CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/profile/me" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-700)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  {user.firstName || 'My Profile'}
                </span>
                <CheckCircle2 size={15} color="var(--success)" />
              </Link>
              
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Join Community
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
