/**
 * P3K Care – script.js
 * Vanilla JavaScript: animations, nav, FAQ, modal, form, etc.
 */

/* ===========================================
   1. NAVBAR – scroll effect & active links
   =========================================== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger= document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const overlay  = document.getElementById('nav-overlay');
  const scrollTop= document.getElementById('scroll-top');

  // Scroll state
  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTop.classList.toggle('visible', y > 400);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  hamburger.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);

  function toggleMobileMenu() {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active link highlight based on scroll position
  function updateActiveLink() {
    const sections = ['beranda', 'materi', 'panduan', 'tips', 'faq', 'kontak'];
    const scrollY  = window.scrollY + 120;

    let current = 'beranda';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
})();

/* ===========================================
   2. SCROLL ANIMATIONS – Intersection Observer
   =========================================== */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.aosDelay || '0');
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ===========================================
   3. HERO STATS – Counter animation
   =========================================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count);
      animateCount(el, 0, end, 1200);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const pct  = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 4);
      el.textContent = Math.round(start + (end - start) * ease);
      if (pct < 1) requestAnimationFrame(update);
      else el.textContent = end;
    }
    requestAnimationFrame(update);
  }
})();

/* ===========================================
   4. FAQ – Accordion
   =========================================== */
function toggleFaq(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const answer = document.getElementById(btn.getAttribute('aria-controls'));

  // Close all open FAQs
  document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(q => {
    if (q !== btn) {
      q.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(q.getAttribute('aria-controls'));
      if (a) a.classList.remove('open');
    }
  });

  // Toggle current
  btn.setAttribute('aria-expanded', !isOpen);
  if (answer) answer.classList.toggle('open', !isOpen);
}

/* ===========================================
   5. MODAL – Materi detail
   =========================================== */
