/**
 * Admin role types for Phixall platform
 */
export type AdminRole = 'full_admin' | 'manager' | 'billing_finance';

/**
 * Permission flags for admin roles
 */
export interface AdminPermissions {
  // User Management
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canCreateAdminUsers: boolean;
  canManageRoles: boolean;
  
  // Job Management
  canViewJobs: boolean;
  canAssignJobs: boolean;
  canApproveJobs: boolean;
  canCancelJobs: boolean;
  
  // Billing & Finance
  canViewBilling: boolean;
  canApproveBills: boolean;
  canViewTransactions: boolean;
  canManageWallets: boolean;
  
  // Resources & Materials
  canViewResources: boolean;
  canManageResources: boolean;
  canApproveMaterials: boolean;
  
  // Analytics & Reports
  canViewAnalytics: boolean;
  canViewReports: boolean;
  
  // Settings & Configuration
  canManageSettings: boolean;
  canManageKnowledgeBase: boolean;
  canManageSupport: boolean;
  
  // Career & Registration
  canViewApplications: boolean;
  canManageApplications: boolean;
  
  // Email Management
  canManageEmails: boolean;
}

/**
 * Role permissions configuration
 */
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  full_admin: {
    // Full access to everything
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canCreateAdminUsers: true,
    canManageRoles: true,
    canViewJobs: true,
    canAssignJobs: true,
    canApproveJobs: true,
    canCancelJobs: true,
    canViewBilling: true,
    canApproveBills: true,
    canViewTransactions: true,
    canManageWallets: true,
    canViewResources: true,
    canManageResources: true,
    canApproveMaterials: true,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: true,
    canManageKnowledgeBase: true,
    canManageSupport: true,
    canViewApplications: true,
    canManageApplications: true,
    canManageEmails: true,
  },
  manager: {
    // Manager access - can manage users, jobs, resources, but not billing/finance
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: false, // Cannot delete users
    canCreateAdminUsers: false,
    canManageRoles: false,
    canViewJobs: true,
    canAssignJobs: true,
    canApproveJobs: true,
    canCancelJobs: true,
    canViewBilling: false, // Limited billing access
    canApproveBills: false,
    canViewTransactions: false,
    canManageWallets: false,
    canViewResources: true,
    canManageResources: true,
    canApproveMaterials: true,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: false, // Cannot change system settings
    canManageKnowledgeBase: true,
    canManageSupport: true,
    canViewApplications: true,
    canManageApplications: true,
    canManageEmails: true,
  },
  billing_finance: {
    // Billing & Finance access - focused on financial operations
    canViewUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateAdminUsers: false,
    canManageRoles: false,
    canViewJobs: true, // Can view but not assign
    canAssignJobs: false,
    canApproveJobs: false,
    canCancelJobs: false,
    canViewBilling: true,
    canApproveBills: true,
    canViewTransactions: true,
    canManageWallets: true,
    canViewResources: false,
    canManageResources: false,
    canApproveMaterials: false,
    canViewAnalytics: true, // Financial analytics only
    canViewReports: true,
    canManageSettings: false,
    canManageKnowledgeBase: false,
    canManageSupport: false,
    canViewApplications: false,
    canManageApplications: false,
    canManageEmails: false,
  },
};

/**
 * Get permissions for a given admin role
 */
export function getAdminPermissions(role: AdminRole | string): AdminPermissions {
  if (role === 'admin') {
    // Legacy 'admin' role maps to 'full_admin'
    return ROLE_PERMISSIONS.full_admin;
  }
  
  if (role in ROLE_PERMISSIONS) {
    return ROLE_PERMISSIONS[role as AdminRole];
  }
  
  // Default: no permissions
  return {
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateAdminUsers: false,
    canManageRoles: false,
    canViewJobs: false,
    canAssignJobs: false,
    canApproveJobs: false,
    canCancelJobs: false,
    canViewBilling: false,
    canApproveBills: false,
    canViewTransactions: false,
    canManageWallets: false,
    canViewResources: false,
    canManageResources: false,
    canApproveMaterials: false,
    canViewAnalytics: false,
    canViewReports: false,
    canManageSettings: false,
    canManageKnowledgeBase: false,
    canManageSupport: false,
    canViewApplications: false,
    canManageApplications: false,
    canManageEmails: false,
  };
}

/**
 * Check if a role is an admin role
 */
export function isAdminRole(role: string | undefined): role is AdminRole {
  return role === 'admin' || role === 'full_admin' || role === 'manager' || role === 'billing_finance';
}

/**
 * Get display name for admin role
 */
export function getAdminRoleDisplayName(role: AdminRole | string): string {
  const roleMap: Record<string, string> = {
    admin: 'Full Admin',
    full_admin: 'Full Admin',
    manager: 'Manager',
    billing_finance: 'Billing & Finance',
  };
  
  return roleMap[role] || role;
}

