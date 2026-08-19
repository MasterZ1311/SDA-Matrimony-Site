import { Injectable, BadRequestException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, Gender, VerificationStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getJwtSecret(type: 'access' | 'refresh'): string {
    const key = type === 'access' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET';
    const secret = this.configService.get<string>(key) || process.env[key];

    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new InternalServerErrorException(`Missing required JWT secret configuration: ${key}`);
      }
      return type === 'access'
        ? 'dev_only_jwt_access_secret_do_not_use_in_prod'
        : 'dev_only_jwt_refresh_secret_do_not_use_in_prod';
    }

    return secret;
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: UserRole.MEMBER,
        isEmailVerified: false,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            verificationStatus: VerificationStatus.UNVERIFIED,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        hasProfile: !!user.profile,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
      },
      ...tokens,
    };
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        hasProfile: !!user.profile,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
      },
      ...tokens,
    };
  }

  generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };
    const accessSecret = this.getJwtSecret('access');
    const refreshSecret = this.getJwtSecret('refresh');

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const refreshSecret = this.getJwtSecret('refresh');
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { profile: true },
      });

      if (!user) throw new UnauthorizedException('Invalid session.');

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }
}
