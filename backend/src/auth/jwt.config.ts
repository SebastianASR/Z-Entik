import type { SignOptions } from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required for authentication',
    );
  }

  return secret;
}

export function getJwtExpiresIn(): SignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];
}

export function getTwoFactorLoginTokenExpiresIn(): SignOptions['expiresIn'] {
  const configuredMinutes = Number(
    process.env.TWO_FACTOR_LOGIN_TOKEN_EXPIRES_MINUTES,
  );
  const minutes =
    Number.isInteger(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : 5;

  return `${minutes}m` as SignOptions['expiresIn'];
}
