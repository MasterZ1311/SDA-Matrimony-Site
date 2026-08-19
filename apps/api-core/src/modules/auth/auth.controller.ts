import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Gender } from '@prisma/client';

import { IsEmail, IsString, IsNotEmpty, IsEnum, IsDateString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ example: 'david.miller@sda-matrimony.test' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @ApiProperty({ example: 'David' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({ example: 'Miller' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: 'Gender must be MALE or FEMALE.' })
  @IsNotEmpty({ message: 'Gender is required.' })
  gender: Gender;

  @ApiProperty({ example: '1996-04-15' })
  @IsDateString({}, { message: 'Please provide a valid date string (YYYY-MM-DD).' })
  @IsNotEmpty({ message: 'Date of birth is required.' })
  dateOfBirth: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: 'david.miller@sda-matrimony.test' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required.' })
  refreshToken: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new Seventh-day Adventist candidate account' })
  @ApiResponse({ status: 201, description: 'Account created successfully with initial profile shell.' })
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate member and issue JWT access & refresh token pair' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully.' })
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate and refresh JWT access token' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve current authenticated member identity and profile state' })
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profile: user.profile,
    };
  }
}
