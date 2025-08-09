/**
 * Role-Based Access Control (RBAC) Utilities
 * Centralized functions for managing user roles and routing
 */

export type UserRole = 'customer' | 'admin';

export interface RoleBasedRoutes {
  admin: string[];
  customer: string[];
  public: string[];
}

// Define role-based route mapping
export const ROLE_ROUTES: RoleBasedRoutes = {
  admin: [
    '/admin',
    '/admin/products',
    '/admin/orders',
    '/admin/customers',
    '/admin/coupons',
    '/admin/suppliers',
    '/admin/materials',
    '/admin/purchase-orders',
    '/admin/processing'
  ],
  customer: [
    '/cart',
    '/wishlist',
    '/orders',
    '/profile'
  ],
  public: [
    '/',
    '/login',
    '/register',
    '/search',
    '/bags',
    '/wallets',
    '/accessories'
  ]
};

// Default landing pages for each role
export const DEFAULT_ROLE_REDIRECTS = {
  admin: '/admin',
  customer: '/'
};

/**
 * Get the default redirect URL for a user role
 */
export function getDefaultRedirectForRole(role: UserRole): string {
  return DEFAULT_ROLE_REDIRECTS[role];
}

/**
 * Check if a user role has access to a specific path
 */
export function hasAccessToPath(role: UserRole, path: string): boolean {
  // Public routes are accessible to everyone
  if (ROLE_ROUTES.public.some(route => path.startsWith(route))) {
    return true;
  }

  // Check role-specific routes
  return ROLE_ROUTES[role].some(route => path.startsWith(route));
}

/**
 * Get the redirect URL for unauthorized access
 */
export function getUnauthorizedRedirect(role: UserRole, requestedPath: string): string {
  // If admin tries to access customer routes, redirect to admin dashboard
  if (role === 'admin' && ROLE_ROUTES.customer.some(route => requestedPath.startsWith(route))) {
    return '/admin';
  }

  // If customer tries to access admin routes, redirect to login
  if (role === 'customer' && ROLE_ROUTES.admin.some(route => requestedPath.startsWith(route))) {
    return '/login';
  }

  // Default redirect to role's home page
  return getDefaultRedirectForRole(role);
}

/**
 * Check if a path is admin-only
 */
export function isAdminOnlyPath(path: string): boolean {
  return ROLE_ROUTES.admin.some(route => path.startsWith(route));
}

/**
 * Check if a path is customer-only
 */
export function isCustomerOnlyPath(path: string): boolean {
  return ROLE_ROUTES.customer.some(route => path.startsWith(route));
}
