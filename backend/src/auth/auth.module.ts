import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { getJwtExpiresIn, getJwtSecret } from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { PasswordResetService } from './password-reset.service';
import { TwoFactorService } from './two-factor.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: {
        expiresIn: getJwtExpiresIn(),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    TwoFactorService,
    JwtStrategy,
  ],
})
export class AuthModule {}
