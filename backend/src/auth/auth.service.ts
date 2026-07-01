import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './auth-user.type';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailVerificationService } from './email-verification.service';
import { getJwtExpiresIn } from './jwt.config';
import { JwtPayload } from './jwt-payload.type';
import { PasswordResetService } from './password-reset.service';

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type RegisterResponse = {
  message: string;
  user: AuthUser;
};

type VerifyEmailResponse = {
  message: string;
  user: AuthUser;
};

type MessageResponse = {
  message: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: UserRole.USER,
        isDemo: false,
      },
    });

    const verificationToken =
      await this.emailVerificationService.createVerificationToken(user.id);
    await this.emailVerificationService.sendVerificationEmail(
      user,
      verificationToken,
    );

    return {
      message:
        'Registration successful. Please verify your email before logging in.',
      user: this.toAuthUser(user),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Please verify your email before logging in',
      );
    }

    return this.createAuthResponse(user);
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const user = await this.emailVerificationService.verifyEmailToken(token);

      return {
        message: 'Email verified successfully',
        user: this.toAuthUser(user),
      };
    } catch {
      throw new BadRequestException(
        'Invalid or expired email verification token',
      );
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const resetToken = await this.passwordResetService.createResetToken(
        user.id,
      );
      await this.passwordResetService.sendPasswordResetEmail(user, resetToken);
    }

    return {
      message:
        'If the email is registered, password reset instructions will be sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const resetToken = await this.passwordResetService.findValidResetToken(
      dto.token,
    );

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
    });
    const usedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
        data: { usedAt },
      }),
    ]);

    return {
      message: 'Password updated successfully. You can now log in.',
    };
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const authUser = this.toAuthUser(user);
    const payload: JwtPayload = {
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
      isDemo: authUser.isDemo,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: getJwtExpiresIn(),
    });

    return {
      accessToken,
      user: authUser,
    };
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isDemo: user.isDemo,
      emailVerifiedAt: user.emailVerifiedAt,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
