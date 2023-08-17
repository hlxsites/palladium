/* global WebImporter */
export default function process(main) {
  WebImporter.DOMUtils.remove(main, ['.header-xf', 'footer', '.footer-brand-xf']);
}
