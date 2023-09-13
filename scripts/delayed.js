// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

/**
 * Google Tag
* */
function loadGAScript(url, callback) {
  const head = document.querySelector('head');
  let script = head.querySelector(`script[src="${url}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = url;
    script.async = true;
    head.append(script);
    script.onload = callback;
    return script;
  }
  return script;
}

async function loadGA() {
  const gaId = 'G-Q7JCVTBTKM';
  loadGAScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, () => {
  // eslint-disable-next-line
    window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', gaId);
  });
}

await loadGA();
