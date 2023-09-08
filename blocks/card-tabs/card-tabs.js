export default function decorate(block) {
  const ul = document.createElement('ul');
  const section = block.closest('.section');
  [...section.querySelectorAll('.block.cards')].forEach((cardBlock, i) => {
    [...cardBlock.classList].forEach((cl) => {
      if (cl.startsWith('tab-')) {
        const li = document.createElement('li');
        li.textContent = cl.slice(4);
        ul.appendChild(li);
        if (!i) {
          cardBlock.classList.add('active');
          li.classList.add('active');
        }
        li.addEventListener('click', () => {
          section.querySelector('.block.cards.active').classList.remove('active');
          ul.querySelector('li.active').classList.remove('active');
          cardBlock.classList.add('active');
          li.classList.add('active');
        });
      }
    });
  });
  block.appendChild(ul);
}