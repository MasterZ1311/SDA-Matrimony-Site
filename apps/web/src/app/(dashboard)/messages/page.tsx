'use client';

import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCheck, Smile, Phone, Video, Info } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

const initialMessages: Message[] = [
  {
    id: 'm-1',
    senderId: 'sarah',
    text: 'Hello David! Thank you for accepting my interest. Happy Sabbath preparation!',
    timestamp: '10:14 AM',
    isMe: false,
  },
  {
    id: 'm-2',
    senderId: 'david',
    text: 'Happy Sabbath Sarah! It is a pleasure to connect. I saw you teach at Spencerville Academy — how long have you been involved in Adventist Christian education?',
    timestamp: '10:16 AM',
    isMe: true,
  },
  {
    id: 'm-3',
    senderId: 'sarah',
    text: 'This is my fifth year teaching science and biology. It is truly a mission field for me! How is your residency going at Loma Linda?',
    timestamp: '10:18 AM',
    isMe: false,
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'david',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    // Mock realistic reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          senderId: 'sarah',
          text: 'That is wonderful to hear! God is certainly directing your steps in healthcare ministry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
        },
      ]);
    }, 1500);
  };

  return (
    <div style={{ padding: '30px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="card" style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          height: '720px',
          overflow: 'hidden',
        }}>
          {/* Conversation List Sidebar */}
          <div style={{
            borderRight: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                Conversations
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                1 Active Matched Dialogue
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{
                padding: '16px 20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: 'var(--primary-50)',
                borderLeft: '4px solid var(--primary-700)',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundImage: 'url("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--success)',
                    borderRadius: '50%',
                    border: '2px solid #FFF',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                      Sarah Johnson
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10:18 AM</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    This is my fifth year teaching science...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#FAFAFA' }}>
            {/* Header */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundImage: 'url("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                    Sarah Johnson
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ● Online • Pastoral Verified
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-gold">94% Compatibility</span>
              </div>
            </div>

            {/* Safety Banner */}
            <div style={{
              backgroundColor: 'var(--primary-50)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: 'var(--primary-800)',
            }}>
              <ShieldCheck size={14} color="var(--primary-700)" />
              <span>
                Protected Matrimonial Chat: All conversations are conducted with Christian decorum, mutual respect, and faith integrity.
              </span>
            </div>

            {/* Message Stream */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((msg) => (
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
                      maxWidth: '70%',
                      padding: '12px 18px',
                      borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: msg.isMe ? 'var(--primary-800)' : '#FFFFFF',
                      color: msg.isMe ? '#FFFFFF' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.925rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {msg.timestamp} {msg.isMe && <CheckCheck size={13} color="var(--primary-600)" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 24px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '12px',
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
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
