/* Navegación independiente de geometría, precios, cuotas y configuración 3D. */
(() => {
 const header=document.querySelector('.site-header');if(!header)return;
 const toggle=header.querySelector('.site-menu-toggle'),menu=document.getElementById('site-mobile-menu'),theme=header.querySelector('#theme');
 let previousOverflow='';
 function closeMenu(restoreFocus=false){if(toggle.getAttribute('aria-expanded')!=='true')return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');menu.hidden=true;document.body.style.overflow=previousOverflow;if(restoreFocus)toggle.focus();}
 toggle.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true'){closeMenu();return;}previousOverflow=document.body.style.overflow;window.scrollTo({top:0,behavior:'instant'});toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Cerrar menú');menu.hidden=false;document.body.style.overflow='hidden';});
 menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu(true);});
 const desktop=window.matchMedia('(min-width:1251px)');desktop.addEventListener?.('change',event=>{if(event.matches)closeMenu();});
 // En las dos calculadoras, su código original conserva el control de #theme.
 // La portada de cotizadores no tenía botón ni manejador y los recibe aquí.
 if(header.dataset.themeController==='shared'){
  const sync=()=>{const light=document.documentElement.dataset.theme==='light';theme.setAttribute('aria-checked',String(light));theme.setAttribute('aria-label',light?'Pasar a modo oscuro':'Pasar a modo claro');};
  theme.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('fabrilar-theme',next);}catch(_){}sync();});sync();
 }
})();

