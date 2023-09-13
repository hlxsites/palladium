// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed  functionality here

/**
 * Google Tag Manager
* */
async function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
        (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
        }(window, document, 'script', 'dataLayer', 'GTM-W6W5RK'));
    `;
  document.head.prepend(scriptTag);
}

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
  const gaId = 'UA-150288508-1';
  loadGAScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, () => {
  // eslint-disable-next-line
    window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', gaId); ga('send', 'pageview'); ga('create', gaId, 'auto');
  });
}

await loadGTM();
await loadGA();
