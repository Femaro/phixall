import { NextRequest, NextResponse } from 'next/server';
import { getCheckrReport } from '@/lib/checkr';

/**
 * API route to fetch Checkr report status
 * Used by admin dashboard to display background check results
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const report = await getCheckrReport(reportId);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error('Error fetching Checkr report:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch background check report',
      },
      { status: 500 }
    );
  }
}

