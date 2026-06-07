/* =====================================================
   DATI DEL PORTFOLIO
   Modifica questo array per aggiungere foto, video o PDF.

   type può essere:
   - "image"
   - "video"
   - "pdf"

   Metti i tuoi file dentro la cartella assets.
   Esempio:
   src: "assets/mia-foto.jpg"
   thumbnail: "assets/anteprima-mia-foto.jpg"
   ===================================================== */

const portfolioItems = [
  {
    type: "pdf",
    title: "Portfolio Un ultimo anno da raccontare ",
    description: "Portfolio scolastico che raccoglie i lavori migliori realizzati durante il mio ultimo anno",
    src: "assets/portfolio.pdf",
    thumbnail: "assets/thumb-portfolio1.webp",
    alt: "portfolio"
  },
  {
    type: "pdf",
    title: "Depliant Ed.Sentimentale",
    description: "Depliant dedicato all’importanza della comunicazione nei rapporti",
    src: "assets/depliant-francesca-catapane.pdf",
    thumbnail: "assets/thumb-depliant.webp",
    alt: "Anteprima del video presentazione"
  },
  {
    type: "video",
    title: "Sigla sul Neorealismo",
    description: "Video di montaggio dedicato al cinema neorealista italiano",
    src: "assets/sigla-neorealismo.mp4",
    thumbnail: "assets/thumb-neorealismo.webp",
    alt: "Anteprima del documento PDF"
  },
  {
    type: "pdf",
    title: "Portfolio Shooting Fotografico",
    description: "Portfolio fotografico che raccoglie una selezione di immagini realizzate durante uno shooting fotografico",
    src: "assets/portfolio-shooting-con-copertina.pdf",
    thumbnail: "assets/thumb-portfolio.webp",
    alt: "Anteprima del progetto visual 02"
  },
  {
    type: "video",
    title: "Video Shoa",
    description: "Video dedicato alla Shoah, realizzato attraverso immagini del percorso di visita al Memoriale di Firenze e l'intervista alla sopravvissuta Kitty Braun",
    src: "assets/shoa.mp4",
    thumbnail: "assets/thumb-memoriale.webp",
    alt: "Anteprima del design portfolio 03"
  },

  /* =====================================================
     ELEMENTI EXTRA
     Questi 20 elementi compaiono quando premi “Mostra altro”.
     Puoi cambiarli liberamente con foto, video o PDF veri.
     ===================================================== */
  {
    type: "pdf",
    title: "Articolo DCA",
    description: "Articolo informativo sui disturbi del comportamento alimentare",
    src: "assets/DCA.pdf",
    thumbnail: "assets/copertina-dca.webp",
    alt: "Anteprima progetto extra 04"
  },
  {
    type: "video",
    title: "Video Fiesole",
    description: "Video commemorativo dedicato ai Tre Martiri di Fiesole",
    src: "assets/fiesole.mp4",
    thumbnail: "assets/thumb-fiesole.webp",
    alt: "Anteprima progetto extra 05"
  },
  {
    type: "video",
    title: "Video sulla sensibilizzazione del Femminicidio",
    description: "Video di sensibilizzazione sul tema del femminicidio",
    src: "assets/femminicidio.mp4",
    thumbnail: "assets/thumb-ultimo-video.webp",
    alt: "Anteprima PDF extra 07"
  },
  {
    type: "pdf",
    title: "Locandina di Judo",
    description: "Locandina realizzata per pubblicizzare uno stage di judo con il Maestro Riccardo Caldarelli",
    src: "assets/locandina-stage-caldarelli.pdf",
    thumbnail: "assets/copertina-judo.webp",
    alt: "Anteprima PDF extra 07"
  },

];

/* =====================================================
   PRESENTAZIONE STAGE / ALTERNANZA
   Questa sezione usa una presentazione Google incorporata.

   COME MODIFICARLA:
   1. Apri Google Presentazioni
   2. Vai su File > Condividi > Pubblica sul web
   3. Scegli "Incorpora"
   4. Copia il link che trovi dentro src="..."
   5. Incollalo in embedUrl qui sotto

   openUrl invece è il link normale che vuoi aprire premendo
   il pulsante "Apri presentazione".

   IMPORTANTE:
   Per funzionare online, la presentazione deve essere pubblicata
   sul web o condivisa con permessi adatti.
   ===================================================== */

const stagePresentation = {
  type: "pdf",
  title: "STAGE",
  description: "Produzione audio visiva",
  src: "assets/stage.pdf",
  thumbnail: "assets/thumb-presentazione.jpeg",
  alt: "Anteprima presentazione stage"
};

const gallery = document.querySelector("#gallery");
const showMoreBtn = document.querySelector("#showMoreBtn");

