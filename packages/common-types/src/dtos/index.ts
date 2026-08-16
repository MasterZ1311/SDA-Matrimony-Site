import {
  Gender,
  MaritalStatus,
  BaptismStatus,
  SabbathObservance,
  DietType,
  AlcoholTobaccoStance,
  MinistryInvolvement,
  EducationLevel,
  RelocationPreference,
  PhotoPrivacy,
  InterestStatus,
  VerificationStatus,
  UserRole,
} from '../enums/index.js';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    hasProfile: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ProfileSearchFilterDto {
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  divisionId?: string;
  conferenceId?: string;
  residenceCountry?: string;
  baptismStatus?: BaptismStatus[];
  diet?: DietType[];
  sabbathObservance?: SabbathObservance[];
  highestEducation?: EducationLevel[];
  verificationStatus?: VerificationStatus[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'compatibility' | 'age';
  sortOrder?: 'asc' | 'desc';
}

export interface SendInterestDto {
  receiverId: string;
  introMessage?: string;
}

export interface UpdateInterestStatusDto {
  interestId: string;
  status: InterestStatus.ACCEPTED | InterestStatus.DECLINED | InterestStatus.BLOCKED;
}

export interface SubmitPastoralVerificationDto {
  pastorName: string;
  pastorEmail: string;
  pastorPhone?: string;
  churchName: string;
  conferenceName: string;
  referenceNotes?: string;
}

export interface PastorEndorsementDto {
  verificationToken: string;
  isEndorsed: boolean;
  pastorComments?: string;
}
