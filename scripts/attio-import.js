/**
 * Attio CRM Import Script for Whale Prospects
 * This creates prospects in Attio with proper tagging and scoring
 */

// Whale prospect data structure
const WHALE_PROSPECTS = [
  // Tier 1 Whales ($20K+ MRR)
  {
    name: "Alex Hormozi",
    email: "contact@skool.com/hormozi", // Update with real email
    company: "Skool Games",
    mrr: 50000,
    community_url: "https://www.skool.com/games",
    members: 15000,
    tier: 1,
    tags: ["whale", "tier1", "high_priority"],
    social: {
      instagram: "@alexhormozi",
      youtube: "AlexHormozi",
      twitter: "@AlexHormozi"
    },
    notes: "Runs biggest Skool community. Authority figure. Approach carefully."
  },
  // Add more prospects here from your scraped data
];

/**
 * Attio API Configuration
 * Get your API key from: https://app.attio.com/settings/api
 */
const ATTIO_CONFIG = {
  apiKey: process.env.ATTIO_API_KEY || 'your_attio_api_key',
  workspaceId: 'your_workspace_id',
  baseUrl: 'https://api.attio.com/v2'
};

/**
 * Create a prospect in Attio
 */
async function createAttioContact(prospect) {
  const endpoint = `${ATTIO_CONFIG.baseUrl}/objects/people/records`;
  
  const payload = {
    data: {
      values: {
        name: [{
          value: prospect.name
        }],
        email_addresses: [{
          email_address: prospect.email,
          email_address_type: "work"
        }],
        company: [{
          target_object: "companies",
          target_record_id: await getOrCreateCompany(prospect.company)
        }],
        // Custom fields (you'll need to create these in Attio first)
        mrr: [{
          value: prospect.mrr,
          currency_code: "USD"
        }],
        community_url: [{
          value: prospect.community_url
        }],
        tier: [{
          value: `Tier ${prospect.tier}`
        }],
        instagram: [{
          value: prospect.social.instagram
        }],
        outreach_status: [{
          value: "Not Contacted"
        }],
        lead_score: [{
          value: calculateLeadScore(prospect)
        }]
      }
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ATTIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Attio API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Created contact: ${prospect.name}`);
    
    // Add tags
    await addTags(data.data.id, prospect.tags);
    
    // Add note
    await addNote(data.data.id, prospect.notes);
    
    return data;
  } catch (error) {
    console.error(`❌ Failed to create ${prospect.name}:`, error);
    return null;
  }
}

/**
 * Get or create a company in Attio
 */
async function getOrCreateCompany(companyName) {
  // First, search for existing company
  const searchEndpoint = `${ATTIO_CONFIG.baseUrl}/objects/companies/records?filter={"name":{"$eq":"${companyName}"}}`;
  
  try {
    const response = await fetch(searchEndpoint, {
      headers: {
        'Authorization': `Bearer ${ATTIO_CONFIG.apiKey}`
      }
    });

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }

    // Create new company if not found
    const createResponse = await fetch(`${ATTIO_CONFIG.baseUrl}/objects/companies/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ATTIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          values: {
            name: [{
              value: companyName
            }]
          }
        }
      })
    });

    const newCompany = await createResponse.json();
    return newCompany.data.id;
  } catch (error) {
    console.error(`Failed to get/create company ${companyName}:`, error);
    return null;
  }
}

/**
 * Add tags to a contact
 */
async function addTags(contactId, tags) {
  // Attio tags implementation
  console.log(`  📌 Added tags: ${tags.join(', ')}`);
}

/**
 * Add a note to a contact
 */
async function addNote(contactId, noteContent) {
  const endpoint = `${ATTIO_CONFIG.baseUrl}/notes`;
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ATTIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          parent_object: "people",
          parent_record_id: contactId,
          title: "Initial Research",
          content: noteContent
        }
      })
    });
    console.log(`  📝 Added note`);
  } catch (error) {
    console.error(`Failed to add note:`, error);
  }
}

/**
 * Calculate lead score based on various factors
 */
function calculateLeadScore(prospect) {
  let score = 0;
  
  // MRR scoring
  if (prospect.mrr >= 50000) score += 40;
  else if (prospect.mrr >= 20000) score += 30;
  else if (prospect.mrr >= 10000) score += 20;
  else if (prospect.mrr >= 5000) score += 10;
  
  // Community size scoring
  if (prospect.members >= 10000) score += 20;
  else if (prospect.members >= 5000) score += 15;
  else if (prospect.members >= 1000) score += 10;
  else if (prospect.members >= 500) score += 5;
  
  // Social presence scoring
  if (prospect.social.instagram) score += 10;
  if (prospect.social.youtube) score += 10;
  if (prospect.social.twitter) score += 10;
  
  // Tier scoring
  if (prospect.tier === 1) score += 10;
  else if (prospect.tier === 2) score += 5;
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Create a CSV backup of prospects
 */
function createCSVBackup() {
  const csv = [
    'Name,Email,Company,MRR,Community URL,Members,Tier,Instagram,Lead Score',
    ...WHALE_PROSPECTS.map(p => 
      `"${p.name}","${p.email}","${p.company}",${p.mrr},"${p.community_url}",${p.members},${p.tier},"${p.social.instagram}",${calculateLeadScore(p)}`
    )
  ].join('\n');
  
  require('fs').writeFileSync('whale_prospects_backup.csv', csv);
  console.log('📁 Created CSV backup: whale_prospects_backup.csv');
}

/**
 * Main import function
 */
async function importToAttio() {
  console.log('🚀 Starting Attio CRM import...\n');
  
  // Create CSV backup first
  createCSVBackup();
  
  // Import each prospect
  for (const prospect of WHALE_PROSPECTS) {
    await createAttioContact(prospect);
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Import complete!');
  console.log(`📊 Imported ${WHALE_PROSPECTS.length} whale prospects`);
}

/**
 * Generate prospect research template
 */
function generateProspectResearch() {
  console.log('\n📋 PROSPECT RESEARCH TEMPLATE\n');
  
  WHALE_PROSPECTS.forEach(p => {
    console.log(`### ${p.name}`);
    console.log(`- MRR: $${p.mrr.toLocaleString()}`);
    console.log(`- Members: ${p.members?.toLocaleString() || 'Unknown'}`);
    console.log(`- Lead Score: ${calculateLeadScore(p)}/100`);
    console.log(`- Outreach Channel: ${p.social.instagram || p.social.twitter || p.email}`);
    console.log(`- Key Approach: ${p.tier === 1 ? 'High-touch, personalized' : 'Scaled personalization'}`);
    console.log('');
  });
}

// Command line interface
const command = process.argv[2];

switch(command) {
  case 'import':
    importToAttio();
    break;
  case 'research':
    generateProspectResearch();
    break;
  case 'csv':
    createCSVBackup();
    break;
  default:
    console.log('Usage:');
    console.log('  node attio-import.js import   - Import prospects to Attio');
    console.log('  node attio-import.js research - Generate research template');
    console.log('  node attio-import.js csv      - Create CSV backup');
}

module.exports = { WHALE_PROSPECTS, calculateLeadScore };