// All'inizio mostro solo i primi 5 elementi: la riga da 2 + la riga da 3.
// Al click su “Mostra altro” vengono aggiunti gli altri 20 elementi.
const INITIAL_VISIBLE_ITEMS = 5;
let visibleItemsCount = INITIAL_VISIBLE_ITEMS;
const modal = document.querySelector("#modal");
const modalMedia = document.querySelector("#modalMedia");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modalDescription");
const modalType = document.querySelector("#modalType");
const modalExtraActions = document.querySelector("#modalExtraActions");
const closeModalBtn = document.querySelector("#closeModalBtn");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const prevModalBtn = document.querySelector("#prevModalBtn");
const nextModalBtn = document.querySelector("#nextModalBtn");
const stagePresentationCard = document.querySelector("#stagePresentationCard");
const stagePresentationThumb = document.querySelector("#stagePresentationThumb");
const stagePresentationTitle = document.querySelector("#stagePresentationTitle");
const stagePresentationDescription = document.querySelector("#stagePresentationDescription");

let currentMediaElement = null;
let lastFocusedElement = null;
let currentPortfolioIndex = -1;
let isPortfolioModal = false;

function getTypeLabel(type) {
  const labels = {
    image: "Foto",
    video: "Video",
    pdf: "PDF"
  };

  return labels[type] || "Elemento";
}

function getTypeIcon(type) {
  const icons = {
    image: "●",
    video: "▶",
    pdf: "▣"
  };

  return icons[type] || "●";
}

function setupStagePresentationCard() {
  if (!stagePresentationCard) return;

  if (stagePresentationThumb && stagePresentation.thumbnail && stagePresentation.thumbnail.trim() !== "") {
    stagePresentationThumb.src = stagePresentation.thumbnail;
    stagePresentationThumb.alt = stagePresentation.alt || stagePresentation.title;
  }

  if (stagePresentationTitle) {
    stagePresentationTitle.textContent = stagePresentation.title;
  }

  if (stagePresentationDescription) {
    stagePresentationDescription.textContent = stagePresentation.description;
  }

  stagePresentationCard.addEventListener("click", () => {
    openPresentationModal(stagePresentation);
  });
}

