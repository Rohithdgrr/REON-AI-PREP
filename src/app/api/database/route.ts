/**
 * API Route for Database Operations
 * Handles server-side database operations for Neon PostgreSQL
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabasePool, initializeDatabase } from '@/lib/database';

// Initialize database on first import
let dbInitialized = false;

// Auto-initialize database when API route is first accessed
if (!dbInitialized) {
  initializeDatabase().catch((error) => {
    console.error('Failed to auto-initialize database:', error);
  });
  dbInitialized = true;
}

export async function GET(request: NextRequest) {
  try {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }

    const pool = getDatabasePool();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        const healthCheck = await pool.query('SELECT NOW()');
        return NextResponse.json({ 
          status: 'ok', 
          timestamp: healthCheck.rows[0].now 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Database API error:', error);
    return NextResponse.json(
      { error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }

    const body = await request.json();
    const { action, data } = body;

    const pool = getDatabasePool();

    switch (action) {
      case 'create_user':
        const { firebase_uid, email, full_name, ri_id, date_of_birth, target_exam, profile_photo } = data;
        const result = await pool.query(
          `INSERT INTO users (firebase_uid, email, full_name, ri_id, date_of_birth, target_exam, profile_photo)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (firebase_uid) DO UPDATE SET
           last_login = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [firebase_uid, email, full_name, ri_id, date_of_birth, target_exam, profile_photo]
        );
        return NextResponse.json({ user: result.rows[0] });

      case 'get_user':
        const { uid } = data;
        const userResult = await pool.query(
          'SELECT * FROM users WHERE firebase_uid = $1',
          [uid]
        );
        return NextResponse.json({ user: userResult.rows[0] || null });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Database API error:', error);
    return NextResponse.json(
      { error: error.message || 'Database operation failed' },
      { status: 500 }
    );
  }
}

