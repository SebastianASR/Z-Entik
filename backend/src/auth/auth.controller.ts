import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { Response } from 'express';
import type { AuthUser } from './auth-user.type';
import { AuthService } from './auth.service';
import { BlockDemoUsers } from './decorators/block-demo-users.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TwoFactorCodeDto } from './dto/two-factor-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyTwoFactorLoginDto } from './dto/verify-two-factor-login.dto';
import { DemoUserGuard } from './guards/demo-user.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('2fa/verify-login')
  verifyTwoFactorLogin(@Body() dto: VerifyTwoFactorLoginDto) {
    return this.authService.verifyTwoFactorLogin(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('reset-password')
  getResetPasswordForm(
    @Query('token') token: string | undefined,
    @Res() response: Response,
  ): void {
    if (!token) {
      this.sendResetPasswordPage(response, undefined, false);
      return;
    }

    this.sendResetPasswordPage(response, token, true);
  }

  @Get('verify-email')
  async verifyEmailFromLink(
    @Query('token') token: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    if (!token) {
      this.sendVerificationPage(response, false);
      return;
    }

    try {
      await this.authService.verifyEmail(token);
      this.sendVerificationPage(response, true);
    } catch {
      this.sendVerificationPage(response, false);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/request-enable')
  requestEnableTwoFactor(@CurrentUser() user: AuthUser) {
    return this.authService.requestEnableTwoFactor(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/confirm-enable')
  confirmEnableTwoFactor(
    @CurrentUser() user: AuthUser,
    @Body() dto: TwoFactorCodeDto,
  ) {
    return this.authService.confirmEnableTwoFactor(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/request-disable')
  requestDisableTwoFactor(@CurrentUser() user: AuthUser) {
    return this.authService.requestDisableTwoFactor(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/confirm-disable')
  confirmDisableTwoFactor(
    @CurrentUser() user: AuthUser,
    @Body() dto: TwoFactorCodeDto,
  ) {
    return this.authService.confirmDisableTwoFactor(user, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-check')
  getAdminCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Acceso de administrador concedido',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get('staff-check')
  getStaffCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Acceso de equipo tecnico concedido',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }

  @UseGuards(JwtAuthGuard, DemoUserGuard)
  @BlockDemoUsers()
  @Get('demo-protected-check')
  getDemoProtectedCheck(@CurrentUser() user: AuthUser) {
    return {
      status: 'ok',
      message: 'Acceso de cuenta no demo concedido',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo,
      },
    };
  }

  private sendVerificationPage(response: Response, isSuccess: boolean): void {
    const status = isSuccess ? HttpStatus.OK : HttpStatus.BAD_REQUEST;

    response.status(status).type('html').send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${isSuccess ? 'Correo verificado' : 'Verificación no válida'} | Z-Entik</title>
        </head>
        <body style="margin:0; min-height:100vh; background:#eef3f8; color:#172033; font-family:Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; padding:24px;">
          <main style="width:100%; max-width:560px; background:#ffffff; border:1px solid #dbe3ef; border-radius:14px; box-shadow:0 18px 48px rgba(23,32,51,0.12); overflow:hidden;">
            <section style="background:#111827; padding:28px;">
              <p style="margin:0 0 8px; color:#8bd3ff; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Z Labs</p>
              <h1 style="margin:0; color:#ffffff; font-size:30px; line-height:1.2;">Z-Entik</h1>
            </section>
            <section style="padding:32px 28px;">
              <div style="width:48px; height:48px; border-radius:999px; background:${isSuccess ? '#dcfce7' : '#fee2e2'}; color:${isSuccess ? '#166534' : '#991b1b'}; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; margin-bottom:18px;">
                ${isSuccess ? '&#10003;' : '!'}
              </div>
              <h2 style="margin:0 0 12px; color:#172033; font-size:24px; line-height:1.3;">
                ${isSuccess ? 'Correo verificado correctamente' : 'No pudimos verificar este correo'}
              </h2>
              <p style="margin:0 0 22px; color:#4b5a70; font-size:16px; line-height:1.65;">
                ${
                  isSuccess
                    ? 'Ya puedes iniciar sesión en Z-Entik con tu cuenta.'
                    : 'El enlace puede ser inválido, haber expirado o ya haber sido usado. Puedes solicitar un nuevo registro o intentar iniciar sesión si tu correo ya fue verificado.'
                }
              </p>
              <p style="margin:0; color:#6b7890; font-size:14px; line-height:1.6;">
                Equipo Z-Entik<br />
                <span style="font-size:13px;">Una solución de Z Labs</span>
              </p>
            </section>
          </main>
        </body>
      </html>
    `);
  }

  private sendResetPasswordPage(
    response: Response,
    token: string | undefined,
    hasToken: boolean,
  ): void {
    const safeToken = this.escapeHtml(token ?? '');

    response
      .status(hasToken ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .type('html').send(`
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Restablecer contraseña | Z-Entik</title>
          </head>
          <body style="margin:0; min-height:100vh; background:#eef3f8; color:#172033; font-family:Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; padding:24px;">
            <main style="width:100%; max-width:560px; background:#ffffff; border:1px solid #dbe3ef; border-radius:14px; box-shadow:0 18px 48px rgba(23,32,51,0.12); overflow:hidden;">
              <section style="background:#111827; padding:28px;">
                <p style="margin:0 0 8px; color:#8bd3ff; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Z Labs</p>
                <h1 style="margin:0; color:#ffffff; font-size:30px; line-height:1.2;">Z-Entik</h1>
              </section>
              <section style="padding:32px 28px;">
                <h2 style="margin:0 0 12px; color:#172033; font-size:24px; line-height:1.3;">Restablecer contraseña</h2>
                ${
                  hasToken
                    ? `
                      <p style="margin:0 0 22px; color:#4b5a70; font-size:16px; line-height:1.65;">Ingresa tu nueva contraseña para recuperar el acceso a Z-Entik.</p>
                      <form method="post" action="/auth/reset-password">
                        <input type="hidden" name="token" value="${safeToken}" />
                        <label style="display:block; margin:0 0 14px; color:#172033; font-size:14px; font-weight:700;">
                          Nueva contraseña
                          <input type="password" name="newPassword" minlength="8" required autocomplete="new-password" style="box-sizing:border-box; display:block; width:100%; margin-top:8px; padding:12px 14px; border:1px solid #cfd8e6; border-radius:8px; font-size:16px;" />
                        </label>
                        <label style="display:block; margin:0 0 22px; color:#172033; font-size:14px; font-weight:700;">
                          Confirmar contraseña
                          <input type="password" name="confirmPassword" minlength="8" required autocomplete="new-password" style="box-sizing:border-box; display:block; width:100%; margin-top:8px; padding:12px 14px; border:1px solid #cfd8e6; border-radius:8px; font-size:16px;" />
                        </label>
                        <button type="submit" style="border:0; background:#2563eb; color:#ffffff; padding:14px 20px; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer;">Actualizar contraseña</button>
                      </form>
                      <p style="margin:20px 0 0; color:#6b7890; font-size:13px; line-height:1.6;">La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.</p>
                    `
                    : '<p style="margin:0; color:#4b5a70; font-size:16px; line-height:1.65;">El enlace no incluye un token válido. Solicita un nuevo enlace de recuperación e inténtalo nuevamente.</p>'
                }
              </section>
            </main>
          </body>
        </html>
      `);
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
