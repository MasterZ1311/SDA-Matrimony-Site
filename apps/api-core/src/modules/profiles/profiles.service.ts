import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender, BaptismStatus, SabbathObservance, DietType, EducationLevel, VerificationStatus } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        spiritualProfile: {
          include: {
            division: true,
            union: true,
            conference: true,
            localChurch: true,
          },
        },
        lifestyleProfile: true,
        educationCareer: true,
        familyBackground: true,
        photos: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Member profile not found.');
    }

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    let profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          userId,
          firstName: data.firstName || 'Member',
          lastName: data.lastName || '',
          gender: data.gender || Gender.MALE,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date('1998-01-01'),
        },
      });
    }

    // Update main profile fields
    const updatedProfile = await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        firstName: data.firstName !== undefined ? data.firstName : profile.firstName,
        lastName: data.lastName !== undefined ? data.lastName : profile.lastName,
        gender: data.gender !== undefined ? data.gender : profile.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : profile.dateOfBirth,
        heightCm: data.heightCm !== undefined ? data.heightCm : profile.heightCm,
        maritalStatus: data.maritalStatus !== undefined ? data.maritalStatus : profile.maritalStatus,
        hasChildren: data.hasChildren !== undefined ? data.hasChildren : profile.hasChildren,
        citizenship: data.citizenship !== undefined ? data.citizenship : profile.citizenship,
        residenceCountry: data.residenceCountry !== undefined ? data.residenceCountry : profile.residenceCountry,
        residenceState: data.residenceState !== undefined ? data.residenceState : profile.residenceState,
        residenceCity: data.residenceCity !== undefined ? data.residenceCity : profile.residenceCity,
        bioSummary: data.bioSummary !== undefined ? data.bioSummary : profile.bioSummary,
        partnerExpectations: data.partnerExpectations !== undefined ? data.partnerExpectations : profile.partnerExpectations,
      },
    });

    // Upsert Spiritual Profile
    if (data.spiritualProfile) {
      await this.prisma.spiritualProfile.upsert({
        where: { profileId: profile.id },
        update: {
          divisionId: data.spiritualProfile.divisionId,
          unionId: data.spiritualProfile.unionId,
          conferenceId: data.spiritualProfile.conferenceId,
          localChurchId: data.spiritualProfile.localChurchId,
          localChurchCustomName: data.spiritualProfile.localChurchCustomName,
          baptismStatus: data.spiritualProfile.baptismStatus || BaptismStatus.BAPTIZED_SDA,
          baptismYear: data.spiritualProfile.baptismYear,
          sabbathObservance: data.spiritualProfile.sabbathObservance || SabbathObservance.STRICT_SUNSET_TO_SUNSET,
          ministries: data.spiritualProfile.ministries || [],
          favoriteBibleVerse: data.spiritualProfile.favoriteBibleVerse,
          spiritOfProphecyPerspective: data.spiritualProfile.spiritOfProphecyPerspective,
        },
        create: {
          profileId: profile.id,
          divisionId: data.spiritualProfile.divisionId,
          unionId: data.spiritualProfile.unionId,
          conferenceId: data.spiritualProfile.conferenceId,
          localChurchId: data.spiritualProfile.localChurchId,
          localChurchCustomName: data.spiritualProfile.localChurchCustomName,
          baptismStatus: data.spiritualProfile.baptismStatus || BaptismStatus.BAPTIZED_SDA,
          baptismYear: data.spiritualProfile.baptismYear,
          sabbathObservance: data.spiritualProfile.sabbathObservance || SabbathObservance.STRICT_SUNSET_TO_SUNSET,
          ministries: data.spiritualProfile.ministries || [],
          favoriteBibleVerse: data.spiritualProfile.favoriteBibleVerse,
          spiritOfProphecyPerspective: data.spiritualProfile.spiritOfProphecyPerspective,
        },
      });
    }

    // Upsert Lifestyle Profile
    if (data.lifestyleProfile) {
      await this.prisma.lifestyleProfile.upsert({
        where: { profileId: profile.id },
        update: {
          diet: data.lifestyleProfile.diet || DietType.LACTO_OVO_VEGETARIAN,
          alcoholTobacco: data.lifestyleProfile.alcoholTobacco,
          musicPreferences: data.lifestyleProfile.musicPreferences || [],
          hobbies: data.lifestyleProfile.hobbies || [],
          modestyValues: data.lifestyleProfile.modestyValues,
        },
        create: {
          profileId: profile.id,
          diet: data.lifestyleProfile.diet || DietType.LACTO_OVO_VEGETARIAN,
          alcoholTobacco: data.lifestyleProfile.alcoholTobacco,
          musicPreferences: data.lifestyleProfile.musicPreferences || [],
          hobbies: data.lifestyleProfile.hobbies || [],
          modestyValues: data.lifestyleProfile.modestyValues,
        },
      });
    }

    // Upsert Education & Career
    if (data.educationCareer) {
      await this.prisma.educationCareer.upsert({
        where: { profileId: profile.id },
        update: {
          highestEducation: data.educationCareer.highestEducation || EducationLevel.BACHELORS,
          fieldOfStudy: data.educationCareer.fieldOfStudy,
          institution: data.educationCareer.institution,
          occupation: data.educationCareer.occupation || 'Professional',
          employerOrBusiness: data.educationCareer.employerOrBusiness,
          annualIncomeRange: data.educationCareer.annualIncomeRange,
          relocationPreference: data.educationCareer.relocationPreference,
        },
        create: {
          profileId: profile.id,
          highestEducation: data.educationCareer.highestEducation || EducationLevel.BACHELORS,
          fieldOfStudy: data.educationCareer.fieldOfStudy,
          institution: data.educationCareer.institution,
          occupation: data.educationCareer.occupation || 'Professional',
          employerOrBusiness: data.educationCareer.employerOrBusiness,
          annualIncomeRange: data.educationCareer.annualIncomeRange,
          relocationPreference: data.educationCareer.relocationPreference,
        },
      });
    }

    // Upsert Family Background
    if (data.familyBackground) {
      await this.prisma.familyBackground.upsert({
        where: { profileId: profile.id },
        update: {
          fatherOccupation: data.familyBackground.fatherOccupation,
          motherOccupation: data.familyBackground.motherOccupation,
          siblingsCount: data.familyBackground.siblingsCount,
          familyValues: data.familyBackground.familyValues,
          isAdventistFamily: data.familyBackground.isAdventistFamily ?? true,
        },
        create: {
          profileId: profile.id,
          fatherOccupation: data.familyBackground.fatherOccupation,
          motherOccupation: data.familyBackground.motherOccupation,
          siblingsCount: data.familyBackground.siblingsCount,
          familyValues: data.familyBackground.familyValues,
          isAdventistFamily: data.familyBackground.isAdventistFamily ?? true,
        },
      });
    }

    return this.getMyProfile(userId);
  }

  async getProfileById(targetProfileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: targetProfileId },
      include: {
        spiritualProfile: {
          include: {
            division: true,
            union: true,
            conference: true,
            localChurch: true,
          },
        },
        lifestyleProfile: true,
        educationCareer: true,
        familyBackground: true,
        photos: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Member profile not found.');
    }

    return profile;
  }

  async searchProfiles(currentUserId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId: { not: currentUserId },
    };

    if (query.gender) {
      whereClause.gender = query.gender;
    }

    if (query.residenceCountry) {
      whereClause.residenceCountry = query.residenceCountry;
    }

    if (query.verificationStatus) {
      whereClause.verificationStatus = query.verificationStatus;
    }

    if (query.divisionId || query.conferenceId || query.baptismStatus) {
      whereClause.spiritualProfile = {};
      if (query.divisionId) whereClause.spiritualProfile.divisionId = query.divisionId;
      if (query.conferenceId) whereClause.spiritualProfile.conferenceId = query.conferenceId;
      if (query.baptismStatus) whereClause.spiritualProfile.baptismStatus = query.baptismStatus;
    }

    if (query.diet) {
      whereClause.lifestyleProfile = { diet: query.diet };
    }

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where: whereClause,
        include: {
          spiritualProfile: {
            include: { division: true, conference: true, localChurch: true },
          },
          lifestyleProfile: true,
          educationCareer: true,
          photos: {
            where: { isPrimary: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profile.count({ where: whereClause }),
    ]);

    return {
      profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