function openPresentationModal(item) {
  lastFocusedElement = document.activeElement;
  currentPortfolioIndex = -1;
  isPortfolioModal = false;
  updateModalNavigation();

  modalMedia.innerHTML = "";
  modalExtraActions.innerHTML = "";
  currentMediaElement = null;

  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalType.textContent = "PDF";

  if (item.src && item.src.trim() !== "") {
    const frame = document.createElement("iframe");
    frame.src = item.src;
    frame.title = item.title;
    currentMediaElement = frame;
    modalMedia.appendChild(frame);

    const openPdf = document.createElement("a");
    openPdf.href = item.src;
    openPdf.target = "_blank";
    openPdf.rel = "noopener";
    openPdf.className = "action-link";
    openPdf.textContent = "Apri PDF";

    const downloadPdf = document.createElement("a");
    downloadPdf.href = item.src;
    downloadPdf.download = "";
    downloadPdf.className = "action-link";
    downloadPdf.textContent = "Scarica PDF";

    modalExtraActions.append(openPdf, downloadPdf);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "google-slides-placeholder";
    placeholder.innerHTML = `
      <div class="google-slides-placeholder-card">
        ${item.thumbnail && item.thumbnail.trim() !== "" ? `<img src="${item.thumbnail}" alt="${item.alt || item.title}">` : ""}
        <div class="google-slides-placeholder-text">
          Inserisci il percorso del PDF nel file script.js, dentro <strong>stagePresentation.src</strong>.
        </div>
      </div>
    `;
    currentMediaElement = placeholder;
    modalMedia.appendChild(placeholder);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalBtn.focus();
}

function createGallery() {
  gallery.innerHTML = "";

  const visibleItems = portfolioItems.slice(0, visibleItemsCount);

  visibleItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.className = "card";

    // Gli elementi che appaiono dopo il click hanno una piccola animazione.
    if (index >= INITIAL_VISIBLE_ITEMS) {
      card.classList.add("is-new");
    }

    card.type = "button";
    card.setAttribute("aria-label", `Apri ${getTypeLabel(item.type)}: ${item.title}`);

    card.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.alt || item.title}" draggable="false">
      <span class="card-content">
        <span class="pill">${getTypeIcon(item.type)} ${getTypeLabel(item.type)}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </span>
    `;

    card.addEventListener("click", () => openModal(item, index));
    gallery.appendChild(card);
  });

  updateShowMoreButton();
}

function updateShowMoreButton() {
  if (!showMoreBtn) return;

  const remainingItems = portfolioItems.length - visibleItemsCount;

  if (remainingItems <= 0) {
    showMoreBtn.classList.add("is-hidden");
    return;
  }

  showMoreBtn.classList.remove("is-hidden");
  showMoreBtn.textContent = `Mostra altro (${remainingItems})`;
}

function showMoreItems() {
  visibleItemsCount = portfolioItems.length;
  createGallery();

  // Dopo aver mostrato gli elementi extra, porto leggermente lo sguardo verso i nuovi contenuti.
  const firstNewCard = gallery.children[INITIAL_VISIBLE_ITEMS];

  if (firstNewCard) {
    firstNewCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
}

function openModal(item, index = -1) {
  lastFocusedElement = document.activeElement;
  currentPortfolioIndex = index;
  isPortfolioModal = true;
  updateModalNavigation();

  modalMedia.innerHTML = "";
  modalExtraActions.innerHTML = "";
  currentMediaElement = null;

  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalType.textContent = getTypeLabel(item.type);

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.title;
    img.loading = "eager";
    currentMediaElement = img;
    modalMedia.appendChild(img);
  }

  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.poster = item.thumbnail;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    currentMediaElement = video;
    modalMedia.appendChild(video);
  }

  if (item.type === "pdf") {
    const frame = document.createElement("iframe");
    frame.src = item.src;
    frame.title = item.title;
    currentMediaElement = frame;
    modalMedia.appendChild(frame);

    const openPdf = document.createElement("a");
    openPdf.href = item.src;
    openPdf.target = "_blank";
    openPdf.rel = "noopener";
    openPdf.className = "action-link";
    openPdf.textContent = "Apri PDF";

    const downloadPdf = document.createElement("a");
    downloadPdf.href = item.src;
    downloadPdf.download = "";
    downloadPdf.className = "action-link";
    downloadPdf.textContent = "Scarica PDF";

    modalExtraActions.append(openPdf, downloadPdf);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalBtn.focus();
}

function closeModal() {
  const video = modalMedia.querySelector("video");

  if (video) {
    video.pause();
    video.currentTime = 0;
    video.removeAttribute("src");
    video.load();
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalMedia.innerHTML = "";
  modalExtraActions.innerHTML = "";
  currentMediaElement = null;
  currentPortfolioIndex = -1;
  isPortfolioModal = false;
  updateModalNavigation();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

async function openFullscreen() {
  const target = currentMediaElement || modalMedia;

  if (!target) return;

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch (error) {
    console.warn("Schermo intero non disponibile:", error);
  }
}

function getVisiblePortfolioItems() {
  return portfolioItems.slice(0, visibleItemsCount);
}

function updateModalNavigation() {
  if (!prevModalBtn || !nextModalBtn) return;

  const visibleItems = getVisiblePortfolioItems();
  const shouldShowNavigation =
    isPortfolioModal &&
    currentPortfolioIndex >= 0 &&
    visibleItems.length > 1;

  prevModalBtn.classList.toggle("is-hidden", !shouldShowNavigation);
  nextModalBtn.classList.toggle("is-hidden", !shouldShowNavigation);
}

function stopCurrentVideoIfNeeded() {
  const video = modalMedia.querySelector("video");

  if (video) {
    video.pause();
    video.currentTime = 0;
    video.removeAttribute("src");
    video.load();
  }
}

function goToPortfolioItem(direction) {
  if (!isPortfolioModal) return;

  const visibleItems = getVisiblePortfolioItems();
  if (visibleItems.length <= 1) return;

  stopCurrentVideoIfNeeded();

  currentPortfolioIndex =
    (currentPortfolioIndex + direction + visibleItems.length) % visibleItems.length;

  openModal(visibleItems[currentPortfolioIndex], currentPortfolioIndex);
}

function setupModalEvents() {
  closeModalBtn.addEventListener("click", closeModal);
  fullscreenBtn.addEventListener("click", openFullscreen);

  if (prevModalBtn && nextModalBtn) {
    prevModalBtn.addEventListener("click", () => goToPortfolioItem(-1));
    nextModalBtn.addEventListener("click", () => goToPortfolioItem(1));
  }

  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      goToPortfolioItem(-1);
    }

    if (event.key === "ArrowRight") {
      goToPortfolioItem(1);
    }

    // Piccola gestione del focus dentro la modal.
    if (event.key === "Tab") {
      const focusableElements = modal.querySelectorAll(
        'button, a, iframe, video, [tabindex]:not([tabindex="-1"])'
      );

      const focusable = Array.from(focusableElements)
        .filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

/* =====================================================
   DRAG SCROLL PER MOBILE / TRACKPAD / MOUSE
   Ti permette di trascinare la galleria quando è scrollabile.
   ===================================================== */

function setupDragScroll() {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  gallery.addEventListener("pointerdown", (event) => {
    isDown = true;
    hasDragged = false;
    gallery.classList.add("is-dragging");
    startX = event.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!isDown) return;

    const x = event.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.2;

    if (Math.abs(walk) > 8) {
      hasDragged = true;
    }

    gallery.scrollLeft = scrollLeft - walk;
  });

  gallery.addEventListener("pointerup", () => {
    isDown = false;
    gallery.classList.remove("is-dragging");
  });

  gallery.addEventListener("pointerleave", () => {
    isDown = false;
    gallery.classList.remove("is-dragging");
  });

  // Evita click accidentali quando stai trascinando.
  gallery.addEventListener("click", (event) => {
    if (hasDragged) {
      event.preventDefault();
      event.stopPropagation();
      hasDragged = false;
    }
  }, true);
}

if (showMoreBtn) {
  showMoreBtn.addEventListener("click", showMoreItems);
}

setupStagePresentationCard();
createGallery();
setupModalEvents();
setupDragScroll();
