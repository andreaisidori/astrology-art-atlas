import crypto from 'crypto';

// Server-side check of the Curator Studio password.
// The expected value lives only in the ADMIN_PASSWORD environment variable (Vercel / .env.local).
export function checkAdminPassword(candidate, expected = process.env.ADMIN_PASSWORD) {
  if (!expected) {
    return { ok: false, status: 503, error: 'ADMIN_PASSWORD non configurata sul server: salvataggio disabilitato.' };
  }
  const a = crypto.createHash('sha256').update(String(candidate || '')).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return { ok: false, status: 401, error: 'Password curatore non valida.' };
  }
  return { ok: true };
}
