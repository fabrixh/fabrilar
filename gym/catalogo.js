// Mejora progresiva: el catálogo y los precios siguen presentes en el HTML.
const cards = [...document.querySelectorAll('.galeria-item')];
cards.forEach((card) => {
  const title = card.querySelector('.galeria-nombre').textContent;
  card.removeAttribute('onclick');
  card.dataset.nombre = title;
  const img = card.querySelector('img');
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
  photo.addEventListener('click', () => abrirLightbox(img.src, title, card.dataset.desc, cards.indexOf(card)));
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
  link.href = 'https://wa.me/543804985423?text=' + encodeURIComponent('¡Hola! Me interesa ' + title + ' de Fabrilar.\nPrecio publicado: ' + prices + '\n¿Me cuentan qué incluye, disponibilidad, plazo de entrega y medios de pago?');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  consult.replaceWith(link);
});
galeriaItems = cards.map(card => ({src:card.querySelector('img').src,nombre:card.dataset.nombre,desc:card.dataset.desc}));
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
