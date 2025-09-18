import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

let fpPromise: Promise<any> | null = null;

export async function getFingerprint() {
  try {
    // Initialize FingerprintJS only once
    if (!fpPromise && process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY) {
      fpPromise = FingerprintJS.load({
        apiKey: process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY,
        endpoint: 'https://fp.allumi.to', // Custom endpoint for better privacy
      });
    }

    if (fpPromise) {
      const fp = await fpPromise;
      const result = await fp.get();
      return result.visitorId;
    }

    // Fallback to basic fingerprinting if no API key
    return await getBasicFingerprint();
  } catch (error) {
    console.error('Error getting fingerprint:', error);
    return await getBasicFingerprint();
  }
}

// Basic fingerprinting without external service
async function getBasicFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return generateRandomId();

  // Canvas fingerprinting
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Allumi', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('Allumi', 4, 17);

  const canvasData = canvas.toDataURL();

  // Combine with other browser characteristics
  const fingerprint = {
    canvas: canvasData,
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    cores: navigator.hardwareConcurrency,
    memory: (navigator as any).deviceMemory,
    vendor: navigator.vendor,
    userAgent: navigator.userAgent,
  };

  // Create a hash
  const str = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `fp_${Math.abs(hash).toString(36)}`;
}

function generateRandomId(): string {
  return `fp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

// Enhanced tracking with multiple signals
export async function getEnhancedFingerprint() {
  const baseFingerprint = await getFingerprint();
  
  const enhanced = {
    visitorId: baseFingerprint,
    
    // WebGL fingerprint
    webgl: await getWebGLFingerprint(),
    
    // Audio fingerprint
    audio: await getAudioFingerprint(),
    
    // Font detection
    fonts: detectInstalledFonts(),
    
    // Hardware details
    hardware: {
      cores: navigator.hardwareConcurrency,
      memory: (navigator as any).deviceMemory,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchSupport: 'ontouchstart' in window,
      devicePixelRatio: window.devicePixelRatio,
    },
    
    // Browser features
    features: {
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      vendor: navigator.vendor,
    }
  };

  return enhanced;
}

async function getWebGLFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'no-webgl';

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) return 'no-debug-info';

    const vendor = (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return `${vendor}::${renderer}`;
  } catch (e) {
    return 'webgl-error';
  }
}

async function getAudioFingerprint(): Promise<number> {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 0;

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
    
    return new Promise((resolve) => {
      scriptProcessor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += Math.abs(data[i]);
        }
        oscillator.stop();
        scriptProcessor.disconnect();
        analyser.disconnect();
        gain.disconnect();
        resolve(sum);
      };
    });
  } catch (e) {
    return 0;
  }
}

function detectInstalledFonts(): string[] {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Bookman',
    'Comic Sans MS', 'Trebuchet MS', 'Impact'
  ];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return [];

  const testString = 'mmmmmmmmmmlli';
  const detectedFonts: string[] = [];

  ctx.font = '72px monospace';
  const baseWidth = ctx.measureText(testString).width;

  for (const font of testFonts) {
    ctx.font = `72px '${font}', monospace`;
    const width = ctx.measureText(testString).width;
    
    if (width !== baseWidth) {
      detectedFonts.push(font);
    }
  }

  return detectedFonts;
}