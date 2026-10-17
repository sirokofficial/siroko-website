const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  $$('.main-nav a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

const glow = $('#cursorGlow');
if (glow) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

$$('.filter').forEach(button => {
  button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.event-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

$$('.tilt').forEach(card => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - .5) * -8;
    const rotateY = ((x / rect.width) - .5) * 8;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

$$('.magnetic').forEach(button => {
  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * .12}px, ${y * .18}px)`;
  });
  button.addEventListener('pointerleave', () => button.style.transform = '');
});

const modal = $('#membershipModal');
const modalTitle = $('#modalTitle');
const memberStatus = $('#memberStatus');
const closeMembership = $('.close-modal');
if (closeMembership && modal) {
  closeMembership.addEventListener('click', () => modal.close());
}

$$('button.mini-btn[data-event]').forEach(button => {
  button.addEventListener('click', () => {
    const eventName = button.dataset.event || 'Siroko event';
    localStorage.setItem('sirokoSelectedEvent', eventName);
    if (modal && modalTitle && memberStatus) {
      modalTitle.textContent = eventName;
      memberStatus.textContent = 'Leave your details and we will send you the link.';
      modal.showModal();
    }
  });
});

const openMembership = $('#openMembership');
if (openMembership && modal) {
  openMembership.addEventListener('click', () => {
    if (modalTitle) modalTitle.textContent = 'Join Siroko';
    if (memberStatus) memberStatus.textContent = '';
    modal.showModal();
  });
}

const membershipForm = $('#membershipForm');
if (membershipForm) {
  membershipForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = $('#saveMember');
    const formData = new FormData(membershipForm);
    formData.set('selectedEvent', localStorage.getItem('sirokoSelectedEvent') || 'Siroko Card waitlist');
    formData.set('createdAt', new Date().toISOString());

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    if (!name || !email) {
      if (memberStatus) memberStatus.textContent = 'Add at least your name and email.';
      return;
    }

    if (memberStatus) memberStatus.textContent = 'Sending...';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(membershipForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (memberStatus) memberStatus.textContent = 'Done. You are on the Siroko list.';
        membershipForm.reset();
        const memberSource = $('#memberSource');
        if (memberSource) memberSource.value = 'Siroko Card waitlist';
      } else {
        if (memberStatus) memberStatus.textContent = 'Something went wrong. Try again in a moment.';
      }
    } catch (error) {
      if (memberStatus) memberStatus.textContent = 'Connection issue. Try again in a moment.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formStatus = $('#formStatus');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    formData.set('createdAt', new Date().toISOString());
    formData.set('_subject', `Siroko contact - ${formData.get('reason') || 'Website message'}`);

    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const reason = (formData.get('reason') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !reason || !message) {
      if (formStatus) formStatus.textContent = 'Complete all fields before sending.';
      return;
    }

    if (formStatus) formStatus.textContent = 'Sending...';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (formStatus) formStatus.textContent = 'Message sent.';
        contactForm.reset();
      } else {
        if (formStatus) formStatus.textContent = 'Something went wrong. Try again in a moment.';
      }
    } catch (error) {
      if (formStatus) formStatus.textContent = 'Connection issue. Try again in a moment.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}


const collabForm = $('#collabForm');
if (collabForm) {
  collabForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(collabForm);
    const company = (formData.get('company') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const vision = (formData.get('vision') || '').toString().trim();
    const status = $('#collabStatus');
    const submitButton = collabForm.querySelector('button[type="submit"]');

    if (!company || !email || !vision) {
      if (status) status.textContent = 'Complete all fields before sending.';
      return;
    }

    formData.set('createdAt', new Date().toISOString());
    formData.set('_subject', `Siroko Collab Request - ${company}`);

    if (status) status.textContent = 'Sending...';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(collabForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (status) status.textContent = 'Message sent.';
        collabForm.reset();
      } else {
        if (status) status.textContent = 'Something went wrong. Try again.';
      }
    } catch (error) {
      if (status) status.textContent = 'Connection issue. Try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}


// V47 scroll reveal: subtle professional motion as sections and cards enter the viewport.
const revealTargets = $$('.section, .event-card, .gallery-tile, .sponsor-logo, .event-info-card, .faq-list details, .ambassador-copy, .ambassador-form, .countdown-card');
if ('IntersectionObserver' in window) {
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('in-view'));
}

// V48 countdown timers for SRK-001.
function updateCountdowns() {
  document.querySelectorAll('[data-countdown]').forEach((box) => {
    const target = new Date(box.dataset.countdown).getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const values = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
    Object.entries(values).forEach(([key, value]) => {
      const node = box.querySelector(`[data-${key}]`);
      if (node) node.textContent = value;
    });
  });
}
updateCountdowns();
setInterval(updateCountdowns, 1000);

// V76 ambassador applications submit directly through the website.
const ambassadorForm = document.querySelector('#ambassadorForm');
if (ambassadorForm) {
  ambassadorForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(ambassadorForm);
    const name = (formData.get('name') || '').toString().trim();
    const university = (formData.get('university') || '').toString().trim();
    const instagram = (formData.get('instagram') || '').toString().trim();
    const whatsapp = (formData.get('whatsapp') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const status = document.querySelector('#ambassadorStatus');
    const submitButton = ambassadorForm.querySelector('button[type="submit"]');

    if (!name || !university || !instagram || !whatsapp || !message) {
      if (status) status.textContent = 'Complete all fields before sending.';
      return;
    }

    formData.set('createdAt', new Date().toISOString());
    formData.set('_subject', `Siroko Ambassador Application - ${name}`);

    if (status) status.textContent = 'Sending...';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(ambassadorForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (status) status.textContent = 'Application sent.';
        ambassadorForm.reset();
      } else {
        if (status) status.textContent = 'Something went wrong. Try again.';
      }
    } catch (error) {
      if (status) status.textContent = 'Connection issue. Try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// V50 premium loader: quick cinematic chrome mark on page entry.
window.addEventListener('load', () => {
  const loader = document.querySelector('#siteLoader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('is-hidden'), 520);
  setTimeout(() => loader.remove(), 1500);
});
