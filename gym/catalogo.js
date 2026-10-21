// Conserva los seis destacados aunque la planilla regenere la portada.
(async function () {
  const isHomePage = /^\/(?:index\.html)?$/.test(location.pathname);
  if (isHomePage && document.querySelector('#gym .galeria')) {
    try {
      const response = await fetch('/gym/', {signal: AbortSignal.timeout(4000)});
      if (!response.ok) throw new Error('Catálogo no disponible');
      const catalog = new DOMParser().parseFromString(await response.text(), 'text/html');
      const products = [...catalog.querySelectorAll('#gym .galeria-item')];
      const featuredCodes = ["FAB-00083","FAB-00017","FAB-00002","FAB-00003","FAB-00004","FAB-00022"];
      const selected = featuredCodes.map(code => products.find(card => card.dataset.codigo === code)).filter(Boolean);
      if (selected.length === 6) document.querySelector('#gym .galeria').replaceChildren(...selected);
    } catch (_) { /* El HTML publicado sigue disponible sin conexión al catálogo. */ }
  }
// Mejora progresiva: el catálogo y los precios siguen presentes en el HTML.
const cards = [...document.querySelectorAll('.galeria-item')];
const photoCards = cards.filter(card => card.querySelector('img'));
cards.forEach((card) => {
  const title = card.querySelector('.galeria-nombre').textContent;
  card.removeAttribute('onclick');
  card.dataset.nombre = title;
  const img = card.querySelector('img');
  if (img) {
  const photo = document.createElement('button');
  photo.type = 'button';
  photo.className = 'product-photo';
  photo.setAttribute('aria-label', 'Ampliar foto de ' + title);
  card.insertBefore(photo, img);
  photo.append(img);
  const hint = document.createElement('span');
  hint.className = 'photo-hint';
  hint.textContent = 'Ampliar foto ↗';
  hint.setAttribute('aria-hidden', 'true');
  photo.append(hint);
  photo.addEventListener('click', () => {
    const visiblePhotos = photoCards.filter(item => !item.hidden);
    galeriaItems = visiblePhotos.map(item => ({src:item.querySelector('img').src,nombre:item.dataset.nombre,desc:item.dataset.desc}));
    abrirLightbox(img.src, title, card.dataset.desc, visiblePhotos.indexOf(card));
  });
  }
  // Videos destacados solo en la portada; cada enlace conserva la foto ampliable.
  const videoUrls = {"FAB-00083":"https://www.instagram.com/p/DdNXZReBxAt/","FAB-00002":"https://www.instagram.com/p/DaGy3DtJdLw/","FAB-00017":"https://www.instagram.com/p/DW7_s2tDpbM/"};
  if (isHomePage && card.closest('#gym') && videoUrls[card.dataset.codigo]) {
    card.querySelector('.product-video')?.remove();
    const video = document.createElement('a');
    video.className = 'product-video';
    video.href = videoUrls[card.dataset.codigo];
    video.target = '_blank';
    video.rel = 'noopener noreferrer';
    video.textContent = '▶ VIDEO ↗';
    video.setAttribute('aria-label', 'Ver video en Instagram de ' + title + ' (abre en otra pestaña)');
    card.querySelector('.product-photo').after(video);
  }
  const name = card.querySelector('.galeria-nombre');
  const heading = document.createElement('h3');
  heading.className = name.className;
  heading.textContent = title;
  name.replaceWith(heading);
  const consult = card.querySelector('.btn-consultar');
  const prices = card.querySelector('.galeria-precio').innerText.replace(/\s+/g, ' ').trim();
  const link = document.createElement('a');
  link.className = consult.className;
  link.textContent = 'Consultar por WhatsApp ↗';
  link.setAttribute('aria-label', 'Consultar por WhatsApp: ' + title);
  link.href = 'https://wa.me/543804985423?text=' + encodeURIComponent('¡Hola! Me interesa ' + title + (card.dataset.codigo ? ' (' + card.dataset.codigo + ')' : '') + ' de Fabrilar.\nPrecio publicado: ' + prices + '\n¿Me cuentan qué incluye, disponibilidad, plazo de entrega y medios de pago?');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  consult.replaceWith(link);
});
galeriaItems = photoCards.map(card => ({src:card.querySelector('img').src,nombre:card.dataset.nombre,desc:card.dataset.desc}));
const lightbox = document.getElementById('lightbox');
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-labelledby', 'lightbox-nombre');
lightbox.querySelector('.lightbox-close').setAttribute('aria-label', 'Cerrar foto');
lightbox.querySelector('.lightbox-prev').setAttribute('aria-label', 'Foto anterior');
lightbox.querySelector('.lightbox-next').setAttribute('aria-label', 'Foto siguiente');
let previousFocus;
const originalOpen = abrirLightbox;
abrirLightbox = function(src, nombre, desc, index) {
  previousFocus = document.activeElement;
  originalOpen(src, nombre, desc, index);
  document.getElementById('lightbox-img').alt = nombre;
  lightbox.querySelector('.lightbox-close').focus();
};
const originalClose = cerrarLightbox;
cerrarLightbox = function(event) {
  const wasOpen = lightbox.classList.contains('open');
  originalClose(event);
  if (wasOpen && !lightbox.classList.contains('open')) previousFocus?.focus();
};
const originalNav = navLightbox;
navLightbox = function(dir) {
  originalNav(dir);
  document.getElementById('lightbox-img').alt = galeriaItems[lbIndex].nombre;
};
document.addEventListener('keydown', event => {
  if(event.key !== 'Tab' || !lightbox.classList.contains('open')) return;
  const buttons = [...lightbox.querySelectorAll('button')];
  const first = buttons[0], last = buttons[buttons.length - 1];
  if(event.shiftKey && document.activeElement === first){event.preventDefault();last.focus();}
  else if(!event.shiftKey && document.activeElement === last){event.preventDefault();first.focus();}
});
document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');

// Los filtros se ofrecen en los catálogos completos; la portada conserva sus destacados.
if (/\/(gym|hogar)(\/|\/index\.html)?$/.test(location.pathname)) {
  document.querySelectorAll('.catalog-wrap').forEach(wrap => {
    const gallery = wrap.querySelector('.galeria');
    const products = [...gallery.querySelectorAll('.galeria-item')];
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const items = products.map(card => ({card,
      category: card.querySelector('.product-category')?.textContent.trim() || 'Otros',
      search: normalize(card.dataset.nombre + ' ' + (card.dataset.codigo || '')),
      available: card.querySelector('.product-stock')?.textContent.trim() === 'En stock'
    }));
    const form = document.createElement('form');
    form.className = 'catalog-filters';
    form.setAttribute('role', 'search');
    form.setAttribute('aria-label', 'Buscar productos del catálogo');
    form.innerHTML = '<label class="catalog-search">Buscar producto<input type="search" name="buscar" placeholder="Nombre o código, por ejemplo FAB-00001" autocomplete="off"></label><label>Categoría<select name="categoria" aria-label="Categoría"><option value="">Todas las categorías</option></select></label><label class="catalog-stock"><input type="checkbox" name="stock">Solo en stock</label><button type="reset" class="catalog-reset">Limpiar filtros</button>';
    const input = form.elements.namedItem('buscar');
    const category = form.elements.namedItem('categoria');
    const stock = form.elements.namedItem('stock');
    [...new Set(items.map(item => item.category))].sort((a,b) => a.localeCompare(b,'es')).forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      category.append(option);
    });
    const status = document.createElement('p');
    status.className = 'catalog-results';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    const empty = document.createElement('div');
    empty.className = 'catalog-empty';
    empty.hidden = true;
    empty.textContent = 'No encontramos productos con esos filtros. Probá otro nombre o código, o limpiá los filtros.';
    gallery.before(form, status);
    gallery.after(empty);
    function filterProducts() {
      const words = input.value.trim().split(/\s+/).map(normalize).filter(Boolean);
      let count = 0;
      items.forEach(item => {
        const show = words.every(word => item.search.includes(word)) && (!category.value || item.category === category.value) && (!stock.checked || item.available);
        item.card.hidden = !show;
        if (show) count++;
      });
      status.textContent = 'Mostrando ' + count + ' de ' + items.length + ' productos';
      empty.hidden = count > 0;
    }
    form.addEventListener('submit', event => event.preventDefault());
    input.addEventListener('input', filterProducts);
    category.addEventListener('change', filterProducts);
    stock.addEventListener('change', filterProducts);
    form.addEventListener('reset', event => {
      event.preventDefault();
      input.value = '';
      category.value = '';
      stock.checked = false;
      filterProducts();
    });
    filterProducts();
  });
}

 
// Volver al inicio sin perder los filtros elegidos.
if (document.querySelector('.hero-title, .catalog-wrap')) {
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.hidden = true;
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span><span>Arriba</span>';
  document.body.append(backToTop);
  function updateBackToTop() {
    const hidden = window.scrollY < 500;
    if (hidden && document.activeElement === backToTop) {
      const target = document.querySelector('.catalog-filters input[type="search"]') || document.querySelector('h1');
      if (target) {
        if (!target.matches('input')) target.setAttribute('tabindex', '-1');
        target.focus({preventScroll:true});
      }
    }
    backToTop.hidden = hidden;
  }
  window.addEventListener('scroll', updateBackToTop, {passive:true});
  window.addEventListener('resize', updateBackToTop);
  backToTop.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  updateBackToTop();
}

})();
