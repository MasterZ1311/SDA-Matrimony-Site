'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Heart, CheckCircle2, ArrowRight, ArrowLeft, Shield, BookOpen, Utensils, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'FEMALE',
    dateOfBirth: '1998-05-12',
    residenceCity: 'Silver Spring',
    residenceCountry: 'United States',
    // Step 2: Spiritual
    division: 'North American Division',
    conference: 'Chesapeake Conference',
    localChurch: 'Spencerville SDA Church',
    baptismStatus: 'BAPTIZED_SDA',
    sabbathObservance: 'STRICT_SUNSET_TO_SUNSET',
    ministries: ['Sabbath School', 'Music / Choir'],
    // Step 3: Lifestyle
    diet: 'LACTO_OVO_VEGETARIAN',
    alcoholTobacco: 'STRICT_ABSTINENCE',
    musicPreferences: 'Sacred Choral, Classical',
    // Step 4: Education
    highestEducation: 'BACHELORS',
    occupation: 'Healthcare Professional',
    relocationPreference: 'WILLING_TO_RELOCATE_ANYWHERE',
  });

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(
      {
        id: 'newly-registered-user',
        email: formData.email || 'new.member@sda-matrimony.org',
        role: 'MEMBER',
        firstName: formData.firstName || 'Grace',
        lastName: formData.lastName || 'Adams',
        isEmailVerified: true,
      },
      'token-new-user'
    );
    router.push('/discover');
  };

  return (
    <div style={{ padding: '60px 20px', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--bg-page)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-800)' }}>
              Step {step} of 4: {step === 1 ? 'Personal Details' : step === 2 ? 'Adventist Faith' : step === 3 ? 'Lifestyle & Diet' : 'Education & Vocation'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {step * 25}% Complete
            </span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${step * 25}%`,
              backgroundColor: 'var(--primary-700)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="card animate-fade" style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Shield size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Personal Background
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>First Name</label>
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
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Last Name</label>
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="grace.adventist@example.com"
                    className="input-control"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-control"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="input-control"
                    >
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="input-control"
                    />
                  </div>
                </div>

                <button type="button" onClick={nextStep} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Continue to Faith Profile <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <BookOpen size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Seventh-day Adventist Faith Profile
                  </h2>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>General Conference Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="input-control"
                  >
                    <option value="North American Division">North American Division (NAD)</option>
                    <option value="Southern Asia Division">Southern Asia Division (SUD)</option>
                    <option value="East-Central Africa Division">East-Central Africa Division (ECD)</option>
                    <option value="Trans-European Division">Trans-European Division (TED)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Baptism Status in SDA Church</label>
                  <select
                    value={formData.baptismStatus}
                    onChange={(e) => setFormData({ ...formData, baptismStatus: e.target.value })}
                    className="input-control"
                  >
                    <option value="BAPTIZED_SDA">Baptized by Immersion in SDA Church</option>
                    <option value="PLANNING_BAPTISM">Attending & Actively Preparing for Baptism</option>
                    <option value="ATTENDING_NON_MEMBER">Regular Church Attendee</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Sabbath Observance</label>
                  <select
                    value={formData.sabbathObservance}
                    onChange={(e) => setFormData({ ...formData, sabbathObservance: e.target.value })}
                    className="input-control"
                  >
                    <option value="STRICT_SUNSET_TO_SUNSET">Strict Sunset Friday to Sunset Saturday (Sacred Time)</option>
                    <option value="MODERATE">Moderate / Sabbath Church Attendee</option>
                  </select>
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

            {step === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Utensils size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Lifestyle & Health Message
                  </h2>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Dietary Practice</label>
                  <select
                    value={formData.diet}
                    onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                    className="input-control"
                  >
                    <option value="STRICT_VEGAN">Strict Vegan (Plant-Based)</option>
                    <option value="LACTO_OVO_VEGETARIAN">Lacto-Ovo Vegetarian</option>
                    <option value="PESCATARIAN">Pescatarian (Clean Fish Only)</option>
                    <option value="NON_VEGETARIAN_CLEAN_ONLY">Non-Vegetarian (Levitical Clean Meats Only)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Alcohol & Tobacco Stance</label>
                  <select
                    value={formData.alcoholTobacco}
                    onChange={(e) => setFormData({ ...formData, alcoholTobacco: e.target.value })}
                    className="input-control"
                  >
                    <option value="STRICT_ABSTINENCE">Strict Total Abstinence (Adventist Temperance)</option>
                    <option value="NEVER_USED">Never Used in Lifetime</option>
                  </select>
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

            {step === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <GraduationCap size={24} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    Education & Vocation
                  </h2>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Highest Degree</label>
                  <select
                    value={formData.highestEducation}
                    onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                    className="input-control"
                  >
                    <option value="BACHELORS">Bachelor's Degree</option>
                    <option value="MASTERS">Master's Degree</option>
                    <option value="DOCTORATE">Doctorate (Ph.D / MD / Ed.D)</option>
                    <option value="DIPLOMA">Associate / Diploma</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Occupation / Profession</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Relocation Willingness</label>
                  <select
                    value={formData.relocationPreference}
                    onChange={(e) => setFormData({ ...formData, relocationPreference: e.target.value })}
                    className="input-control"
                  >
                    <option value="WILLING_TO_RELOCATE_ANYWHERE">Willing to Relocate Anywhere Globally</option>
                    <option value="WITHIN_COUNTRY">Within Country Only</option>
                    <option value="NOT_WILLING_TO_RELOCATE">Prefer to Stay in Local Area</option>
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
