import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class BiodataService {
  constructor(private prisma: PrismaService) {}

  async generateBiodataPdf(profileId: string): Promise<Buffer> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        spiritualProfile: {
          include: { division: true, conference: true, localChurch: true },
        },
        lifestyleProfile: true,
        educationCareer: true,
        familyBackground: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header Banner
      doc.rect(40, 40, 515, 60).fill('#0F2942');
      doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold')
         .text('SEVENTH-DAY ADVENTIST MATRIMONIAL BIODATA', 50, 55, { align: 'center' });
      doc.fontSize(10).font('Helvetica')
         .text('Christ-Centered Matrimonial Profile', 50, 78, { align: 'center' });

      doc.moveDown(3);
      doc.fillColor('#1A202C');

      // Personal Details Section
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0F2942').text('1. PERSONAL & CONTACT DETAILS');
      doc.rect(40, doc.y + 2, 515, 1).fill('#0F2942');
      doc.moveDown(0.6);
      doc.fontSize(10).font('Helvetica').fillColor('#2D3748');

      const age = Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));
      
      doc.text(`Full Name: ${profile.firstName} ${profile.lastName}`);
      doc.text(`Gender / Age: ${profile.gender} / ${age} years`);
      doc.text(`Marital Status: ${profile.maritalStatus.replace('_', ' ')}`);
      doc.text(`Location: ${profile.residenceCity}, ${profile.residenceCountry}`);
      if (profile.heightCm) doc.text(`Height: ${profile.heightCm} cm`);

      doc.moveDown(1);

      // Spiritual Profile Section
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0F2942').text('2. SPIRITUAL & ADVENTIST FAITH PROFILE');
      doc.rect(40, doc.y + 2, 515, 1).fill('#0F2942');
      doc.moveDown(0.6);
      doc.fontSize(10).font('Helvetica').fillColor('#2D3748');

      const sp = profile.spiritualProfile;
      if (sp) {
        doc.text(`Baptism Status: ${sp.baptismStatus.replace(/_/g, ' ')} ${sp.baptismYear ? `(Year: ${sp.baptismYear})` : ''}`);
        doc.text(`Sabbath Observance: ${sp.sabbathObservance.replace(/_/g, ' ')}`);
        doc.text(`Division: ${sp.division?.name || 'Not specified'}`);
        doc.text(`Conference: ${sp.conference?.name || 'Not specified'}`);
        doc.text(`Local Church: ${sp.localChurch?.name || sp.localChurchCustomName || 'Not specified'}`);
        doc.text(`Church Ministries: ${sp.ministries.join(', ') || 'Active Member'}`);
        if (sp.favoriteBibleVerse) doc.text(`Favorite Scripture: "${sp.favoriteBibleVerse}"`);
      } else {
        doc.text('Spiritual profile details pending completion.');
      }

      doc.moveDown(1);

      // Lifestyle & Health Message Section
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0F2942').text('3. LIFESTYLE & HEALTH COMMITMENT');
      doc.rect(40, doc.y + 2, 515, 1).fill('#0F2942');
      doc.moveDown(0.6);
      doc.fontSize(10).font('Helvetica').fillColor('#2D3748');

      const ls = profile.lifestyleProfile;
      if (ls) {
        doc.text(`Dietary Practice: ${ls.diet.replace(/_/g, ' ')}`);
        doc.text(`Temperance Stance: ${ls.alcoholTobacco.replace(/_/g, ' ')}`);
        doc.text(`Music Preferences: ${ls.musicPreferences.join(', ') || 'Sacred / Classical'}`);
      }

      doc.moveDown(1);

      // Education & Profession Section
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0F2942').text('4. EDUCATION & VOCATION');
      doc.rect(40, doc.y + 2, 515, 1).fill('#0F2942');
      doc.moveDown(0.6);
      doc.fontSize(10).font('Helvetica').fillColor('#2D3748');

      const ec = profile.educationCareer;
      if (ec) {
        doc.text(`Highest Education: ${ec.highestEducation}`);
        if (ec.fieldOfStudy) doc.text(`Field of Study: ${ec.fieldOfStudy}`);
        doc.text(`Occupation: ${ec.occupation}`);
        if (ec.employerOrBusiness) doc.text(`Employer / Organization: ${ec.employerOrBusiness}`);
        doc.text(`Relocation Willingness: ${ec.relocationPreference.replace(/_/g, ' ')}`);
      }

      doc.moveDown(1.5);
      doc.fontSize(8).fillColor('#718096').text(
        'Generated securely via Seventh-day Adventist Matrimony Platform. Verified for matrimonial and pastoral family review.',
        { align: 'center' }
      );

      doc.end();
    });
  }
}
