'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  Heart,
  FileDown,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Briefcase,
  BookOpen,
  Utensils,
  GraduationCap,
  Users,
  ArrowLeft,
  Sparkles,
  Edit3
} from 'lucide-react';

interface CandidateDetail {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  institutionOrEmployer: string;
  degree: string;
  city: string;
  state: string;
  country: string;
  division: string;
  union: string;
  conference: string;
  homeChurch: string;
  baptismStatus: string;
  baptismYear: number;
  sabbathObservance: string;
  ministries: string[];
  favoriteVerse: string;
  diet: string;
  temperance: string;
  musicAndHobbies: string;
  modestyValues: string;
  relocationPreference: string;
  familyHeritage: string;
  parentsSiblings: string;
  homeTraditions: string;
  isPastoralVerified: boolean;
  compatibilityScore: number;
  imageUrl: string;
}

const profileDatabase: Record<string, CandidateDetail> = {
  'demo-user-1': {
    id: 'demo-user-1',
    name: 'David Miller',
    age: 30,
    gender: 'MALE',
    occupation: 'Resident Physician (Internal Medicine)',
    institutionOrEmployer: 'Loma Linda University Medical Center',
    degree: 'Doctor of Medicine (M.D.) — Loma Linda University',
    city: 'Loma Linda',
    state: 'California',
    country: 'United States',
    division: 'North American Division',
    union: 'Pacific Union Conference',
    conference: 'Southeastern California Conference',
    homeChurch: 'Loma Linda University Church',
    baptismStatus: 'Baptized SDA by Immersion',
    baptismYear: 2008,
    sabbathObservance: 'Strict Sunset to Sunset (Friday to Saturday)',
    ministries: ['Medical Missionary Work', 'Sabbath School Facilitator', 'Sanctuary Choir'],
    favoriteVerse: '"Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." — Proverbs 3:5-6',
    diet: 'Strict Vegan (Whole Food Plant-Based)',
    temperance: 'Strict Abstinence (Lifelong Non-Drinker & Non-Smoker)',
    musicAndHobbies: 'Classical Organ & Sacred Hymnody, Wilderness Backpacking, Gardening',
    modestyValues: 'Committed to Christ-like decorum and Christian simplicity',
    relocationPreference: 'Willing to Relocate Globally for Medical Missions',
    familyHeritage: 'Second-generation Adventist family devoted to healthcare & pastoral service',
    parentsSiblings: 'Father (SDA Minister), Mother (Public Health Educator), 2 Younger Sisters',
    homeTraditions: 'Friday evening vespers, Sabbath nature walks, family prayer altar',
    isPastoralVerified: true,
    compatibilityScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  },
  'demo-user-2': {
    id: 'demo-user-2',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'FEMALE',
    occupation: 'Secondary Science Educator (Biology & Chemistry)',
    institutionOrEmployer: 'Spencerville Adventist Academy',
    degree: 'Master of Education (M.Ed) — Andrews University',
    city: 'Silver Spring',
    state: 'Maryland',
    country: 'United States',
    division: 'North American Division',
    union: 'Columbia Union Conference',
    conference: 'Chesapeake Conference',
    homeChurch: 'Spencerville Seventh-day Adventist Church',
    baptismStatus: 'Baptized SDA by Immersion',
    baptismYear: 2010,
    sabbathObservance: 'Strict Sunset to Sunset (Friday to Saturday)',
    ministries: ['Adventist Youth (AY Leader)', 'Pathfinder Counselor', 'Sabbath School Teacher'],
    favoriteVerse: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
    diet: 'Lacto-Ovo Vegetarian (Plant-forward home)',
    temperance: 'Strict Total Abstinence (Lifelong)',
    musicAndHobbies: 'Sacred Choral, Acoustic Christian, Nature Hikes, Artisan Sourdough Baking',
    modestyValues: 'Committed to biblical simplicity and modesty values',
    relocationPreference: 'Open to Relocation within North American Division / Global',
    familyHeritage: 'Multi-generational Adventist family dedicated to Christian education',
    parentsSiblings: 'Father (Healthcare Admin), Mother (Registered Nurse), 1 Younger Brother',
    homeTraditions: 'Friday evening Sabbath welcome, family worship, and hospitality',
    isPastoralVerified: true,
    compatibilityScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
  },
  'demo-user-3': {
    id: 'demo-user-3',
    name: 'Rachel Vance',
    age: 26,
    gender: 'FEMALE',
    occupation: 'Registered Nurse (BSN, ICU Specialist)',
    institutionOrEmployer: 'Adventist Health Glendale',
    degree: 'Bachelor of Science in Nursing (BSN) — Southern Adventist University',
    city: 'Glendale',
    state: 'California',
    country: 'United States',
    division: 'North American Division',
    union: 'Pacific Union Conference',
    conference: 'Southern California Conference',
    homeChurch: 'Vallejo Drive SDA Church',
    baptismStatus: 'Baptized SDA by Immersion',
    baptismYear: 2012,
    sabbathObservance: 'Strict Sunset to Sunset',
    ministries: ['Health Ministry Director', 'Community Service Center', 'Music Ministry'],
    favoriteVerse: '"He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God." — Micah 6:8',
    diet: 'Strict Vegan (8 Laws of Health)',
    temperance: 'Strict Abstinence',
    musicAndHobbies: 'Classical Piano, Trail Running, Adventist Health Cooking Demonstrations',
    modestyValues: 'Biblical simplicity in lifestyle and dress',
    relocationPreference: 'Willing to Relocate within Country',
    familyHeritage: 'Adventist family with roots in mission hospitals and community outreach',
    parentsSiblings: 'Parents (Missionary Nurses), 1 Older Sister',
    homeTraditions: 'Sabbath potlucks, morning prayer devotionals',
    isPastoralVerified: true,
    compatibilityScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
  },
  'demo-user-4': {
    id: 'demo-user-4',
    name: 'Rebecca Mthembu',
    age: 29,
    gender: 'FEMALE',
    occupation: 'Software Engineer & Digital Ministry Lead',
    institutionOrEmployer: 'Enterprise Cloud Solutions',
    degree: 'B.Sc Computer Science — Helderberg College of Higher Education',
    city: 'Johannesburg',
    state: 'Gauteng',
    country: 'South Africa',
    division: 'Southern Africa-Indian Ocean Division (SID)',
    union: 'Southern Africa Union Conference',
    conference: 'Trans-Orange Conference',
    homeChurch: 'Central Johannesburg SDA Church',
    baptismStatus: 'Baptized SDA by Immersion',
    baptismYear: 2009,
    sabbathObservance: 'Strict Sunset to Sunset',
    ministries: ['Adventist Youth Society Leader', 'Media & AV Ministry', 'Literature Evangelism'],
    favoriteVerse: '"And this gospel of the kingdom will be preached in all the world as a witness to all the nations, and then the end will come." — Matthew 24:14',
    diet: 'Lacto-Ovo Vegetarian',
    temperance: 'Strict Total Abstinence',
    musicAndHobbies: 'A cappella quartet singing, Drone videography, Bible prophecy study groups',
    modestyValues: 'Traditional Christian decorum',
    relocationPreference: 'Willing to Relocate Anywhere for Marriage & Mission',
    familyHeritage: 'Committed Adventist family spanning three generations',
    parentsSiblings: 'Father (Civil Engineer), Mother (Teacher), 2 Brothers',
    homeTraditions: 'Sunset Sabbath opening song service, family devotional journaling',
    isPastoralVerified: true,
    compatibilityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
  },
};

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const [interestSent, setInterestSent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const profileId = params.id === 'me' ? (user?.id === 'demo-user-2' ? 'demo-user-2' : 'demo-user-1') : params.id;
  const profile = profileDatabase[profileId] || profileDatabase['demo-user-2'];
  const isOwnProfile = params.id === 'me' || (user && user.id === profileId);

  const handleDownloadBiodata = () => {
    setDownloading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    setTimeout(() => {
      setDownloading(false);
      window.open(`${apiUrl}/biodata/${profile.id}/download`, '_blank');
    }, 500);
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/discover" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Candidates
          </Link>
          {isOwnProfile && (
            <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} /> Viewing Your Official Matrimonial Profile
            </span>
          )}
        </div>

        {/* Profile Header Banner Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundImage: `url("${profile.imageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)',
              flexShrink: 0,
            }} />

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {profile.name}, {profile.age}
                </h1>
                {profile.isPastoralVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Pastoral Verified
                  </span>
                )}
                <span className="badge badge-gold">
                  <Sparkles size={13} /> {profile.compatibilityScore}% Faith Compatibility
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Briefcase size={15} color="var(--primary-700)" /> {profile.occupation}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="var(--primary-700)" /> {profile.city}, {profile.state} ({profile.conference})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <BookOpen size={15} color="var(--primary-700)" /> {profile.baptismStatus} ({profile.baptismYear})
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {!isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setInterestSent(true)}
                    className={interestSent ? 'btn btn-outline' : 'btn btn-gold'}
                  >
                    {interestSent ? (
                      <>
                        <CheckCircle2 size={16} color="var(--success)" /> Interest Expressed
                      </>
                    ) : (
                      <>
                        <Heart size={16} /> Express Matrimonial Interest
                      </>
                    )}
                  </button>
                ) : (
                  <Link href="/profile" className="btn btn-outline">
                    <Edit3 size={16} /> Edit My Profile Details
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleDownloadBiodata}
                  disabled={downloading}
                  className="btn btn-primary"
                >
                  <FileDown size={16} /> {downloading ? 'Preparing PDF...' : 'Download Printable Biodata (PDF)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Profile Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Section 1: Spiritual Profile */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <BookOpen size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Adventist Faith & Church Life
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>BAPTISM & SABBATH</span>
                <span style={{ fontWeight: 600 }}>{profile.baptismStatus} ({profile.baptismYear}) • {profile.sabbathObservance}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>CHURCH HIERARCHY</span>
                <span style={{ fontWeight: 600 }}>{profile.division} → {profile.union} → {profile.conference}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>HOME CONGREGATION</span>
                <span style={{ fontWeight: 600 }}>{profile.homeChurch}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>ACTIVE MINISTRIES</span>
                <span style={{ fontWeight: 600 }}>{profile.ministries.join(', ')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>FAVORITE SCRIPTURE</span>
                <p style={{ fontStyle: 'italic', color: 'var(--primary-800)', marginTop: '2px' }}>
                  {profile.favoriteVerse}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Lifestyle & Health */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Utensils size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Lifestyle & Health Message
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DIETARY PRACTICE</span>
                <span style={{ fontWeight: 600 }}>{profile.diet}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>TEMPERANCE COMMITMENT</span>
                <span style={{ fontWeight: 600 }}>{profile.temperance}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>MUSIC, LEISURE & HOBBIES</span>
                <span style={{ fontWeight: 600 }}>{profile.musicAndHobbies}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>CHRISTIAN MODESTY</span>
                <span style={{ fontWeight: 600 }}>{profile.modestyValues}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Education & Profession */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <GraduationCap size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Education & Vocation
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DEGREE & ALMA MATER</span>
                <span style={{ fontWeight: 600 }}>{profile.degree}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>OCCUPATION & EMPLOYER</span>
                <span style={{ fontWeight: 600 }}>{profile.occupation} at {profile.institutionOrEmployer}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>RELOCATION READINESS</span>
                <span style={{ fontWeight: 600 }}>{profile.relocationPreference}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Family Background */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Users size={20} color="var(--primary-800)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Family Heritage & Values
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>ADVENTIST HERITAGE</span>
                <span style={{ fontWeight: 600 }}>{profile.familyHeritage}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>PARENTS & SIBLINGS</span>
                <span style={{ fontWeight: 600 }}>{profile.parentsSiblings}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>FAMILY ALTAR & TRADITIONS</span>
                <span style={{ fontWeight: 600 }}>{profile.homeTraditions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
