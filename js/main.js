/* ============================================================
   ХИМКОЛОР — main.js
   Multi-page version
   ============================================================ */
'use strict';

/* ---- LANGUAGE SYSTEM ---- */
let currentLang = localStorage.getItem('himcolor-lang') || 'bg';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('himcolor-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-bg]').forEach(el => {
        const text = lang === 'bg' ? el.dataset.bg : el.dataset.en;
        if (text !== undefined) {
            if (text.includes('<') || el.tagName === 'H1' || el.tagName === 'H2') {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    document.querySelectorAll('[data-placeholder-bg]').forEach(el => {
        el.placeholder = lang === 'bg' ? el.dataset.placeholderBg : el.dataset.placeholderEn;
    });

    document.querySelectorAll('select option[data-bg]').forEach(opt => {
        opt.textContent = lang === 'bg' ? opt.dataset.bg : opt.dataset.en;
    });

    const bodyTitleBg = document.body.dataset.titleBg;
    const bodyTitleEn = document.body.dataset.titleEn;
    document.title = lang === 'bg'
        ? (bodyTitleBg || 'Химколор — Инвестиция в сигурност')
        : (bodyTitleEn || 'Himcolor — Investment in Safety');

    document.querySelectorAll('.lang-bg').forEach(el => el.classList.toggle('active', lang === 'bg'));
    document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('active', lang === 'en'));
}

document.getElementById('langToggle')?.addEventListener('click', () => {
    applyLanguage(currentLang === 'bg' ? 'en' : 'bg');
});
document.getElementById('langToggleFooter')?.addEventListener('click', () => {
    applyLanguage(currentLang === 'bg' ? 'en' : 'bg');
});
applyLanguage(currentLang);


/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
function updateNavbar() {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();


/* ---- ACTIVE PAGE NAV (URL-based) ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const productPages = [
    'acrylna-boya.html',
    'studen-plastik.html',
    'shpric-plastik.html'
];
document.querySelectorAll('.nav-links .nav-item').forEach(item => {
    const mainLink = item.querySelector(':scope > a');
    if (!mainLink) return;
    const href = (mainLink.getAttribute('href') || '').split('#')[0];
    if (
        href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (href === 'prodykti.html' && productPages.includes(currentPage))
    ) {
        item.classList.add('active-page');
    }
});


/* ---- MOBILE HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile menu when a link is clicked (navigation will happen)
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        navLinks?.classList.remove('open');
        document.body.style.overflow = '';
    });
});


/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || '0';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---- GALLERY LIGHTBOX ---- */
const galleryItems = [...document.querySelectorAll('.g-item:not([aria-hidden="true"])')];
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lbImg');
let currentLbIndex = 0;

if (lbImg) lbImg.style.transition = 'opacity 0.18s ease';

function openLightbox(index) {
    if (!lightbox || !lbImg) return;
    currentLbIndex = index;
    lbImg.src = galleryItems[index].dataset.src || galleryItems[index].querySelector('img').src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
}
function moveLightbox(dir) {
    if (!galleryItems.length) return;
    currentLbIndex = (currentLbIndex + dir + galleryItems.length) % galleryItems.length;
    const src = galleryItems[currentLbIndex].dataset.src || galleryItems[currentLbIndex].querySelector('img').src;
    if (lbImg) {
        lbImg.style.opacity = '0';
        setTimeout(() => { lbImg.src = src; lbImg.style.opacity = '1'; }, 180);
    }
}

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => moveLightbox(-1));
document.getElementById('lbNext')?.addEventListener('click', () => moveLightbox(+1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });


/* ---- QUOTE FORM ---- */
const quoteForm   = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');

quoteForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    this.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) { field.classList.add('error'); valid = false; }
    });
    if (!valid) return;
    const btn = this.querySelector('.btn-submit');
    btn.disabled = true; btn.style.opacity = '0.7';
    setTimeout(() => {
        formSuccess?.classList.add('visible');
        quoteForm.reset();
        btn.disabled = false; btn.style.opacity = '1';
        formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        applyLanguage(currentLang);
    }, 800);
});
quoteForm?.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
});


/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ---- PRODUCT MODALS ---- */
function openProductModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeProductModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeProductModal(btn.dataset.closeModal));
});
document.querySelectorAll('.prod-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeProductModal(backdrop.id);
    });
});


/* ---- KEYBOARD ---- */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeLightbox();
        document.querySelectorAll('.prod-modal-backdrop.open').forEach(m => closeProductModal(m.id));
    }
    if (lightbox?.classList.contains('open')) {
        if (e.key === 'ArrowLeft')  moveLightbox(-1);
        if (e.key === 'ArrowRight') moveLightbox(+1);
    }
});


/* ---- SMOOTH ANCHOR SCROLL (in-page only) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
});


/* ---- LAZY MAP ---- */
function loadMap() {
    const placeholder = document.getElementById('mapPlaceholder');
    const container   = document.getElementById('mapContainer');
    if (!placeholder || !container) return;
    placeholder.remove();
    const iframe = document.createElement('iframe');
    iframe.title = 'Химколор — Местоположение';
    iframe.src   = 'https://maps.google.com/maps?q=%D0%B3%D1%80.+%D0%9F%D1%8A%D1%80%D0%B2%D0%BE%D0%BC%D0%B0%D0%B9,+%D1%83%D0%BB.+%D0%91%D1%83%D0%B7%D0%BB%D1%83%D0%B4%D0%B6%D0%B0+3&t=&z=16&ie=UTF8&iwloc=&output=embed';
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.allowFullscreen = true;
    container.appendChild(iframe);
}


/* ---- HERO VIDEO FALLBACK ---- */
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; });


/* ---- SCROLL TO ANCHOR ON PAGE LOAD (for cross-page links like prodykti.html#product-2) ---- */
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
            setTimeout(() => {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 24, behavior: 'smooth' });
            }, 100);
        }
    }
});
