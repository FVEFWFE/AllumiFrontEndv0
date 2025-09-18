// Content script for Skool member pages
console.log('Allumi Extension: Active on Skool members page');

// Function to extract member data from the page
function extractMembers() {
  const members = [];
  
  // Find all member elements (adjust selector based on actual Skool HTML)
  const memberElements = document.querySelectorAll('[data-testid="member-item"], .member-card, [class*="member"]');
  
  memberElements.forEach(element => {
    try {
      // Extract member info (these selectors need to be updated based on actual Skool HTML)
      const nameElement = element.querySelector('[class*="name"], h3, h4');
      const emailElement = element.querySelector('[class*="email"]');
      const joinedElement = element.querySelector('[class*="joined"], [class*="date"]');
      const roleElement = element.querySelector('[class*="role"], [class*="badge"]');
      
      const member = {
        name: nameElement?.textContent?.trim() || '',
        email: emailElement?.textContent?.trim() || '',
        joined: joinedElement?.textContent?.trim() || '',
        role: roleElement?.textContent?.trim() || 'member',
        extractedAt: new Date().toISOString()
      };
      
      // Only add if we have at least a name
      if (member.name) {
        members.push(member);
      }
    } catch (err) {
      console.error('Error extracting member:', err);
    }
  });
  
  return members;
}

// Function to scroll and load all members
async function loadAllMembers() {
  let previousHeight = 0;
  let currentHeight = document.body.scrollHeight;
  let attempts = 0;
  const maxAttempts = 50;
  
  while (previousHeight !== currentHeight && attempts < maxAttempts) {
    previousHeight = currentHeight;
    window.scrollTo(0, document.body.scrollHeight);
    
    // Wait for new content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    currentHeight = document.body.scrollHeight;
    attempts++;
    
    // Update status
    updateStatus(`Loading members... (${attempts}/${maxAttempts} scrolls)`);
  }
  
  return true;
}

// Function to update status in the UI
function updateStatus(message) {
  const statusElement = document.getElementById('allumi-status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

// Create floating action button
function createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'allumi-fab';
  button.innerHTML = `
    <button id="allumi-import-btn" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      cursor: pointer;
      z-index: 10000;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    ">
      📊
    </button>
    <div id="allumi-status" style="
      position: fixed;
      bottom: 90px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      display: none;
    "></div>
  `;
  
  document.body.appendChild(button);
  
  // Add hover effect
  const btn = document.getElementById('allumi-import-btn');
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
  });
  
  // Add click handler
  btn.addEventListener('click', handleImport);
}

// Handle import button click
async function handleImport() {
  const statusElement = document.getElementById('allumi-status');
  statusElement.style.display = 'block';
  
  try {
    // Check if user is authenticated
    const apiKey = await getStoredApiKey();
    if (!apiKey) {
      updateStatus('Please configure your Allumi API key in the extension popup');
      return;
    }
    
    updateStatus('Starting member import...');
    
    // Load all members by scrolling
    await loadAllMembers();
    
    // Extract member data
    updateStatus('Extracting member data...');
    const members = extractMembers();
    
    if (members.length === 0) {
      updateStatus('No members found. Try refreshing the page.');
      return;
    }
    
    updateStatus(`Found ${members.length} members. Sending to Allumi...`);
    
    // Get current Skool group URL
    const groupUrl = window.location.href.split('/members')[0];
    
    // Send to Allumi API
    const response = await fetch('https://allumi.to/api/import/skool-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        members,
        groupUrl,
        importedAt: new Date().toISOString(),
        source: 'chrome_extension'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      updateStatus(`✅ Successfully imported ${result.imported} members!`);
      
      // Hide status after 5 seconds
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 5000);
    } else {
      updateStatus('❌ Import failed. Check your API key.');
    }
    
  } catch (error) {
    console.error('Import error:', error);
    updateStatus('❌ Error during import. See console for details.');
  }
}

// Get stored API key
async function getStoredApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['allumiApiKey'], (result) => {
      resolve(result.allumiApiKey);
    });
  });
}

// Initialize when page loads
if (window.location.href.includes('/members')) {
  // Wait for page to load
  setTimeout(() => {
    createFloatingButton();
    console.log('Allumi Extension: Import button added');
  }, 2000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractMembers') {
    handleImport();
    sendResponse({ status: 'Import started' });
  }
});