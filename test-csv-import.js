/**
 * Test CSV Import Functionality
 * Tests the member import and identity creation system
 */

const fs = require('fs');
const path = require('path');

// Generate sample Skool CSV data
function generateSampleCSV(numMembers = 100) {
  const headers = 'Email,Full Name,Joined Date,Member ID,Status,Location';
  const rows = [];

  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Emma', 'Chris', 'Lisa', 'David', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'example.org'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];

  for (let i = 1; i <= numMembers; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`;
    const fullName = `${firstName} ${lastName}`;
    const joinedDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const memberId = `skool_${i}_${Date.now()}`;
    const status = 'Active';

    rows.push(`${email},"${fullName}",${joinedDate},${memberId},${status},${location}`);
  }

  return headers + '\n' + rows.join('\n');
}

// Test CSV parsing locally
async function testCSVParsing() {
  console.log('🧪 Testing CSV Parsing...\n');

  const csvContent = generateSampleCSV(10);
  console.log('Sample CSV (first 5 rows):');
  console.log(csvContent.split('\n').slice(0, 6).join('\n'));
  console.log('...\n');

  // Parse CSV
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

  console.log('Parsed headers:', headers);
  console.log('Total rows:', lines.length - 1);

  // Parse first member
  const firstRow = lines[1].split(',');
  console.log('\nFirst member parsed:');
  console.log('- Email:', firstRow[0]);
  console.log('- Name:', firstRow[1].replace(/"/g, ''));
  console.log('- Joined:', firstRow[2]);
  console.log('- ID:', firstRow[3]);
}

// Test CSV import API
async function testCSVImport() {
  console.log('\n📤 Testing CSV Import API...\n');

  const csvContent = generateSampleCSV(100);
  const blob = new Blob([csvContent], { type: 'text/csv' });

  const formData = new FormData();
  formData.append('file', blob, 'skool_members.csv');

  try {
    const response = await fetch('http://localhost:3000/api/import/csv', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Import failed:', response.status, error);
      return;
    }

    const result = await response.json();
    console.log('✅ Import successful!');
    console.log('Results:', result);

    if (result.results) {
      console.log(`\n📊 Import Statistics:`);
      console.log(`- Imported: ${result.results.imported}`);
      console.log(`- Skipped: ${result.results.skipped}`);
      console.log(`- Errors: ${result.results.errors?.length || 0}`);

      if (result.results.errors?.length > 0) {
        console.log('\n⚠️ Errors:');
        result.results.errors.slice(0, 5).forEach(err => {
          console.log(`  - ${err.email}: ${err.error}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Test identity resolution
async function testIdentityResolution() {
  console.log('\n🔍 Testing Identity Resolution...\n');

  // Test with duplicate emails
  const csvWithDuplicates = `Email,Full Name,Joined Date
john.doe@example.com,"John Doe",2024-01-01
jane.smith@example.com,"Jane Smith",2024-01-02
john.doe@example.com,"John D.",2024-01-03
mike.wilson@example.com,"Mike Wilson",2024-01-04`;

  console.log('CSV with duplicate email (john.doe@example.com):');
  console.log(csvWithDuplicates);

  const blob = new Blob([csvWithDuplicates], { type: 'text/csv' });
  const formData = new FormData();
  formData.append('file', blob, 'test_duplicates.csv');

  try {
    const response = await fetch('http://localhost:3000/api/import/csv', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('\nResult:', result);
    console.log('Expected: 3 imported, 1 skipped (duplicate)');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Save sample CSV file
function saveSampleCSV() {
  const csvContent = generateSampleCSV(100);
  const filename = 'sample_skool_members.csv';

  fs.writeFileSync(filename, csvContent);
  console.log(`\n💾 Sample CSV saved as: ${filename}`);
  console.log('You can upload this file to test the import UI\n');
}

// Main test runner
async function runTests() {
  console.log('='.repeat(60));
  console.log('🚀 ALLUMI CSV IMPORT TEST SUITE');
  console.log('='.repeat(60));

  // Test 1: CSV Parsing
  await testCSVParsing();

  // Test 2: Save sample CSV
  saveSampleCSV();

  // Test 3: API Import (only if server is running)
  const isServerRunning = await checkServerStatus();
  if (isServerRunning) {
    await testCSVImport();
    await testIdentityResolution();
  } else {
    console.log('\n⚠️ Server not running. Start the dev server to test API endpoints.');
    console.log('Run: npm run dev');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests complete!');
  console.log('='.repeat(60));
}

// Check if dev server is running
async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    return response.ok || response.status === 404; // 404 means server is up but route doesn't exist
  } catch {
    return false;
  }
}

// Run tests
runTests().catch(console.error);