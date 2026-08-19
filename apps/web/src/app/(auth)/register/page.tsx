'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useMatrimonyStore, CandidateProfile } from '@/stores/matrimonyStore';
import {
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  BookOpen,
  Utensils,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';

const AVAILABLE_MINISTRIES = [
  'Sabbath School Teacher',
  'Music / Choir / Praise',
  'Pathfinder Counselor',
  'Adventist Youth (AY)',
  'Health Ministries',
  'Literature Evangelism',
  'Community Services',
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { registerCandidate, addToast } = useMatrimonyStore();
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'FEMALE' as 'FEMALE' | 'MALE',
    dateOfBirth: '1998-05-12',
    residenceCity: 'Silver Spring',
    residenceCountry: 'United States',
    // Step 2: Spiritual
    division: 'North American Division (NAD)',
    conference: 'Chesapeake Conference',
    localChurch: 'Spencerville SDA Church',
    baptismStatus: 'Baptized SDA by Immersion',
    sabbathObservance: 'Strict Friday Sunset to Saturday Sunset',
    ministries: ['Sabbath School Teacher', 'Music / Choir / Praise'],
    pastorName: 'Pastor Chad Stuart',
    pastorEmail: 'pastor.chad@spencervillechurch.org',
    // Step 3: Lifestyle
    diet: 'Lacto-Ovo Vegetarian',
    alcoholTobacco: 'Strict Total Abstinence (Lifetime Abstainer)',
    musicPreferences: 'Sacred Choral, Classical Piano, Christian Acoustic',
    // Step 4: Education & Vocation
    highestEducation: "Master's Degree",
    occupation: 'Healthcare Professional',
    relocationPreference: 'Willing to Relocate Anywhere Globally',
  });

  const validateCurrentStep = () => {
    setStepError('');
    if (step === 1) {
      if (!formData.firstName.trim()) {
        setStepError('Please provide your first name.');
        return false;
      }
      if (!formData.lastName.trim()) {
        setStepError('Please provide your last name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
        setStepError('Please enter a valid email address.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setStepError('Password must be at least 6 characters long.');
        return false;
      }
      if (!formData.residenceCity.trim() || !formData.residenceCountry.trim()) {
        setStepError('Please specify your current city and country.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.localChurch.trim()) {
        setStepError('Please specify your local Seventh-day Adventist home church.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.occupation.trim()) {
        setStepError('Please specify your current profession or field of study.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(4, s + 1));
    }
  };

  const prevStep = () => {
    setStepError('');
    setStep((s) => Math.max(1, s - 1));
  };

  const toggleMinistry = (ministry: string) => {
    setFormData((prev) => {
      const exists = prev.ministries.includes(ministry);
      return {
        ...prev,
        ministries: exists
          ? prev.ministries.filter((m) => m !== ministry)
          : [...prev.ministries, ministry],
      };
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970) || 26;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const newUserId = `user-${Date.now()}`;
    const userAge = calculateAge(formData.dateOfBirth);

    // 1. Create full CandidateProfile
    const newProfile: CandidateProfile = {
      id: newUserId,
      name: `${formData.firstName} ${formData.lastName}`,
      age: userAge,
      gender: formData.gender,
      occupation: formData.occupation,
      highestEducation: formData.highestEducation,
      city: formData.residenceCity,
      country: formData.residenceCountry,
      division: formData.division,
      conference: formData.conference,
      localChurch: formData.localChurch,
      baptismYear: 2015,
      baptismStatus: formData.baptismStatus,
      sabbathObservance: formData.sabbathObservance,
      diet: formData.diet,
      temperance: formData.alcoholTobacco,
      musicPreferences: formData.musicPreferences,
      relocationPreference: formData.relocationPreference,
      isPastoralVerified: false,
      compatibilityScore: 92,
      imageUrl: formData.gender === 'FEMALE'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
      bioSnippet: `Dedicated Seventh-day Adventist professional committed to Christ-centered service, ${formData.ministries.slice(0, 2).join(' and ')}, and active church life.`,
      favoriteScripture: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you. — Jeremiah 29:11',
      activeMinistries: formData.ministries,
      familyBackground: {
        heritage: 'Active Adventist family committed to Christian faith',
        familyStructure: 'Supportive Christian parents and family',
        traditions: 'Sabbath evening worship and family fellowship.',
      },
      pastorReference: {
        name: formData.pastorName || 'Local Church Pastor',
        church: formData.localChurch,
        email: formData.pastorEmail || 'pastor@church.org',
        phone: '+1 (555) 019-2831',
        notes: 'Member in regular standing, actively engaged in local congregation ministries.',
      },
    };

    // 2. Register candidate in matrimonyStore
    registerCandidate(newProfile, {
      name: formData.pastorName,
      email: formData.pastorEmail,
      phone: '+1 (555) 019-2831',
      notes: 'New profile registration submitted. Verification queued for pastoral endorsement.',
    });

    // 3. Set auth session
    setAuth(
      {
        id: newUserId,
        email: formData.email,
        role: 'MEMBER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        isEmailVerified: true,
      },
      `token-${newUserId}`
    );

    addToast({
      title: 'Welcome to SDA Matrimony! ⛪',
      description: `Your Adventist profile for ${formData.firstName} has been created and pastoral verification submitted.`,
      type: 'success',
    });

    router.push('/discover');
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--bg-page)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-800)' }}>
              Step {step} of 4: {step === 1 ? 'Personal Details' : step === 2 ? 'Adventist Faith' : step === 3 ? 'Lifestyle & Diet' : 'Education & Vocation'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              {step * 25}% Complete
            </span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${step * 25}%`,
                backgroundColor: 'var(--primary-700)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="card animate-fade" style={{ padding: '36px' }}>
          {stepError && (
            <div
              className="animate-fade"
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} />
              {stepError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Shield size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Personal Background
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Grace"
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Adams"
                      className="input-control"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="grace.adventist@example.com"
                    className="input-control"
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="input-control"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="input-control"
                    >
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>City *</label>
                    <input
                      type="text"
                      required
                      value={formData.residenceCity}
                      onChange={(e) => setFormData({ ...formData, residenceCity: e.target.value })}
                      placeholder="e.g. Silver Spring"
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Country *</label>
                    <input
                      type="text"
                      required
                      value={formData.residenceCountry}
                      onChange={(e) => setFormData({ ...formData, residenceCountry: e.target.value })}
                      placeholder="e.g. United States"
                      className="input-control"
                    />
                  </div>
                </div>

                <button type="button" onClick={nextStep} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Continue to Faith Profile <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: FAITH */}
            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <BookOpen size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Seventh-day Adventist Faith Profile
                  </h2>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>General Conference Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="input-control"
                  >
                    <option value="North American Division (NAD)">North American Division (NAD)</option>
                    <option value="Southern Asia Division (SUD)">Southern Asia Division (SUD)</option>
                    <option value="Southern Africa-Indian Ocean (SID)">Southern Africa-Indian Ocean (SID)</option>
                    <option value="Trans-European Division (TED)">Trans-European Division (TED)</option>
                    <option value="Inter-American Division (IAD)">Inter-American Division (IAD)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Conference / Union</label>
                    <input
                      type="text"
                      value={formData.conference}
                      onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                      placeholder="e.g. Chesapeake Conference"
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Local Home Church *</label>
                    <input
                      type="text"
                      required
                      value={formData.localChurch}
                      onChange={(e) => setFormData({ ...formData, localChurch: e.target.value })}
                      placeholder="e.g. Spencerville SDA Church"
                      className="input-control"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Pastoral Reference Name</label>
                    <input
                      type="text"
                      value={formData.pastorName}
                      onChange={(e) => setFormData({ ...formData, pastorName: e.target.value })}
                      placeholder="e.g. Pastor Randy Roberts"
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Pastor / Church Email</label>
                    <input
                      type="email"
                      value={formData.pastorEmail}
                      onChange={(e) => setFormData({ ...formData, pastorEmail: e.target.value })}
                      placeholder="pastor@church.org"
                      className="input-control"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Baptism Status in SDA Church</label>
                  <select
                    value={formData.baptismStatus}
                    onChange={(e) => setFormData({ ...formData, baptismStatus: e.target.value })}
                    className="input-control"
                  >
                    <option value="Baptized SDA by Immersion">Baptized by Immersion in SDA Church</option>
                    <option value="Attending & Preparing for Baptism">Attending & Actively Preparing for Baptism</option>
                    <option value="Regular Church Attendee">Regular Church Attendee</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Sabbath Observance</label>
                  <select
                    value={formData.sabbathObservance}
                    onChange={(e) => setFormData({ ...formData, sabbathObservance: e.target.value })}
                    className="input-control"
                  >
                    <option value="Strict Friday Sunset to Saturday Sunset">Strict Sunset Friday to Sunset Saturday (Sacred Time)</option>
                    <option value="Moderate Sabbath Church Attendee">Moderate / Sabbath Church Attendee</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '8px' }}>Active Church Ministries</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {AVAILABLE_MINISTRIES.map((ministry) => {
                      const isSelected = formData.ministries.includes(ministry);
                      return (
                        <button
                          key={ministry}
                          type="button"
                          onClick={() => toggleMinistry(ministry)}
                          className={`badge ${isSelected ? 'badge-verified' : 'badge-primary'}`}
                          style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {ministry}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn btn-primary" style={{ flex: 2 }}>
                    Continue to Lifestyle <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LIFESTYLE */}
            {step === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Utensils size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Lifestyle & Health Message
                  </h2>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Dietary Practice</label>
                  <select
                    value={formData.diet}
                    onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                    className="input-control"
                  >
                    <option value="Strict Vegan (Plant-Based)">Strict Vegan (Plant-Based)</option>
                    <option value="Lacto-Ovo Vegetarian">Lacto-Ovo Vegetarian</option>
                    <option value="Pescatarian (Clean Fish Only)">Pescatarian (Clean Fish Only)</option>
                    <option value="Non-Vegetarian (Levitical Clean Meats Only)">Non-Vegetarian (Levitical Clean Meats Only)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Alcohol & Tobacco Stance</label>
                  <select
                    value={formData.alcoholTobacco}
                    onChange={(e) => setFormData({ ...formData, alcoholTobacco: e.target.value })}
                    className="input-control"
                  >
                    <option value="Strict Total Abstinence (Lifetime Abstainer)">Strict Total Abstinence (Adventist Temperance)</option>
                    <option value="Never Used in Lifetime">Never Used in Lifetime</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Sacred Music & Worship Preferences</label>
                  <input
                    type="text"
                    value={formData.musicPreferences}
                    onChange={(e) => setFormData({ ...formData, musicPreferences: e.target.value })}
                    placeholder="e.g. Choral hymns, Classical piano, Christian acoustic"
                    className="input-control"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn btn-primary" style={{ flex: 2 }}>
                    Continue to Vocation <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {step === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <GraduationCap size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Education & Vocation
                  </h2>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Highest Degree</label>
                  <select
                    value={formData.highestEducation}
                    onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                    className="input-control"
                  >
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate (Ph.D / MD / Ed.D)">Doctorate (Ph.D / MD / Ed.D)</option>
                    <option value="Associate / Diploma">Associate / Diploma</option>
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Occupation / Profession *</label>
                  <input
                    type="text"
                    required
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Registered Nurse, Engineer, Teacher"
                    className="input-control"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '5px' }}>Relocation Willingness</label>
                  <select
                    value={formData.relocationPreference}
                    onChange={(e) => setFormData({ ...formData, relocationPreference: e.target.value })}
                    className="input-control"
                  >
                    <option value="Willing to Relocate Anywhere Globally">Willing to Relocate Anywhere Globally</option>
                    <option value="Within Country Only">Within Country Only</option>
                    <option value="Prefer to Stay in Local Area">Prefer to Stay in Local Area</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="btn btn-gold" style={{ flex: 2, padding: '12px' }}>
                    Complete & Enter Platform <CheckCircle2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
