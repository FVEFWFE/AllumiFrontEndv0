// Popup script for Allumi Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const importBtn = document.getElementById('importBtn');
  const dashboardBtn = document.getElementById('dashboardBtn');
  const statusDiv = document.getElementById('status');
  const memberCount = document.getElementById('memberCount');
  const importCount = document.getElementById('importCount');
  const matchRate = document.getElementById('matchRate');
  
  // Load saved API key
  chrome.storage.sync.get(['allumiApiKey', 'stats'], function(result) {
    if (result.allumiApiKey) {
      apiKeyInput.value = result.allumiApiKey;
      updateStatus(true);
      checkCurrentTab();
    }
    
    if (result.stats) {
      updateStats(result.stats);
    }
  });
  
  // Save API key
  saveBtn.addEventListener('click', async function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    
    // Validate API key format
    if (!apiKey.startsWith('ak_')) {
      alert('Invalid API key format. API keys should start with "ak_"');
      return;
    }
    
    // Test API key
    saveBtn.disabled = true;
    saveBtn.textContent = 'Validating...';
    
    try {
      const response = await fetch('https://allumi.to/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.ok) {
        // Save the API key
        chrome.storage.sync.set({ allumiApiKey: apiKey }, function() {
          updateStatus(true);
          saveBtn.textContent = 'Saved!';
          setTimeout(() => {
            saveBtn.textContent = 'Save API Key';
          }, 2000);
          checkCurrentTab();
        });
      } else {
        alert('Invalid API key. Please check and try again.');
        saveBtn.textContent = 'Save API Key';
      }
    } catch (error) {
      alert('Could not validate API key. Please check your connection.');
      saveBtn.textContent = 'Save API Key';
    } finally {
      saveBtn.disabled = false;
    }
  });
  
  // Import members button
  importBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractMembers' }, function(response) {
        if (response) {
          importBtn.textContent = 'Import Started...';
          importBtn.disabled = true;
          
          // Re-enable after 5 seconds
          setTimeout(() => {
            importBtn.textContent = 'Import Members';
            importBtn.disabled = false;
            loadStats();
          }, 5000);
        }
      });
    });
  });
  
  // Open dashboard
  dashboardBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://allumi.to/dashboard' });
  });
  
  // Update connection status
  function updateStatus(connected) {
    if (connected) {
      statusDiv.className = 'status connected';
      statusDiv.textContent = '✅ Connected to Allumi';
    } else {
      statusDiv.className = 'status disconnected';
      statusDiv.textContent = 'Not connected - Enter your API key';
    }
  }
  
  // Check if current tab is Skool members page
  function checkCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;
      if (currentUrl && currentUrl.includes('skool.com') && currentUrl.includes('/members')) {
        importBtn.disabled = false;
        importBtn.textContent = 'Import Members From This Page';
      } else {
        importBtn.disabled = true;
        importBtn.textContent = 'Go to Skool Members Page';
      }
    });
  }
  
  // Update statistics
  function updateStats(stats) {
    if (stats.members) memberCount.textContent = stats.members;
    if (stats.imported) importCount.textContent = stats.imported;
    if (stats.matchRate) matchRate.textContent = stats.matchRate + '%';
  }
  
  // Load stats from API
  async function loadStats() {
    chrome.storage.sync.get(['allumiApiKey'], async function(result) {
      if (!result.allumiApiKey) return;
      
      try {
        const response = await fetch('https://allumi.to/api/stats/import', {
          headers: {
            'Authorization': `Bearer ${result.allumiApiKey}`
          }
        });
        
        if (response.ok) {
          const stats = await response.json();
          updateStats(stats);
          
          // Save stats to storage
          chrome.storage.sync.set({ stats });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    });
  }
  
  // Load stats on startup
  loadStats();
  
  // Check tab on load
  checkCurrentTab();
});