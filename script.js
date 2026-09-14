const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

navMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navToggle?.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    header?.classList.remove("is-open");
  }
});

document.querySelectorAll("[data-intent]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-intent]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelector(".search-panel")?.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
});

const managementScroll = document.querySelector("[data-management-scroll]");
const managementPanels = [...document.querySelectorAll("[data-management-panel]")];

const syncManagementPanels = () => {
  if (!managementScroll || !managementPanels.length) return;

  if (window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    managementPanels.forEach((panel, index) => {
      panel.classList.toggle("is-active", index === 0);
      panel.classList.remove("is-before");
      panel.classList.remove("is-next");
    });
    return;
  }

  const start = managementScroll.getBoundingClientRect().top + window.scrollY;
  const distance = Math.max(managementScroll.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
  const steps = managementPanels.length - 1;
  const exactIndex = progress * steps;
  const activeIndex = Math.min(Math.floor(exactIndex), managementPanels.length - 1);
  const localProgress = activeIndex === steps ? 1 : exactIndex - activeIndex;
  const nextProgress = Math.min(Math.max((localProgress - 0.12) / 0.88, 0), 1);
  const isTransitioning = nextProgress > 0 && activeIndex < managementPanels.length - 1;

  managementPanels.forEach((panel, index) => {
    panel.style.setProperty("--management-progress", index === activeIndex + 1 ? nextProgress.toFixed(4) : index === activeIndex ? localProgress.toFixed(4) : "0");
    panel.classList.toggle("is-active", index === activeIndex);
    panel.classList.toggle("is-before", index < activeIndex);
    panel.classList.toggle("is-next", isTransitioning && index === activeIndex + 1);
  });
};

syncManagementPanels();
window.addEventListener("scroll", syncManagementPanels, { passive: true });
window.addEventListener("resize", syncManagementPanels);

document.querySelectorAll("[data-process-showcase]").forEach((showcase) => {
  const steps = [...showcase.querySelectorAll("[data-process-step]")];
  const cards = [...showcase.querySelectorAll("[data-process-card]")];
  const processGrid = showcase.querySelector(".process-showcase");
  const processTrack = showcase.querySelector(".process-track");
  const processPanel = showcase.querySelector(".process-panel");
  let processTimer;

  const syncPanelPosition = (step) => {
    if (!processGrid || !processTrack || !processPanel || window.innerWidth < 1024) return;

    const targetTop = step.offsetTop + step.offsetHeight / 2 - processPanel.offsetHeight / 2;
    processGrid.style.setProperty("--process-panel-top", `${targetTop}px`);
  };

  const activateStep = (step) => {
    if (!step) return;
    syncPanelPosition(step);
    if (step.classList.contains("is-active")) return;

    const nextIndex = Number(step.dataset.processIndex || 0);
    const activeCard = cards.find((card) => card.classList.contains("is-active"));
    const nextCard = cards[nextIndex];

    steps.forEach((item) => item.classList.toggle("is-active", item === step));

    if (!nextCard || activeCard === nextCard) return;

    window.clearTimeout(processTimer);
    cards.forEach((card) => {
      if (card !== activeCard) card.classList.remove("is-leaving");
    });
    activeCard?.classList.add("is-leaving");
    activeCard?.classList.remove("is-active");
    nextCard.classList.remove("is-leaving");
    nextCard.classList.add("is-active");

    processTimer = window.setTimeout(() => {
      activeCard?.classList.remove("is-leaving");
    }, 720);
  };

  steps.forEach((step) => {
    step.addEventListener("mouseenter", () => activateStep(step));
    step.addEventListener("focus", () => activateStep(step));
    step.addEventListener("click", () => activateStep(step));
  });

  const activeStep = steps.find((step) => step.classList.contains("is-active"));
  if (activeStep) syncPanelPosition(activeStep);

  window.addEventListener("resize", () => {
    const currentStep = steps.find((step) => step.classList.contains("is-active"));
    if (currentStep) syncPanelPosition(currentStep);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const portfolioSection = document.querySelector("#portfolio");
const portfolioStage = document.querySelector("[data-portfolio-stage]");
const portfolioCards = [...document.querySelectorAll(".portfolio-card")];

const syncPortfolioScroll = () => {
  if (!portfolioSection || !portfolioStage || !portfolioCards.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const start = portfolioStage.getBoundingClientRect().top + window.scrollY;
  const distance = Math.max(portfolioStage.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
  const steps = portfolioCards.length - 1;
  const exactIndex = progress * steps;
  const activeIndex = Math.min(Math.floor(exactIndex), steps);
  const nextIndex = Math.min(activeIndex + 1, steps);
  const localProgress = activeIndex === steps ? 1 : exactIndex - activeIndex;
  const bgProgress = activeIndex === steps ? 1 : Math.min(Math.max(localProgress / 0.28, 0), 1);
  const imageProgress = activeIndex === steps ? 1 : Math.min(Math.max((localProgress - 0.34) / 0.5, 0), 1);

  portfolioCards.forEach((card, index) => {
    const cardProgress = index === activeIndex ? localProgress : index === nextIndex ? imageProgress : 0;
    const cardBgProgress = index === activeIndex ? 1 : index === nextIndex ? bgProgress : 0;
    const cardImageProgress = index === activeIndex ? 1 : index === nextIndex ? imageProgress : 0;
    card.style.setProperty("--portfolio-progress", cardProgress.toFixed(4));
    card.style.setProperty("--portfolio-bg-progress", cardBgProgress.toFixed(4));
    card.style.setProperty("--portfolio-image-progress", cardImageProgress.toFixed(4));
    card.classList.toggle("is-active", index === activeIndex);
    card.classList.toggle("is-next", index === nextIndex && nextIndex !== activeIndex && bgProgress > 0);
    card.classList.toggle("is-bg-active", index === activeIndex);
  });
};

syncPortfolioScroll();
window.addEventListener("scroll", syncPortfolioScroll, { passive: true });
window.addEventListener("resize", syncPortfolioScroll);
