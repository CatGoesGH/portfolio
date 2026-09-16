const projects = window.portfolioProjects;

const grid = document.querySelector("#project-grid");
const count = document.querySelector("#project-count");
const filters = [...document.querySelectorAll(".filter")];
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector(".dialog-close");

const total = String(projects.length).padStart(2, "0");

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function logoImg(project) {
  if (!project.logo) return "";
  return `<img class="card-logo" src="${project.logo.src}" alt="${escapeAttr(project.logo.alt)}" loading="lazy" />`;
}

const visualMarkup = {
  spotifind: () => `
    <div class="spotifind-type">Find your perfect <span>study spot.</span></div>
    <div class="spotifind-map" aria-hidden="true"></div>`,
  uwcube: (project) => `
    <div class="cube-grid" aria-hidden="true">${Array.from({ length: 30 }, () => "<span></span>").join("")}</div>
    ${logoImg(project)}`,
  cooking: (project) => `
    <div class="cooking-plate" aria-hidden="true"><span></span><span></span><span></span></div>
    <p class="cooking-tag" aria-hidden="true">Class recap</p>
    ${logoImg(project)}`,
  kdance: (project) => logoImg(project),
  ldhr: (project) => `
    <div class="ldhr-graphic" aria-hidden="true"><span></span><span></span><span></span></div>
    ${logoImg(project)}`,
  inthedoor: (project) => `
    <div class="podcast-waves" aria-hidden="true">${Array.from({ length: 7 }, () => "<span></span>").join("")}</div>
    ${logoImg(project)}`,
  video: (project) => `
    <div class="film-sprockets top" aria-hidden="true">${Array.from({ length: 10 }, () => "<span></span>").join("")}</div>
    <div class="film-sprockets bottom" aria-hidden="true">${Array.from({ length: 10 }, () => "<span></span>").join("")}</div>
    <p class="video-title">Behind the edit.</p>
    ${logoImg(project)}`,
};

function cardVisual(project) {
  if (visualMarkup[project.visual]) return visualMarkup[project.visual](project);
  if (project.image) {
    const fit = project.image.fit === "contain" ? " is-contain" : "";
    const pad = project.image.pad ? " is-padded" : "";
    return `<img class="visual-image${fit}${pad}" src="${project.image.src}" alt="${escapeAttr(project.image.alt)}" loading="lazy" />`;
  }
  return "";
}

function projectCard(project) {
  return `
    <article class="project-card">
      <div class="project-visual visual-${project.visual}">
        <div class="visual-topline"><span>${project.category}</span><span class="project-index">${project.number} / ${total}</span></div>
        ${cardVisual(project)}
      </div>
      <h3>${project.title}</h3>
      <div class="project-meta"><span>${project.label}</span><span>${project.meta}</span></div>
      <button class="project-open" type="button" data-project-id="${project.id}">View project ↗</button>
    </article>`;
}

function renderProjects(filter = "all") {
  const visibleProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  grid.innerHTML = visibleProjects.map(projectCard).join("");
  count.textContent = `${String(visibleProjects.length).padStart(2, "0")} PROJECT${visibleProjects.length === 1 ? "" : "S"}`;
}

function sectionMarkup(sections = []) {
  if (!sections.length) return "";
  return `<div class="dialog-sections">${sections
    .map((section) => {
      const body = section.body ? `<p>${section.body}</p>` : "";
      const tag = section.ordered ? "ol" : "ul";
      const list = section.list
        ? `<${tag} class="dialog-list">${section.list.map((item) => `<li>${item}</li>`).join("")}</${tag}>`
        : "";
      const heading = section.heading ? `<h3>${section.heading}</h3>` : "";
      return `<section>${heading}${body}${list}</section>`;
    })
    .join("")}</div>`;
}

function galleryMarkup(gallery = []) {
  if (!gallery.length) return "";
  return `<div class="dialog-gallery">${gallery
    .map(
      (item) => `
        <figure class="gallery-item${item.fit === "contain" ? " is-contain" : ""}">
          <img src="${item.src}" alt="${escapeAttr(item.alt)}" loading="lazy" />
          ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ""}
        </figure>`,
    )
    .join("")}</div>`;
}

function bannerMarkup(banners = []) {
  if (!banners.length) return "";
  return `
    <h3 class="dialog-subhead">LinkedIn banners</h3>
    <div class="dialog-banners">${banners
      .map(
        (banner) => `
          <figure class="banner-item" data-caption="${escapeAttr(banner.caption)}">
            <img src="${banner.src}" alt="LinkedIn banner for ${escapeAttr(banner.caption)}" loading="lazy"
                 onerror="this.closest('.banner-item').classList.add('is-missing'); this.remove();" />
            <figcaption>${banner.caption}</figcaption>
          </figure>`,
      )
      .join("")}</div>`;
}

function linkList(links = [], className) {
  if (!links.length) return "";
  return `<ul class="${className}">${links
    .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${label} <span>↗</span></a></li>`)
    .join("")}</ul>`;
}

function openProject(project) {
  const details = project.details
    .map(([label, copy]) => `<div><span>${label}</span><p>${copy}</p></div>`)
    .join("");
  const socials = project.socials?.length
    ? `<h3 class="dialog-subhead">Follow along</h3>${linkList(project.socials, "source-list is-social")}`
    : "";
  const sources = project.sources?.length
    ? `<h3 class="dialog-subhead">${project.id === "spotifind" ? "Prototype" : "Watch"}</h3>${linkList(project.sources, "source-list")}`
    : "";

  dialogContent.innerHTML = `
    <div class="dialog-inner">
      <p class="dialog-eyebrow">${project.number} / ${project.category}</p>
      <h2 id="dialog-title">${project.title}</h2>
      <p class="dialog-summary">${project.summary}</p>
      ${galleryMarkup(project.gallery)}
      ${bannerMarkup(project.banners)}
      ${sectionMarkup(project.sections)}
      <div class="dialog-details">${details}</div>
      ${socials}
      ${sources}
    </div>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  closeDialog.focus();
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((button) => button.classList.toggle("is-active", button === filter));
    renderProjects(filter.dataset.filter);
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (!button) return;
  openProject(projects.find((project) => project.id === button.dataset.projectId));
});

const navWorkCount = document.querySelector("#nav-work-count");
if (navWorkCount) navWorkCount.textContent = `(${total})`;

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const revealItems = document.querySelectorAll(".reveal");
revealItems.forEach((item) => item.dataset.hidden = "true");
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.dataset.hidden = "false";
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 },
);
revealItems.forEach((item) => revealObserver.observe(item));

renderProjects();
