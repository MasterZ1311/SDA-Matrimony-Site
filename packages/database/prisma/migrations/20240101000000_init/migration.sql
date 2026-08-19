-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GUEST', 'MEMBER', 'VERIFIED_MEMBER', 'PASTOR_VERIFIER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('NEVER_MARRIED', 'WIDOWED', 'DIVORCED_ANNULLED');

-- CreateEnum
CREATE TYPE "BaptismStatus" AS ENUM ('BAPTIZED_SDA', 'PLANNING_BAPTISM', 'ATTENDING_NON_MEMBER');

-- CreateEnum
CREATE TYPE "SabbathObservance" AS ENUM ('STRICT_SUNSET_TO_SUNSET', 'MODERATE', 'LEARNING');

-- CreateEnum
CREATE TYPE "DietType" AS ENUM ('STRICT_VEGAN', 'LACTO_OVO_VEGETARIAN', 'PESCATARIAN', 'NON_VEGETARIAN_CLEAN_ONLY');

-- CreateEnum
CREATE TYPE "AlcoholTobaccoStance" AS ENUM ('STRICT_ABSTINENCE', 'NEVER_USED', 'OCCASIONAL', 'PAST_USE_QUIT');

-- CreateEnum
CREATE TYPE "PhotoPrivacy" AS ENUM ('PUBLIC_TO_ALL', 'VERIFIED_MEMBERS_ONLY', 'REQUEST_APPROVAL_ONLY');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'SUBMITTED_PENDING_PASTOR', 'PASTOR_ENDORSED', 'ADMIN_APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "RelocationPreference" AS ENUM ('WILLING_TO_RELOCATE_ANYWHERE', 'WITHIN_COUNTRY', 'WITHIN_DIVISION', 'NOT_WILLING_TO_RELOCATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifyToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "heightCm" INTEGER,
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'NEVER_MARRIED',
    "hasChildren" BOOLEAN NOT NULL DEFAULT false,
    "citizenship" TEXT NOT NULL DEFAULT 'United States',
    "residenceCountry" TEXT NOT NULL DEFAULT 'United States',
    "residenceState" TEXT,
    "residenceCity" TEXT NOT NULL DEFAULT 'Silver Spring',
    "bioSummary" TEXT,
    "partnerExpectations" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpiritualProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "divisionId" TEXT,
    "unionId" TEXT,
    "conferenceId" TEXT,
    "localChurchId" TEXT,
    "localChurchCustomName" TEXT,
    "baptismStatus" "BaptismStatus" NOT NULL DEFAULT 'BAPTIZED_SDA',
    "baptismYear" INTEGER,
    "sabbathObservance" "SabbathObservance" NOT NULL DEFAULT 'STRICT_SUNSET_TO_SUNSET',
    "ministries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favoriteBibleVerse" TEXT,
    "spiritOfProphecyPerspective" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpiritualProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifestyleProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "diet" "DietType" NOT NULL DEFAULT 'LACTO_OVO_VEGETARIAN',
    "alcoholTobacco" "AlcoholTobaccoStance" NOT NULL DEFAULT 'STRICT_ABSTINENCE',
    "musicPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hobbies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modestyValues" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifestyleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationCareer" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "highestEducation" "EducationLevel" NOT NULL DEFAULT 'BACHELORS',
    "fieldOfStudy" TEXT,
    "institution" TEXT,
    "occupation" TEXT NOT NULL DEFAULT 'Professional',
    "employerOrBusiness" TEXT,
    "annualIncomeRange" TEXT,
    "relocationPreference" "RelocationPreference" NOT NULL DEFAULT 'WILLING_TO_RELOCATE_ANYWHERE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationCareer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyBackground" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "fatherOccupation" TEXT,
    "motherOccupation" TEXT,
    "siblingsCount" INTEGER DEFAULT 0,
    "familyValues" TEXT,
    "isAdventistFamily" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyBackground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "privacy" "PhotoPrivacy" NOT NULL DEFAULT 'PUBLIC_TO_ALL',
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchDivision" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "ChurchDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchUnion" (
    "id" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "ChurchUnion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchConference" (
    "id" TEXT NOT NULL,
    "unionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateOrProvince" TEXT NOT NULL,

    CONSTRAINT "ChurchConference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalChurch" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "LocalChurch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "InterestStatus" NOT NULL DEFAULT 'PENDING',
    "introMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterestRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PastoralVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pastorName" TEXT NOT NULL,
    "pastorEmail" TEXT NOT NULL,
    "pastorPhone" TEXT,
    "churchName" TEXT NOT NULL,
    "conferenceName" TEXT NOT NULL,
    "referenceNotes" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'SUBMITTED_PENDING_PASTOR',
    "verificationToken" TEXT,
    "pastorComments" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PastoralVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_gender_verificationStatus_idx" ON "Profile"("gender", "verificationStatus");

-- CreateIndex
CREATE INDEX "Profile_residenceCountry_residenceCity_idx" ON "Profile"("residenceCountry", "residenceCity");

-- CreateIndex
CREATE UNIQUE INDEX "SpiritualProfile_profileId_key" ON "SpiritualProfile"("profileId");

-- CreateIndex
CREATE INDEX "SpiritualProfile_baptismStatus_sabbathObservance_idx" ON "SpiritualProfile"("baptismStatus", "sabbathObservance");

-- CreateIndex
CREATE INDEX "SpiritualProfile_divisionId_conferenceId_idx" ON "SpiritualProfile"("divisionId", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "LifestyleProfile_profileId_key" ON "LifestyleProfile"("profileId");

-- CreateIndex
CREATE INDEX "LifestyleProfile_diet_alcoholTobacco_idx" ON "LifestyleProfile"("diet", "alcoholTobacco");

-- CreateIndex
CREATE UNIQUE INDEX "EducationCareer_profileId_key" ON "EducationCareer"("profileId");

-- CreateIndex
CREATE INDEX "EducationCareer_highestEducation_occupation_idx" ON "EducationCareer"("highestEducation", "occupation");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyBackground_profileId_key" ON "FamilyBackground"("profileId");

-- CreateIndex
CREATE INDEX "Photo_profileId_isPrimary_idx" ON "Photo"("profileId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchDivision_code_key" ON "ChurchDivision"("code");

-- CreateIndex
CREATE INDEX "ChurchUnion_divisionId_idx" ON "ChurchUnion"("divisionId");

-- CreateIndex
CREATE INDEX "ChurchConference_unionId_idx" ON "ChurchConference"("unionId");

-- CreateIndex
CREATE INDEX "LocalChurch_conferenceId_idx" ON "LocalChurch"("conferenceId");

-- CreateIndex
CREATE INDEX "InterestRequest_receiverId_status_idx" ON "InterestRequest"("receiverId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "InterestRequest_senderId_receiverId_key" ON "InterestRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Conversation_user1Id_user2Id_idx" ON "Conversation"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PastoralVerification_verificationToken_key" ON "PastoralVerification"("verificationToken");

-- CreateIndex
CREATE INDEX "PastoralVerification_userId_status_idx" ON "PastoralVerification"("userId", "status");

-- CreateIndex
CREATE INDEX "PastoralVerification_verificationToken_idx" ON "PastoralVerification"("verificationToken");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritualProfile" ADD CONSTRAINT "SpiritualProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritualProfile" ADD CONSTRAINT "SpiritualProfile_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "ChurchDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritualProfile" ADD CONSTRAINT "SpiritualProfile_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "ChurchUnion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritualProfile" ADD CONSTRAINT "SpiritualProfile_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "ChurchConference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritualProfile" ADD CONSTRAINT "SpiritualProfile_localChurchId_fkey" FOREIGN KEY ("localChurchId") REFERENCES "LocalChurch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifestyleProfile" ADD CONSTRAINT "LifestyleProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationCareer" ADD CONSTRAINT "EducationCareer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyBackground" ADD CONSTRAINT "FamilyBackground_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchUnion" ADD CONSTRAINT "ChurchUnion_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "ChurchDivision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchConference" ADD CONSTRAINT "ChurchConference_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "ChurchUnion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalChurch" ADD CONSTRAINT "LocalChurch_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "ChurchConference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestRequest" ADD CONSTRAINT "InterestRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestRequest" ADD CONSTRAINT "InterestRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastoralVerification" ADD CONSTRAINT "PastoralVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
