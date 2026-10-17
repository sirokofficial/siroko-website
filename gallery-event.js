
// V52 fix: the archive page uses its own script, so hide the global loader here too.
function releaseArchiveLoader() {
  const loader = document.querySelector('#siteLoader');
  if (!loader) return;
  loader.classList.add('is-hidden');
  setTimeout(() => loader.remove(), 700);
}
window.addEventListener('load', () => setTimeout(releaseArchiveLoader, 250));
setTimeout(releaseArchiveLoader, 1200);

const archivePhotos = [
  "end-semester-01.jpg",
  "end-semester-02.jpg",
  "end-semester-03.jpg",
  "end-semester-04.jpg",
  "end-semester-05.jpg",
  "end-semester-06.jpg",
  "end-semester-07.jpg",
  "end-semester-08.jpg",
  "end-semester-09.jpg",
  "end-semester-10.jpg",
  "end-semester-11.jpg",
  "end-semester-12.jpg",
  "end-semester-13.jpg",
  "end-semester-14.jpg",
  "end-semester-15.jpg",
  "end-semester-16.jpg"
];

const srk001Photos = Array.from({ length: 20 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `assets/srk-001-recap/srk-001-recap-${number}.jpg`,
    label: `SRK-001 · ${number}`,
    download: `srk-001-recap-${number}.jpg`
  };
});

const srk002Photos = Array.from({ length: 20 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `assets/srk-002-recap/srk-002-recap-${number}.jpg`,
    label: `SRK-002 · ${number}`,
    download: `srk-002-recap-${number}.jpg`
  };
});

const events = {
  "founder-archives": {
    title: "End of Semester Party — Bacheloneta",
    subtitle: "Founder Archives",
    description: "Selected moments from previous Barcelona events by the team behind Siroko.",
    photos: archivePhotos.map((file, index) => ({
      src: `assets/founder-archives/${file}`,
      label: `Bacheloneta · ${String(index + 1).padStart(2, "0")}`,
      download: file
    }))
  },
  "srk-001": {
    title: "SRK-001: DEPARTURE",
    subtitle: "Sunset Boat Party",
    description: "A sunset boat party with Barcelona’s international crowd, real connections on deck, and the night ending strong at CDLC.",
    photos: srk001Photos
  },
  "srk-002": {
    title: "SRK-002: Student Social & Club Night",
    subtitle: "D9 Aribau · Twenties",
    description: "A packed student social at D9 that moved into Twenties for the after-club part of the night.",
    photos: srk002Photos
  },
  "srk-003": {
    title: "SRK-003: Halloween Party",
    subtitle: "Mambo Jambo",
    description: "Halloween archive coming after the event.",
    count: 12
  },
  "night-drops": {
    title: "SRK-001: DEPARTURE",
    subtitle: "Sunset Boat Party",
    description: "A sunset boat party with Barcelona’s international crowd, real connections on deck, and the night ending strong at CDLC.",
    photos: srk001Photos
  },
  "beach-games": {
    title: "SRK-002: Student Social & Club Night",
    subtitle: "D9 Aribau · Twenties",
    description: "A packed student social at D9 that moved into Twenties for the after-club part of the night.",
    photos: srk002Photos
  },
  "student-nights": { title: "SRK-003: Halloween Party", count: 12 },
  "after-dark": { title: "SRK-004", count: 8 },
  "community": { title: "Community", count: 9 }
};

const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event") || "srk-001";
const current = events[eventKey] || events["srk-001"];

const title = document.getElementById("galleryTitle");
const head = document.querySelector(".gallery-page-head > div");
title.textContent = current.title;
document.title = `${current.title} | Siroko Archives`;
document.getElementById("year").textContent = new Date().getFullYear();

if (current.subtitle || current.description) {
  const meta = document.createElement("p");
  meta.className = "gallery-event-description";
  meta.textContent = current.description || current.subtitle;
  head.appendChild(meta);
}

const grid = document.getElementById("photoGrid");

if (current.photos) {
  grid.classList.add("archive-photo-grid");
  current.photos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card has-photo";
    card.dataset.index = String(index);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Preview ${photo.label}`);
    card.innerHTML = `
      <img alt="${photo.label}" loading="lazy" src="${photo.src}">
      <div class="photo-overlay">
        <span>${photo.label}</span>
        <a class="download-photo" href="${photo.src}" download="${photo.download}" aria-label="Download ${photo.label}">Download ↓</a>
      </div>
    `;
    grid.appendChild(card);
  });
} else {
  for (let i = 1; i <= current.count; i += 1) {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `<span>${current.title} · ${String(i).padStart(2, "0")}</span>`;
    grid.appendChild(card);
  }
}


// V53: click-to-preview archive photos with previous/next controls.
if (current.photos) {
  let activePhotoIndex = 0;
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photo preview");
  lightbox.innerHTML = `
    <div class="lightbox-frame">
      <div class="lightbox-top">
        <div class="lightbox-title">
          <span id="lightboxLabel">Bacheloneta · 01</span>
          <span class="lightbox-count" id="lightboxCount">1 / ${current.photos.length}</span>
        </div>
        <div class="lightbox-controls">
          <button class="lightbox-btn" type="button" id="lightboxClose" aria-label="Close preview">×</button>
        </div>
      </div>
      <button class="lightbox-btn lightbox-arrow lightbox-prev" type="button" id="lightboxPrev" aria-label="Previous photo">‹</button>
      <img alt="" id="lightboxImage">
      <button class="lightbox-btn lightbox-arrow lightbox-next" type="button" id="lightboxNext" aria-label="Next photo">›</button>
      <a class="lightbox-download" id="lightboxDownload" href="#" download>Download ↓</a>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxLabel = document.getElementById("lightboxLabel");
  const lightboxCount = document.getElementById("lightboxCount");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const updateLightbox = () => {
    const photo = current.photos[activePhotoIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.label;
    lightboxLabel.textContent = photo.label;
    lightboxCount.textContent = `${activePhotoIndex + 1} / ${current.photos.length}`;
    lightboxDownload.href = photo.src;
    lightboxDownload.setAttribute("download", photo.download);
    lightboxDownload.dataset.src = photo.src;
    lightboxDownload.dataset.filename = photo.download;
  };

  const openLightbox = (index) => {
    activePhotoIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const showPrev = () => {
    activePhotoIndex = (activePhotoIndex - 1 + current.photos.length) % current.photos.length;
    updateLightbox();
  };

  const showNext = () => {
    activePhotoIndex = (activePhotoIndex + 1) % current.photos.length;
    updateLightbox();
  };

  document.querySelectorAll(".photo-card.has-photo").forEach((card) => {
    const openFromCard = () => openLightbox(Number(card.dataset.index || 0));
    card.addEventListener("click", (event) => {
      if (event.target.closest(".download-photo")) return;
      openFromCard();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFromCard();
      }
    });
  });

  document.querySelectorAll(".download-photo").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  lightboxDownload.addEventListener("click", (event) => {
    event.stopPropagation();
    lightboxDownload.href = lightboxDownload.dataset.src || lightboxDownload.href;
    lightboxDownload.setAttribute("download", lightboxDownload.dataset.filename || "siroko-photo.jpg");
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrev();
    if (event.key === "ArrowRight") showNext();
  });
}

const glow = document.getElementById("cursorGlow");
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * .12}px, ${y * .18}px)`;
  });
  button.addEventListener("pointerleave", () => button.style.transform = "");
});
