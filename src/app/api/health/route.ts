/**
 * Health Check API Route
 * Checks the status of all application services
 */

import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/startup';

export async function GET() {
  try {
    const health = await healthCheck();
    return NextResponse.json(health, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

