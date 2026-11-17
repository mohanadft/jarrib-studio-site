export const SLIDES = [
  { kind: 'reel', src: 'assets/img/reel-arm.webp', alt: 'غلاف تجربة الإيد اللي بتطلع لحالها' },
  { kind: 'reel', src: 'assets/img/reel-head.webp', alt: 'غلاف تجربة الراس اللي بيميل لحاله' },
  { kind: 'brand' },
];

const PRESS_MS = 100;

export const nextIndex = (i) => (i + 1) % SLIDES.length;

function slideNode(slide) {
  const tpl = document.createElement('template');
  tpl.innerHTML = slide.kind === 'brand'
    ? '<div class="slide-brand"><p class="slide-brand__label">الفيديو الجاي</p><p class="slide-brand__title">براندك<br>هون</p></div>'
    : '<img width="520" height="924">';
  const node = tpl.content.firstElementChild;
  if (slide.kind === 'reel') {
    node.src = slide.src;
    node.alt = slide.alt;
  }
  return node;
}

function init() {
  const press = document.getElementById('press');
  const screen = document.getElementById('phone-screen');
  const dots = [...document.querySelectorAll('#dots .dot')];
  if (!press || !screen) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer = 0;

  const render = (i) => {
    screen.replaceChildren(slideNode(SLIDES[i]));
    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === i);
      if (n === i) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  press.addEventListener('click', () => {
    // State advances now so rapid presses never desync; the timeout only paints.
    index = nextIndex(index);
    clearTimeout(timer);
    if (reduced.matches) {
      press.classList.remove('is-down');
      render(index);
      return;
    }
    press.classList.add('is-down');
    timer = setTimeout(() => {
      press.classList.remove('is-down');
      render(index);
    }, PRESS_MS);
  });

  render(0);

  // Warm the second reel once the first has settled.
  const preload = () => { new Image().src = SLIDES[1].src; };
  (window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200)))(preload);
}

init();