const modalData = {
  'luka-ringan': {
    title: '🩹 Penanganan Luka Ringan',
    intro: 'Luka ringan seperti goresan, sayatan kecil, atau lecet umumnya tidak memerlukan penanganan medis khusus. Namun penanganan yang tepat sangat penting untuk mencegah infeksi.',
    steps: [
      { num: 1, text: '<strong>Bersihkan tangan</strong> dengan sabun dan air, atau gunakan sarung tangan sekali pakai sebelum menyentuh luka.' },
      { num: 2, text: '<strong>Hentikan perdarahan</strong> dengan menekan lembut luka menggunakan kain bersih atau kasa steril selama 5–10 menit.' },
      { num: 3, text: '<strong>Bersihkan luka</strong> dengan air mengalir yang cukup deras selama beberapa menit untuk menghilangkan kotoran.' },
      { num: 4, text: '<strong>Oleskan antiseptik</strong> (betadine atau povidone iodine) secara tipis di sekitar luka.' },
      { num: 5, text: '<strong>Tutup luka</strong> dengan plester atau kain kasa steril. Ganti setiap hari atau jika basah/kotor.' },
      { num: 6, text: '<strong>Pantau tanda infeksi</strong>: kemerahan meluas, bengkak, nanah, atau demam. Segera ke dokter jika muncul.' },
    ],
    warning: '⚠️ Segera ke dokter jika luka dalam, tepi luka tidak bisa merapat, perdarahan tidak berhenti, atau ada benda asing yang tertancap.'
  },
  'luka-bakar': {
    title: '🔥 Penanganan Luka Bakar',
    intro: 'Luka bakar harus ditangani dengan cepat dan tepat. Kesalahan penanganan (misalnya menggunakan es batu atau odol) justru bisa memperparah kondisi.',
    steps: [
      { num: 1, text: '<strong>Jauhkan dari sumber panas</strong>. Pastikan area aman dan korban tidak lagi terkena sumber panas.' },
      { num: 2, text: '<strong>Aliri dengan air mengalir</strong> (20–25°C) selama minimal 10–20 menit. Jangan gunakan es batu.' },
      { num: 3, text: '<strong>Lepaskan pakaian/perhiasan</strong> secara hati-hati di area yang terbakar KECUALI jika menempel pada kulit.' },
      { num: 4, text: '<strong>Tutup luka</strong> dengan kain bersih yang tidak berbulu, atau perban non-perekat. Jangan pecahkan lepuhan.' },
      { num: 5, text: '<strong>JANGAN gunakan</strong>: odol, mentega, minyak, es batu, alkohol, atau tepung. Ini memperparah luka.' },
      { num: 6, text: '<strong>Berikan pereda nyeri</strong> jika diperlukan dan segera bawa ke fasilitas medis.' },
    ],
    warning: '🚨 Bawa segera ke UGD untuk: luka bakar derajat 2 yang luas (>5 cm), luka di wajah/tangan/kaki/sendi, dan semua luka bakar derajat 3.'
  },
  'patah-tulang': {
    title: '🦴 Penanganan Patah Tulang',
    intro: 'Patah tulang harus ditangani dengan mobilisasi yang tepat untuk mencegah kerusakan lebih lanjut pada jaringan sekitar dan memudahkan evakuasi korban.',
    steps: [
      { num: 1, text: '<strong>Jangan gerakkan</strong> bagian yang dicurigai patah. Imobilisasi sangat penting untuk mencegah cedera tambahan.' },
      { num: 2, text: '<strong>Hentikan perdarahan</strong> jika ada luka terbuka dengan menekan lembut menggunakan kain bersih.' },
      { num: 3, text: '<strong>Buat bidai darurat</strong> menggunakan bahan keras (kayu, karton tebal) yang dilapisi kain empuk.' },
      { num: 4, text: '<strong>Pasang bidai</strong> melewati dua sendi (atas dan bawah tulang yang patah) dan ikat dengan kain.' },
      { num: 5, text: '<strong>Periksa sirkulasi</strong>: pastikan ujung jari masih hangat, berwarna normal, dan bisa bergerak.' },
      { num: 6, text: '<strong>Hubungi 119</strong> atau segera bawa ke rumah sakit terdekat dengan posisi yang stabil.' },
    ],
    warning: '⚠️ Jangan coba meluruskan atau memasukkan kembali tulang yang patah. Biarkan posisi seperti apa adanya dan stabilkan dengan bidai.'
  },
  'pingsan': {
    title: '😵 Penanganan Pingsan',
    intro: 'Pingsan (sinkop) adalah hilangnya kesadaran sementara, sering disebabkan oleh aliran darah yang berkurang ke otak. Penanganan cepat sangat diperlukan.',
    steps: [
      { num: 1, text: '<strong>Pastikan keamanan area</strong>. Cegah korban dari jatuh atau terbentur benda keras.' },
      { num: 2, text: '<strong>Baringkan korban</strong> di permukaan datar dan angkat kaki setinggi 30–45 cm untuk melancarkan aliran darah ke otak.' },
      { num: 3, text: '<strong>Longgarkan pakaian</strong> yang ketat di sekitar leher, sabuk, atau kancing atas.' },
      { num: 4, text: '<strong>Pantau pernapasan</strong>. Jika tidak bernapas, mulai CPR dan hubungi 119 segera.' },
      { num: 5, text: '<strong>Jangan berikan makan/minum</strong> sampai korban benar-benar sadar penuh dan bisa menelan.' },
      { num: 6, text: '<strong>Jika sadar</strong>, bantu korban duduk perlahan dan tetap awasi selama beberapa menit.' },
    ],
    warning: '🚨 Hubungi 119 jika: pingsan lebih dari 1–2 menit, korban tidak sadar sepenuhnya, ada cedera kepala, riwayat penyakit jantung, atau pingsan terjadi berulang.'
  },
  'tersedak': {
    title: '😮 Penanganan Tersedak',
    intro: 'Tersedak terjadi ketika benda asing menyumbat saluran napas. Ini adalah kedaruratan medis yang memerlukan tindakan segera dalam hitungan detik.',
    steps: [
      { num: 1, text: '<strong>Tanya korban</strong>: "Kamu tersedak?" Jika masih bisa bicara/batuk, minta terus batuk dengan kuat.' },
      { num: 2, text: '<strong>Condongkan korban ke depan</strong> dan berikan 5 hentakan keras di punggung antara tulang belikat menggunakan telapak tangan.' },
      { num: 3, text: '<strong>Manuver Heimlich (dewasa)</strong>: berdiri di belakang korban, kepalkan tangan di atas perut (bawah tulang dada), tekan ke dalam dan ke atas 5 kali.' },
      { num: 4, text: '<strong>Ulangi siklus</strong> 5 hentakan punggung + 5 tekanan perut sampai benda keluar atau korban tidak sadar.' },
      { num: 5, text: '<strong>Jika korban tidak sadar</strong>, baringkan dan mulai CPR. Setiap kali membuka jalan napas, periksa benda asing di mulut.' },
      { num: 6, text: '<strong>Untuk bayi</strong> (< 1 tahun): 5 hentakan punggung + 5 tekanan dada (BUKAN perut). Panggil bantuan segera.' },
    ],
    warning: '🚨 Hubungi 119 segera jika korban tidak dapat berbicara, bernapas, atau batuk; atau jika teknik di atas tidak berhasil dalam beberapa siklus.'
  },
};

