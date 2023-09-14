import { readBlockConfig, decorateIcons, decorateButtons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/drafts/paolom/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const formTitle = footer.querySelector('.center > div > div > h4');
    const input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.setAttribute('placeholder', 'Email');
    formTitle.after(input);

    decorateIcons(footer);
    decorateButtons(footer);
    block.append(footer);
  }
}
