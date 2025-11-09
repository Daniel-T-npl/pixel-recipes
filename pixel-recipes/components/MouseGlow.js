import { useEffect } from 'react';

export default function MouseGlow() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hero = document.getElementById('hero');
    const gallery = document.getElementById('gallery');

    let heroGlow = null;
    let galleryGlow = null;

    if (hero) {
      // ensure hero is positioned so absolute child is relative; sticky already positions it
      hero.style.position = hero.style.position || 'sticky';
      heroGlow = document.createElement('div');
      heroGlow.className = 'pointer-events-none mouse-glow-hero';
      Object.assign(heroGlow.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '-1',
        transition: 'opacity 160ms linear',
        opacity: '0',
        background: 'radial-gradient(600px at 0px 0px, rgba(99,102,241,0.12), transparent 60%)',
      });
      hero.appendChild(heroGlow);
    }

    if (gallery) {
      if (!getComputedStyle(gallery).position || getComputedStyle(gallery).position === 'static') {
        gallery.style.position = 'relative';
      }
      galleryGlow = document.createElement('div');
      galleryGlow.className = 'pointer-events-none mouse-glow-gallery';
      Object.assign(galleryGlow.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '0',
        transition: 'opacity 160ms linear',
        opacity: '0',
        background: 'radial-gradient(600px at 0px 0px, rgba(99,102,241,0.10), transparent 70%)',
        mixBlendMode: 'screen',
      });
      gallery.appendChild(galleryGlow);
    }

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (hero && heroGlow) {
        const hr = hero.getBoundingClientRect();
        const insideHero = x >= hr.left && x <= hr.right && y >= hr.top && y <= hr.bottom;
        if (insideHero) {
          const relX = x - hr.left;
          const relY = y - hr.top;
          heroGlow.style.background = `radial-gradient(520px at ${relX}px ${relY}px, rgba(99,102,241,0.18), transparent 65%)`;
          heroGlow.style.opacity = '1';
        } else {
          heroGlow.style.opacity = '0';
        }
      }

      if (gallery && galleryGlow) {
        const gr = gallery.getBoundingClientRect();
        const insideGallery = x >= gr.left && x <= gr.right && y >= gr.top && y <= gr.bottom;
        if (insideGallery) {
          const relX = x - gr.left;
          const relY = y - gr.top;
          galleryGlow.style.background = `radial-gradient(520px at ${relX}px ${relY}px, rgba(99,102,241,0.12), transparent 70%)`;
          galleryGlow.style.opacity = '1';
        } else {
          galleryGlow.style.opacity = '0';
        }
      }
    };

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (heroGlow && hero.contains(heroGlow)) hero.removeChild(heroGlow);
      if (galleryGlow && gallery.contains(galleryGlow)) gallery.removeChild(galleryGlow);
    };
  }, []);

  return null;
}