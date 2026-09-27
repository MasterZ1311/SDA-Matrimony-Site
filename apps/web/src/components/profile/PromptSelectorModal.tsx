'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2, Check, Loader2, HelpCircle } from 'lucide-react';
import { useMatrimonyStore, PromptAnswerItem } from '@/stores/matrimonyStore';

export const FAITH_PROMPTS_OPTIONS = [
  {
    key: 'SABBATH_TYPICAL',
    category: 'MY SABBATH WALK',
    question: 'A typical Sabbath afternoon for me consists of...',
    placeholder: 'Visiting church shut-ins, taking a prayer walk in nature, singing hymns with friends...',
  },
  {
    key: 'SPOUSE_QUALITIES',
    category: 'CHRISTIAN COURTSHIP',
    question: 'The spiritual qualities I value most in a future spouse are...',
    placeholder: 'A genuine prayer life, humility, kindness, and devotion to biblical principles...',
  },
  {
    key: 'MISSION_PASSION',
    category: 'FAITH & CALLING',
    question: 'A church ministry or community project close to my heart is...',
    placeholder: 'Pathfinders leadership, community medical missionary outreach, youth Sabbath School...',
  },
  {
    key: 'SPIRITUAL_ADVICE',
    category: 'SPIRITUAL ANCHOR',
    question: 'The best spiritual advice or biblical promise that has shaped my life...',
    placeholder: 'Jeremiah 29:11, Proverbs 3:5-6, or advice on prayer from a godly mentor...',
  },
  {
    key: 'CHRISTIAN_HOME',
    category: 'CHRISTIAN HOME',
    question: 'The non-negotiables in my future Adventist home are...',
    placeholder: 'Friday sunset family worship, an open-door hospitality spirit, peaceful home atmosphere...',
  },
  {
    key: 'FAVORITE_HYMN_BIBLE',
    category: 'DEVOTIONAL LIFE',
    question: 'My favorite hymn or passage of Scripture and why it moves me...',
    placeholder: 'Hymn #100 "Great Is Thy Faithfulness", Romans 8:38-39...',
  },
  {
    key: 'ADVENTIST_VALUES',
    category: 'ADVENTIST HERITAGE',
    question: 'How my Adventist faith and conviction has shaped who I am today...',
    placeholder: 'Living the health message, Sabbath rest, and living with the hope of the Blessed Hope...',
  },
  {
    key: 'FAITH_IN_DIFFICULTIES',
    category: 'PERSONAL TESTIMONY',
    question: 'A moment where God clearly guided my footsteps during uncertainty...',
    placeholder: 'During college decisions, career changes, or a time God miraculously provided...',
  },
];

interface PromptSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompts?: PromptAnswerItem[];
  onSaved?: (updated: PromptAnswerItem[]) => void;
}

export const PromptSelectorModal: React.FC<PromptSelectorModalProps> = ({
  isOpen,
  onClose,
  initialPrompts = [],
  onSaved,
}) => {
  const { savePromptAnswers, fetchMyPrompts, addToast } = useMatrimonyStore();
  const [prompts, setPrompts] = useState<{ promptKey: string; answer: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialPrompts.length > 0) {
        setPrompts(initialPrompts.map((p) => ({ promptKey: p.promptKey, answer: p.answer })));
      } else {
        // Default to first prompt if empty
        setPrompts([
          {
            promptKey: 'SABBATH_TYPICAL',
            answer: '',
          },
        ]);
      }
    }
  }, [isOpen, initialPrompts]);

  if (!isOpen) return null;

  const handleAddPrompt = () => {
    if (prompts.length >= 3) {
      addToast({
        title: 'Limit Reached',
        description: 'You can showcase up to 3 prompts on your profile.',
        type: 'warning',
      });
      return;
    }
    // Find first key not already selected
    const chosenKeys = prompts.map((p) => p.promptKey);
    const availableOption = FAITH_PROMPTS_OPTIONS.find((opt) => !chosenKeys.includes(opt.key));
    if (availableOption) {
      setPrompts([...prompts, { promptKey: availableOption.key, answer: '' }]);
    }
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...prompts];
    updated[index].promptKey = newKey;
    setPrompts(updated);
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updated = [...prompts];
    updated[index].answer = answer;
    setPrompts(updated);
  };

  const handleSave = async () => {
    // Validate that all have answers
    const emptyIdx = prompts.findIndex((p) => !p.answer.trim());
    if (emptyIdx !== -1) {
      addToast({
        title: 'Incomplete Answer',
        description: `Please write an answer for Prompt #${emptyIdx + 1} or remove it.`,
        type: 'warning',
      });
      return;
    }

    setIsSaving(true);
    const success = await savePromptAnswers(prompts);
    setIsSaving(false);
    if (success) {
      const refreshed = await fetchMyPrompts();
      if (onSaved) {
        onSaved(refreshed);
      }
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--primary-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="var(--primary-800)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                Faith & Calling Prompts
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select up to 3 prompts that reflect your Adventist spiritual walk and home values
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {prompts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
              <HelpCircle size={36} style={{ margin: '0 auto 12px auto' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No prompts selected yet.</p>
            </div>
          ) : (
            prompts.map((item, idx) => {
              const selectedOption =
                FAITH_PROMPTS_OPTIONS.find((opt) => opt.key === item.promptKey) ||
                FAITH_PROMPTS_OPTIONS[0];

              const chosenKeysElsewhere = prompts
                .filter((_, i) => i !== idx)
                .map((p) => p.promptKey);

              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    backgroundColor: '#FAFAFA',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: 'var(--primary-800)',
                        backgroundColor: 'var(--primary-50)',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Prompt {idx + 1} • {selectedOption.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemovePrompt(idx)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  {/* Prompt Question Dropdown */}
                  <div style={{ marginBottom: '12px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--primary-900)',
                        marginBottom: '6px',
                      }}
                    >
                      Select Prompt Question:
                    </label>
                    <select
                      value={item.promptKey}
                      onChange={(e) => handleKeyChange(idx, e.target.value)}
                      className="input"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--primary-900)',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {FAITH_PROMPTS_OPTIONS.map((opt) => (
                        <option
                          key={opt.key}
                          value={opt.key}
                          disabled={chosenKeysElsewhere.includes(opt.key)}
                        >
                          [{opt.category}] {opt.question}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prompt Answer Input */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--primary-900)',
                        }}
                      >
                        Your Reflection:
                      </label>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: item.answer.length > 550 ? 'var(--danger)' : 'var(--text-muted)',
                        }}
                      >
                        {item.answer.length}/600
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={600}
                      value={item.answer}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      placeholder={selectedOption.placeholder}
                      className="input"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        backgroundColor: '#FFFFFF',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}

          {prompts.length < 3 && (
            <button
              type="button"
              onClick={handleAddPrompt}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderStyle: 'dashed',
                borderWidth: '1.5px',
                color: 'var(--primary-800)',
                fontWeight: 700,
              }}
            >
              <Plus size={16} /> Add Another Faith Prompt ({prompts.length}/3)
            </button>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#F8FAFC',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="btn btn-outline"
            style={{ padding: '8px 18px', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
            style={{
              padding: '8px 24px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check size={16} /> Save Prompts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