function openModal(id) {
  const data = modalData[id];
  if (!data) return;

  const content = document.getElementById('modal-content');
  const overlay = document.getElementById('modal-overlay');

  content.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.intro}</p>
    <h3>Langkah-langkah:</h3>
    ${data.steps.map(s => `
      <div class="modal-step">
        <div class="modal-step-num">${s.num}</div>
        <div class="modal-step-text">${s.text}</div>
      </div>
    `).join('')}
    <div style="margin-top:20px; padding:16px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:12px; font-size:14px; color:#fca5a5; line-height:1.6;">
      ${data.warning}
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Trap focus
  setTimeout(() => document.getElementById('modal-close').focus(), 100);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ===========================================
   6. CONTACT FORM – Validation & submission
   =========================================== */
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = document.getElementById('btn-kirim-pesan');
  const success = document.getElementById('form-success');

  const nama  = form.nama.value.trim();
  const email = form.email.value.trim();
  const pesan = form.pesan.value.trim();

  if (!nama || !email || !pesan) {
    shakeInvalidInputs(form);
    return;
  }
  if (!validateEmail(email)) {
    showInputError(form.email);
    return;
  }

  // Simulate sending
  btn.disabled = true;
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation:spin 1s linear infinite">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
    Mengirim...
  `;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Kirim Pesan
    `;
    success.classList.add('visible');
    form.reset();

    // Hide success after 5 seconds
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1800);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInvalidInputs(form) {
  ['nama', 'email', 'pesan'].forEach(name => {
    const input = form[name];
    if (!input.value.trim()) showInputError(input);
  });
}

function showInputError(input) {
  input.style.borderColor = '#ef4444';
  input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.2)';
  input.style.animation   = 'shake 0.4s ease';
  setTimeout(() => { input.style.animation = ''; }, 400);
}

// Add shake and spin keyframes dynamically
(function addKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();

/* ===========================================
   7. PARALLAX – Hero floating elements
   =========================================== */
(function initParallax() {
  const floatIcons = document.querySelectorAll('.float-icon');
  const blobs      = document.querySelectorAll('.blob');

  let ticking = false;
  window.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;

      floatIcons.forEach((icon, i) => {
        const depth = (i % 3 + 1) * 6;
        icon.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
      });

      blobs.forEach((blob, i) => {
        const depth = (i + 1) * 10;
        blob.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
      });

      ticking = false;
    });
  });
})();

/* ===========================================
   8. SMOOTH SCROLLING – for all anchor links
   =========================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===========================================
   9. TIP CARDS – Enhanced hover with 3D tilt
   =========================================== */
(function initTiltCards() {
  document.querySelectorAll('.tip-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const xRel   = (e.clientX - rect.left) / rect.width  - 0.5;
      const yRel   = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-12px) scale(1.02)
        rotateX(${-yRel * 8}deg)
        rotateY(${xRel  * 8}deg)
      `;
      card.style.animationPlayState = 'paused';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.animationPlayState = '';
    });
  });
})();

/* ===========================================
   10. MATERI CARDS – 3D tilt
   =========================================== */
(function initCardTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width  - 0.5;
      const yRel = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px) scale(1.01)
        rotateX(${-yRel * 6}deg)
        rotateY(${xRel  * 6}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
