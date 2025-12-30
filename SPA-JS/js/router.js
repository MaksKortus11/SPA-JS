let pageUrls = {
  about: 'index.html?about',
  contact: 'index.html?contact'
};

function OnStartUp() {
  popStateHandler();
}

OnStartUp();

/* --- Obsługa kliknięć w menu --- */

document.querySelector('#about-link').addEventListener('click', () => {
  let stateObj = { page: 'about' };
  document.title = 'About';
  history.pushState(stateObj, "about", "index.html?about");
  RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', () => {
  let stateObj = { page: 'contact' };
  document.title = 'Contact';
  history.pushState(stateObj, "contact", "index.html?contact");
  RenderContactPage();
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

      <button type="submit">Send</button>
    </form>`;

  document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Form submitted!');
  });
}

/* --- Obsługa przycisków wstecz/dalej --- */

function popStateHandler() {
  const query = window.location.search;

  if (query === '?about') {
    RenderAboutPage();
  }

  if (query === '?contact') {
    RenderContactPage();
  }
}

window.onpopstate = popStateHandler;

/* --- Przełączanie motywu --- */

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
