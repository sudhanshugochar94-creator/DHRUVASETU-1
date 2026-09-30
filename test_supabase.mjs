import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read .env file directly
const envContent = fs.readFileSync('.env', 'utf-8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

console.log('====================================================');
console.log('SIH26063: SUPABASE INTEGRATION VERIFICATION TEST');
console.log('====================================================');
console.log(`Supabase URL: ${url}`);
console.log(`Supabase Key: ${key.slice(0, 15)}...${key.slice(-6)}`);

if (!url || !key) {
  console.error('FAIL: Missing credentials in .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

let results = {
  connection: false,
  database: false,
  rls: false,
  storage: false,
  auth: false,
  frontendIntegration: false
};

async function runVerification() {
  // 1. Connection & Auth Verification
  console.log('\n--- 1. Supabase Auth Verification ---');
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log(`Auth getSession error: ${authError.message}`);
    } else {
      console.log('Auth getSession: OK (Public client connected, session is null or valid)');
      results.auth = true;
      results.connection = true;
    }
  } catch (e) {
    console.error('Auth check threw error:', e.message);
  }

  // 2. Database Tables & Seed Verification
  console.log('\n--- 2. Database Tables & Data Verification ---');
  const tables = [
    { name: 'expeditions', expectedMin: 1 },
    { name: 'resources', expectedMin: 1 },
    { name: 'datasets', expectedMin: 1 },
    { name: 'publications', expectedMin: 1 },
    { name: 'media_assets', expectedMin: 1 },
    { name: 'institutional_activities', expectedMin: 1 },
    { name: 'science_stories', expectedMin: 1 },
    { name: 'content_drafts', expectedMin: 0 },
    { name: 'content_reviews', expectedMin: 0 },
    { name: 'content_sources', expectedMin: 0 },
    { name: 'learning_modules', expectedMin: 1 },
    { name: 'profiles', expectedMin: 0 }
  ];

  let accessibleTables = 0;
  for (const t of tables) {
    try {
      const { data, error, count } = await supabase
        .from(t.name)
        .select('*', { count: 'exact' })
        .limit(5);

      if (error) {
        console.log(`  [${t.name}]: FAIL - ${error.message} (code: ${error.code})`);
      } else {
        accessibleTables++;
        console.log(`  [${t.name}]: PASS - ${data?.length} records returned (total: ${count})`);
      }
    } catch (e) {
      console.log(`  [${t.name}]: EXCEPTION - ${e.message}`);
    }
  }

  if (accessibleTables >= 8) {
    results.database = true;
  }

  // 3. Relationships / Foreign Keys Verification
  console.log('\n--- 3. Relationships & Foreign Key Join Verification ---');
  try {
    const { data: joinedData, error: joinError } = await supabase
      .from('resources')
      .select('id, title, region, expeditions(name, slug)')
      .limit(3);

    if (joinError) {
      console.log(`  Resource -> Expedition Join: FAIL (${joinError.message})`);
    } else {
      console.log(`  Resource -> Expedition Join: PASS (${joinedData.length} records with expedition relations)`);
      if (joinedData[0]?.expeditions) {
        console.log(`    Sample related expedition: "${joinedData[0].expeditions.name}"`);
      }
    }

    const { data: datasetJoined, error: dsJoinError } = await supabase
      .from('datasets')
      .select('id, name, resources(title, format:file_type)')
      .limit(3);

    if (dsJoinError) {
      console.log(`  Dataset -> Resource Join: FAIL (${dsJoinError.message})`);
    } else {
      console.log(`  Dataset -> Resource Join: PASS (${datasetJoined.length} records with resource relations)`);
    }
  } catch (e) {
    console.log(`  Join check exception: ${e.message}`);
  }

  // 4. RLS Verification
  console.log('\n--- 4. RLS Security Verification ---');
  try {
    // Attempting unauthenticated insertion into a protected table (e.g. resources or profiles)
    const { data: insertData, error: insertError } = await supabase
      .from('resources')
      .insert([{
        title: 'Unauthorized Intrusion Test',
        resource_type: 'publication',
        region: 'Antarctica',
        research_theme: 'Security',
        year: 2026,
        author: 'Unknown Attacker'
      }]);

    if (insertError) {
      console.log(`  RLS Write Protection: PASS - Unauthorized write blocked with error: "${insertError.message}"`);
      results.rls = true;
    } else {
      console.log('  RLS Write Protection: FAIL - Unauthorized write was permitted!');
    }
  } catch (e) {
    console.log(`  RLS check exception: ${e.message}`);
  }

  // 5. Storage Buckets Verification
  console.log('\n--- 5. Storage Buckets Verification ---');
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.log(`  Storage buckets list: FAIL (${bucketError.message})`);
    } else {
      console.log(`  Storage buckets list: PASS (${buckets.length} buckets found)`);
      const bucketNames = buckets.map(b => b.name);
      console.log(`  Buckets: ${bucketNames.join(', ')}`);
      const requiredBuckets = ['polar-reports', 'polar-datasets', 'polar-publications', 'polar-photos', 'polar-videos', 'polar-thumbnails'];
      const missingBuckets = requiredBuckets.filter(b => !bucketNames.includes(b));
      if (missingBuckets.length === 0) {
        console.log('  All 6 required polar storage buckets exist and are active.');
        results.storage = true;
      } else {
        console.log(`  Missing buckets: ${missingBuckets.join(', ')}`);
      }
    }
  } catch (e) {
    console.log(`  Storage check exception: ${e.message}`);
  }

  // 6. Frontend Services Data Flow Test
  console.log('\n--- 6. Frontend Service Query Validation ---');
  try {
    // Test queries that repositoryService, expeditionService, datasetService execute
    const [expRes, resRes, dsRes, pubRes, mediaRes, storyRes, actRes, modRes] = await Promise.all([
      supabase.from('expeditions').select('*').order('year', { ascending: false }),
      supabase.from('resources').select('*, expeditions(name)').order('created_at', { ascending: false }),
      supabase.from('datasets').select('*').order('created_at', { ascending: false }),
      supabase.from('publications').select('*').order('year', { ascending: false }),
      supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
      supabase.from('science_stories').select('*').order('created_at', { ascending: false }),
      supabase.from('institutional_activities').select('*').order('date', { ascending: false }),
      supabase.from('learning_modules').select('*').order('created_at', { ascending: false })
    ]);

    const allQueriesSuccessful = !expRes.error && !resRes.error && !dsRes.error && !pubRes.error && !mediaRes.error && !storyRes.error && !actRes.error && !modRes.error;

    if (allQueriesSuccessful) {
      console.log('  All 8 frontend service core queries returned clean data without errors:');
      console.log(`    - Expeditions: ${expRes.data.length} records`);
      console.log(`    - Resources: ${resRes.data.length} records`);
      console.log(`    - Datasets: ${dsRes.data.length} records`);
      console.log(`    - Publications: ${pubRes.data.length} records`);
      console.log(`    - Media Assets: ${mediaRes.data.length} records`);
      console.log(`    - Science Stories: ${storyRes.data.length} records`);
      console.log(`    - Activities: ${actRes.data.length} records`);
      console.log(`    - Learning Modules: ${modRes.data.length} records`);
      results.frontendIntegration = true;
    } else {
      console.log('  Some service queries failed:');
      if (expRes.error) console.log('    Expeditions error:', expRes.error.message);
      if (resRes.error) console.log('    Resources error:', resRes.error.message);
      if (dsRes.error) console.log('    Datasets error:', dsRes.error.message);
    }
  } catch (e) {
    console.log(`  Frontend service validation exception: ${e.message}`);
  }

  // Summary
  console.log('\n====================================================');
  console.log('VERIFICATION SUMMARY');
  console.log('====================================================');
  console.log(`SUPABASE CONNECTION: ${results.connection ? 'PASS' : 'FAIL'}`);
  console.log(`DATABASE: ${results.database ? 'PASS' : 'FAIL'}`);
  console.log(`RLS: ${results.rls ? 'PASS' : 'FAIL'}`);
  console.log(`STORAGE: ${results.storage ? 'PASS' : 'FAIL'}`);
  console.log(`AUTH: ${results.auth ? 'PASS' : 'FAIL'}`);
  console.log(`FRONTEND INTEGRATION: ${results.frontendIntegration ? 'PASS' : 'FAIL'}`);
  console.log('====================================================');
}

runVerification();
