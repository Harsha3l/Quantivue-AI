import { Pool } from 'pg';

/**
 * Fix PostgreSQL permissions for n8n_user
 * Run this with a superuser (postgres) to grant permissions
 */
async function fixDatabasePermissions() {
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'n8n_db', // Connect to your app DB to grant schema perms there
    user: 'postgres',      // Use postgres superuser
    password: process.env.POSTGRES_PASSWORD || 'postgres', // Default postgres password
  });

  try {
    console.log('🔐 Connecting as postgres superuser...');
    const client = await adminPool.connect();

    console.log('📋 Granting permissions to n8n_user...');
    
    // Grant schema permissions
    await client.query('GRANT ALL PRIVILEGES ON SCHEMA public TO n8n_user');
    console.log('✅ Schema permissions granted');

    // Grant table permissions
    await client.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO n8n_user');
    console.log('✅ Table permissions granted');

    // Grant sequence permissions
    await client.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO n8n_user');
    console.log('✅ Sequence permissions granted');

    // Set default privileges for future tables
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO n8n_user');
    console.log('✅ Default table permissions set');

    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO n8n_user');
    console.log('✅ Default sequence permissions set');

    client.release();
    console.log('\n✅ All permissions fixed successfully!');
  } catch (error) {
    console.error('❌ Permission fix failed:', error.message);
    console.log('\n💡 If this fails, try manually with psql:');
    console.log('   psql -U postgres -d n8n_db');
    console.log('   GRANT ALL PRIVILEGES ON SCHEMA public TO n8n_user;');
    console.log('   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO n8n_user;');
    console.log('   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO n8n_user;');
    process.exit(1);
  } finally {
    await adminPool.end();
  }
}

fixDatabasePermissions();
