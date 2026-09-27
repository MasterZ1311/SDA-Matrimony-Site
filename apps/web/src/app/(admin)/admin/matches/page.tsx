'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useMatrimonyStore, MatchSuggestionItem } from '@/stores/matrimonyStore';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Search,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Users,
} from 'lucide-react';

export default function AdminMatchesPage() {
  const { matchSuggestions, fetchAdminMatchSuggestions, isMatchmakingLoading } = useMatrimonyStore();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminMatchSuggestions();
  }, [fetchAdminMatchSuggestions]);

  const filteredSuggestions = useMemo(() => {
    return matchSuggestions.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const user1Name = `${item.user?.profile?.firstName || ''} ${item.user?.profile?.lastName || ''}`.toLowerCase();
        const user2Name = `${item.suggestedUser?.profile?.firstName || ''} ${item.suggestedUser?.profile?.lastName || ''}`.toLowerCase();
        const note = (item.adminNote || '').toLowerCase();
        const city1 = (item.user?.profile?.residenceCity || '').toLowerCase();
        const city2 = (item.suggestedUser?.profile?.residenceCity || '').toLowerCase();

        if (
          !user1Name.includes(q) &&
          !user2Name.includes(q) &&
          !note.includes(q) &&
          !city1.includes(q) &&
          !city2.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [matchSuggestions, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: matchSuggestions.length,
      pending: matchSuggestions.filter((s) => s.status === 'PENDING').length,
      accepted: matchSuggestions.filter((s) => s.status === 'ACCEPTED').length,
      rejected: matchSuggestions.filter((s) => s.status === 'REJECTED').length,
    };
  }, [matchSuggestions]);

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-800)',
                }}
              >
                <Sparkles size={22} />
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Elder & Admin Matchmaker Desk
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link
                href="/admin/verifications"
                className="btn btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.825rem' }}
              >
                <ShieldCheck size={14} /> Pastoral Verifications
              </Link>
              <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.825rem' }}>
                Curated Introductions
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Track and monitor church leadership-assisted introductions between compatible Adventist members.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '12px' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member name, city, or note content..."
              className="input-control"
              style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'ALL', label: `All (${counts.all})` },
              { id: 'PENDING', label: `Pending (${counts.pending})` },
              { id: 'ACCEPTED', label: `Accepted (${counts.accepted})` },
              { id: 'REJECTED', label: `Declined (${counts.rejected})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Table / List */}
        {filteredSuggestions.length === 0 ? (
          <div className="card animate-fade" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Sparkles size={46} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
              No Match Suggestions Found
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                maxWidth: '440px',
                margin: '0 auto 20px auto',
                lineHeight: 1.5,
              }}
            >
              {matchSuggestions.length === 0
                ? 'No matches have been suggested by leadership yet. Visit any member profile in the directory to introduce them to another candidate.'
                : 'No suggestions match your current filter or search criteria.'}
            </p>
            {matchSuggestions.length === 0 ? (
              <Link href="/discover" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <Users size={16} /> Browse Candidate Directory
              </Link>
            ) : (
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={14} /> Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredSuggestions.map((item) => {
              const user1 = item.user;
              const user2 = item.suggestedUser;
              const user1Name = user1?.profile
                ? `${user1.profile.firstName} ${user1.profile.lastName}`
                : 'Member A';
              const user2Name = user2?.profile
                ? `${user2.profile.firstName} ${user2.profile.lastName}`
                : 'Member B';

              const createdFormatted = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div key={item.id} className="card animate-fade" style={{ padding: '24px' }}>
                  {/* Top Row: Candidates & Status */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    {/* The Match Candidates Pair */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Candidate 1 */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                            {user1Name}
                          </span>
                          <Link
                            href={`/profile/${item.userId}`}
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--primary-700)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontWeight: 600,
                            }}
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                        {user1?.profile?.residenceCity && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {user1.profile.residenceCity}, {user1.profile.residenceCountry}
                          </span>
                        )}
                      </div>

                      {/* Bridge Icon */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-100)',
                          color: 'var(--accent-gold)',
                          margin: '0 4px',
                        }}
                      >
                        <Heart size={16} fill="var(--accent-gold)" />
                      </div>

                      {/* Candidate 2 */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                            {user2Name}
                          </span>
                          <Link
                            href={`/profile/${item.suggestedUserId}`}
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--primary-700)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontWeight: 600,
                            }}
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                        {user2?.profile?.residenceCity && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {user2.profile.residenceCity}, {user2.profile.residenceCountry}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {item.status === 'ACCEPTED' ? (
                        <span className="badge badge-verified">
                          <CheckCircle2 size={13} /> Accepted & Connected
                        </span>
                      ) : item.status === 'REJECTED' ? (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: 'var(--danger-light)',
                            color: 'var(--danger)',
                          }}
                        >
                          <XCircle size={13} /> Politely Declined
                        </span>
                      ) : (
                        <span className="badge badge-gold">
                          <Clock size={13} /> Awaiting Member Response
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin Note Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--primary-50)',
                      borderLeft: '4px solid var(--accent-gold)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Sparkles size={14} color="var(--primary-800)" />
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--primary-800)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Personal Matchmaker Note
                      </span>
                    </div>
                    <p
                      style={{
                        fontStyle: 'italic',
                        fontSize: '0.9rem',
                        color: 'var(--primary-900)',
                        lineHeight: 1.5,
                      }}
                    >
                      "{item.adminNote || 'Suggested based on mutual ministry involvement and shared spiritual goals.'}"
                    </p>
                  </div>

                  {/* Metadata Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} /> Introduced on {createdFormatted}
                    </span>
                    {item.admin && (
                      <span>
                        Suggested by Church Admin ({item.admin.email})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
