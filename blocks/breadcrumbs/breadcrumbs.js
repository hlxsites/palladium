import ffetch from '../../scripts/ffetch.js';

function prependSlash(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function getName(pageIndex, path) {
  const pg = pageIndex.find((page) => page.path === path);
  return pg.title;
}

export default async function decorate(block) {
  const breadcrumbs = [
    { name: 'Home', url_path: '/es' },
    { name: 'Palladium Cares', url_path: '/es/cares' },
    { name: '4 causes to take action', url_path: '/es/cares/4-causas' },
  ];
  const path = window.location.pathname;
  const pathSplit = path.split('/');
  const pageIndex = await ffetch('/query-index.json').all();
  const urlForIndex = (index) => prependSlash(pathSplit.slice(1, index + 2).join('/'));

  breadcrumbs.push(
    ...pathSplit.slice(1, -1).map((part, index) => {
      if (index > 2) {
        const url = urlForIndex(index);
        return { name: getName(pageIndex, url), url_path: url };
      } return null;
    }),
    { name: getName(pageIndex, path) },
  );

  const ol = document.createElement('ol');
  breadcrumbs.forEach((crumb) => {
    if (crumb) {
      const li = document.createElement('li');
      li.innerHTML = crumb.url_path ? `<a href='${crumb.url_path}'>${crumb.name}</a>` : crumb.name;
      ol.appendChild(li);
    }
  });
  block.appendChild(ol);
}
