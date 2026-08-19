import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const accessSecret = configService.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET;
    if (!accessSecret && process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY CONFIGURATION ERROR: Missing required environment variable JWT_ACCESS_SECRET in production mode.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret || 'dev_only_jwt_access_secret_do_not_use_in_prod',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists or session is invalid.');
    }

    return user;
  }
}
