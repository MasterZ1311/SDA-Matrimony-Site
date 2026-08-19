'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useMatrimonyStore, Conversation } from '@/stores/matrimonyStore';
import {
  Send,
  ShieldCheck,
  CheckCheck,
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

const ICEBREAKERS = [
  'Happy Sabbath preparation! What are your favorite Sabbath traditions?',
  'I loved your dedication to church ministry. What inspired you to serve?',
  'What is your favorite biblical promise or scripture that guides your life?',
];

export default function MessagesPage() {
  const { conversations, messages, sendMessage } = useMatrimonyStore();
  const [activeConvId, setActiveConvId] = useState<string>('conv-sarah');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];

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
    if (!inputText.trim()) return;
    sendMessage(activeConvId, inputText);
    setInputText('');
  };

  const handleSelectConv = (convId: string) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  };

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

            {/* Conversation Items */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#FFFFFF',
                      borderLeft: isSelected ? '4px solid var(--primary-700)' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundImage: `url(${conv.participantAvatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
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
                    backgroundImage: `url(${activeConv.participantAvatar})`,
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

            {/* Safety Banner */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '8px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--primary-800)',
              }}
            >
              <ShieldCheck size={14} color="var(--primary-700)" style={{ flexShrink: 0 }} />
              <span>
                Protected Matrimonial Chat: All conversations are held with Christian decorum, modesty, and faith integrity.
              </span>
            </div>

            {/* Message Stream */}
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
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.isMe ? 'var(--primary-800)' : '#FFFFFF',
                      color: msg.isMe ? '#FFFFFF' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      border: msg.isMe ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    {msg.text}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {msg.timestamp} {msg.isMe && <CheckCheck size={13} color="var(--primary-600)" />}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Icebreaker Suggestions */}
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Prompts:
              </span>
              {ICEBREAKERS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(prompt)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    backgroundColor: 'var(--primary-50)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: 'var(--primary-800)',
                    flexShrink: 0,
                  }}
                >
                  {prompt.slice(0, 38)}...
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '14px 20px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a thoughtful, Christ-centered message..."
                className="input-control"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn btn-primary"
                style={{ padding: '10px 18px' }}
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
