'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Check, X, MessageSquare, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface InterestItem {
  id: string;
  senderName: string;
  senderAge: number;
  senderOccupation: string;
  senderLocation: string;
  senderDivision: string;
  imageUrl: string;
  introMessage: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  date: string;
}

const mockReceivedInterests: InterestItem[] = [
  {
    id: 'int-1',
    senderName: 'Sarah Johnson',
    senderAge: 28,
    senderOccupation: 'Secondary Educator (M.Ed)',
    senderLocation: 'Silver Spring, MD',
    senderDivision: 'North American Division',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    introMessage: 'Greetings! I noticed your commitment to medical missionary work and sacred music. I would love to connect and share more about our spiritual journeys.',
    status: 'ACCEPTED',
    date: '2 hours ago',
  },
  {
    id: 'int-2',
    senderName: 'Rachel Vance',
    senderAge: 26,
    senderOccupation: 'Registered Nurse',
    senderLocation: 'Loma Linda, CA',
    senderDivision: 'North American Division',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    introMessage: 'Happy Sabbath! I saw you are serving in Loma Linda. Looking forward to getting to know your family values and testimony.',
    status: 'PENDING',
    date: '1 day ago',
  },
];

export default function InterestsPage() {
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [interests, setInterests] = useState<InterestItem[]>(mockReceivedInterests);

  const handleStatusChange = (id: string, newStatus: 'ACCEPTED' | 'DECLINED') => {
    setInterests(
      interests.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Express Interest Hub
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage mutual connections and expressions of interest in Adventist matrimonial courtship.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            onClick={() => setTab('received')}
            style={{
              padding: '10px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === 'received' ? '2px solid var(--primary-800)' : '2px solid transparent',
              color: tab === 'received' ? 'var(--primary-900)' : 'var(--text-muted)',
            }}
          >
            Received Interests ({interests.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            style={{
              padding: '10px 18px',
              fontSize: '0.925rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === 'sent' ? '2px solid var(--primary-800)' : '2px solid transparent',
              color: tab === 'sent' ? 'var(--primary-900)' : 'var(--text-muted)',
            }}
          >
            Sent Requests (1)
          </button>
        </div>

        {/* Interests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {interests.map((item) => (
            <div key={item.id} className="card animate-fade" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }} />

                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      {item.senderName}, {item.senderAge}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {item.date}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    {item.senderOccupation} • {item.senderLocation}
                  </p>

                  <div style={{
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--primary-900)',
                    fontStyle: 'italic',
                    marginBottom: '16px',
                    borderLeft: '3px solid var(--primary-700)',
                  }}>
                    "{item.introMessage}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <span className="badge badge-primary">
                      {item.senderDivision}
                    </span>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {item.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(item.id, 'DECLINED')}
                            className="btn btn-outline"
                            style={{ padding: '6px 14px', fontSize: '0.825rem' }}
                          >
                            <X size={14} /> Decline Politely
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'ACCEPTED')}
                            className="btn btn-gold"
                            style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                          >
                            <Check size={14} /> Accept & Unlock Chat
                          </button>
                        </>
                      ) : item.status === 'ACCEPTED' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge badge-verified">
                            <CheckCircle2 size={13} /> Mutually Accepted
                          </span>
                          <Link
                            href="/messages"
                            className="btn btn-primary"
                            style={{ padding: '6px 16px', fontSize: '0.825rem' }}
                          >
                            <MessageSquare size={14} /> Open Private Chat
                          </Link>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Declined</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
