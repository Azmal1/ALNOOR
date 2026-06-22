// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) {
    cursor.style.left = mx - 5 + 'px';
    cursor.style.top = my - 5 + 'px';
  }
});
function animateRing() {
  rx += (mx - rx - 18) * 0.15;
  ry += (my - ry - 18) * 0.15;
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Event Delegation for cursor to support dynamically injected header/footer
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, .course-card, .notice-small, .pillar, .gallery-item')) {
    if (cursor) cursor.style.transform = 'scale(2)';
    if (ring) { ring.style.transform = 'scale(1.5)'; ring.style.opacity = '0.3'; }
  }
});
document.addEventListener('mouseout', e => {
  const target = e.target.closest('a, button, .course-card, .notice-small, .pillar, .gallery-item');
  const related = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('a, button, .course-card, .notice-small, .pillar, .gallery-item') : null;
  if (target && target !== related) {
    if (cursor) cursor.style.transform = 'scale(1)';
    if (ring) { ring.style.transform = 'scale(1)'; ring.style.opacity = '0.6'; }
  }
});

// ===== NAVBAR =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const isHome = document.getElementById('home'); // Checks if we are on the homepage
  if (navbar) {
    // Keep navbar solid on inner pages, or if scrolled past 60px on the homepage
    if (!isHome || window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

function toggleMenu() {
  const menu = document.getElementById('mobile-nav');
  const ham = document.getElementById('hamburger');
  if (menu && ham) {
    menu.classList.toggle('open');
    ham.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}
function closeMenu() {
  const menu = document.getElementById('mobile-nav');
  const ham = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (ham) ham.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== HERO CANVAS PARTICLES =====
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      a: Math.random()
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,151,58,${p.a * 0.4})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if (reveals.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ===== GALLERY =====
const grid = document.getElementById('gallery-grid');
if (grid) {
  const galleryData = [
    { alt: "Students in class", emoji: "📚", color: "#0d3d25" },
    { alt: "Prayer hall", emoji: "🕌", color: "#166534" },
    { alt: "Library", emoji: "📖", color: "#1a5276" },
    { alt: "Campus garden", emoji: "🌳", color: "#145a32" },
    { alt: "Graduation", emoji: "🎓", color: "#4a235a" },
    { alt: "Sports day", emoji: "⚽", color: "#1a4a6b" },
    { alt: "Hostel life", emoji: "🏠", color: "#2e4057" },
    { alt: "Community iftar", emoji: "🌙", color: "#1b2631" }
  ];
  const images = ["img/a4.webp", "img/m2.jpeg", "img/a17.webp", "img/a1.webp", "img/a12.webp", "img/a14.webp", "img/a18.webp", "img/a2.webp"];
  galleryData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <div class="gallery-placeholder" style="background: linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)">
        <div class="gallery-placeholder-icon">${item.emoji}</div>
      </div>
      <div class="gallery-item-overlay"><span class="gallery-item-label">${item.alt}</span></div>
    `;
    div.onclick = () => openLightbox(images[i], item.alt);
    grid.appendChild(div);
    const img = new Image();
    img.onload = () => {
      div.innerHTML = `<img src="${img.src}" alt="${item.alt}"><div class="gallery-item-overlay"><span class="gallery-item-label">${item.alt}</span></div>`;
      div.onclick = () => openLightbox(img.src, item.alt);
    };
    img.src = images[i];
  });
}

function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (lb && img) {
    img.src = src; img.alt = alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeLightbox(e) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (!e || e.target.id === 'lightbox' || e.currentTarget.classList.contains('lightbox-close')) {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===== FORM SUBMIT =====
function handleSubmit(e, wrapId) {
  e.preventDefault();
  const wrap = document.getElementById(wrapId);
  if (wrap) {
    const isDark = wrapId === 'contact-form-wrap';
    wrap.innerHTML = `
      <div class="success-state">
        <span class="success-icon">✓</span>
        <div class="success-title" style="color:${isDark?'white':'var(--text-dark)'}">JazakAllah Khair!</div>
        <p class="success-sub" style="color:${isDark?'rgba(255,255,255,0.6)':'var(--text-mid)'}">Your ${wrapId.includes('admission') ? 'application' : 'message'} has been received.<br>We will get back to you shortly, InshaAllah.</p>
        <button onclick="location.reload()" style="margin-top:24px;padding:12px 28px;background:${isDark?'var(--gold)':'var(--forest)'};color:${isDark?'var(--forest)':'white'};border:none;border-radius:12px;cursor:pointer;font-size:0.9rem">Back to Website</button>
      </div>
    `;
  }
}

// ===== SMOOTH SCROLL =====
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    e.preventDefault();
    const targetId = a.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// ===== GALLERY PAGE (gallery.html) =====
function filterCategory(category) {
  const items = document.querySelectorAll('#galleryContainer .gallery-item');
  
  items.forEach(item => {
    if (category === 'all') {
      item.style.display = 'block';
    } else {
      item.style.display = item.getAttribute('data-category') === category ? 'block' : 'none';
    }
  });

  // Active button styling
  document.querySelectorAll('.filter-btn').forEach(btn => {
    // Reset all buttons to inactive state
    btn.classList.remove('bg-teal-700', 'text-white', 'hover:bg-teal-800');
    btn.classList.add('bg-white/70', 'text-gray-800', 'hover:bg-white', 'glass-card');
    
    // Apply active state to the selected button
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.remove('bg-white/70', 'text-gray-800', 'hover:bg-white', 'glass-card');
      btn.classList.add('bg-teal-700', 'text-white', 'hover:bg-teal-800');
    }
  });
}

// Lightbox Functionality for Gallery Page
let currentImages = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Check if we are on the page with custom-lightbox to avoid conflicts
  if (document.getElementById('custom-lightbox')) {
    const galleryItems = document.querySelectorAll('#galleryContainer .gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openGalleryLightbox(img.src);
      });
    });
  }
});

function openGalleryLightbox(src) {
  const visibleItems = Array.from(document.querySelectorAll('#galleryContainer .gallery-item')).filter(item => item.style.display !== 'none');
  currentImages = visibleItems.map(item => item.querySelector('img').src);
  currentIndex = currentImages.indexOf(src);

  const lightbox = document.getElementById('custom-lightbox');
  const lightboxImg = document.getElementById('custom-lightbox-img');
  
  lightboxImg.src = src;
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
  
  setTimeout(() => {
    lightbox.classList.remove('opacity-0');
    lightboxImg.classList.remove('scale-95');
    lightboxImg.classList.add('scale-100');
  }, 10);
  
  document.body.style.overflow = 'hidden';
  updateArrowVisibility();
}

function closeGalleryLightbox() {
  const lightbox = document.getElementById('custom-lightbox');
  const lightboxImg = document.getElementById('custom-lightbox-img');
  
  lightbox.classList.add('opacity-0');
  lightboxImg.classList.remove('scale-100');
  lightboxImg.classList.add('scale-95');
  
  setTimeout(() => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }, 300);
}

function prevImage() {
  if (currentImages.length <= 1) return;
  if (currentIndex > 0) { currentIndex--; } 
  else { currentIndex = currentImages.length - 1; }
  updateLightboxImage();
}

function nextImage() {
  if (currentImages.length <= 1) return;
  if (currentIndex < currentImages.length - 1) { currentIndex++; } 
  else { currentIndex = 0; }
  updateLightboxImage();
}

function updateLightboxImage() {
  const lightboxImg = document.getElementById('custom-lightbox-img');
  lightboxImg.style.opacity = 0.4;
  setTimeout(() => {
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.style.opacity = 1;
    updateArrowVisibility();
  }, 150);
}

function updateArrowVisibility() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  
  if (currentImages.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';
  }
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('custom-lightbox');
  if (lightbox && !lightbox.classList.contains('hidden')) {
    if (e.key === 'Escape') closeGalleryLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }
});
