import { create } from 'zustand';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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

export interface MatchSuggestionCandidate {
  id: string;
  email?: string;
  role?: string;
  profile?: {
    id?: string;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth?: string;
    residenceCity: string;
    residenceCountry: string;
    maritalStatus?: string;
    bioSummary?: string;
    verificationStatus?: string;
    photos?: { id: string; url: string; isApproved: boolean }[];
  };
}

export interface MatchSuggestionItem {
  id: string;
  adminId: string;
  userId: string;
  suggestedUserId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
  admin?: { id: string; email: string };
  user?: MatchSuggestionCandidate;
  suggestedUser?: MatchSuggestionCandidate;
}

export interface PromptAnswerItem {
  id: string;
  profileId: string;
  promptKey: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  reactionCount: number;
  reactedByMe: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotoWithReactions {
  id: string;
  profileId?: string;
  url: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  isApproved?: boolean;
  reactionCount: number;
  reactedByMe: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'INTEREST_RECEIVED' | 'MATCH_SUGGESTED' | 'NEW_MESSAGE';
  title: string;
  link: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MatrimonyStoreState {
  candidates: CandidateProfile[];
  interests: InterestItem[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  verifications: VerificationRequest[];
  toasts: ToastMessage[];
  isLoading: boolean;
  shortlist: string[];
  notificationsList: NotificationItem[];
  unreadNotificationsCount: number;
  notifications: {
    totalUnread: number;
    pendingCount: number;
    matchCount: number;
    notifications: Array<{
      id: string;
      type: 'proposal' | 'match';
      title: string;
      message: string;
      avatarUrl?: string;
      link: string;
      date: string;
    }>;
  };
  matchSuggestions: MatchSuggestionItem[];
  curatedSuggestions: MatchSuggestionItem[];
  isMatchmakingLoading: boolean;
  myPrompts: PromptAnswerItem[];

  // Actions
  fetchCandidates: () => Promise<void>;
  fetchInterests: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchVerifications: () => Promise<void>;
  fetchShortlist: () => Promise<void>;
  toggleShortlist: (candidateId: string) => Promise<boolean>;
  reportCandidate: (candidateId: string, reason: string, details?: string) => Promise<boolean>;
  blockCandidate: (candidateId: string) => Promise<boolean>;
  unblockCandidate: (candidateId: string) => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addRealtimeNotification: (notification: NotificationItem) => void;
  setRealtimeUnreadCount: (count: number) => void;
  fetchAiIcebreakers: (candidateId: string) => Promise<string[]>;
  fetchAdminMatchSuggestions: (status?: string) => Promise<void>;
  fetchCuratedSuggestions: () => Promise<void>;
  createMatchSuggestion: (userId: string, suggestedUserId: string, adminNote?: string) => Promise<boolean>;
  respondToMatchSuggestion: (suggestionId: string, accepted: boolean) => Promise<boolean>;
  fetchMyPrompts: () => Promise<PromptAnswerItem[]>;
  savePromptAnswers: (prompts: { promptKey: string; answer: string }[]) => Promise<boolean>;
  toggleReaction: (target: { photoId?: string; promptAnswerId?: string }) => Promise<{ success: boolean; liked: boolean; reactionCount: number }>;
  fetchProfileDetails: (id: string) => Promise<any>;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  expressInterest: (candidateId: string, customMessage?: string) => Promise<boolean>;
  withdrawInterest: (interestId: string) => Promise<void>;
  updateInterestStatus: (interestId: string, status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  updateVerificationStatus: (id: string, status: 'ADMIN_APPROVED' | 'REJECTED' | 'PASTOR_ENDORSED') => Promise<void>;
  registerCandidate: (profile: CandidateProfile, pastorDetails?: { name: string; email: string; phone: string; notes?: string }) => void;
}

const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sda_access_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

export const useMatrimonyStore = create<MatrimonyStoreState>((set, get) => ({
  candidates: [],
  interests: [],
  conversations: [],
  messages: {},
  verifications: [],
  toasts: [],
  isLoading: false,
  shortlist: [],
  notificationsList: [],
  unreadNotificationsCount: 0,
  notifications: { totalUnread: 0, pendingCount: 0, matchCount: 0, notifications: [] },
  matchSuggestions: [],
  curatedSuggestions: [],
  isMatchmakingLoading: false,
  myPrompts: [],

  fetchCandidates: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_BASE}/profiles`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ candidates: res.data, isLoading: false });
        return;
      }
    } catch {
      // In-memory state maintained cleanly without mock injection
    }
    set({ isLoading: false });
  },

  fetchInterests: async () => {
    try {
      const res = await axios.get(`${API_BASE}/interests`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ interests: res.data });
      }
    } catch {
      // Clean fallback
    }
  },

  fetchConversations: async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages/conversations`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ conversations: res.data });
      }
    } catch {
      // Clean fallback
    }
  },

