import { Response } from 'express';

const DEFAULT_REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const COOKIE_NAME = 'rt';
const COOKIE_PATH = '/';

/** Converts "7d", "24h", "60m", "3600s" formats to milliseconds */
function parseExpiresInToMs(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return DEFAULT_REFRESH_MAX_AGE_MS;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * (multipliers[unit] ?? 1000);
}

function getCookieOptions() {
  const isProduction = process.env['NODE_ENV'] === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProduction,
    path: COOKIE_PATH,
  };
}

export interface SetRefreshTokenCookieOptions {
  refreshExpiresIn?: string;
}

export function setRefreshTokenCookie(
  res: Response,
  token: string,
  options?: SetRefreshTokenCookieOptions,
) {
  const maxAgeMs = options?.refreshExpiresIn
    ? parseExpiresInToMs(options.refreshExpiresIn)
    : DEFAULT_REFRESH_MAX_AGE_MS;

  res.cookie(COOKIE_NAME, token, {
    ...getCookieOptions(),
    maxAge: maxAgeMs,
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, getCookieOptions());
}
