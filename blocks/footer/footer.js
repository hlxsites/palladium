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

    decorateIcons(footer);
    decorateButtons(footer);
    block.append(footer);

    const formTitle = footer.querySelector('.center > div > div > h4');
    const input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.setAttribute('placeholder', 'Email');
    formTitle.after(input);
    const button = footer.querySelector('.center a.button');
    button.classList.add('disabled');
    const { href } = button;

    input.addEventListener('keyup', (event) => {
      // eslint-disable-next-line no-useless-escape
      if (event.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) button.classList.remove('disabled');
      else button.classList.add('disabled');
      button.href = `${href}${event.target.value}`;
    });

    const lis = footer.querySelectorAll('.center > div > div > ul > li');
    [...lis].forEach((li) => {
      li.addEventListener('click', () => {
        const ul = li.querySelector('ul');
        if (li.classList.contains('active')) {
          ul.style.height = '0';
          li.classList.remove('active');
        } else {
          ul.style.height = `${(ul.querySelector('li').offsetHeight*ul.childElementCount) + 10}px`;
          li.classList.add('active');
        }
      })
    });
  }
}
