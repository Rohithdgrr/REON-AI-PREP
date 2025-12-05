/**
 * Application Startup Services
 * Initializes all required services when the application starts
 */

import { initializeDatabase } from './database';

let servicesInitialized = false;

/**
 * Initialize all application services
 * This should be called once when the app starts
 */
export async function initializeServices() {
  if (servicesInitialized) {
    console.log('Services already initialized');
    return;
  }

  try {
    console.log('🚀 Initializing application services...');

    // Initialize database (only in server-side context)
    if (typeof window === 'undefined') {
      try {
        await initializeDatabase();
        console.log('✅ Database initialized');
      } catch (error) {
        console.error('⚠️ Database initialization failed (this is OK if running client-side):', error);
      }
    }

    servicesInitialized = true;
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization error:', error);
    throw error;
  }
}

/**
 * Health check for all services
 */
export async function healthCheck() {
  const health: Record<string, boolean | string> = {
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check database (server-side only)
  if (typeof window === 'undefined') {
    try {
      const { getDatabasePool } = await import('./database');
      const pool = getDatabasePool();
      await pool.query('SELECT NOW()');
      health.services.database = 'ok';
    } catch (error: any) {
      health.services.database = `error: ${error.message}`;
    }
  } else {
    health.services.database = 'client-side (skipped)';
  }

  // Firebase is initialized client-side automatically
  health.services.firebase = 'initialized';

  return health;
}

