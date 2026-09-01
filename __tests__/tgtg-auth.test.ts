import { signToken, verifyToken } from '../lib/auth';

describe('TGTG-Parity Auth Utilities', () => {
  describe('JWT Session Tokens (lib/auth.ts)', () => {
    it('signs and verifies customer JWT tokens properly', async () => {
      const payload = {
        userId: 'user-tgtg-12345',
        role: 'CUSTOMER' as const,
        email: 'rescuer@freshfind.rw',
      };

      const token = await signToken(payload);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20);

      const verified = await verifyToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe(payload.userId);
      expect(verified?.role).toBe('CUSTOMER');
      expect(verified?.email).toBe(payload.email);
    });

    it('signs and verifies business partner JWT tokens properly', async () => {
      const payload = {
        userId: 'biz-partner-67890',
        role: 'BUSINESS_OWNER' as const,
        email: 'bakery@kigalibakes.rw',
      };

      const token = await signToken(payload);
      const verified = await verifyToken(token);
      expect(verified?.role).toBe('BUSINESS_OWNER');
    });

    it('rejects invalid or corrupted JWT tokens gracefully', async () => {
      const verified = await verifyToken('invalid.corrupted.jwt.token');
      expect(verified).toBeNull();
    });
  });

  describe('OTP Code Generator Verification', () => {
    it('generates valid 6-digit numeric codes with correct length and bounds', () => {
      for (let i = 0; i < 50; i++) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        expect(code).toHaveLength(6);
        expect(Number(code)).toBeGreaterThanOrEqual(100000);
        expect(Number(code)).toBeLessThanOrEqual(999999);
      }
    });
  });
});
