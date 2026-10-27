/* Ficha independiente: no ejecuta el código que transforma tarjetas del catálogo. */
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('fabrilar-theme',next);}catch(_){}}
try{const saved=localStorage.getItem('fabrilar-theme');if(['dark','light'].includes(saved))document.documentElement.dataset.theme=saved;}catch(_){}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('hamburger').classList.remove('active');document.body.style.overflow='';}
function toggleMenu(){const menu=document.getElementById('mobileMenu');const open=menu.classList.toggle('open');document.getElementById('hamburger').classList.toggle('active',open);document.body.style.overflow=open?'hidden':'';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
for(const [selector,label] of [['.theme-switch','Cambiar tema claro u oscuro'],['#hamburger','Abrir o cerrar menú']]){const el=document.querySelector(selector);el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();el.click();}});}
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
document.getElementById('share')?.addEventListener('click',async()=>{
 const url=document.querySelector('link[rel="canonical"]').href;
 const title=document.getElementById('product-name').textContent+' · Fabrilar';
 const status=document.getElementById('share-status');
 try{if(navigator.share){await navigator.share({title,url});status.textContent='';}else{await navigator.clipboard.writeText(url);status.textContent='Enlace copiado.';}}
 catch(error){if(error.name==='AbortError')return;document.getElementById('copy-fallback').hidden=false;document.getElementById('product-url').select();status.textContent='Seleccioná y copiá el enlace.';}
});


const galleryImage=document.getElementById('main-photo');
const thumbnails=[...document.querySelectorAll('.photo-thumbnail')];
function showProductPhoto(index){if(!galleryImage||!thumbnails.length)return;const selected=(index+thumbnails.length)%thumbnails.length;galleryImage.src=thumbnails[selected].dataset.image;thumbnails.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));document.getElementById('photo-position').textContent='Foto '+(selected+1)+' de '+thumbnails.length;}
thumbnails.forEach((button,index)=>button.addEventListener('click',()=>showProductPhoto(index)));
if(galleryImage&&thumbnails.length>1){let touchStart=null;galleryImage.addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};else touchStart=null;},{passive:true});galleryImage.addEventListener('touchend',event=>{if(!touchStart||!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){const current=thumbnails.findIndex(button=>button.getAttribute('aria-pressed')==='true');showProductPhoto(current+(dx<0?1:-1));}},{passive:true});}

