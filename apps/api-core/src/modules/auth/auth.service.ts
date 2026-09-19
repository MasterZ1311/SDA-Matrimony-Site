import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { UserRole, Gender, VerificationStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

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

    const rawVerifyToken = this.generateRandomToken();
    const hashedVerifyToken = this.hashToken(rawVerifyToken);
    const emailVerifyExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: UserRole.MEMBER,
        isEmailVerified: false,
        emailVerifyToken: hashedVerifyToken,
        emailVerifyExpires,
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

    // Send email verification link & raw token to user
    await this.mailService.sendVerificationEmail(
      user.email,
      rawVerifyToken,
      user.profile?.firstName,
    );

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

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required.');
    }

    const hashedToken = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerifyToken: hashedToken,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token.');
    }

    if (!user.emailVerifyExpires || user.emailVerifyExpires < new Date()) {
      throw new BadRequestException(
        'Verification token has expired. Please register again or request a new verification link.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    return {
      message: 'Email verified successfully. You can now use your account with full privileges.',
    };
  }

  async forgotPassword(email: string) {
    const genericMessage =
      'If an account exists with this email address, you will receive password reset instructions shortly.';

    if (!email) {
      return { message: genericMessage };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (user) {
      const rawResetToken = this.generateRandomToken();
      const hashedResetToken = this.hashToken(rawResetToken);
      const passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedResetToken,
          passwordResetExpires,
        },
      });

      await this.mailService.sendPasswordResetEmail(
        user.email,
        rawResetToken,
        user.profile?.firstName,
      );
    }

    return { message: genericMessage };
  }

  async resetPassword(token: string, newPass: string) {
    if (!token) {
      throw new BadRequestException('Reset token is required.');
    }

    const hashedToken = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid password reset token.');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException(
        'Password reset token has expired. Please request a new password reset link.',
      );
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPass, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return {
      message: 'Password has been reset successfully. You can now log in with your new password.',
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
