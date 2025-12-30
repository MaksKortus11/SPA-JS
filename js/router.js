let pageUrls = {
  about: 'index.html?about',
  contact: 'index.html?contact',
  gallery: 'index.html?gallery'
};

function OnStartUp() {
  popStateHandler();
}

OnStartUp();

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
      <div class="g-recaptcha" data-sitekey="6LeMGTssAAAAAPFAtthjL30L2tL3XU2QeTR4WAq0"></div>

      <button type="submit">Send</button>
    </form>

    if (typeof grecaptcha !== "undefined") {
    grecaptcha.render(document.querySelector(".g-recaptcha"));
}

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



function loadGalleryImages() {
  const gallery = document.getElementById('gallery');

  const imageUrls = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg',
    'images/9.jpg'
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


  document.title = 'SPA PIAC TEST';
}

window.onpopstate = popStateHandler;


document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});






