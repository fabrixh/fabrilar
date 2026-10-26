/* Ficha independiente: no ejecuta el código que transforma tarjetas del catálogo. */
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('fabrilar-theme',next);}catch(_){}}
try{const saved=localStorage.getItem('fabrilar-theme');if(['dark','light'].includes(saved))document.documentElement.dataset.theme=saved;}catch(_){}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('hamburger').classList.remove('active');document.body.style.overflow='';}
function toggleMenu(){const menu=document.getElementById('mobileMenu');const open=menu.classList.toggle('open');document.getElementById('hamburger').classList.toggle('active',open);document.body.style.overflow=open?'hidden':'';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
for(const [selector,label] of [['.theme-switch','Cambiar tema claro u oscuro'],['#hamburger','Abrir o cerrar menú']]){const el=document.querySelector(selector);el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();el.click();}});}
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
document.getElementById('share').addEventListener('click',async()=>{
 const url=document.querySelector('link[rel="canonical"]').href;
 const title=document.getElementById('product-name').textContent+' · Fabrilar';
 const status=document.getElementById('share-status');
 try{if(navigator.share){await navigator.share({title,url});status.textContent='';}else{await navigator.clipboard.writeText(url);status.textContent='Enlace copiado.';}}
 catch(error){if(error.name==='AbortError')return;document.getElementById('copy-fallback').hidden=false;document.getElementById('product-url').select();status.textContent='Seleccioná y copiá el enlace.';}
});
