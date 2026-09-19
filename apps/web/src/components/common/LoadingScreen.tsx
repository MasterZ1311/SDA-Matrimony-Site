'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

const SCRIPTURES = [
  {
    verse: 'Jeremiah 29:11',
    text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
  },
  {
    verse: 'Ecclesiastes 4:9-10',
    text: '"Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."',
  },
  {
    verse: 'Proverbs 3:5-6',
    text: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
  },
  {
    verse: '1 Corinthians 13:4, 7',
    text: '"Love is patient, love is kind... It always protects, always trusts, always hopes, always perseveres."',
  },
  {
    verse: 'Psalm 37:4',
    text: '"Take delight in the Lord, and he will give you the desires of your heart."',
  },
];

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Seeking God’s Will & Preparing Prayerful Connections...',
  fullScreen = true,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SCRIPTURES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scripture = SCRIPTURES[currentIdx];

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        maxWidth: '540px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* Animated Spiritual Icon with Halo */}
      <div
        style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 155, 60, 0.25) 0%, rgba(15, 37, 55, 0) 70%)',
            animation: 'pulse 2s infinite ease-in-out',
          }}
        />
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            boxShadow: '0 8px 24px rgba(15, 37, 55, 0.25)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Heart size={32} fill="var(--accent-gold)" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            color: 'var(--accent-gold)',
            zIndex: 3,
          }}
        >
          <Sparkles size={20} />
        </div>
      </div>

      {/* Main Status Message */}
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--primary-900)',
          marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}
      >
        {message}
      </h3>

      {/* Rotating Scripture Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          transition: 'all 0.5s ease',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--accent-gold)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          <BookOpen size={16} />
          {scripture.verse}
        </div>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '0.925rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          {scripture.text}
        </p>
      </div>

      {/* Progress Dots */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '20px',
        }}
      >
        {SCRIPTURES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIdx ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === currentIdx ? 'var(--accent-gold)' : 'var(--border-subtle)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '48px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {content}
    </div>
  );
};
