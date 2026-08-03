const BREVO_EMAIL_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

type BrevoEmailPayload = {
  kind: string;
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
  textContent: string;
};

type BrevoConfig = {
  apiKey: string;
  senderEmail: string;
  senderName: string;
};

export class BrevoEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrevoEmailError';
  }
}

export function isBrevoEmailConfigured(): boolean {
  return Boolean(getBrevoConfig());
}

export async function sendBrevoEmail(
  payload: BrevoEmailPayload,
): Promise<void> {
  const config = getBrevoConfig();

  if (!config) {
    throw new BrevoEmailError(
      '[Brevo] faltan BREVO_API_KEY o BREVO_SENDER_EMAIL.',
    );
  }

  let response: Response;

  try {
    response = await fetch(BREVO_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': config.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: config.senderEmail,
          name: config.senderName,
        },
        to: [
          {
            email: payload.toEmail,
            name: payload.toName,
          },
        ],
        subject: payload.subject,
        htmlContent: payload.htmlContent,
        textContent: payload.textContent,
      }),
    });
  } catch (error) {
    throw new BrevoEmailError(
      `[Brevo] no se pudo conectar para enviar ${payload.kind}: ${getErrorMessage(error)}`,
    );
  }

  const responseText = await response.text();

  if (!response.ok) {
    throw new BrevoEmailError(
      `[Brevo] rechazo ${payload.kind} con status ${response.status}: ${sanitizeBrevoResponse(responseText)}`,
    );
  }

  console.log(
    `[Brevo] acepto ${payload.kind} para ${maskEmail(payload.toEmail)}${formatMessageId(responseText)}.`,
  );
}

function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Z-Entik';

  if (!apiKey || !senderEmail) {
    return null;
  }

  return {
    apiKey,
    senderEmail,
    senderName,
  };
}

function formatMessageId(responseText: string): string {
  if (!responseText) {
    return '';
  }

  try {
    const responseBody = JSON.parse(responseText) as { messageId?: unknown };
    return typeof responseBody.messageId === 'string'
      ? ` (messageId=${responseBody.messageId})`
      : '';
  } catch {
    return '';
  }
}

function sanitizeBrevoResponse(responseText: string): string {
  return responseText
    .replaceAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (email) =>
      maskEmail(email),
    )
    .slice(0, 1000);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '[correo invalido]';
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}
