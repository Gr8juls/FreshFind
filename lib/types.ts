// Canonical type definitions shared across the FreshFind platform.
// Import from here — not from mockData.ts — for production code.

export type UserRole =
  | 'CUSTOMER'
  | 'BUSINESS_OWNER'
  | 'BUSINESS_MANAGER'
  | 'BUSINESS_STAFF'
  | 'ADMIN'
  | 'SUPER_ADMIN';

// Roles that are allowed to self-register via the public /api/auth/register endpoint.
export const REGISTERABLE_ROLES: UserRole[] = ['CUSTOMER', 'BUSINESS_OWNER'];

// Roles that have access to the /business portal.
export const BUSINESS_ROLES: UserRole[] = [
  'BUSINESS_OWNER',
  'BUSINESS_MANAGER',
  'BUSINESS_STAFF',
  'ADMIN',
  'SUPER_ADMIN',
];

// Roles that have access to the /admin portal.
export const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
