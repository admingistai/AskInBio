const { Client } = require('pg');

const connectionStrings = [
  {
    name: 'Pooler (Transaction mode)',
    connectionString: 'postgresql://postgres.zakppynbragiympprdqb:O0pl1DJ5QksMoU4i@aws-0-us-east-2.pooler.supabase.com:5432/postgres'
  },
  {
    name: 'Direct connection (port 5432)',
    connectionString: 'postgresql://postgres:O0pl1DJ5QksMoU4i@db.zakppynbragiympprdqb.supabase.co:5432/postgres'
  },
  {
    name: 'Direct connection (port 6543)',
    connectionString: 'postgresql://postgres:O0pl1DJ5QksMoU4i@db.zakppynbragiympprdqb.supabase.co:6543/postgres'
  }
];

async function testConnection(config) {
  console.log(`\n🔍 Testing: ${config.name}`);
  console.log(`   URL: ${config.connectionString.replace(/:[^@]+@/, ':****@')}`);
  
  const client = new Client({
    connectionString: config.connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    console.log(`   ✅ SUCCESS! Connected at: ${result.rows[0].now}`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing all connection options...\n');
  
  let successCount = 0;
  
  for (const config of connectionStrings) {
    if (await testConnection(config)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Results: ${successCount}/${connectionStrings.length} connections succeeded`);
  
  if (successCount > 0) {
    console.log('\n✅ At least one connection worked! Update your .env file with the working connection string.');
  } else {
    console.log('\n❌ All connections failed. Please check:');
    console.log('   1. Your Supabase dashboard for the correct connection string');
    console.log('   2. That your password is correct');
    console.log('   3. Your network/firewall settings');
  }
}

runTests().catch(console.error);