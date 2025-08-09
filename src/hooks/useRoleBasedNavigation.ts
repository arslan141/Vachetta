/**
 * Role-Based Navigation Hook
 * Custom hook for handling role-based navigation
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getDefaultRedirectForRole, hasAccessToPath, getUnauthorizedRedirect } from '@/libs/rbac';
import type { UserRole } from '@/libs/rbac';

export function useRoleBasedNavigation() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const userRole = session?.user?.role as UserRole | undefined;

  /**
   * Navigate to default page for user's role
   */
  const navigateToRoleHome = useCallback(() => {
    if (userRole) {
      const defaultPath = getDefaultRedirectForRole(userRole);
      router.push(defaultPath);
    } else {
      router.push('/login');
    }
  }, [userRole, router]);

  /**
   * Navigate to a path with role-based access control
   */
  const navigateWithRBAC = useCallback((path: string) => {
    if (!userRole) {
      router.push('/login');
      return;
    }

    if (hasAccessToPath(userRole, path)) {
      router.push(path);
    } else {
      const redirectPath = getUnauthorizedRedirect(userRole, path);
      router.push(redirectPath);
    }
  }, [userRole, router]);

  /**
   * Check if current user can access a path
   */
  const canAccess = useCallback((path: string) => {
    if (!userRole) return false;
    return hasAccessToPath(userRole, path);
  }, [userRole]);

  /**
   * Get appropriate redirect URL for current user
   */
  const getRedirectUrl = useCallback(() => {
    if (!userRole) return '/login';
    return getDefaultRedirectForRole(userRole);
  }, [userRole]);

  return {
    userRole,
    isAdmin: userRole === 'admin',
    isCustomer: userRole === 'customer',
    navigateToRoleHome,
    navigateWithRBAC,
    canAccess,
    getRedirectUrl,
  };
}
