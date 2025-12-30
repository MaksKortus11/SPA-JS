let pageUrls = {
  about: 'index.html?about',
  contact: 'index.html?contact',
  gallery: 'index.html?gallery'
};

function OnStartUp() {
  popStateHandler();
}

OnStartUp();

/* --- Obsługa kliknięć w menu --- */

document.querySelector('#about-link').addEventListener('click', () => {
  document.title = 'About';
  history.pushState({ page: 'about' }, 'about', 'index.html?about');
  RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', () => {
  document.title = 'Contact';
  history.pushState({ page: 'contact' }, 'contact', 'index.html?contact');
  RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', () => {
  document.title = 'Gallery';
  history.pushState({ page: 'gallery' }, 'gallery', 'index.html?gallery');
  RenderGalleryPage();
});

/* --- Funkcje renderujące podstrony --- */

function RenderAboutPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">Contact with me</h1>

    <form id="contact-form">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="message">Message:</label>
      <textarea id="message" name="message" required></textarea>

      <!-- reCAPTCHA (wymaga własnego site key) -->
      <div class="g-recaptcha" data-sitekey="TWOJ_SITE_KEY"></div>

      <button type="submit">Send</button>
    </form>
  `;

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let message = document.getElementById('message').value.trim();

    if (name.length < 2) {
      alert('Name is too short');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Invalid email');
      return;
    }

    if (message.length < 5) {
      alert('Message is too short');
      return;
    }

    // reCAPTCHA – żeby działało, musisz:
    // 1. odkomentować <script> w index.html
    // 2. podmienić TWOJ_SITE_KEY na prawdziwy
    if (typeof grecaptcha !== 'undefined') {
      let captcha = grecaptcha.getResponse();
      if (!captcha) {
        alert('Please confirm reCAPTCHA');
        return;
      }
    }

    alert('Form submitted!');
  });
}

function RenderGalleryPage() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">Gallery</h1>
    <div class="gallery-grid" id="gallery"></div>

    <div class="modal" id="modal">
      <div class="modal-content">
        <span class="close-btn" id="close-modal">×</span>
        <img id="modal-img" src="">
      </div>
    </div>
  `;

  loadGalleryImages();
  setupModal();
}

/* --- Ładowanie obrazów jako BLOB + lazy loading --- */

function loadGalleryImages() {
  const gallery = document.getElementById('gallery');

  const imageUrls = [
    'https://posterjack.com/cdn/shop/articles/landscape_photography_tips_featured_image_455x455_da573899-5e4d-4cac-9e77-269882a1dcdd.jpg?v=1563421852&width=2048',
    'https://media.istockphoto.com/id/870755932/photo/fairytale-landscape.jpg?s=612x612&w=0&k=20&c=lXgBCFZL5oCFjSMQQOhg3T-Pir3KOtHczhZfcUnrXuQ=',
    'https://thumbs.dreamstime.com/b/summer-landscape-8622804.jpg',
    'https://www.nps.gov/common/uploads/cropped_image/secondary/FAB0F317-9673-A7A2-8078F4B600A52F6F.jpg?width=640&quality=90&mode=crop',
    'https://img.freepik.com/premium-photo/majestic-mountain-lake-national-park-high-tatra-strbske-pleso_146671-12978.jpg?semt=ais_hybrid&w=740&q=80',
    'https://cdn.mos.cms.futurecdn.net/hEmhHEPGTKkygpAbAjejs.jpg',
    'https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2021/12/Landscape-Cover.jpg?w=435&h=435&crop=1',
    'https://images.stockcake.com/public/5/2/d/52d994a6-a707-4a61-8934-a18e3f5e530c_large/winter-mountain-landscape-stockcake.jpg',
    'https://images.iphonephotographyschool.com/3734/1120/landscape-photography-2000.jpg'
  ];

  imageUrls.forEach(url => {
    let img = document.createElement('img');
    img.classList.add('gallery-item');
    img.dataset.src = url; // do lazy loadingu
    gallery.appendChild(img);
  });

  lazyLoadImages();
}

function lazyLoadImages() {
  const images = document.querySelectorAll('.gallery-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let img = entry.target;

        fetch(img.dataset.src)
          .then(res => res.blob())
          .then(blob => {
            img.src = URL.createObjectURL(blob);
          });

        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

/* --- Modal --- */

function setupModal() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('close-modal');

  document.querySelectorAll('.gallery-item').forEach(img => {
    img.addEventListener('click', () => {
      if (!img.src) return; // jeszcze nie załadowane
      modal.classList.add('active');
      modalImg.src = img.src;
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --- Obsługa przycisków wstecz/dalej --- */

function popStateHandler() {
  const query = window.location.search;

  if (query === '?about') {
    document.title = 'About';
    RenderAboutPage();
    return;
  }

  if (query === '?contact') {
    document.title = 'Contact';
    RenderContactPage();
    return;
  }

  if (query === '?gallery') {
    document.title = 'Gallery';
    RenderGalleryPage();
    return;
  }

  // domyślnie strona startowa
  document.title = 'SPA PIAC TEST';
}

window.onpopstate = popStateHandler;

/* --- Przełączanie motywu --- */

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

