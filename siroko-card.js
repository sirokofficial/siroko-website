(() => {
  const form = document.getElementById('cardForm');
  if (!form) return;

  const status = document.getElementById('cardStatus');
  const submit = document.getElementById('cardSubmit');
  const result = document.getElementById('cardResult');
  const walletLink = document.getElementById('walletLink');

  const grid = document.getElementById('perksGrid');
  if (grid) {
    fetch('partners.json')
      .then(r => r.json())
      .then(partners => {
        grid.innerHTML = '';
        partners.forEach(p => {
          const card = document.createElement('article');
          card.className = 'perk-card glass';
          const type = document.createElement('p');
          type.className = 'eyebrow';
          type.textContent = p.type;
          const title = document.createElement('h3');
          title.textContent = p.name;
          const perk = document.createElement('p');
          perk.textContent = p.perk;
          card.append(type, title, perk);
          grid.append(card);
        });
      })
      .catch(() => { grid.textContent = 'Partners coming soon.'; });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = 'Add your name and a valid email.';
      return;
    }

    status.textContent = 'Creating your card...';
    submit.disabled = true;
    try {
      const response = await fetch('/api/issue-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        status.textContent = data.message || 'Something went wrong. Try again in a moment.';
        return;
      }
      document.getElementById('cardPreviewName').textContent = name;
      document.getElementById('cardPreviewNumber').textContent = data.memberNumber;
      walletLink.href = data.walletUrl;
      result.hidden = false;
      form.hidden = true;
    } catch (error) {
      status.textContent = 'Connection issue. Try again in a moment.';
    } finally {
      submit.disabled = false;
    }
  });
})();
