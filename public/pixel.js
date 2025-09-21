/**
 * Allumi Universal Tracking Pixel
 * The "Game Changer" - Captures email early for 70-80% attribution accuracy
 */

(function() {
  'use strict';

  // Configuration
  const PIXEL_VERSION = '1.0.0';
  const API_BASE = 'https://allumi.com/api';
  const FINGERPRINT_URL = 'https://api64.ipify.org?format=json';

  // State management
  const AllumiPixel = {
    userId: null,
    sessionId: null,
    identityId: null,
    fingerprint: null,
    email: null,
    events: [],

    // Initialize pixel
    init: function(config) {
      this.userId = config.userId || this.getCookie('allumi_user_id');
      this.sessionId = this.generateSessionId();
      this.identityId = this.getCookie('allumi_identity') || this.generateIdentityId();

      // Set cookies
      this.setCookie('allumi_identity', this.identityId, 365);
      this.setCookie('allumi_session', this.sessionId, 0.5);

      // Generate fingerprint
      this.generateFingerprint();

      // Track page view
      this.track('page_view', {
        url: window.location.href,
        referrer: document.referrer,
        title: document.title
      });

      // Capture email from forms (THE MAGIC!)
      this.captureEmailFromForms();

      // Listen for custom events
      this.listenForCustomEvents();

      console.log('[Allumi Pixel] Initialized v' + PIXEL_VERSION);
    },

    // Enhanced device fingerprinting
    generateFingerprint: async function() {
      const fp = {
        // Screen properties
        screen: screen.width + 'x' + screen.height + 'x' + screen.colorDepth,

        // Timezone
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        // Language
        language: navigator.language || navigator.userLanguage,

        // Hardware
        cores: navigator.hardwareConcurrency || 0,
        memory: navigator.deviceMemory || 0,

        // Platform
        platform: navigator.platform,

        // User agent
        ua: navigator.userAgent,

        // Canvas fingerprint
        canvas: await this.getCanvasFingerprint(),

        // WebGL fingerprint
        webgl: this.getWebGLFingerprint(),

        // Audio fingerprint
        audio: this.getAudioFingerprint(),

        // Font detection
        fonts: this.detectFonts(),

        // Plugins (if available)
        plugins: this.getPlugins()
      };

      // Create hash
      this.fingerprint = await this.hashFingerprint(fp);
      return this.fingerprint;
    },

    // Canvas fingerprinting
    getCanvasFingerprint: function() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Allumi 🚀', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Allumi 🚀', 4, 17);
        return canvas.toDataURL();
      } catch (e) {
        return null;
      }
    },

    // WebGL fingerprinting
    getWebGLFingerprint: function() {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return null;

        return {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
      } catch (e) {
        return null;
      }
    },

    // Audio fingerprinting
    getAudioFingerprint: function() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;

        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const analyser = context.createAnalyser();
        const gain = context.createGain();
        const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

        gain.gain.value = 0;
        oscillator.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(gain);
        gain.connect(context.destination);

        oscillator.start(0);
        const fingerprint = analyser.frequencyBinCount;
        oscillator.stop();
        context.close();

        return fingerprint;
      } catch (e) {
        return null;
      }
    },

    // Font detection
    detectFonts: function() {
      const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier', 'Courier New'];
      const detected = [];

      for (let font of fonts) {
        if (this.isFontAvailable(font)) {
          detected.push(font);
        }
      }

      return detected.join(',');
    },

    isFontAvailable: function(font) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
      context.font = '72px monospace';
      const baselineSize = context.measureText(text).width;
      context.font = '72px ' + font + ', monospace';
      const newSize = context.measureText(text).width;
      return baselineSize !== newSize;
    },

    // Plugin detection
    getPlugins: function() {
      if (!navigator.plugins) return '';
      const plugins = [];
      for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push(navigator.plugins[i].name);
      }
      return plugins.join(',');
    },

    // Hash fingerprint
    hashFingerprint: async function(fp) {
      const str = JSON.stringify(fp);
      const msgUint8 = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // EMAIL CAPTURE - THE GAME CHANGER!
    captureEmailFromForms: function() {
      const self = this;

      // Monitor all form submissions
      document.addEventListener('submit', function(e) {
        const form = e.target;
        const emailInputs = form.querySelectorAll('input[type="email"], input[name*="email"]');

        emailInputs.forEach(input => {
          if (input.value && self.isValidEmail(input.value)) {
            self.captureEmail(input.value);
          }
        });
      }, true);

      // Monitor email input changes (for AJAX forms)
      document.addEventListener('change', function(e) {
        if (e.target.type === 'email' || e.target.name?.includes('email')) {
          if (e.target.value && self.isValidEmail(e.target.value)) {
            self.captureEmail(e.target.value);
          }
        }
      }, true);

      // Check for pre-filled email fields
      setTimeout(() => {
        const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"]');
        emailInputs.forEach(input => {
          if (input.value && self.isValidEmail(input.value)) {
            self.captureEmail(input.value);
          }
        });
      }, 1000);
    },

    // Capture and send email
    captureEmail: function(email) {
      if (this.email === email) return; // Already captured

      this.email = email;
      console.log('[Allumi Pixel] Email captured:', email);

      // Send immediately to server
      this.track('email_captured', {
        email: email,
        source: 'pixel',
        page: window.location.pathname,
        confidence: 95 // Email match has 95% confidence
      });

      // Update identity
      this.updateIdentity({
        email: email,
        fingerprint: this.fingerprint
      });
    },

    // Update identity resolution
    updateIdentity: function(data) {
      const payload = {
        identityId: this.identityId,
        userId: this.userId,
        email: data.email,
        fingerprint: this.fingerprint,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Send to identity resolution endpoint
      fetch(API_BASE + '/pixel/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => console.error('[Allumi Pixel] Identity update failed:', err));
    },

    // Track events
    track: function(eventName, properties) {
      const event = {
        userId: this.userId,
        identityId: this.identityId,
        sessionId: this.sessionId,
        email: this.email,
        eventName: eventName,
        properties: properties || {},
        fingerprint: this.fingerprint,
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        metadata: {
          pixelVersion: PIXEL_VERSION,
          viewport: window.innerWidth + 'x' + window.innerHeight,
          screenResolution: screen.width + 'x' + screen.height
        }
      };

      // Store event
      this.events.push(event);

      // Send to server
      this.sendEvent(event);
    },

    // Send event to server
    sendEvent: function(event) {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
        navigator.sendBeacon(API_BASE + '/pixel/track', blob);
      } else {
        // Fallback to fetch
        fetch(API_BASE + '/pixel/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
          keepalive: true
        }).catch(err => console.error('[Allumi Pixel] Event tracking failed:', err));
      }
    },

    // Listen for custom events
    listenForCustomEvents: function() {
      const self = this;

      // Custom tracking API
      window.allumi = {
        track: function(eventName, properties) {
          self.track(eventName, properties);
        },
        identify: function(email, properties) {
          if (email && self.isValidEmail(email)) {
            self.captureEmail(email);
          }
          if (properties) {
            self.track('identify', properties);
          }
        },
        setUser: function(userId) {
          self.userId = userId;
          self.setCookie('allumi_user_id', userId, 365);
        }
      };

      // Track clicks on tracked links
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('allumi.to')) {
          self.track('link_clicked', {
            url: link.href,
            text: link.textContent,
            position: self.getElementPosition(link)
          });
        }
      }, true);
    },

    // Utility functions
    generateSessionId: function() {
      return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    generateIdentityId: function() {
      return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    isValidEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    getCookie: function(name) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },

    setCookie: function(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    },

    getElementPosition: function(element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      };
    }
  };

  // Auto-initialize if script has data attributes
  if (document.currentScript) {
    const script = document.currentScript;
    const userId = script.getAttribute('data-user-id');
    const autoInit = script.getAttribute('data-auto-init') !== 'false';

    if (autoInit) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          AllumiPixel.init({ userId: userId });
        });
      } else {
        AllumiPixel.init({ userId: userId });
      }
    }
  }

  // Export for manual initialization
  window.AllumiPixel = AllumiPixel;

})();