import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        prompts: data.prompts !== undefined ? data.prompts : (profile as any).prompts,
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

    // Filter out self and any users with mutual blocks
    const blocks = await this.prisma.blockedUser.findMany({
      where: {
        OR: [{ userId: currentUserId }, { blockedUserId: currentUserId }],
      },
    });
    const excludedUserIds = Array.from(
      new Set([
        currentUserId,
        ...blocks.map((b) => (b.userId === currentUserId ? b.blockedUserId : b.userId)),
      ])
    );

    const whereClause: any = {
      userId: { notIn: excludedUserIds },
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

    if (query.institution) {
      whereClause.educationCareer = {
        institution: { contains: query.institution, mode: 'insensitive' },
      };
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

  async reportProfile(reporterId: string, reportedProfileId: string, reason: string, details?: string) {
    const targetProfile = await this.prisma.profile.findUnique({
      where: { id: reportedProfileId },
      include: { user: true },
    });

    if (!targetProfile) {
      throw new NotFoundException('Reported member profile not found.');
    }

    if (targetProfile.userId === reporterId) {
      throw new BadRequestException('You cannot report your own profile.');
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: targetProfile.userId,
        reason,
        details: details?.trim() || null,
      },
    });

    return {
      message: 'Report submitted confidentially to Pastoral Administration for safety review.',
      reportId: report.id,
    };
  }

  async blockUser(userId: string, targetProfileId: string) {
    const targetProfile = await this.prisma.profile.findUnique({
      where: { id: targetProfileId },
    });

    if (!targetProfile) {
      throw new NotFoundException('Member profile not found.');
    }

    const blockedUserId = targetProfile.userId;
    if (userId === blockedUserId) {
      throw new BadRequestException('You cannot block yourself.');
    }

    await this.prisma.blockedUser.upsert({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
      update: {},
      create: {
        userId,
        blockedUserId,
      },
    });

    return {
      message: 'Member has been blocked. They will no longer appear in your searches or be able to contact you.',
      blockedUserId,
    };
  }

  async unblockUser(userId: string, blockedUserId: string) {
    await this.prisma.blockedUser.deleteMany({
      where: {
        userId,
        blockedUserId,
      },
    });

    return {
      message: 'Member unblocked successfully.',
      blockedUserId,
    };
  }

  async getBlockedUsers(userId: string) {
    const blocks = await this.prisma.blockedUser.findMany({
      where: { userId },
      include: {
        blockedUser: {
          include: {
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photos: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
    });

    return blocks.map((b) => ({
      blockId: b.id,
      blockedAt: b.createdAt,
      blockedUser: b.blockedUser,
    }));
  }

  async getAdminReports() {
    return this.prisma.report.findMany({
      include: {
        reporter: {
          include: { profile: true },
        },
        reportedUser: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
