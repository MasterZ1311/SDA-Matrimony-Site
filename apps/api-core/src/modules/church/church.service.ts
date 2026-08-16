import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChurchService {
  constructor(private prisma: PrismaService) {}

  async getDivisions() {
    return this.prisma.churchDivision.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getUnions(divisionId?: string) {
    return this.prisma.churchUnion.findMany({
      where: divisionId ? { divisionId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async getConferences(unionId?: string) {
    return this.prisma.churchConference.findMany({
      where: unionId ? { unionId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async getLocalChurches(conferenceId?: string) {
    return this.prisma.localChurch.findMany({
      where: conferenceId ? { conferenceId } : undefined,
      orderBy: { name: 'asc' },
    });
  }
}
