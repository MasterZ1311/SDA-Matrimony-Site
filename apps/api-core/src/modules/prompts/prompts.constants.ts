export interface FaithPromptDefinition {
  key: string;
  category: string;
  question: string;
  placeholder?: string;
}

export const FAITH_PROMPTS: FaithPromptDefinition[] = [
  {
    key: 'SABBATH_TYPICAL',
    category: 'MY SABBATH WALK',
    question: 'A typical Sabbath afternoon for me consists of...',
    placeholder: 'Visiting church shut-ins, walking in God’s nature, singing hymns with friends...',
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

export const ALLOWED_PROMPT_KEYS: string[] = FAITH_PROMPTS.map((p) => p.key);

export const FAITH_PROMPT_MAP: Record<string, FaithPromptDefinition> = FAITH_PROMPTS.reduce(
  (acc, curr) => {
    acc[curr.key] = curr;
    return acc;
  },
  {} as Record<string, FaithPromptDefinition>,
);
