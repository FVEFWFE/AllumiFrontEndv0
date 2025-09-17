"use client"

import { useEffect } from "react"

export function FeaturebaseManual() {
  useEffect(() => {
    // Create a simple feedback form that opens in a new window
    const setupFeaturebase = () => {
      // Add click listeners to all featurebase buttons
      const feedbackButtons = document.querySelectorAll('[data-featurebase-feedback]');
      
      feedbackButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          // Try different Featurebase URL formats
          // Format 1: organization.featurebase.app
          // Format 2: featurebase.app/b/organization
          // Format 3: feedback.featurebase.app/organization
          window.open('https://feedback.featurebase.app/allumi', 'featurebase-feedback', 'width=600,height=700');
        });
      });

      // Setup for changelog button
      const changelogButtons = document.querySelectorAll('[data-featurebase-changelog]');
      changelogButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          window.open('https://feedback.featurebase.app/allumi/changelog', 'featurebase-changelog', 'width=600,height=700');
        });
      });

      // Setup for roadmap button  
      const roadmapButtons = document.querySelectorAll('[data-featurebase-roadmap]');
      roadmapButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          window.open('https://feedback.featurebase.app/allumi/roadmap', 'featurebase-roadmap', 'width=600,height=700');
        });
      });
    };

    // Setup on mount
    setupFeaturebase();

    // Re-setup when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      setupFeaturebase();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

// Helper function to open Featurebase programmatically
export function openFeaturebase(type: 'feedback' | 'changelog' | 'roadmap' = 'feedback') {
  const urls = {
    feedback: 'https://feedback.featurebase.app/allumi',
    changelog: 'https://feedback.featurebase.app/allumi/changelog',
    roadmap: 'https://feedback.featurebase.app/allumi/roadmap'
  };
  
  window.open(urls[type], `featurebase-${type}`, 'width=600,height=700');
}