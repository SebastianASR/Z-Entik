import { randomBytes, randomInt } from 'node:crypto';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import {
  BrevoEmailError,
  getBrevoUserMessage,
  isBrevoEmailConfigured,
  sendBrevoEmail,
} from './brevo-email.client';

type TwoFactorEmailUser = Pick<User, 'id' | 'name' | 'email'>;

export const TWO_FACTOR_CODE_PURPOSE = {
  LOGIN: 'LOGIN',
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
} as const;

export type TwoFactorCodePurpose =
  (typeof TWO_FACTOR_CODE_PURPOSE)[keyof typeof TWO_FACTOR_CODE_PURPOSE];

type TwoFactorEmailCopy = {
  subject: string;
  title: string;
  intro: string;
  warning: string;
};

type StoredTwoFactorCode = {
  id: string;
  codeHash: string;
};

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async createAndSendCode(
    user: TwoFactorEmailUser,
    purpose: TwoFactorCodePurpose,
  ): Promise<void> {
    const code = this.generateCode();
    const codeHash = await argon2.hash(code, {
      type: argon2.argon2id,
    });
    const expiresAt = new Date(
      Date.now() + this.getCodeExpiresMinutes() * 60 * 1000,
    );
    const invalidatedAt = new Date();
    const twoFactorCodeId = `tfc_${randomBytes(16).toString('hex')}`;

    await this.prisma.$transaction([
      this.prisma.$executeRaw`
        UPDATE "TwoFactorCode"
        SET "usedAt" = ${invalidatedAt}
        WHERE "userId" = ${user.id}
          AND "usedAt" IS NULL
      `,
      this.prisma.$executeRaw`
        INSERT INTO "TwoFactorCode" (
          "id",
          "codeHash",
          "purpose",
          "expiresAt",
          "userId"
        )
        VALUES (
          ${twoFactorCodeId},
          ${codeHash},
          ${purpose}::"TwoFactorCodePurpose",
          ${expiresAt},
          ${user.id}
        )
      `,
    ]);

    await this.sendTwoFactorCodeEmail(user, code, purpose);
  }

  async verifyCode(
    userId: string,
    purpose: TwoFactorCodePurpose,
    code: string,
  ): Promise<boolean> {
    const now = new Date();
    const [twoFactorCode] = await this.prisma.$queryRaw<StoredTwoFactorCode[]>`
      SELECT "id", "codeHash"
      FROM "TwoFactorCode"
      WHERE "userId" = ${userId}
        AND "purpose" = ${purpose}::"TwoFactorCodePurpose"
        AND "usedAt" IS NULL
        AND "expiresAt" > ${now}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;

    if (!twoFactorCode) {
      return false;
    }

    const isCodeValid = await argon2.verify(twoFactorCode.codeHash, code);

    if (!isCodeValid) {
      return false;
    }

    const usedAt = new Date();
    const updatedRows = await this.prisma.$executeRaw`
      UPDATE "TwoFactorCode"
      SET "usedAt" = ${usedAt}
      WHERE "id" = ${twoFactorCode.id}
        AND "usedAt" IS NULL
        AND "expiresAt" > ${usedAt}
    `;

    return updatedRows === 1;
  }

  getCodeExpiresMinutes(): number {
    const configuredMinutes = Number(
      process.env.TWO_FACTOR_CODE_EXPIRES_MINUTES,
    );

    return Number.isInteger(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : 5;
  }

  private async sendTwoFactorCodeEmail(
    user: TwoFactorEmailUser,
    code: string,
    purpose: TwoFactorCodePurpose,
  ): Promise<void> {
    if (!isBrevoEmailConfigured()) {
      this.logDevelopmentCode(user.email, code, purpose);
      console.warn(
        '[Brevo] correo 2FA no enviado: falta BREVO_API_KEY o BREVO_SENDER_EMAIL.',
      );

      if (process.env.NODE_ENV !== 'production') {
        return;
      }

      throw new ServiceUnavailableException(
        'Brevo no esta configurado en Render. Revisa BREVO_API_KEY y BREVO_SENDER_EMAIL.',
      );
    }

    const copy = this.getEmailCopy(purpose);

    try {
      await sendBrevoEmail({
        kind: `correo 2FA ${purpose}`,
        toEmail: user.email,
        toName: user.name,
        subject: copy.subject,
        htmlContent: this.buildHtmlContent(user.name, code, copy),
        textContent: this.buildTextContent(code, copy),
      });
    } catch (error) {
      this.logDevelopmentCode(user.email, code, purpose);
      this.handleBrevoError(error, 'código 2FA');
    }
  }

  private generateCode(): string {
    return randomInt(0, 1000000).toString().padStart(6, '0');
  }

  private logDevelopmentCode(
    email: string,
    code: string,
    purpose: TwoFactorCodePurpose,
  ): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    console.log(`2FA ${purpose} code for ${email} (development only): ${code}`);
  }

  private handleBrevoError(error: unknown, kind: string): never {
    if (error instanceof BrevoEmailError) {
      console.error(error.message);
      throw new ServiceUnavailableException(
        `${getBrevoUserMessage(error)} No pudimos enviar el ${kind}.`,
      );
    }

    console.error(error);
    throw new ServiceUnavailableException(`No pudimos enviar el ${kind}.`);
  }

  private getEmailCopy(purpose: TwoFactorCodePurpose): TwoFactorEmailCopy {
    if (purpose === TWO_FACTOR_CODE_PURPOSE.ENABLE) {
      return {
        subject: 'Confirma la activaci\u00f3n de 2FA en Z-Entik',
        title: 'Confirma la activaci\u00f3n de 2FA',
        intro:
          'Recibimos una solicitud para activar la verificaci\u00f3n en dos pasos de tu cuenta en Z-Entik.',
        warning:
          'Si no solicitaste activar 2FA, cambia tu contrase\u00f1a y contacta a tu administrador.',
      };
    }

    if (purpose === TWO_FACTOR_CODE_PURPOSE.DISABLE) {
      return {
        subject: 'Confirma la desactivaci\u00f3n de 2FA en Z-Entik',
        title: 'Confirma la desactivaci\u00f3n de 2FA',
        intro:
          'Recibimos una solicitud para desactivar la verificaci\u00f3n en dos pasos de tu cuenta en Z-Entik.',
        warning:
          'Si no solicitaste desactivar 2FA, ignora este correo y contacta a tu administrador.',
      };
    }

    return {
      subject: 'Tu c\u00f3digo de acceso a Z-Entik',
      title: 'Tu c\u00f3digo de acceso',
      intro:
        'Usa este c\u00f3digo para completar el inicio de sesi\u00f3n en Z-Entik.',
      warning:
        'Si no intentaste iniciar sesi\u00f3n, cambia tu contrase\u00f1a y contacta a tu administrador.',
    };
  }

  private buildHtmlContent(
    name: string,
    code: string,
    copy: TwoFactorEmailCopy,
  ): string {
    const safeName = this.escapeHtml(name || 'hola');
    const safeCode = this.escapeHtml(code);
    const expiresMinutes = this.getCodeExpiresMinutes();

    return `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${copy.subject}</title>
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
                      <h2 style="margin:0 0 16px; color:#172033; font-size:24px; line-height:1.3;">${copy.title}</h2>
                      <p style="margin:0 0 16px; color:#3f4d63; font-size:16px; line-height:1.65;">Hola ${safeName},</p>
                      <p style="margin:0 0 20px; color:#3f4d63; font-size:16px; line-height:1.65;">${copy.intro}</p>
                      <div style="margin:0 0 20px; padding:18px 22px; background:#eef6ff; border:1px solid #bfdbfe; border-radius:10px; color:#172033; font-size:30px; font-weight:800; letter-spacing:0.18em; text-align:center;">${safeCode}</div>
                      <p style="margin:0 0 16px; color:#3f4d63; font-size:16px; line-height:1.65;">Este c\u00f3digo expira en <strong style="color:#172033;">${expiresMinutes} minutos</strong>.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 28px 32px;">
                      <div style="border-top:1px solid #e5ebf3; padding-top:20px;">
                        <p style="margin:0 0 16px; color:#5d6b82; font-size:14px; line-height:1.6;">${copy.warning}</p>
                        <p style="margin:0; color:#172033; font-size:15px; line-height:1.6; font-weight:700;">Equipo Z-Entik</p>
                        <p style="margin:2px 0 0; color:#6b7890; font-size:13px; line-height:1.6;">Una soluci\u00f3n de Z Labs</p>
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

  private buildTextContent(code: string, copy: TwoFactorEmailCopy): string {
    return [
      copy.subject,
      '',
      copy.intro,
      `C\u00f3digo: ${code}`,
      '',
      `Este c\u00f3digo expira en ${this.getCodeExpiresMinutes()} minutos.`,
      copy.warning,
      '',
      'Equipo Z-Entik',
      'Una soluci\u00f3n de Z Labs',
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
