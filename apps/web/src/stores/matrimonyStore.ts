import { create } from 'zustand';

export interface CandidateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  occupation: string;
  highestEducation: string;
  institution?: string;
  city: string;
  state?: string;
  country: string;
  division: string;
  union?: string;
  conference: string;
  localChurch: string;
  baptismYear: number;
  baptismStatus: string;
  sabbathObservance: string;
  diet: string;
  temperance: string;
  musicPreferences: string;
  relocationPreference: string;
  isPastoralVerified: boolean;
  compatibilityScore: number;
  imageUrl: string;
  bioSnippet: string;
  favoriteScripture: string;
  activeMinistries: string[];
  familyBackground: {
    heritage: string;
    familyStructure: string;
    traditions: string;
  };
  pastorReference?: {
    name: string;
    church: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export interface InterestItem {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAge: number;
  candidateOccupation: string;
  candidateLocation: string;
  candidateDivision: string;
  imageUrl: string;
  introMessage: string;
  type: 'RECEIVED' | 'SENT';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  date: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantOccupation: string;
  compatibilityScore: number;
  isOnline: boolean;
  isPastoralVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface VerificationRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  churchName: string;
  conferenceName: string;
  divisionName: string;
  pastorName: string;
  pastorEmail: string;
  pastorPhone: string;
  referenceNotes: string;
  status: 'SUBMITTED_PENDING_PASTOR' | 'PASTOR_ENDORSED' | 'ADMIN_APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface MatrimonyStoreState {
  candidates: CandidateProfile[];
  interests: InterestItem[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  verifications: VerificationRequest[];
  toasts: ToastMessage[];

  // Actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  expressInterest: (candidateId: string, customMessage?: string) => boolean;
  withdrawInterest: (interestId: string) => void;
  updateInterestStatus: (interestId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  sendMessage: (conversationId: string, text: string) => void;
  updateVerificationStatus: (id: string, status: 'ADMIN_APPROVED' | 'REJECTED' | 'PASTOR_ENDORSED') => void;
  registerCandidate: (profile: CandidateProfile, pastorDetails?: { name: string; email: string; phone: string; notes?: string }) => void;
}

export const initialCandidates: CandidateProfile[] = [
  {
    id: 'demo-user-1',
    name: 'David Miller',
    age: 30,
    gender: 'MALE',
    occupation: 'Physician (MD - Internal Medicine)',
    highestEducation: 'Doctor of Medicine (MD)',
    institution: 'Loma Linda University School of Medicine',
    city: 'Loma Linda',
    state: 'California',
    country: 'United States',
    division: 'North American Division (NAD)',
    union: 'Pacific Union Conference',
    conference: 'Southeastern California Conference',
    localChurch: 'Loma Linda University Church',
    baptismYear: 2008,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Friday Sunset to Saturday Sunset',
    diet: 'Strict Vegan (Plant-Based)',
    temperance: 'Total Abstinence (Never consumed alcohol/tobacco)',
    musicPreferences: 'Classical sacred, Choral hymns, Orchestral',
    relocationPreference: 'Willing to relocate for medical missionary opportunities',
    isPastoralVerified: true,
    compatibilityScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Passionate about medical missionary work, classical sacred music, and healthy plant-based living.',
    favoriteScripture: 'Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth. — 3 John 1:2',
    activeMinistries: ['Health Ministries', 'Sabbath School Teacher', 'Medical Outreach'],
    familyBackground: {
      heritage: 'Third-generation Seventh-day Adventist family',
      familyStructure: 'Father (SDA Pastor), Mother (Nutritionist), 1 Sister',
      traditions: 'Sunset Friday Sabbath opening with family worship and sacred music.',
    },
    pastorReference: {
      name: 'Pastor Randy Roberts',
      church: 'Loma Linda University Church',
      email: 'pastor.randy@lluc.org',
      phone: '+1 (909) 558-4570',
      notes: 'Brother David has been in good and regular standing, serves actively in Sabbath school and medical missionary work.',
    },
  },
  {
    id: 'demo-user-2',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'FEMALE',
    occupation: 'Secondary Science Educator (M.Ed)',
    highestEducation: 'Master of Education (M.Ed)',
    institution: 'Andrews University',
    city: 'Silver Spring',
    state: 'Maryland',
    country: 'United States',
    division: 'North American Division (NAD)',
    union: 'Columbia Union Conference',
    conference: 'Chesapeake Conference',
    localChurch: 'Spencerville Seventh-day Adventist Church',
    baptismYear: 2010,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Sunset to Sunset (Sacred Time)',
    diet: 'Lacto-Ovo Vegetarian',
    temperance: 'Strict Abstinence (Lifetime abstainer)',
    musicPreferences: 'Sacred Choral, Acoustic Christian, Sacred piano',
    relocationPreference: 'Open to relocation across North American Division',
    isPastoralVerified: true,
    compatibilityScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Adventist academy educator passionate about youth ministry, pathfinders, literature evangelism, and family worship.',
    favoriteScripture: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. — Jeremiah 29:11',
    activeMinistries: ['Adventist Youth (AY Leader)', 'Pathfinder Counselor', 'Sabbath School'],
    familyBackground: {
      heritage: 'Multi-generational Adventist family dedicated to Christian education',
      familyStructure: 'Father (Healthcare Admin), Mother (RN), 1 Younger Brother',
      traditions: 'Friday evening Sabbath dinner with fresh baked bread and family devotion.',
    },
    pastorReference: {
      name: 'Pastor Chad Stuart',
      church: 'Spencerville SDA Church',
      email: 'pastor.chad@spencervillechurch.org',
      phone: '+1 (301) 384-2920',
      notes: 'Sister Sarah is an exemplary educator and youth leader. Highly recommended for godly Adventist courtship.',
    },
  },
  {
    id: 'demo-user-3',
    name: 'Rachel Vance',
    age: 26,
    gender: 'FEMALE',
    occupation: 'Critical Care Registered Nurse (BSN)',
    highestEducation: 'Bachelor of Science in Nursing (BSN)',
    institution: 'Southern Adventist University',
    city: 'Collegedale',
    state: 'Tennessee',
    country: 'United States',
    division: 'North American Division (NAD)',
    union: 'Southern Union Conference',
    conference: 'Georgia-Cumberland Conference',
    localChurch: 'Collegedale SDA Church',
    baptismYear: 2012,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Sunset to Sunset',
    diet: 'Strict Vegan (Whole Food Plant-Based)',
    temperance: 'Strict Abstinence',
    musicPreferences: 'Hymns, Contemporary Praise, Violin',
    relocationPreference: 'Willing to relocate nationally',
    isPastoralVerified: true,
    compatibilityScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Dedicated to the Adventist 8 laws of health (NEWSTART), ICU bedside ministry, and church choir leadership.',
    favoriteScripture: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding. — Proverbs 3:5',
    activeMinistries: ['Health Ministries Coordinator', 'Choir Member', 'Community Food Pantry'],
    familyBackground: {
      heritage: 'Adventist roots with strong missionary commitment in Southern Union',
      familyStructure: 'Parents (Both Educators), 2 Older Sisters',
      traditions: 'Nature hikes every Sabbath afternoon after fellowship lunch.',
    },
    pastorReference: {
      name: 'Pastor Jim Moon',
      church: 'Collegedale SDA Church',
      email: 'pastor.jim@collegedalesda.org',
      phone: '+1 (423) 396-2134',
      notes: 'Sister Rachel is a steadfast Christian with deep devotion to health ministry and worship.',
    },
  },
  {
    id: 'demo-user-4',
    name: 'Rebecca Mthembu',
    age: 29,
    gender: 'FEMALE',
    occupation: 'Senior Cloud Software Architect',
    highestEducation: 'Master of Science in Computer Science',
    institution: 'Helderberg College of Higher Education',
    city: 'Johannesburg',
    state: 'Gauteng',
    country: 'South Africa',
    division: 'Southern Africa-Indian Ocean (SID)',
    union: 'Southern Africa Union Conference',
    conference: 'Trans-Orange Conference',
    localChurch: 'Advent Centre SDA Church',
    baptismYear: 2011,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Sunset to Sunset',
    diet: 'Lacto-Ovo Vegetarian',
    temperance: 'Strict Abstinence',
    musicPreferences: 'A cappella gospel, Classical hymns',
    relocationPreference: 'Willing to relocate internationally',
    isPastoralVerified: true,
    compatibilityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Adventist Youth leader, digital evangelism advocate, loves Bible prophecy studies, photography, and hiking.',
    favoriteScripture: 'And they that be wise shall shine as the brightness of the firmament. — Daniel 12:3',
    activeMinistries: ['Digital Media Evangelism', 'Youth Elder', 'Adventist Community Services'],
    familyBackground: {
      heritage: 'Active Adventist leaders spanning two generations in South Africa',
      familyStructure: 'Father (Church Elder), Mother (Teacher), 1 Younger Brother',
      traditions: 'Sunrise Sabbath morning prayer group and AY afternoon youth meetings.',
    },
  },
  {
    id: 'demo-user-5',
    name: 'Jonathan Edwards',
    age: 32,
    gender: 'MALE',
    occupation: 'Hospital Chaplain & Ordained Minister',
    highestEducation: 'Master of Divinity (M.Div)',
    institution: 'Seventh-day Adventist Theological Seminary (Andrews University)',
    city: 'Berrien Springs',
    state: 'Michigan',
    country: 'United States',
    division: 'North American Division (NAD)',
    union: 'Lake Union Conference',
    conference: 'Michigan Conference',
    localChurch: 'Pioneer Memorial Church',
    baptismYear: 2006,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Friday Sunset to Saturday Sunset',
    diet: 'Lacto-Ovo Vegetarian',
    temperance: 'Strict Abstinence',
    musicPreferences: 'Choral anthems, Sacred pipe organ, Bluegrass Gospel',
    relocationPreference: 'Open to divine calling anywhere globally',
    isPastoralVerified: true,
    compatibilityScore: 93,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Dedicated pastoral care chaplain focused on family counseling, biblical theology, and hospital crisis ministry.',
    favoriteScripture: 'He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God? — Micah 6:8',
    activeMinistries: ['Pastoral Counseling', 'Prison Ministry', 'Youth Mentorship'],
    familyBackground: {
      heritage: 'Four generations of Adventist pastoral and missionary service',
      familyStructure: 'Father (Retired Seminary Dean), Mother (Social Worker), 2 Brothers',
      traditions: 'Community outreach and Bible study circles every Sabbath afternoon.',
    },
  },
  {
    id: 'demo-user-6',
    name: 'Hannah Alva',
    age: 27,
    gender: 'FEMALE',
    occupation: 'Physical Therapist (DPT)',
    highestEducation: 'Doctor of Physical Therapy (DPT)',
    institution: 'Spicer Adventist University',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    division: 'Southern Asia Division (SUD)',
    union: 'Western India Union Section',
    conference: 'Maharashtra Section',
    localChurch: 'Salisbury Park SDA Church',
    baptismYear: 2013,
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Sunset to Sunset',
    diet: 'Clean Foods (Levitical Clean Meats / Veg)',
    temperance: 'Strict Abstinence',
    musicPreferences: 'Christian devotional, Classical piano, Choral',
    relocationPreference: 'Willing to relocate internationally',
    isPastoralVerified: false,
    compatibilityScore: 86,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    bioSnippet: 'Holistic rehabilitation specialist passionate about health camps, children Sabbath school, and vegetarian cooking workshops.',
    favoriteScripture: 'I can do all things through Christ which strengtheneth me. — Philippians 4:13',
    activeMinistries: ['Children Sabbath School', 'Health Expos', 'Medical Camps'],
    familyBackground: {
      heritage: 'Faithful Adventist family rooted in Christian medical institution service',
      familyStructure: 'Parents (Hospital Staff), 1 Elder Sister',
      traditions: 'Friday evening vespers and Sabbath choir fellowship.',
    },
  },
];

const initialInterests: InterestItem[] = [
  {
    id: 'int-1',
    candidateId: 'demo-user-2',
    candidateName: 'Sarah Johnson',
    candidateAge: 28,
    candidateOccupation: 'Secondary Educator (M.Ed)',
    candidateLocation: 'Silver Spring, MD',
    candidateDivision: 'North American Division (NAD)',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    introMessage: 'Greetings! I noticed your commitment to medical missionary work and sacred music. I would love to connect and share more about our spiritual journeys.',
    type: 'RECEIVED',
    status: 'ACCEPTED',
    date: '2 hours ago',
  },
  {
    id: 'int-2',
    candidateId: 'demo-user-3',
    candidateName: 'Rachel Vance',
    candidateAge: 26,
    candidateOccupation: 'Registered Nurse (BSN)',
    candidateLocation: 'Loma Linda, CA',
    candidateDivision: 'North American Division (NAD)',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    introMessage: 'Happy Sabbath! I saw you are serving in Loma Linda. Looking forward to getting to know your family values and testimony in Christ.',
    type: 'RECEIVED',
    status: 'PENDING',
    date: '1 day ago',
  },
  {
    id: 'int-sent-1',
    candidateId: 'demo-user-4',
    candidateName: 'Rebecca Mthembu',
    candidateAge: 29,
    candidateOccupation: 'Software Engineer',
    candidateLocation: 'Johannesburg, South Africa',
    candidateDivision: 'Southern Africa-Indian Ocean (SID)',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    introMessage: 'Hello Rebecca, I was deeply inspired by your tech evangelism ministry and Sabbath dedication.',
    type: 'SENT',
    status: 'PENDING',
    date: '3 days ago',
  },
];

const initialConversations: Conversation[] = [
  {
    id: 'conv-sarah',
    participantId: 'demo-user-2',
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    participantOccupation: 'Secondary Science Teacher (M.Ed)',
    compatibilityScore: 94,
    isOnline: true,
    isPastoralVerified: true,
    lastMessage: 'This is my fifth year teaching science and biology. It is truly a mission field for me!',
    lastMessageTime: '10:18 AM',
    unreadCount: 0,
  },
  {
    id: 'conv-rachel',
    participantId: 'demo-user-3',
    participantName: 'Rachel Vance',
    participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    participantOccupation: 'Critical Care RN',
    compatibilityScore: 91,
    isOnline: false,
    isPastoralVerified: true,
    lastMessage: 'Happy Sabbath preparation! Have a blessed Friday sunset.',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
  },
  {
    id: 'conv-admin',
    participantId: 'demo-admin-1',
    participantName: 'Pastor Randy (Pastoral Advisor)',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    participantOccupation: 'Senior Pastor & Elder Liaison',
    compatibilityScore: 100,
    isOnline: true,
    isPastoralVerified: true,
    lastMessage: 'Your profile pastoral endorsement has been reviewed and affirmed. God bless your courtship journey.',
    lastMessageTime: 'Aug 14',
    unreadCount: 0,
  },
];

const initialMessagesData: Record<string, ChatMessage[]> = {
  'conv-sarah': [
    {
      id: 'm-1',
      conversationId: 'conv-sarah',
      senderId: 'demo-user-2',
      senderName: 'Sarah Johnson',
      text: 'Hello David! Thank you for accepting my interest. Happy Sabbath preparation!',
      timestamp: '10:14 AM',
      isMe: false,
    },
    {
      id: 'm-2',
      conversationId: 'conv-sarah',
      senderId: 'demo-user-1',
      senderName: 'David Miller',
      text: 'Happy Sabbath Sarah! It is a pleasure to connect. I saw you teach at Spencerville Academy — how long have you been involved in Adventist Christian education?',
      timestamp: '10:16 AM',
      isMe: true,
    },
    {
      id: 'm-3',
      conversationId: 'conv-sarah',
      senderId: 'demo-user-2',
      senderName: 'Sarah Johnson',
      text: 'This is my fifth year teaching science and biology. It is truly a mission field for me! How is your residency going at Loma Linda?',
      timestamp: '10:18 AM',
      isMe: false,
    },
  ],
  'conv-rachel': [
    {
      id: 'mr-1',
      conversationId: 'conv-rachel',
      senderId: 'demo-user-3',
      senderName: 'Rachel Vance',
      text: 'Happy Sabbath preparation! Have a blessed Friday sunset.',
      timestamp: 'Yesterday',
      isMe: false,
    },
  ],
  'conv-admin': [
    {
      id: 'ma-1',
      conversationId: 'conv-admin',
      senderId: 'demo-admin-1',
      senderName: 'Pastor Randy',
      text: 'Welcome Brother David. Your pastoral reference from Loma Linda University Church is active.',
      timestamp: 'Aug 14',
      isMe: false,
    },
  ],
};

const initialVerifications: VerificationRequest[] = [
  {
    id: 'ver-1',
    candidateId: 'demo-user-1',
    candidateName: 'David Miller',
    candidateEmail: 'david.miller@sda-matrimony.test',
    churchName: 'Loma Linda University Church',
    conferenceName: 'Southeastern California Conference',
    divisionName: 'North American Division',
    pastorName: 'Pastor Randy Roberts',
    pastorEmail: 'pastor.randy@lluc.org',
    pastorPhone: '+1 (909) 558-4570',
    referenceNotes: 'Brother David has been in good and regular standing, serves actively in Sabbath school and medical missionary work.',
    status: 'PASTOR_ENDORSED',
    submittedAt: 'August 14, 2026',
  },
  {
    id: 'ver-2',
    candidateId: 'demo-user-2',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@sda-matrimony.test',
    churchName: 'Spencerville SDA Church',
    conferenceName: 'Chesapeake Conference',
    divisionName: 'North American Division',
    pastorName: 'Pastor Chad Stuart',
    pastorEmail: 'pastor.chad@spencervillechurch.org',
    pastorPhone: '+1 (301) 384-2920',
    referenceNotes: 'Sister Sarah is an exemplary educator and youth leader. Highly recommended for godly Adventist courtship.',
    status: 'ADMIN_APPROVED',
    submittedAt: 'August 10, 2026',
  },
  {
    id: 'ver-3',
    candidateId: 'demo-user-6',
    candidateName: 'Hannah Alva',
    candidateEmail: 'hannah.alva@sda-matrimony.test',
    churchName: 'Salisbury Park SDA Church',
    conferenceName: 'Western India Union',
    divisionName: 'Southern Asia Division',
    pastorName: 'Pastor Samuel Gaikwad',
    pastorEmail: 'pastor.samuel@sud-adventist.org',
    pastorPhone: '+91 20 2426 3123',
    referenceNotes: 'Sister Hannah is a dedicated youth leader and physical therapist. Actively preparing pastoral endorsement documents.',
    status: 'SUBMITTED_PENDING_PASTOR',
    submittedAt: 'August 17, 2026',
  },
];

export const useMatrimonyStore = create<MatrimonyStoreState>((set, get) => ({
  candidates: initialCandidates,
  interests: initialInterests,
  conversations: initialConversations,
  messages: initialMessagesData,
  verifications: initialVerifications,
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  registerCandidate: (profile, pastorDetails) => {
    const state = get();
    
    // Add to candidates list (or update if already exists)
    const exists = state.candidates.some((c) => c.id === profile.id);
    const updatedCandidates = exists
      ? state.candidates.map((c) => (c.id === profile.id ? profile : c))
      : [profile, ...state.candidates];

    // Create verification request
    const newVerification: VerificationRequest = {
      id: `ver-${Date.now()}`,
      candidateId: profile.id,
      candidateName: profile.name,
      candidateEmail: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@sda-matrimony.org`,
      churchName: profile.localChurch,
      conferenceName: profile.conference || 'General Conference',
      divisionName: profile.division,
      pastorName: pastorDetails?.name || 'Local Church Pastor',
      pastorEmail: pastorDetails?.email || 'pastor@church.org',
      pastorPhone: pastorDetails?.phone || '+1 (555) 019-2831',
      referenceNotes: pastorDetails?.notes || 'New registration submitted. Awaiting verification of Adventist church membership records.',
      status: 'SUBMITTED_PENDING_PASTOR',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    set({
      candidates: updatedCandidates,
      verifications: [newVerification, ...state.verifications],
    });
  },

  expressInterest: (candidateId, customMessage) => {
    const state = get();
    const candidate = state.candidates.find((c) => c.id === candidateId);
    if (!candidate) return false;

    // Check if already sent
    const alreadySent = state.interests.some(
      (i) => i.candidateId === candidateId && i.type === 'SENT'
    );
    if (alreadySent) {
      state.addToast({
        title: 'Interest Already Expressed',
        description: `You have already sent an expression of interest to ${candidate.name}.`,
        type: 'info',
      });
      return false;
    }

    const newInterest: InterestItem = {
      id: `int-sent-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateAge: candidate.age,
      candidateOccupation: candidate.occupation,
      candidateLocation: `${candidate.city}, ${candidate.country}`,
      candidateDivision: candidate.division,
      imageUrl: candidate.imageUrl,
      introMessage:
        customMessage ||
        `Greetings ${candidate.name}, I reviewed your faith profile and would be honored to connect and discuss our Christian journey.`,
      type: 'SENT',
      status: 'PENDING',
      date: 'Just now',
    };

    set({
      interests: [newInterest, ...state.interests],
    });

    state.addToast({
      title: 'Expression of Interest Sent! 💌',
      description: `Your Christ-centered expression was delivered to ${candidate.name}.`,
      type: 'success',
    });

    return true;
  },

  withdrawInterest: (interestId) => {
    const state = get();
    const target = state.interests.find((i) => i.id === interestId);
    set({
      interests: state.interests.filter((i) => i.id !== interestId),
    });
    if (target) {
      state.addToast({
        title: 'Interest Withdrawn',
        description: `Your interest request to ${target.candidateName} has been withdrawn.`,
        type: 'info',
      });
    }
  },

  updateInterestStatus: (interestId, newStatus) => {
    const state = get();
    const target = state.interests.find((i) => i.id === interestId);
    if (!target) return;

    set({
      interests: state.interests.map((i) =>
        i.id === interestId ? { ...i, status: newStatus } : i
      ),
    });

    // If accepted, ensure conversation exists
    if (newStatus === 'ACCEPTED') {
      const convExists = state.conversations.some(
        (c) => c.participantId === target.candidateId
      );
      if (!convExists) {
        const newConv: Conversation = {
          id: `conv-${target.candidateId}`,
          participantId: target.candidateId,
          participantName: target.candidateName,
          participantAvatar: target.imageUrl,
          participantOccupation: target.candidateOccupation,
          compatibilityScore: 92,
          isOnline: true,
          isPastoralVerified: true,
          lastMessage: target.introMessage,
          lastMessageTime: 'Just now',
          unreadCount: 0,
        };
        set((prev) => ({
          conversations: [newConv, ...prev.conversations],
          messages: {
            ...prev.messages,
            [`conv-${target.candidateId}`]: [
              {
                id: `msg-init-${Date.now()}`,
                conversationId: `conv-${target.candidateId}`,
                senderId: target.candidateId,
                senderName: target.candidateName,
                text: target.introMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
              },
            ],
          },
        }));
      }

      state.addToast({
        title: 'Interest Accepted! 🎉',
        description: `Private matrimonial chat unlocked with ${target.candidateName}.`,
        type: 'success',
      });
    } else {
      state.addToast({
        title: 'Interest Declined',
        description: `Politely declined request from ${target.candidateName}.`,
        type: 'info',
      });
    }
  },

  sendMessage: (conversationId, text) => {
    const state = get();
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'demo-user-1',
      senderName: 'David Miller',
      text: text.trim(),
      timestamp: timeStr,
      isMe: true,
    };

    const existingMsgs = state.messages[conversationId] || [];
    set({
      messages: {
        ...state.messages,
        [conversationId]: [...existingMsgs, newMsg],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: text.trim(), lastMessageTime: timeStr }
          : c
      ),
    });

    // Realistic auto-reply simulation
    const conv = state.conversations.find((c) => c.id === conversationId);
    if (conv && conv.participantId !== 'demo-admin-1') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId,
          senderId: conv.participantId,
          senderName: conv.participantName,
          text: `Thank you for sharing, David! May God continue to guide our communication and fellowship.`,
          timestamp: replyTime,
          isMe: false,
        };

        const currentMsgs = get().messages[conversationId] || [];
        set({
          messages: {
            ...get().messages,
            [conversationId]: [...currentMsgs, autoReply],
          },
          conversations: get().conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: autoReply.text, lastMessageTime: replyTime }
              : c
          ),
        });
      }, 1400);
    }
  },

  updateVerificationStatus: (id, newStatus) => {
    const state = get();
    const target = state.verifications.find((v) => v.id === id);
    if (!target) return;

    // Update verifications list
    const updatedVerifications = state.verifications.map((v) =>
      v.id === id ? { ...v, status: newStatus } : v
    );

    // If candidate approved, update candidate badge in store too
    const updatedCandidates = state.candidates.map((c) => {
      if (c.id === target.candidateId || c.name === target.candidateName) {
        return { ...c, isPastoralVerified: newStatus === 'ADMIN_APPROVED' };
      }
      return c;
    });

    set({
      verifications: updatedVerifications,
      candidates: updatedCandidates,
    });

    state.addToast({
      title:
        newStatus === 'ADMIN_APPROVED'
          ? 'Member Badge Granted! 🛡️'
          : newStatus === 'REJECTED'
          ? 'Verification Rejected'
          : 'Status Updated',
      description: `Verification status for ${target.candidateName} updated to ${newStatus}.`,
      type: newStatus === 'ADMIN_APPROVED' ? 'success' : 'warning',
    });
  },
}));
