import {
  UserRole,
  Gender,
  MaritalStatus,
  BaptismStatus,
  SabbathObservance,
  DietType,
  AlcoholTobaccoStance,
  MinistryInvolvement,
  PhotoPrivacy,
  InterestStatus,
  VerificationStatus,
  EducationLevel,
  RelocationPreference,
} from '../enums/index.js';

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date | string;
}

export interface ChurchDivision {
  id: string;
  name: string;
  code: string;
  region: string;
}

export interface ChurchUnion {
  id: string;
  divisionId: string;
  name: string;
  country: string;
}

export interface ChurchConference {
  id: string;
  unionId: string;
  name: string;
  stateOrProvince: string;
}

export interface LocalChurch {
  id: string;
  conferenceId: string;
  name: string;
  city: string;
  address?: string;
}

export interface SpiritualProfileData {
  divisionId?: string;
  divisionName?: string;
  unionId?: string;
  unionName?: string;
  conferenceId?: string;
  conferenceName?: string;
  localChurchId?: string;
  localChurchName?: string;
  baptismStatus: BaptismStatus;
  baptismYear?: number;
  sabbathObservance: SabbathObservance;
  ministries: MinistryInvolvement[];
  favoriteBibleVerse?: string;
  spiritOfProphecyPerspective?: string;
}

export interface LifestyleProfileData {
  diet: DietType;
  alcoholTobacco: AlcoholTobaccoStance;
  musicPreferences: string[];
  hobbies: string[];
  modestyValues?: string;
}

export interface EducationCareerData {
  highestEducation: EducationLevel;
  fieldOfStudy?: string;
  institution?: string;
  occupation: string;
  employerOrBusiness?: string;
  annualIncomeRange?: string;
  relocationPreference: RelocationPreference;
}

export interface FamilyBackgroundData {
  fatherOccupation?: string;
  motherOccupation?: string;
  siblingsCount?: number;
  familyValues?: string;
  isAdventistFamily: boolean;
}

export interface PhotoData {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  privacy: PhotoPrivacy;
  isApproved: boolean;
}

export interface MemberProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  age: number;
  heightCm?: number;
  maritalStatus: MaritalStatus;
  hasChildren: boolean;
  citizenship: string;
  residenceCountry: string;
  residenceCity: string;
  bioSummary?: string;
  partnerExpectations?: string;
  verificationStatus: VerificationStatus;
  spiritualProfile?: SpiritualProfileData;
  lifestyleProfile?: LifestyleProfileData;
  educationCareer?: EducationCareerData;
  familyBackground?: FamilyBackgroundData;
  photos: PhotoData[];
  createdAt: string;
  updatedAt: string;
}

export interface InterestRequestData {
  id: string;
  senderId: string;
  receiverId: string;
  senderProfile?: MemberProfile;
  receiverProfile?: MemberProfile;
  status: InterestStatus;
  introMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageData {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationData {
  id: string;
  user1Id: string;
  user2Id: string;
  otherUser?: MemberProfile;
  lastMessage?: ChatMessageData;
  unreadCount?: number;
  updatedAt: string;
}

export interface PastoralVerificationData {
  id: string;
  userId: string;
  pastorName: string;
  pastorEmail: string;
  pastorPhone?: string;
  churchName: string;
  conferenceName: string;
  status: VerificationStatus;
  verificationToken?: string;
  pastorComments?: string;
  verifiedAt?: string;
}

export interface CompatibilityFactor {
  factorName: string;
  weight: number;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface CompatibilityScoreResponse {
  overallScore: number; // 0 to 100
  categoryScores: {
    spiritualAlignment: number;
    lifestyleAlignment: number;
    locationAndRelocation: number;
    educationAndCareer: number;
  };
  factors: CompatibilityFactor[];
  summary: string;
}
