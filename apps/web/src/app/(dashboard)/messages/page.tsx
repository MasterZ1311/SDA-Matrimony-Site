'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useMatrimonyStore } from '@/stores/matrimonyStore';
import {
  Send,
  ShieldCheck,
  CheckCheck,
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Compass,
} from 'lucide-react';

const DEFAULT_ICEBREAKERS = [
  'Happy Sabbath preparation! What are your favorite Sabbath traditions?',
  'I loved your dedication to church ministry. What inspired you to serve?',
  'What is your favorite biblical promise or scripture that guides your life?',
  'Which Adventist university or academy did you attend?',
];

export default function MessagesPage() {
  const { conversations, messages, sendMessage, fetchConversations, fetchAiIcebreakers } = useMatrimonyStore();
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [aiIcebreakers, setAiIcebreakers] = useState<string[]>(DEFAULT_ICEBREAKERS);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showIcebreakerDrawer, setShowIcebreakerDrawer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const loadAiIcebreakers = async () => {
    if (!activeConv) return;
    setLoadingIcebreakers(true);
    try {
      const result = await fetchAiIcebreakers(activeConv.participantId);
      if (result && result.length > 0) {
        setAiIcebreakers(result);
      } else {
        setAiIcebreakers(DEFAULT_ICEBREAKERS);
      }
      setShowIcebreakerDrawer(true);
    } catch {
      setAiIcebreakers(DEFAULT_ICEBREAKERS);
      setShowIcebreakerDrawer(true);
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText);
    setInputText('');
  };

  const handleSelectConv = (convId: string) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  };

  if (conversations.length === 0) {
    return (
      <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card animate-fade" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <MessageSquare size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '8px' }}>
              No Active Conversations Yet
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              In accordance with Adventist matrimonial decorum, 1-on-1 text messaging is unlocked once both parties mutually accept an expression of interest.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/discover" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <Compass size={16} /> Browse Candidate Profiles
              </Link>
              <Link href="/interests" className="btn btn-outline" style={{ padding: '12px 24px' }}>
                View Sent & Received Interests
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div
          className="card chat-layout animate-fade"
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            height: '740px',
            overflow: 'hidden',
          }}
        >
          {/* Conversation List Sidebar */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              display: mobileShowChat ? 'none' : 'flex',
              flexDirection: 'column',
            }}
            className={mobileShowChat ? 'hide-mobile' : ''}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  Matrimonial Chat
                </h2>
                <span className="badge badge-primary">{conversations.length} Active</span>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search contacts..."
                  className="input-control"
                  style={{ paddingLeft: '32px', padding: '6px 12px 6px 32px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--primary-50)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--primary-700)' : '3px solid transparent',
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundImage: `url(${conv.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {conv.isOnline && (
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'var(--success)',
                            borderRadius: '50%',
                            border: '2px solid #FFF',
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <h4
                          style={{
                            fontSize: '0.925rem',
                            fontWeight: isSelected ? 700 : 600,
                            color: 'var(--primary-900)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {conv.participantName}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          margin: 0,
                        }}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          {activeConv && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FAFAFA',
                height: '100%',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="nav-mobile-toggle"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--primary-800)',
                      padding: '4px',
                    }}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundImage: `url(${activeConv.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                        {activeConv.participantName}
                      </h3>
                      {activeConv.isPastoralVerified && (
                        <CheckCircle2 size={14} color="var(--success)" />
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: activeConv.isOnline ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {activeConv.isOnline ? '● Active Now' : 'Offline'} • {activeConv.participantOccupation}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href={`/profile/${activeConv.participantId}`}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.775rem' }}
                  >
                    View Biodata
                  </Link>
                </div>
              </div>

              {/* Safety notice banner */}
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(197, 160, 89, 0.12)',
                  borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
                  fontSize: '0.75rem',
                  color: 'var(--primary-900)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={14} color="var(--accent-gold)" />
                <span>Protected by Adventist Community Guidelines & Real-Time Content Moderation</span>
              </div>

              {/* Messages Body */}
              <div
                style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {activeMessages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '440px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Sparkles size={18} color="var(--accent-gold)" />
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)', margin: 0 }}>
                        Christ-Centered AI Conversation Starters
                      </p>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      Click any prompt below to populate your message and break the ice respectfully:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiIcebreakers.map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setInputText(prompt)}
                          className="btn btn-outline"
                          style={{
                            fontSize: '0.825rem',
                            textAlign: 'left',
                            padding: '10px 14px',
                            backgroundColor: '#FFFFFF',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--primary-900)',
                            lineHeight: 1.4,
                          }}
                        >
                          <Sparkles size={13} color="var(--accent-gold)" style={{ display: 'inline', marginRight: '6px', flexShrink: 0 }} />
                          {prompt}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={loadAiIcebreakers}
                      disabled={loadingIcebreakers}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-700)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Sparkles size={12} /> {loadingIcebreakers ? 'Regenerating...' : 'Refresh AI Prompts'}
                    </button>
                  </div>
                ) : (
                  activeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.isMe ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 16px',
                          borderRadius: msg.isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          backgroundColor: msg.isMe ? 'var(--primary-800)' : '#FFFFFF',
                          color: msg.isMe ? '#FFFFFF' : 'var(--text-main)',
                          boxShadow: msg.isMe ? 'none' : 'var(--shadow-sm)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          border: msg.isMe ? 'none' : '1px solid var(--border-subtle)',
                        }}
                      >
                        {msg.text}
                      </div>

                      <div
                        style={{
                          fontSize: '0.675rem',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.isMe && <CheckCheck size={12} color="var(--primary-600)" />}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Dynamic AI Icebreaker Drawer */}
              {showIcebreakerDrawer && (
                <div
                  style={{
                    backgroundColor: 'var(--primary-50)',
                    borderTop: '1px solid var(--border-subtle)',
                    padding: '12px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} color="var(--accent-gold)" />
                      Personalized AI Faith Starters
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowIcebreakerDrawer(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                    >
                      Close ✕
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {aiIcebreakers.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setInputText(prompt);
                          setShowIcebreakerDrawer(false);
                        }}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          color: 'var(--primary-900)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Sparkles size={12} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#FFFFFF',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={loadAiIcebreakers}
                  disabled={loadingIcebreakers}
                  title="Generate AI Faith Prompts"
                  style={{
                    backgroundColor: 'rgba(200, 155, 60, 0.12)',
                    border: '1px solid rgba(200, 155, 60, 0.35)',
                    color: 'var(--accent-gold-dark, #8C6A1E)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Sparkles size={14} />
                  {loadingIcebreakers ? '...' : 'AI Starters'}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Send a faith-centered message to ${activeConv.participantName}...`}
                  className="input-control"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 18px',
                    opacity: inputText.trim() ? 1 : 0.6,
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
