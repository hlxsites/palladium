import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  // nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  // toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Show the modal when sidebar is open.
 * This modal also helps to target click event outside
 * of sidebar.
 */
function showModalBackground(block) {
  block.querySelector('.modal-filter').style.display = 'block';
}

function hideModalBackground(block) {
  block.querySelector('.modal-filter').style.display = 'none';
}

function closeSidebar(block, clsName = '.nav-sidebar-new') {
  const sidebar = block.querySelector(clsName);
  const isSidebarOpen = sidebar.classList.contains('open');

  if (isSidebarOpen) {
    sidebar.classList.remove('open');
    document.body.style = '';
    hideModalBackground(block);
  }
}

function closeSidebarOnClickOutside(block) {
  const modalEl = document.querySelector('.modal-filter');
  const isReservasSidebar = document.querySelector('.nav-sidebar-phone.open');

  document.addEventListener('click', (event) => {
    if (modalEl && event.target === modalEl) {
      if (isReservasSidebar) {
        closeSidebar(block, '.nav-sidebar-phone');
      } else {
        closeSidebar(block);
      }
    }
  });
}

/**
 * Open the sidebar on click of hamburger
 */
function handleSidebarOpen(block, target = '.nav-hamburger', clsName = '.nav-sidebar-new') {
  const hamburger = block.querySelector(target);

  hamburger.addEventListener('click', () => {
    const sidebar = block.querySelector(clsName);
    const isSidebarOpen = sidebar.classList.contains('open');
    if (!isSidebarOpen) {
      sidebar.classList.add('open');
      showModalBackground(block);
      closeSidebarOnClickOutside(block);
    }
  });
}

/**
 * Close the sidebar on click of close
 */
function handleSidebarClose(block, clsName = '.nav-sidebar-new') {
  const closeBtn = block.querySelector(`header nav ${clsName} .icon.icon-close`);

  closeBtn.addEventListener('click', () => {
    closeSidebar(block, clsName);
  });
}

function closeLanguageNavOnClickOutside(globe) {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('li.active');
    if (target !== globe || !target) {
      globe.classList.remove('active');
    }
  });
}

function toggleLanguageNav(block) {
  const languageToggleEls = block.querySelectorAll('.nav-sidebar-new > ul li:last-child, .nav-sections > ul li:last-child');
  const ACTIVE = 'active';

  [...languageToggleEls].forEach((languageToggleEl) => {
    languageToggleEl.addEventListener('click', () => {
      const isActive = languageToggleEl.classList.contains(ACTIVE);
      if (isActive) {
        languageToggleEl.classList.remove(ACTIVE);
      } else {
        languageToggleEl.classList.add(ACTIVE);
      }
    });
    closeLanguageNavOnClickOutside(languageToggleEl);
  });
}

function decorateSecondarySidebar(block) {
  const sidebarUlEl = block.querySelector('.nav-sections ul li:nth-child(3) ul');
  sidebarUlEl?.classList.add('nav-sidebar-phone');

  handleSidebarOpen(block, '.nav-sections .icon.icon-phone', '.nav-sidebar-phone');
  handleSidebarClose(block, '.nav-sidebar-phone');
}

function addModalElementToSidebar(nav) {
  const modalEl = document.createElement('div');
  modalEl.classList.add('modal-filter');
  nav.append(modalEl);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) block.closest('header').classList.add('hide');
    else block.closest('header').classList.remove('hide');
  });

  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/drafts/paolom/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['menu', 'brand', 'sections', 'sidebar-new'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    nav.append(hamburger);
    addModalElementToSidebar(nav);
    nav.setAttribute('aria-expanded', 'false');

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    handleSidebarOpen(block);
    handleSidebarClose(block);
    toggleLanguageNav(block);
    decorateSecondarySidebar(block);
  }
}
