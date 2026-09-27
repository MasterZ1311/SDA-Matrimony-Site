'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Heart,
  ShieldCheck,
  MessageSquare,
  Compass,
  Sparkles,
  LogOut,
  CheckCircle2,
  Menu,
  X,
  User,
  Bell,
} from 'lucide-react';
import { useRealtimeSocket } from '@/hooks/useRealtimeSocket';

function formatRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const now = new Date();
  const date = new Date(dateInput);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getNotificationBadge(type: string) {
  switch (type) {
    case 'INTEREST_RECEIVED':
      return {
        icon: <Heart size={15} fill="currentColor" />,
        bg: 'rgba(200, 155, 60, 0.12)',
        color: 'var(--accent-gold)',
      };
    case 'MATCH_SUGGESTED':
      return {
        icon: <Sparkles size={15} />,
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10B981',
      };
    case 'NEW_MESSAGE':
      return {
        icon: <MessageSquare size={15} />,
        bg: 'rgba(59, 130, 246, 0.12)',
        color: '#3B82F6',
      };
    default:
      return {
        icon: <Bell size={15} />,
        bg: 'rgba(30, 58, 95, 0.1)',
        color: 'var(--primary-800)',
      };
  }
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    interests,
    conversations,
    notificationsList,
    unreadNotificationsCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    curatedSuggestions,
  } = useMatrimonyStore();

  useRealtimeSocket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications().catch(() => {});
    }
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingReceivedInterests = interests.filter(
    (i) => i.type === 'RECEIVED' && i.status === 'PENDING'
  ).length;

  const pendingCuratedMatches = curatedSuggestions.length;

  const totalUnreadMessages = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              flexShrink: 0,
            }}
          >
            <Heart size={20} fill="var(--accent-gold)" />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--primary-900)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                display: 'block',
              }}
            >
              SDA MATRIMONY
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              FAITH • PURPOSE • COVENANT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop" style={{ alignItems: 'center', gap: '24px' }}>
          <Link
            href="/discover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/discover' ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: pathname === '/discover' ? '2px solid var(--primary-700)' : '2px solid transparent',
              padding: '6px 0',
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
              borderBottom: pathname === '/interests' ? '2px solid var(--primary-700)' : '2px solid transparent',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            <Heart size={18} />
            Interests
            {pendingReceivedInterests > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {pendingReceivedInterests}
              </span>
            )}
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
              borderBottom: pathname === '/messages' ? '2px solid var(--primary-700)' : '2px solid transparent',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            <MessageSquare size={18} />
            Messages
            {totalUnreadMessages > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--primary-700)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {totalUnreadMessages}
              </span>
            )}
          </Link>

          <Link
            href="/matches"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/matches' ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: pathname === '/matches' ? '2px solid var(--primary-700)' : '2px solid transparent',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            <Sparkles size={18} />
            Matches
            {pendingCuratedMatches > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {pendingCuratedMatches}
              </span>
            )}
          </Link>

          <Link
            href="/admin/verifications"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: pathname === '/admin/verifications' ? 'var(--primary-700)' : 'var(--text-secondary)',
              borderBottom: pathname === '/admin/verifications' ? '2px solid var(--primary-700)' : '2px solid transparent',
              padding: '6px 0',
            }}
          >
            <ShieldCheck size={18} />
            Pastoral Portal
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin/matches"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.925rem',
                fontWeight: 600,
                color: pathname === '/admin/matches' ? 'var(--primary-700)' : 'var(--text-secondary)',
                borderBottom: pathname === '/admin/matches' ? '2px solid var(--primary-700)' : '2px solid transparent',
                padding: '6px 0',
              }}
            >
              <Sparkles size={18} />
              Matchmaker Desk
            </Link>
          )}
        </nav>

        {/* Desktop User Profile / CTA */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Notification Bell Dropdown */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                  aria-label="View notifications"
                  style={{
                    position: 'relative',
                    background: notificationsOpen ? 'var(--primary-50)' : 'none',
                    border: '1px solid',
                    borderColor: notificationsOpen ? 'var(--border-subtle)' : 'transparent',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: unreadNotificationsCount > 0 ? 'var(--primary-800)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Bell size={19} />
                  {unreadNotificationsCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 0 2px #FFF',
                      }}
                    >
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '350px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-subtle)',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'var(--primary-50)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={16} color="var(--primary-800)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                          Notifications
                        </span>
                        {unreadNotificationsCount > 0 && (
                          <span
                            style={{
                              backgroundColor: 'var(--primary-800)',
                              color: '#FFFFFF',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '10px',
                            }}
                          >
                            {unreadNotificationsCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-700)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                      {notificationsList && notificationsList.length > 0 ? (
                        notificationsList.map((notif) => {
                          const badge = getNotificationBadge(notif.type);
                          return (
                            <Link
                              key={notif.id}
                              href={notif.link || '/'}
                              onClick={() => {
                                if (!notif.isRead) {
                                  markAsRead(notif.id);
                                }
                                setNotificationsOpen(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px 16px',
                                borderBottom: '1px solid var(--border-subtle)',
                                textDecoration: 'none',
                                color: 'inherit',
                                backgroundColor: notif.isRead ? '#FFFFFF' : 'rgba(238, 242, 255, 0.65)',
                                transition: 'background 0.2s ease',
                                position: 'relative',
                              }}
                            >
                              {!notif.isRead && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '6px',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2563EB',
                                  }}
                                />
                              )}
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: '2px',
                                }}
                              >
                                {badge.icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: '0.825rem',
                                    fontWeight: notif.isRead ? 500 : 700,
                                    color: notif.isRead ? 'var(--text-secondary)' : 'var(--primary-900)',
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {notif.title}
                                </p>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    marginTop: '4px',
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  {formatRelativeTime(notif.createdAt)}
                                </span>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <Bell size={24} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                          <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 600 }}>
                            No notifications yet
                          </p>
                          <span style={{ fontSize: '0.75rem' }}>
                            We&apos;ll notify you when someone connects or messages you.
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding: '10px 16px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Link
                        href="/interests"
                        onClick={() => setNotificationsOpen(false)}
                        style={{
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          color: 'var(--primary-700)',
                          textDecoration: 'none',
                        }}
                      >
                        View Received Proposals &rarr;
                      </Link>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/profile/me"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
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
                  }}
                >
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
                aria-label="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
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

        {/* Mobile Hamburger Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--primary-900)',
            padding: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="animate-fade"
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 49,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderTop: '1px solid var(--border-subtle)',
            overflowY: 'auto',
          }}
        >
          <Link
            href="/discover"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/discover' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <Compass size={20} color="var(--primary-700)" />
            Discover Candidates
          </Link>

          <Link
            href="/interests"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/interests' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={20} color="var(--accent-gold)" />
              Express Interests
            </div>
            {pendingReceivedInterests > 0 && (
              <span className="badge badge-gold">{pendingReceivedInterests} Pending</span>
            )}
          </Link>

          <Link
            href="/messages"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/messages' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={20} color="var(--primary-700)" />
              Matrimonial Messages
            </div>
            {totalUnreadMessages > 0 && (
              <span className="badge badge-primary">{totalUnreadMessages} New</span>
            )}
          </Link>

          <Link
            href="/matches"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/matches' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={20} color="var(--accent-gold)" />
              Curated Matches
            </div>
            {pendingCuratedMatches > 0 && (
              <span className="badge badge-gold">{pendingCuratedMatches} New</span>
            )}
          </Link>

          <Link
            href="/interests"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/interests' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={20} color="var(--primary-700)" />
              Notifications & Alerts
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="badge badge-gold">{unreadNotificationsCount} New</span>
            )}
          </Link>

          <Link
            href="/admin/verifications"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: pathname === '/admin/verifications' ? 'var(--primary-50)' : 'transparent',
              color: 'var(--primary-900)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <ShieldCheck size={20} color="var(--primary-700)" />
            Pastoral Verification Portal
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin/matches"
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: pathname === '/admin/matches' ? 'var(--primary-50)' : 'transparent',
                color: 'var(--primary-900)',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              <Sparkles size={20} color="var(--accent-gold)" />
              Admin Matchmaker Desk
            </Link>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '8px 0' }} />

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/profile/me"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-900)',
                  fontWeight: 600,
                }}
              >
                <User size={20} color="var(--primary-700)" />
                My Biodata & Profile ({user.firstName || 'User'})
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Join Community
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
