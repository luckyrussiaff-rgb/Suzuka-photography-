import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const SUPABASE_URL='https://kzvsghucgoncxdxlygjl.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_E-mfJsuT7VrzabPisRpyuQ_eMS63VVo';
const db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);
const year=$('year');if(year)year.textContent=new Date().getFullYear();
const toggle=$('menuToggle'),nav=$('mainNav');if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));
async function getSettings(){const {data}=await db.from('site_settings').select('*').eq('id',1).maybeSingle();return data||{}}
async function applySettings(){const s=await getSettings();if(s.tagline&&$('tagline'))$('tagline').textContent=s.tagline;if(s.about_title&&$('aboutTitle'))$('aboutTitle').textContent=s.about_title;if(s.about_text&&$('aboutText'))$('aboutText').textContent=s.about_text;if(s.contact_email){document.querySelectorAll('[data-email]').forEach(a=>{a.href='mailto:'+s.contact_email;a.textContent=s.contact_email})}if(s.instagram){document.querySelectorAll('[data-instagram]').forEach(a=>a.textContent=s.instagram)}}

let galleryItems = [];
let currentImageIndex = 0;



function createLightbox() {
  if (document.getElementById('merakiLightbox')) return;

  const box = document.createElement('dialog');
  box.id = 'merakiLightbox';

  box.innerHTML = `
    <button class="lb-close" aria-label="Close">×</button>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <div class="lb-content"></div>
    <button class="lb-next" aria-label="Next">›</button>
    <div class="lb-caption"></div>
    <div class="lb-count"></div>
  `;

  document.body.append(box);

  box.querySelector('.lb-close').onclick = closeLightbox;
  box.querySelector('.lb-prev').onclick = () =>
    showLightbox(currentImageIndex - 1);
  box.querySelector('.lb-next').onclick = () =>
    showLightbox(currentImageIndex + 1);

  box.addEventListener('close', () => {
    box.querySelector('.lb-content').innerHTML = '';
  });

  document.addEventListener('keydown', e => {
    if (!box.open) return;
    if (e.key === 'ArrowRight') showLightbox(currentImageIndex + 1);
    if (e.key === 'ArrowLeft') showLightbox(currentImageIndex - 1);
  });
}

function showLightbox(index) {
  if (!galleryItems.length) return;

  currentImageIndex =
    (index + galleryItems.length) % galleryItems.length;

  const item = galleryItems[currentImageIndex];
  const box = document.getElementById('merakiLightbox');
  const content = box.querySelector('.lb-content');

  content.innerHTML = '';

  if (item.media_type === 'video') {
    const video = document.createElement('video');
    video.src = item.public_url;
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    content.append(video);
  } else {
    const img = document.createElement('img');
    img.src = item.public_url;
    img.alt = item.title || '';
    img.draggable = false;

    let startX = 0;

    img.addEventListener('touchstart', e => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    img.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) < 55) return;

      if (diff < 0) showLightbox(currentImageIndex + 1);
      else showLightbox(currentImageIndex - 1);
    }, { passive: true });

    content.append(img);
  }

  box.querySelector('.lb-caption').textContent =
    item.title || item.category || '';

  box.querySelector('.lb-count').textContent =
    `${currentImageIndex + 1} / ${galleryItems.length}`;

  if (!box.open) box.showModal();
}

function closeLightbox() {
  const box = document.getElementById('merakiLightbox');
  if (box && box.open) box.close();
}


async function loadGallery(targetId, filterId, featured = false) {
  const root = $(targetId);
  if (!root) return;

  const { data, error } = await db.from('gallery_items')
    .select('*').order('created_at', { ascending: false });

  if (error) {
    root.innerHTML = '<div class="empty">Gallery is temporarily unavailable.</div>';
    return;
  }

  const items = data || [];
  galleryItems = items;

  const cats = ['All', ...new Set(items.map(x => x.category))];
  let selected = 'All';

  const draw = () => {
    root.innerHTML = '';
    let shown = selected === 'All'
      ? items : items.filter(x => x.category === selected);

    if (featured) shown = shown.slice(0, 6);

    if (!shown.length) {
      root.innerHTML = '<div class="empty">New photographs and films will appear here soon.</div>';
      return;
    }

    shown.forEach(x => {
      const card = document.createElement('article');
      card.className = 'item';

      let media;
      if (x.media_type === 'video') {
        media = document.createElement('video');
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
      } else {
        media = document.createElement('img');
        media.loading = 'lazy';
        media.alt = x.title || x.category;
      }

      media.src = x.public_url;

      card.append(media);

      if (x.title) {
        const cap = document.createElement('div');
        cap.className = 'caption';
        cap.textContent = x.title + ' · ' + x.category;
        card.append(cap);
      }

      card.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const index = galleryItems.findIndex(
    item => item.public_url === x.public_url
  );

  if (index !== -1) {
    showLightbox(index);
  }
});

      root.append(card);
    });
  };

  const filterRoot = $(filterId);
  if (filterRoot) {
    filterRoot.innerHTML = '';
    cats.forEach(c => {
      const b = document.createElement('button');
      b.className = 'filter' + (c === selected ? ' active' : '');
      b.textContent = c;
      b.onclick = () => {
        selected = c;
        filterRoot.querySelectorAll('button')
          .forEach(v => v.classList.toggle('active', v === b));
        draw();
      };
      filterRoot.append(b);
    });
  }

  draw();
}

createLightbox();
applySettings();
loadGallery('gallery', 'filters', false);
loadGallery('featuredGallery', null, true);
  
const form=$('bookingForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('Photography enquiry — Meraki Film');const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nService: ${d.get('service')}\nDate / location: ${d.get('date')}\nMessage: ${d.get('message')}`);location.href=`mailto:themerakifilm@gmail.com?subject=${subject}&body=${body}`});


// Cinematic motion: scroll reveals, subtle pointer depth and gallery card tilt.
const revealTargets=document.querySelectorAll('.section,.cta-band,.service-card,.contact-box,.visual,.gallery .item');
revealTargets.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3)*70+'ms'});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(el=>observer.observe(el))}else revealTargets.forEach(el=>el.classList.add('is-visible'));
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.service-card,.gallery .item,.contact-box').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});}
