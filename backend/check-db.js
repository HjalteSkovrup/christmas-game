import pool from './src/db/pool.js';

async function checkTables() {
  try {
    console.log('🔍 Checking database for tables...\n');
    
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    
    if (result.rows.length === 0) {
      console.log('❌ NO TABLES FOUND in database!');
      console.log('   Tables should have been created by migrations.');
    } else {
      console.log('✅ Found tables:');
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    // Also check for views
    const viewResult = await pool.query(
      "SELECT viewname FROM pg_views WHERE schemaname = 'public'"
    );
    
    if (viewResult.rows.length > 0) {
      console.log('\n✅ Found views:');
      viewResult.rows.forEach(row => {
        console.log(`   - ${row.viewname}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  }
}

checkTables();
