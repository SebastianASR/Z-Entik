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
import { TwoFactorCodeDto } from './dto/two-factor-code.dto';
import { VerifyTwoFactorLoginDto } from './dto/verify-two-factor-login.dto';
import { EmailVerificationService } from './email-verification.service';
import { getJwtExpiresIn, getTwoFactorLoginTokenExpiresIn } from './jwt.config';
import { JwtPayload } from './jwt-payload.type';
import { PasswordResetService } from './password-reset.service';
import {
  TWO_FACTOR_CODE_PURPOSE,
  TwoFactorService,
} from './two-factor.service';

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type TwoFactorLoginRequiredResponse = {
  twoFactorRequired: true;
  twoFactorToken: string;
  message: string;
};

type LoginResponse = AuthResponse | TwoFactorLoginRequiredResponse;

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

type TwoFactorLoginTokenPayload = {
  sub: string;
  email: string;
  purpose: '2fa-login';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.emailVerifiedAt) {
        const verificationToken =
          await this.emailVerificationService.createVerificationToken(
            existingUser.id,
          );
        await this.emailVerificationService.sendVerificationEmail(
          existingUser,
          verificationToken,
        );

        return {
          message:
            'Ya existe una cuenta pendiente. Enviamos un nuevo correo de verificación.',
          user: this.toAuthUser(existingUser),
        };
      }

      throw new ConflictException('Este correo ya esta registrado');
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
      message: 'Registro exitoso. Verifica tu correo antes de iniciar sesión.',
      user: this.toAuthUser(user),
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Correo o contrasena incorrectos');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contrasena incorrectos');
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Debes verificar tu correo antes de iniciar sesion',
      );
    }

    if (user.isTwoFactorEnabled) {
      return this.createTwoFactorLoginResponse(user);
    }

    return this.createAuthResponse(user);
  }

  async verifyTwoFactorLogin(
    dto: VerifyTwoFactorLoginDto,
  ): Promise<AuthResponse> {
    const payload = await this.verifyTwoFactorLoginToken(dto.twoFactorToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException(
        'La verificacion 2FA expiro o no es valida',
      );
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Debes verificar tu correo antes de iniciar sesion',
      );
    }

    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'La autenticacion en dos factores no esta activada',
      );
    }

    const isCodeValid = await this.twoFactorService.verifyCode(
      user.id,
      TWO_FACTOR_CODE_PURPOSE.LOGIN,
      dto.code,
    );

    if (!isCodeValid) {
      throw new BadRequestException('El codigo 2FA no es valido o expiro');
    }

    return this.createAuthResponse(user);
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const user = await this.emailVerificationService.verifyEmailToken(token);

      return {
        message: 'Correo verificado correctamente',
        user: this.toAuthUser(user),
      };
    } catch {
      throw new BadRequestException(
        'El enlace de verificacion no es valido o expiro',
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
        'Si el correo existe, recibiras instrucciones para restablecer tu contrasena.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Las contrasenas no coinciden');
    }

    const resetToken = await this.passwordResetService.findValidResetToken(
      dto.token,
    );

    if (!resetToken) {
      throw new BadRequestException(
        'El enlace para restablecer la contrasena no es valido o expiro',
      );
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
      message:
        'Contrasena actualizada correctamente. Ya puedes iniciar sesion.',
    };
  }

  async requestEnableTwoFactor(authUser: AuthUser): Promise<MessageResponse> {
    const user = await this.findUserForTwoFactor(authUser.id);

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Debes verificar tu correo antes de activar 2FA',
      );
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'La autenticacion en dos factores ya esta activada',
      );
    }

    await this.twoFactorService.createAndSendCode(
      user,
      TWO_FACTOR_CODE_PURPOSE.ENABLE,
    );

    return {
      message: 'Se envi\u00f3 un c\u00f3digo de verificaci\u00f3n a tu correo.',
    };
  }

  async confirmEnableTwoFactor(
    authUser: AuthUser,
    dto: TwoFactorCodeDto,
  ): Promise<MessageResponse> {
    const user = await this.findUserForTwoFactor(authUser.id);

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Debes verificar tu correo antes de activar 2FA',
      );
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'La autenticacion en dos factores ya esta activada',
      );
    }

    const isCodeValid = await this.twoFactorService.verifyCode(
      user.id,
      TWO_FACTOR_CODE_PURPOSE.ENABLE,
      dto.code,
    );

    if (!isCodeValid) {
      throw new BadRequestException('El codigo 2FA no es valido o expiro');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: true },
    });

    return {
      message:
        'La autenticaci\u00f3n en dos factores fue activada correctamente.',
    };
  }

  async requestDisableTwoFactor(authUser: AuthUser): Promise<MessageResponse> {
    const user = await this.findUserForTwoFactor(authUser.id);

    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'La autenticacion en dos factores no esta activada',
      );
    }

    await this.twoFactorService.createAndSendCode(
      user,
      TWO_FACTOR_CODE_PURPOSE.DISABLE,
    );

    return {
      message: 'Se envi\u00f3 un c\u00f3digo de confirmaci\u00f3n a tu correo.',
    };
  }

  async confirmDisableTwoFactor(
    authUser: AuthUser,
    dto: TwoFactorCodeDto,
  ): Promise<MessageResponse> {
    const user = await this.findUserForTwoFactor(authUser.id);

    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'La autenticacion en dos factores no esta activada',
      );
    }

    const isCodeValid = await this.twoFactorService.verifyCode(
      user.id,
      TWO_FACTOR_CODE_PURPOSE.DISABLE,
      dto.code,
    );

    if (!isCodeValid) {
      throw new BadRequestException('El codigo 2FA no es valido o expiro');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: false },
    });

    return {
      message:
        'La autenticaci\u00f3n en dos factores fue desactivada correctamente.',
    };
  }

  private async createTwoFactorLoginResponse(
    user: User,
  ): Promise<TwoFactorLoginRequiredResponse> {
    await this.twoFactorService.createAndSendCode(
      user,
      TWO_FACTOR_CODE_PURPOSE.LOGIN,
    );

    const payload: TwoFactorLoginTokenPayload = {
      sub: user.id,
      email: user.email,
      purpose: '2fa-login',
    };
    const twoFactorToken = await this.jwtService.signAsync(payload, {
      expiresIn: getTwoFactorLoginTokenExpiresIn(),
    });

    return {
      twoFactorRequired: true,
      twoFactorToken,
      message: 'Se envi\u00f3 un c\u00f3digo de verificaci\u00f3n a tu correo.',
    };
  }

  private async verifyTwoFactorLoginToken(
    twoFactorToken: string,
  ): Promise<TwoFactorLoginTokenPayload> {
    try {
      const payload =
        await this.jwtService.verifyAsync<TwoFactorLoginTokenPayload>(
          twoFactorToken,
        );

      if (payload.purpose !== '2fa-login') {
        throw new Error('Proposito de token 2FA no valido');
      }

      return payload;
    } catch {
      throw new UnauthorizedException(
        'La verificacion 2FA expiro o no es valida',
      );
    }
  }

  private async findUserForTwoFactor(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Debes iniciar sesion');
    }

    return user;
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
