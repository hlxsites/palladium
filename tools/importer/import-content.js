/* eslint-disable object-curly-newline */
import { transformers, asyncTransformers, preTransformers, postTransformers } from './transformers/index.js';
/* global WebImporter */
export default {
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    // eslint-disable-next-line no-unused-vars
    html,
    params,
  }) => {
    const main = document.body;
    if (main) {
      preTransformers.forEach((fn) => fn.call(this, main, document, params, url));

      transformers.forEach((fn) => fn.call(this, main, document, params, url));
      await Promise.all(asyncTransformers.map((fn) => fn(main, document, params, url)));

      postTransformers.forEach((fn) => fn.call(this, main, document, params, url));
    }
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    // eslint-disable-next-line no-unused-vars
    html,
    // eslint-disable-next-line no-unused-vars
    params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
