/**
 * Checkr API Integration for Background Checks
 * Documentation: https://docs.checkr.com/
 * 
 * This integration is used for US artisan background checks during onboarding.
 */

import { Buffer } from 'buffer';

const CHECKR_API_BASE = 'https://api.checkr.com/v1';

export interface CheckrCandidate {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  dob?: string; // YYYY-MM-DD
  ssn?: string; // Last 4 digits only for security
  zipcode?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  copy_requested?: boolean;
  custom_id?: string;
}

export interface CheckrReport {
  id: string;
  object: string;
  uri: string;
  status: 'pending' | 'clear' | 'consider' | 'suspended' | 'canceled';
  created_at: string;
  completed_at?: string;
  package: string;
  candidate_id: string;
  ssn_trace_id?: string;
  sex_offender_search_id?: string;
  national_criminal_search_id?: string;
  county_criminal_search_ids?: string[];
  motor_vehicle_report_id?: string;
  [key: string]: any;
}

export interface CheckrInvitation {
  id: string;
  object: string;
  uri: string;
  status: 'pending' | 'completed' | 'expired' | 'declined';
  created_at: string;
  expires_at?: string;
  candidate_id: string;
  package: string;
  report_id?: string;
}

/**
 * Get Checkr API credentials from environment
 */
function getCheckrCredentials() {
  const apiKey = process.env.CHECKR_SECRET_API_KEY;
  if (!apiKey) {
    throw new Error('CHECKR_SECRET_API_KEY not configured');
  }
  return apiKey;
}

/**
 * Make authenticated request to Checkr API
 */
async function checkrRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiKey = getCheckrCredentials();
  const url = `${CHECKR_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Checkr API error: ${error.message || response.statusText}`);
  }

  return response;
}

/**
 * Create a candidate in Checkr
 * https://docs.checkr.com/reference/create-a-new-candidate
 */
export async function createCheckrCandidate(candidate: CheckrCandidate): Promise<any> {
  const response = await checkrRequest('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidate),
  });
  return response.json();
}

/**
 * Create a background check report
 * https://docs.checkr.com/reference/create-a-new-report
 */
export async function createCheckrReport(
  candidateId: string,
  packageType: string = 'tasker_standard'
): Promise<CheckrReport> {
  const response = await checkrRequest('/reports', {
    method: 'POST',
    body: JSON.stringify({
      candidate_id: candidateId,
      package: packageType,
    }),
  });
  return response.json();
}

/**
 * Retrieve a background check report
 * https://docs.checkr.com/reference/retrieve-an-existing-report
 */
export async function getCheckrReport(reportId: string): Promise<CheckrReport> {
  const response = await checkrRequest(`/reports/${reportId}`);
  return response.json();
}

/**
 * Create an invitation for candidate to complete their information
 * https://docs.checkr.com/reference/create-an-invitation
 */
export async function createCheckrInvitation(
  candidateId: string,
  packageType: string = 'tasker_standard'
): Promise<CheckrInvitation> {
  const response = await checkrRequest('/invitations', {
    method: 'POST',
    body: JSON.stringify({
      candidate_id: candidateId,
      package: packageType,
    }),
  });
  return response.json();
}

/**
 * Get report status and results
 */
export async function getCheckrReportStatus(reportId: string): Promise<{
  status: string;
  completed: boolean;
  report?: CheckrReport;
}> {
  try {
    const report = await getCheckrReport(reportId);
    return {
      status: report.status,
      completed: report.status !== 'pending',
      report,
    };
  } catch (error) {
    console.error('Error fetching Checkr report:', error);
    return {
      status: 'error',
      completed: false,
    };
  }
}

/**
 * Initialize background check for US artisan
 * This should be called when US artisan completes onboarding
 */
export async function initiateBackgroundCheck(
  artisanData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dob?: string;
    ssnLast4?: string;
    zipcode?: string;
    driverLicenseNumber?: string;
    driverLicenseState?: string;
    userId: string;
  }
): Promise<{
  candidateId: string;
  reportId: string;
  invitationId?: string;
}> {
  // Create candidate
  const candidate = await createCheckrCandidate({
    first_name: artisanData.firstName,
    last_name: artisanData.lastName,
    email: artisanData.email,
    phone: artisanData.phone,
    dob: artisanData.dob,
    ssn: artisanData.ssnLast4, // Only last 4 digits
    zipcode: artisanData.zipcode,
    driver_license_number: artisanData.driverLicenseNumber,
    driver_license_state: artisanData.driverLicenseState,
    custom_id: artisanData.userId, // Link to Phixall user ID
  });

  // Create report (standard package for taskers/gig workers)
  const report = await createCheckrReport(candidate.id, 'tasker_standard');

  // Optionally create invitation for candidate to complete additional info
  let invitationId: string | undefined;
  try {
    const invitation = await createCheckrInvitation(candidate.id, 'tasker_standard');
    invitationId = invitation.id;
  } catch (error) {
    console.warn('Failed to create Checkr invitation:', error);
    // Non-critical, continue without invitation
  }

  return {
    candidateId: candidate.id,
    reportId: report.id,
    invitationId,
  };
}

/**
 * Standard Checkr package for taskers/gig workers
 * Includes: SSN Trace, National Criminal Search, Sex Offender Registry, Global Watchlist
 */
export const CHECKR_PACKAGE_TASKER_STANDARD = 'tasker_standard';

