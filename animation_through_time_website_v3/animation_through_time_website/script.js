const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(opened));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

// Clickable timeline: each milestone updates its own image, title, and explanation.
const milestones = [
  { year: 'EARLY IDEAS', title: 'Optical toys create movement', text: 'The thaumatrope, zoetrope, praxinoscope, and flipbook showed how separate still images could appear to move when viewed in sequence.', fact: 'These experiments helped establish the basic principles that later animators would build on.', image: 'assets/milestones/optical-toys.svg', alt: 'Illustration of optical animation toys' },
  { year: '1908–1914', title: 'Animation begins telling stories', text: 'Émile Cohl created Fantasmagorie in 1908, one of the first fully animated films. In 1914, Winsor McCay presented Gertie the Dinosaur, showing how an animated character could hold an audience’s attention.', fact: 'Animation became more than an optical experiment: it could tell stories and entertain audiences.', image: 'assets/milestones/early-films.svg', alt: 'Illustration of a vintage film strip and animation drawings' },
  { year: '1920s–1960s', title: 'The Golden Age expands the audience', text: 'Animation became more popular as studios developed recognizable characters and productions. Steamboat Willie (1928) helped popularize synchronized sound, and color added new expressive possibilities.', fact: 'Sound, color, studios, and feature films helped establish animation as a major form of entertainment.', image: 'assets/milestones/golden-age.svg', alt: 'Illustration inspired by classic cinema and film reels' },
  { year: 'LATE 20TH CENTURY', title: 'Digital tools transform production', text: 'Computers changed how artists created, edited, and combined images. CGI and digital 2D and 3D techniques expanded the ways animation could be produced.', fact: 'Digital workflows opened new production possibilities and became an important part of modern animation.', image: 'assets/milestones/digital-revolution.svg', alt: 'Illustration of a digital wireframe cube' },
  { year: 'TODAY & BEYOND', title: 'Animation becomes interactive', text: 'Streaming distributes animated stories to global audiences. Motion capture, AI, virtual reality, augmented reality, and real-time rendering continue to change how animation is created and experienced.', fact: 'Animation now appears across films, television, games, advertising, and immersive experiences.', image: 'assets/milestones/interactive-worlds.svg', alt: 'Illustration of an immersive digital world' }
];
const milestoneButtons = [...document.querySelectorAll('.milestone')];
function showMilestone(index) {
  const item = milestones[index];
  if (!item) return;
  milestoneButtons.forEach((button, i) => {
    const active = i === index;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.setAttribute('tabindex', active ? '0' : '-1');
  });
  document.getElementById('detail-kicker').textContent = item.year;
  document.getElementById('detail-title').textContent = item.title;
  document.getElementById('detail-text').textContent = item.text;
  document.getElementById('detail-fact').textContent = item.fact;
  const image = document.getElementById('milestone-img');
  image.src = item.image;
  image.alt = item.alt;
}
milestoneButtons.forEach((button, index) => {
  button.addEventListener('click', () => showMilestone(index));
  button.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % milestoneButtons.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + milestoneButtons.length) % milestoneButtons.length;
    else return;
    event.preventDefault();
    showMilestone(next);
    milestoneButtons[next].focus();
  });
});

// Sketchfab supports different link formats; accept a model page URL or an embed URL.
function toEmbedUrl(raw) {
  let url;
  try { url = new URL(raw.trim()); } catch { return null; }
  const host = url.hostname.toLowerCase();
  if (!['sketchfab.com', 'www.sketchfab.com', 'skfb.ly'].includes(host)) return null;
  if (url.pathname.includes('/embed')) return url.href;
  const match = url.pathname.match(/(?:3d-models|models)\/(?:[^/]*-)?([a-f0-9]{32})(?:\/|$)/i);
  const uid = match ? match[1] : null;
  return uid ? `https://sketchfab.com/models/${uid}/embed` : null;
}

// Default gallery: these six models are saved in the project and load automatically.
// To replace one later, edit the matching name and URL in this list.
const defaultModels = [
  { name: 'Spartan Armour — Halo Reach', url: 'https://sketchfab.com/3d-models/spartan-armour-mkv-halo-reach-57070b2fd9ff472c8988e76d8c5cbe66' },
  { name: 'Praxinoscope', url: 'https://sketchfab.com/3d-models/praxinoscope-phenakistiscope-zoetrope-11953d647489417b945811bfd94956e5' },
  { name: '3D Zoetrope — Penguins Walk', url: 'https://sketchfab.com/3d-models/3d-zoetrope-penguins-walk-b487e67365b641728e027f378cf81a47' },
  { name: 'Flipbook', url: 'https://sketchfab.com/3d-models/sketchfab-flipbook-t1-25c2a1ab4cd945878c199023f4f1e730' },
  { name: 'Snow Globe', url: 'https://sketchfab.com/3d-models/snow-globe-026d3beaa8444b969ecaa9bf75e3fab9' },
  { name: 'Linhi Character', url: 'https://sketchfab.com/3d-models/linhi-character-preview-3e3ea18a5e4c4e609eae767aa08e36db' }
];

document.querySelectorAll('.model-panel').forEach(panel => {
  const nameInput = panel.querySelector('.model-name');
  const urlInput = panel.querySelector('.model-url');
  const button = panel.querySelector('.load-model');
  const frame = panel.querySelector('iframe');
  const placeholder = panel.querySelector('.model-placeholder');
  const message = panel.querySelector('.model-message');
  const state = panel.querySelector('.model-state');
  const title = panel.querySelector('.model-name-display');
  nameInput.addEventListener('input', () => {
    if (title) title.textContent = nameInput.value.trim() || 'Your 3D model goes here';
    else {
      const placeholderTitle = placeholder.querySelector('strong');
      if (placeholderTitle && nameInput.value.trim()) placeholderTitle.textContent = nameInput.value.trim();
    }
  });
  function loadModel() {
    const raw = urlInput.value.trim();
    if (!raw) { message.textContent = 'Paste a Sketchfab model link first.'; return; }
    const embed = toEmbedUrl(raw);
    if (!embed) { message.textContent = 'This link could not be converted. On Sketchfab, choose Share → Embed and paste the full embed URL.'; return; }
    frame.src = embed;
    frame.hidden = false;
    placeholder.hidden = true;
    if (state) state.textContent = 'MODEL LOADED';
    if (title) title.textContent = nameInput.value.trim() || 'Featured 3D model';
    message.textContent = 'Model added. If the viewer stays blank, its creator may have disabled embedding.';
    message.classList.add('ok');
  }
  button.addEventListener('click', loadModel);
  urlInput.addEventListener('keydown', event => { if (event.key === 'Enter') loadModel(); });

  const modelIndex = Number(panel.dataset.slot);
  const savedModel = defaultModels[modelIndex];
  if (savedModel) {
    nameInput.value = savedModel.name;
    urlInput.value = savedModel.url;
    if (title) title.textContent = savedModel.name;
    else {
      const placeholderTitle = placeholder.querySelector('strong');
      if (placeholderTitle) placeholderTitle.textContent = savedModel.name;
    }
    loadModel();
  }
});

// Hide initials fallback when a portrait loads; retain it if the remote image is unavailable.
document.querySelectorAll('.person-photo img').forEach(img => {
  const wrapper = img.closest('.person-photo');
  img.addEventListener('load', () => wrapper.classList.add('has-image'));
  img.addEventListener('error', () => wrapper.classList.remove('has-image'));
});
