export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'message' in value;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const defaultErrorMessages: Record<number, string> = {
  400: 'La solicitud no es valida.',
  401: 'Tu sesion expiro o no tienes autorizacion.',
  403: 'No tienes permiso para realizar esta accion.',
  404: 'No encontramos el recurso solicitado.',
  409: 'Ya existe un registro con esos datos.',
  500: 'El servidor no pudo procesar la solicitud.',
};

const backendMessages: Record<string, string> = {
  'Invalid email or password': 'Correo o contrasena incorrectos.',
  'Please verify your email before logging in':
    'Debes verificar tu correo antes de iniciar sesion.',
  'Email is already registered': 'Este correo ya esta registrado.',
  'Invalid or expired email verification token':
    'El enlace de verificacion no es valido o expiro.',
  'If the email is registered, password reset instructions will be sent.':
    'Si el correo existe, recibiras instrucciones para restablecer tu contrasena.',
  'Password confirmation does not match': 'Las contrasenas no coinciden.',
  'Invalid or expired password reset token':
    'El enlace para restablecer la contrasena no es valido o expiro.',
  'Invalid or expired 2FA token': 'La verificacion 2FA expiro o no es valida.',
  'Two-factor authentication is not enabled':
    'La autenticacion en dos factores no esta activada.',
  'Two-factor authentication is already enabled':
    'La autenticacion en dos factores ya esta activada.',
  'Invalid or expired 2FA code': 'El codigo 2FA no es valido o expiro.',
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers({
    Accept: 'application/json',
  });

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? ((await response.json()) as T | ApiErrorBody)
    : undefined;

  if (!response.ok) {
    const rawMessage = isApiErrorBody(payload)
      ? Array.isArray(payload.message)
        ? payload.message[0]
        : payload.message
      : undefined;
    const translatedMessage =
      rawMessage && backendMessages[rawMessage]
        ? backendMessages[rawMessage]
        : rawMessage;

    throw new ApiError(
      translatedMessage ??
        defaultErrorMessages[response.status] ??
        'No pudimos completar la solicitud.',
      response.status,
    );
  }

  return payload as T;
}
