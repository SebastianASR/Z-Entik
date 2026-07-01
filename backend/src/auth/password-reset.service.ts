import { createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type PasswordResetEmailUser = Pick<User, 'id' | 'name' | 'email'>;

@Injectable()
export class PasswordResetService {
  constructor(private readonly prisma: PrismaService) {}

  async createResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(
      Date.now() + this.getExpiresMinutes() * 60 * 1000,
    );

    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        expiresAt,
        userId,
      },
    });

    return token;
  }

  async findValidResetToken(token: string) {
    const tokenHash = this.hashToken(token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return null;
    }

    return resetToken;
  }

  async sendPasswordResetEmail(
    user: PasswordResetEmailUser,
    token: string,
  ): Promise<void> {
    const resetUrl = this.buildResetUrl(token);
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME ?? 'Z-Entik';

    if (!apiKey || !senderEmail) {
      this.logDevelopmentResetLink(user.email, resetUrl);
      console.warn(
        'Brevo email is not configured. Password reset email was not sent.',
      );
      return;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [
          {
            email: user.email,
            name: user.name,
          },
        ],
        subject: 'Restablece tu contraseña en Z-Entik',
        htmlContent: this.buildHtmlContent(user.name, resetUrl),
        textContent: this.buildTextContent(resetUrl),
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(
        `Brevo password reset request failed with status ${response.status}: ${responseText}`,
      );
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getExpiresMinutes(): number {
    const configuredMinutes = Number(
      process.env.PASSWORD_RESET_EXPIRES_MINUTES,
    );

    return Number.isInteger(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : 30;
  }

  private buildResetUrl(token: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const defaultBackendUrl = `http://localhost:${process.env.PORT ?? 3000}`;
    const baseUrl = isProduction
      ? (process.env.APP_FRONTEND_URL ??
        process.env.FRONTEND_URL ??
        'http://localhost:5173')
      : defaultBackendUrl;
    const path = isProduction ? '/reset-password' : '/auth/reset-password';
    const url = new URL(path, baseUrl);
    url.searchParams.set('token', token);

    return url.toString();
  }

  private logDevelopmentResetLink(email: string, resetUrl: string): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    console.log(
      `Password reset link for ${email} (development only): ${resetUrl}`,
    );
  }

  private buildHtmlContent(name: string, resetUrl: string): string {
    const safeName = this.escapeHtml(name || 'hola');
    const safeResetUrl = this.escapeHtml(resetUrl);
    const expiresMinutes = this.getExpiresMinutes();

    return `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Restablece tu contraseña en Z-Entik</title>
        </head>
        <body style="margin:0; padding:0; background:#f3f6fb; color:#172033; font-family:Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; background:#f3f6fb; padding:24px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:640px; background:#ffffff; border:1px solid #dbe3ef; border-radius:12px; overflow:hidden;">
                  <tr>
                    <td style="background:#111827; padding:28px 28px 22px;">
                      <p style="margin:0 0 8px; color:#8bd3ff; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Z Labs</p>
                      <h1 style="margin:0; color:#ffffff; font-size:28px; line-height:1.2; font-weight:800;">Z-Entik</h1>
                      <p style="margin:8px 0 0; color:#c9d6e8; font-size:15px; line-height:1.5;">Sistema HelpDesk TI</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 28px 12px;">
                      <h2 style="margin:0 0 16px; color:#172033; font-size:24px; line-height:1.3;">Restablece tu contraseña</h2>
                      <p style="margin:0 0 16px; color:#3f4d63; font-size:16px; line-height:1.65;">Hola ${safeName},</p>
                      <p style="margin:0 0 16px; color:#3f4d63; font-size:16px; line-height:1.65;">Recibimos una solicitud para cambiar la contraseña de tu cuenta en <strong style="color:#172033;">Z-Entik</strong>.</p>
                      <p style="margin:0 0 24px; color:#3f4d63; font-size:16px; line-height:1.65;">Este enlace expira en <strong style="color:#172033;">${expiresMinutes} minutos</strong>.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="background:#2563eb; border-radius:8px;">
                            <a href="${safeResetUrl}" style="display:inline-block; padding:14px 22px; color:#ffffff; font-size:16px; line-height:1; font-weight:700; text-decoration:none; border-radius:8px;">Restablecer contraseña</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 10px; color:#5d6b82; font-size:14px; line-height:1.6;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                      <p style="margin:0; word-break:break-all; color:#2563eb; font-size:14px; line-height:1.6;">
                        <a href="${safeResetUrl}" style="color:#2563eb; text-decoration:underline;">${safeResetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 28px 32px;">
                      <div style="border-top:1px solid #e5ebf3; padding-top:20px;">
                        <p style="margin:0 0 16px; color:#5d6b82; font-size:14px; line-height:1.6;">Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.</p>
                        <p style="margin:0; color:#172033; font-size:15px; line-height:1.6; font-weight:700;">Equipo Z-Entik</p>
                        <p style="margin:2px 0 0; color:#6b7890; font-size:13px; line-height:1.6;">Una solución de Z Labs</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private buildTextContent(resetUrl: string): string {
    return [
      'Restablece tu contraseña en Z-Entik',
      '',
      'Recibimos una solicitud para cambiar la contraseña de tu cuenta.',
      'Para continuar, abre el siguiente enlace:',
      resetUrl,
      '',
      `Este enlace expira en ${this.getExpiresMinutes()} minutos.`,
      'Si no solicitaste este cambio, puedes ignorar este correo.',
      '',
      'Equipo Z-Entik',
      'Una solución de Z Labs',
    ].join('\n');
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