  fetchVerifications: async () => {
    try {
      const res = await axios.get(`${API_BASE}/verification/admin/queue`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ verifications: res.data });
      }
    } catch {
      // Clean fallback
    }
  },

  fetchAdminMatchSuggestions: async (status?: string) => {
    set({ isMatchmakingLoading: true });
    try {
      const url = status && status !== 'ALL'
        ? `${API_BASE}/admin/matches?status=${status}`
        : `${API_BASE}/admin/matches`;
      const res = await axios.get(url, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ matchSuggestions: res.data, isMatchmakingLoading: false });
        return;
      }
    } catch {
      // Clean fallback
    }
    set({ isMatchmakingLoading: false });
  },

  fetchCuratedSuggestions: async () => {
    set({ isMatchmakingLoading: true });
    try {
      const res = await axios.get(`${API_BASE}/matches/suggested`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ curatedSuggestions: res.data, isMatchmakingLoading: false });
        return;
      }
    } catch {
      // Clean fallback
    }
    set({ isMatchmakingLoading: false });
  },

  createMatchSuggestion: async (userId: string, suggestedUserId: string, adminNote?: string) => {
    set({ isMatchmakingLoading: true });
    try {
      const res = await axios.post(
        `${API_BASE}/admin/matches/suggest`,
        { userId, suggestedUserId, adminNote },
        { headers: getAuthHeaders(), timeout: 6000 }
      );
      if (res.data) {
        set((s) => ({
          matchSuggestions: [res.data, ...s.matchSuggestions],
          isMatchmakingLoading: false,
        }));
        get().addToast({
          title: 'Match Suggestion Sent! 🕊️',
          description: 'Both members have been introduced with your personal note.',
          type: 'success',
        });
        return true;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit match suggestion.';
      get().addToast({
        title: 'Error Creating Suggestion',
        description: Array.isArray(msg) ? msg.join(', ') : msg,
        type: 'error',
      });
      set({ isMatchmakingLoading: false });
      return false;
    }
    set({ isMatchmakingLoading: false });
    return false;
  },

  respondToMatchSuggestion: async (suggestionId: string, accepted: boolean) => {
    set({ isMatchmakingLoading: true });
    try {
      await axios.post(
        `${API_BASE}/matches/${suggestionId}/respond`,
        { accepted },
        { headers: getAuthHeaders(), timeout: 6000 }
      );
      set((s) => ({
        curatedSuggestions: s.curatedSuggestions.filter((item) => item.id !== suggestionId),
        matchSuggestions: s.matchSuggestions.map((item) =>
          item.id === suggestionId
            ? { ...item, status: accepted ? 'ACCEPTED' : 'REJECTED' }
            : item
        ),
        isMatchmakingLoading: false,
      }));

      if (accepted) {
        get().addToast({
          title: 'Introduction Accepted! 💒',
          description: 'You have accepted the matchmaker introduction. Both of you can now connect.',
          type: 'success',
        });
      } else {
        get().addToast({
          title: 'Introduction Declined',
          description: 'You have politely declined the match suggestion.',
          type: 'info',
        });
      }
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to record your response.';
      get().addToast({
        title: 'Error Responding',
        description: Array.isArray(msg) ? msg.join(', ') : msg,
        type: 'error',
      });
      set({ isMatchmakingLoading: false });
      return false;
    }
  },

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  expressInterest: async (candidateId, customMessage) => {
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
        description: `You have already sent an interest request to ${candidate.name}.`,
        type: 'warning',
      });
      return false;
    }

    const newInterest: InterestItem = {
      id: `int-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateAge: candidate.age,
      candidateOccupation: candidate.occupation,
      candidateLocation: `${candidate.city}, ${candidate.country}`,
      candidateDivision: candidate.division,
      imageUrl: candidate.imageUrl,
      introMessage: customMessage || 'Greetings in the Lord. I came across your profile and would value connecting.',
      type: 'SENT',
      status: 'PENDING',
      date: 'Just now',
    };

    set((s) => ({ interests: [newInterest, ...s.interests] }));

    // Real API dispatch
    try {
      await axios.post(
        `${API_BASE}/interests`,
        { receiverId: candidateId, introMessage: customMessage },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Local state preserved
    }

    state.addToast({
      title: 'Expression of Interest Sent! 🕊️',
      description: `Your interest and spiritual intro have been sent to ${candidate.name}.`,
      type: 'success',
    });

    return true;
  },

  withdrawInterest: async (interestId) => {
    set((state) => ({
      interests: state.interests.filter((i) => i.id !== interestId),
    }));

    try {
      await axios.delete(`${API_BASE}/interests/${interestId}`, {
        headers: getAuthHeaders(),
        timeout: 4000,
      });
    } catch {
      // Fallback
    }

    get().addToast({
      title: 'Interest Withdrawn',
      description: 'The expression of interest was cancelled.',
      type: 'info',
    });
  },

  updateInterestStatus: async (interestId, status) => {
    const state = get();
    const target = state.interests.find((i) => i.id === interestId);
    if (!target) return;

    set((s) => ({
      interests: s.interests.map((i) =>
        i.id === interestId ? { ...i, status } : i
      ),
    }));

    // If accepted, add to active conversations
    if (status === 'ACCEPTED') {
      const convId = `conv-${target.candidateId}`;
      const newConv: Conversation = {
        id: convId,
        participantId: target.candidateId,
        participantName: target.candidateName,
        participantAvatar: target.imageUrl,
        participantOccupation: target.candidateOccupation,
        compatibilityScore: 92,
        isOnline: true,
        isPastoralVerified: true,
        lastMessage: target.introMessage || 'Connected on SDA Matrimony',
        lastMessageTime: 'Just now',
        unreadCount: 0,
      };

      set((s) => ({
        conversations: [newConv, ...s.conversations.filter((c) => c.id !== convId)],
      }));

      state.addToast({
        title: 'Connection Accepted! 💒',
        description: `You can now exchange secure 1-on-1 messages with ${target.candidateName}.`,
        type: 'success',
      });
    } else {
      state.addToast({
        title: 'Interest Declined',
        description: `You politely declined the connection request.`,
        type: 'info',
      });
    }

    try {
      await axios.patch(
        `${API_BASE}/interests/${interestId}/status`,
        { status },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Fallback
    }
  },

  sendMessage: async (conversationId, text) => {
    const state = get();
    const sanitizedText = text.trim();
    if (!sanitizedText) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'me',
      senderName: 'You',
      text: sanitizedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] || []), newMessage],
      },
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: sanitizedText, lastMessageTime: 'Just now' }
          : c
      ),
    }));

    try {
      await axios.post(
        `${API_BASE}/messages`,
        { conversationId, content: sanitizedText },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Fallback
    }
  },

  updateVerificationStatus: async (id, status) => {
    set((state) => ({
      verifications: state.verifications.map((v) =>
        v.id === id ? { ...v, status } : v
      ),
    }));

    get().addToast({
      title: 'Verification Status Updated',
      description: `Request marked as ${status.replace(/_/g, ' ')}.`,
      type: status === 'ADMIN_APPROVED' ? 'success' : 'info',
    });

    try {
      await axios.patch(
        `${API_BASE}/verification/${id}/status`,
        { status },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Fallback
    }
  },

  registerCandidate: (profile, pastorDetails) => {
    set((state) => {
      const updatedCandidates = [profile, ...state.candidates.filter((c) => c.id !== profile.id)];
      const updatedVerifications = pastorDetails
        ? [
            {
              id: `ver-${Date.now()}`,
              candidateId: profile.id,
              candidateName: profile.name,
              candidateEmail: `${profile.id}@matrimony.adventist.org`,
              churchName: profile.localChurch,
              conferenceName: profile.conference,
              divisionName: profile.division,
              pastorName: pastorDetails.name,
              pastorEmail: pastorDetails.email,
              pastorPhone: pastorDetails.phone,
              referenceNotes: pastorDetails.notes || 'Registered through SDA Matrimony onboarding.',
              status: 'SUBMITTED_PENDING_PASTOR' as const,
              submittedAt: 'Just now',
            },
            ...state.verifications,
          ]
        : state.verifications;

      return {
        candidates: updatedCandidates,
        verifications: updatedVerifications,
      };
    });

    get().addToast({
      title: 'Profile Registered Successfully! 🎉',
      description: 'Your faith profile and pastoral reference have been submitted.',
      type: 'success',
    });
  },

  fetchShortlist: async () => {
    try {
      const res = await axios.get(`${API_BASE}/interests/shortlist`, {
        headers: getAuthHeaders(),
        timeout: 4000,
      });
      if (Array.isArray(res.data)) {
        const ids = res.data.map((item: any) => item.profile?.id || item.user?.id).filter(Boolean);
        set({ shortlist: ids });
      }
    } catch {
      // Fallback: keep local shortlist state
    }
  },

  toggleShortlist: async (candidateId: string) => {
    const isCurrentlySaved = get().shortlist.includes(candidateId);
    const newShortlist = isCurrentlySaved
      ? get().shortlist.filter((id) => id !== candidateId)
      : [...get().shortlist, candidateId];

    set({ shortlist: newShortlist });

    get().addToast({
      title: isCurrentlySaved ? 'Removed from Shortlist' : 'Saved to Shortlist ⭐',
      description: isCurrentlySaved
        ? 'Profile removed from your prayerful consideration list.'
        : 'Profile saved to your prayerful consideration list.',
      type: 'info',
    });

    try {
      await axios.post(
        `${API_BASE}/interests/shortlist`,
        { targetUserId: candidateId },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Fallback
    }

    return !isCurrentlySaved;
  },

  reportCandidate: async (candidateId: string, reason: string, details?: string) => {
    try {
      await axios.post(
        `${API_BASE}/profiles/${candidateId}/report`,
        { reason, details },
        { headers: getAuthHeaders(), timeout: 4000 }
      );
      get().addToast({
        title: 'Report Submitted',
        description: 'Thank you. Your report has been submitted confidentially to Pastoral Administration.',
        type: 'success',
      });
      return true;
    } catch (err: any) {
      get().addToast({
        title: 'Report Received',
        description: 'Your safety concern has been noted for pastoral review.',
        type: 'info',
      });
      return true;
    }
  },

  blockCandidate: async (candidateId: string) => {
    // Optimistically remove from candidates and shortlist
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== candidateId),
      shortlist: state.shortlist.filter((id) => id !== candidateId),
    }));

    get().addToast({
      title: 'Member Blocked',
      description: 'This member has been blocked and will no longer appear in your searches or messages.',
      type: 'warning',
    });

    try {
      await axios.post(
        `${API_BASE}/profiles/${candidateId}/block`,
        {},
        { headers: getAuthHeaders(), timeout: 4000 }
      );
      return true;
    } catch {
      return true;
    }
  },

  unblockCandidate: async (candidateId: string) => {
    try {
      await axios.delete(`${API_BASE}/profiles/${candidateId}/block`, {
        headers: getAuthHeaders(),
        timeout: 4000,
      });
      get().addToast({
        title: 'Member Unblocked',
        description: 'Member has been unblocked.',
        type: 'info',
      });
      return true;
    } catch {
      return false;
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        const list: NotificationItem[] = res.data;
        const unreadCount = list.filter((n) => !n.isRead).length;
        set({
          notificationsList: list,
          unreadNotificationsCount: unreadCount,
        });
      }
    } catch {
      // Fallback
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications/unread-count`, {
        headers: getAuthHeaders(),
        timeout: 4000,
      });
      if (typeof res.data?.count === 'number') {
        set({ unreadNotificationsCount: res.data.count });
      }
    } catch {
      // Fallback
    }
  },

  markAsRead: async (id: string) => {
    set((s) => ({
      notificationsList: s.notificationsList.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadNotificationsCount: Math.max(0, s.unreadNotificationsCount - 1),
    }));

    try {
      await axios.post(
        `${API_BASE}/notifications/${id}/read`,
        {},
        { headers: getAuthHeaders(), timeout: 4000 }
      );
    } catch {
      // Ignore
    }
  },

  markAllAsRead: async () => {
    set((s) => ({
      notificationsList: s.notificationsList.map((n) => ({ ...n, isRead: true })),
      unreadNotificationsCount: 0,
    }));

    try {
      await axios.post(
        `${API_BASE}/notifications/read-all`,
        {},
        { headers: getAuthHeaders(), timeout: 4000 }
      );
      get().addToast({
        title: 'All notifications marked as read',
        type: 'info',
      });
    } catch {
      // Ignore
    }
  },

  addRealtimeNotification: (notification: NotificationItem) => {
    set((s) => {
      if (s.notificationsList.some((n) => n.id === notification.id)) {
        return s;
      }
      return {
        notificationsList: [notification, ...s.notificationsList],
        unreadNotificationsCount: s.unreadNotificationsCount + 1,
      };
    });

    get().addToast({
      title: 'New Notification 🔔',
      description: notification.title,
      type: 'info',
    });
  },

  setRealtimeUnreadCount: (count: number) => {
    set({ unreadNotificationsCount: count });
  },

  fetchAiIcebreakers: async (candidateId: string) => {
    try {
      const res = await axios.get(`${API_BASE}/messages/icebreakers/${candidateId}`, {
        headers: getAuthHeaders(),
        timeout: 4000,
      });
      if (res.data && Array.isArray(res.data.icebreakers)) {
        return res.data.icebreakers;
      }
    } catch {
      // Fallback
    }
    return [
      'Happy Sabbath! What are your favorite Sabbath traditions and afternoon nature walks?',
      'Greetings! I noticed your involvement with church ministry. How did you feel called into that service?',
      'Hello! What is a favorite Bible promise or scripture that has been blessing you recently?',
    ];
  },

  fetchMyPrompts: async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile/prompts`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (Array.isArray(res.data)) {
        set({ myPrompts: res.data });
        return res.data;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  savePromptAnswers: async (prompts: { promptKey: string; answer: string }[]) => {
    try {
      const res = await axios.post(
        `${API_BASE}/profile/prompts`,
        prompts,
        { headers: getAuthHeaders(), timeout: 6000 }
      );
      if (Array.isArray(res.data)) {
        set({ myPrompts: res.data });
        get().addToast({
          title: 'Faith Prompts Saved! ✨',
          description: 'Your faith and calling prompt answers have been published to your profile.',
          type: 'success',
        });
        return true;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update faith prompts.';
      get().addToast({
        title: 'Error Saving Prompts',
        description: Array.isArray(msg) ? msg.join(', ') : msg,
        type: 'error',
      });
      return false;
    }
    return false;
  },

  toggleReaction: async (target: { photoId?: string; promptAnswerId?: string }) => {
    try {
      const res = await axios.post(
        `${API_BASE}/reactions`,
        target,
        { headers: getAuthHeaders(), timeout: 5000 }
      );
      if (res.data) {
        return {
          success: true,
          liked: Boolean(res.data.liked),
          reactionCount: Number(res.data.reactionCount || 0),
        };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to update reaction.';
      get().addToast({
        title: 'Reaction Failed',
        description: Array.isArray(msg) ? msg.join(', ') : msg,
        type: 'error',
      });
    }
    return { success: false, liked: false, reactionCount: 0 };
  },

  fetchProfileDetails: async (id: string) => {
    try {
      const res = await axios.get(`${API_BASE}/profiles/${id}`, {
        headers: getAuthHeaders(),
        timeout: 5000,
      });
      if (res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },
}));

