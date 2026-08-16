import { PrismaClient, UserRole, Gender, MaritalStatus, BaptismStatus, SabbathObservance, DietType, AlcoholTobaccoStance, PhotoPrivacy, VerificationStatus, EducationLevel, RelocationPreference } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SDA Church Organization Hierarchy...');

  // 1. Divisions
  const nad = await prisma.churchDivision.upsert({
    where: { code: 'NAD' },
    update: {},
    create: {
      name: 'North American Division',
      code: 'NAD',
      region: 'North America (USA, Canada, Bermuda, Guam)',
    },
  });

  const sud = await prisma.churchDivision.upsert({
    where: { code: 'SUD' },
    update: {},
    create: {
      name: 'Southern Asia Division',
      code: 'SUD',
      region: 'India, Nepal, Bhutan',
    },
  });

  const ecd = await prisma.churchDivision.upsert({
    where: { code: 'ECD' },
    update: {},
    create: {
      name: 'East-Central Africa Division',
      code: 'ECD',
      region: 'East & Central Africa (Kenya, Uganda, Tanzania, Rwanda, Ethiopia)',
    },
  });

  // 2. Unions
  const columbiaUnion = await prisma.churchUnion.create({
    data: {
      divisionId: nad.id,
      name: 'Columbia Union Conference',
      country: 'United States',
    },
  });

  const pacificUnion = await prisma.churchUnion.create({
    data: {
      divisionId: nad.id,
      name: 'Pacific Union Conference',
      country: 'United States',
    },
  });

  const southernUnion = await prisma.churchUnion.create({
    data: {
      divisionId: sud.id,
      name: 'South-Central India Union Section',
      country: 'India',
    },
  });

  // 3. Conferences
  const potomacConf = await prisma.churchConference.create({
    data: {
      unionId: columbiaUnion.id,
      name: 'Potomac Conference',
      stateOrProvince: 'Virginia / Maryland',
    },
  });

  const chesapeakeConf = await prisma.churchConference.create({
    data: {
      unionId: columbiaUnion.id,
      name: 'Chesapeake Conference',
      stateOrProvince: 'Maryland / Delaware',
    },
  });

  const southeasternCalConf = await prisma.churchConference.create({
    data: {
      unionId: pacificUnion.id,
      name: 'Southeastern California Conference',
      stateOrProvince: 'California',
    },
  });

  const tamilConf = await prisma.churchConference.create({
    data: {
      unionId: southernUnion.id,
      name: 'North Tamil Conference',
      stateOrProvince: 'Tamil Nadu',
    },
  });

  // 4. Local Churches
  const spencervilleChurch = await prisma.localChurch.create({
    data: {
      conferenceId: chesapeakeConf.id,
      name: 'Spencerville Seventh-day Adventist Church',
      city: 'Silver Spring',
      address: '16325 New Hampshire Ave, Silver Spring, MD 20905',
    },
  });

  const lomaLindaChurch = await prisma.localChurch.create({
    data: {
      conferenceId: southeasternCalConf.id,
      name: 'Loma Linda University Church',
      city: 'Loma Linda',
      address: '11125 Campus St, Loma Linda, CA 92354',
    },
  });

  const sdaChennaiChurch = await prisma.localChurch.create({
    data: {
      conferenceId: tamilConf.id,
      name: 'Otteri Seventh-day Adventist Church',
      city: 'Chennai',
      address: 'Cooks Rd, Otteri, Chennai, Tamil Nadu',
    },
  });

  console.log('✅ Church hierarchy created.');

  // 5. Seed Users & Profiles
  console.log('🌱 Seeding Sample SDA Member Profiles...');

  // User 1: David Miller (Male, Medical Doctor)
  const user1 = await prisma.user.upsert({
    where: { email: 'david.miller@sda-matrimony.test' },
    update: {},
    create: {
      email: 'david.miller@sda-matrimony.test',
      passwordHash: '$2b$10$wT0vRz/23mC.4vS34kG7uOu7Z8L.q5M4eNqN4H5E9k2K9T2aB6p7y', // hashed 'Password123!'
      role: UserRole.VERIFIED_MEMBER,
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'David',
          lastName: 'Miller',
          gender: Gender.MALE,
          dateOfBirth: new Date('1994-06-15'),
          heightCm: 182,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          hasChildren: false,
          citizenship: 'United States',
          residenceCountry: 'United States',
          residenceState: 'California',
          residenceCity: 'Loma Linda',
          bioSummary: 'Passionate about medical missionary work, classical sacred music, and healthy Adventist living. Looking for a partner centered on Christ.',
          partnerExpectations: 'A devoted Adventist woman who loves God, values Christian education, and enjoys Sabbath walks and ministry.',
          verificationStatus: VerificationStatus.ADMIN_APPROVED,
          spiritualProfile: {
            create: {
              divisionId: nad.id,
              unionId: pacificUnion.id,
              conferenceId: southeasternCalConf.id,
              localChurchId: lomaLindaChurch.id,
              baptismStatus: BaptismStatus.BAPTIZED_SDA,
              baptismYear: 2008,
              sabbathObservance: SabbathObservance.STRICT_SUNSET_TO_SUNSET,
              ministries: ['MUSIC_CHOIR', 'HEALTH_MINISTRIES', 'SABBATH_SCHOOL'],
              favoriteBibleVerse: 'Micah 6:8 - He has shown you, O man, what is good; And what does the Lord require of you but to do justly, to love mercy, and to walk humbly with your God?',
              spiritOfProphecyPerspective: 'Deeply appreciate the health message and spiritual counsel in the writings of Ellen G. White.',
            },
          },
          lifestyleProfile: {
            create: {
              diet: DietType.STRICT_VEGAN,
              alcoholTobacco: AlcoholTobaccoStance.NEVER_USED,
              musicPreferences: ['Sacred Choral', 'Orchestral', 'Adventist Heritage Hymns'],
              hobbies: ['Hiking in nature', 'Playing cello', 'Cooking plant-based recipes', 'Reading theology'],
              modestyValues: 'Commitment to modest Christian attire and healthy recreational choices.',
            },
          },
          educationCareer: {
            create: {
              highestEducation: EducationLevel.DOCTORATE,
              fieldOfStudy: 'Medicine (MD)',
              institution: 'Loma Linda University School of Medicine',
              occupation: 'Physician / Pediatric Resident',
              employerOrBusiness: 'Loma Linda University Medical Center',
              annualIncomeRange: '$120,000 - $160,000',
              relocationPreference: RelocationPreference.WILLING_TO_RELOCATE_ANYWHERE,
            },
          },
          familyBackground: {
            create: {
              fatherOccupation: 'SDA Pastor',
              motherOccupation: 'Adventist School Teacher',
              siblingsCount: 2,
              familyValues: 'Grew up in a strong pastoral Adventist home with family worship twice daily.',
              isAdventistFamily: true,
            },
          },
          photos: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                isPrimary: true,
                privacy: PhotoPrivacy.PUBLIC_TO_ALL,
                isApproved: true,
              },
            ],
          },
        },
      },
    },
  });

  // User 2: Sarah Johnson (Female, Adventist Educator)
  const user2 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@sda-matrimony.test' },
    update: {},
    create: {
      email: 'sarah.johnson@sda-matrimony.test',
      passwordHash: '$2b$10$wT0vRz/23mC.4vS34kG7uOu7Z8L.q5M4eNqN4H5E9k2K9T2aB6p7y',
      role: UserRole.VERIFIED_MEMBER,
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          gender: Gender.FEMALE,
          dateOfBirth: new Date('1996-09-22'),
          heightCm: 168,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          hasChildren: false,
          citizenship: 'United States',
          residenceCountry: 'United States',
          residenceState: 'Maryland',
          residenceCity: 'Silver Spring',
          bioSummary: 'Adventist academy teacher passionate about youth ministry, literature evangelism, and sharing Christ with students.',
          partnerExpectations: 'A spiritual leader who honors the Sabbath, communicates openly, and wants to build an Adventist family home.',
          verificationStatus: VerificationStatus.ADMIN_APPROVED,
          spiritualProfile: {
            create: {
              divisionId: nad.id,
              unionId: columbiaUnion.id,
              conferenceId: chesapeakeConf.id,
              localChurchId: spencervilleChurch.id,
              baptismStatus: BaptismStatus.BAPTIZED_SDA,
              baptismYear: 2010,
              sabbathObservance: SabbathObservance.STRICT_SUNSET_TO_SUNSET,
              ministries: ['AY_YOUTH', 'PATHFINDERS', 'SABBATH_SCHOOL'],
              favoriteBibleVerse: 'Jeremiah 29:11 - For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
              spiritOfProphecyPerspective: 'Grounded in fundamental Adventist pillars and active in church outreach.',
            },
          },
          lifestyleProfile: {
            create: {
              diet: DietType.LACTO_OVO_VEGETARIAN,
              alcoholTobacco: AlcoholTobaccoStance.NEVER_USED,
              musicPreferences: ['Acoustic Christian', 'Classical', 'Sacred Gospel'],
              hobbies: ['Pathfinder camping', 'Gardening', 'Piano', 'Baking artisan sourdough'],
              modestyValues: 'Modest, graceful Christian lifestyle and principles.',
            },
          },
          educationCareer: {
            create: {
              highestEducation: EducationLevel.MASTERS,
              fieldOfStudy: 'Curriculum & Instruction',
              institution: 'Andrews University',
              occupation: 'Secondary Science Teacher',
              employerOrBusiness: 'Spencerville Adventist Academy',
              annualIncomeRange: '$60,000 - $80,000',
              relocationPreference: RelocationPreference.WITHIN_COUNTRY,
            },
          },
          familyBackground: {
            create: {
              fatherOccupation: 'Healthcare Administrator',
              motherOccupation: 'Registered Nurse',
              siblingsCount: 1,
              familyValues: 'Multi-generational Adventist family dedicated to church service.',
              isAdventistFamily: true,
            },
          },
          photos: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
                isPrimary: true,
                privacy: PhotoPrivacy.PUBLIC_TO_ALL,
                isApproved: true,
              },
            ],
          },
        },
      },
    },
  });

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@sda-matrimony.org' },
    update: {},
    create: {
      email: 'admin@sda-matrimony.org',
      passwordHash: '$2b$10$wT0vRz/23mC.4vS34kG7uOu7Z8L.q5M4eNqN4H5E9k2K9T2aB6p7y',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log('✅ Sample users and profiles successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
