const projects = window.portfolioProjects;

const grid = document.querySelector("#project-grid");
const count = document.querySelector("#project-count");
const filters = [...document.querySelectorAll(".filter")];
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector(".dialog-close");

const visualMarkup = {
  spotifind: `
    <div class="spotifind-type">Find your perfect <span>study spot.</span></div>
    <div class="spotifind-map" aria-hidden="true"></div>`,
  uwcube: `
    <div class="cube-grid" aria-hidden="true">${Array.from({ length: 30 }, () => "<span></span>").join("")}</div>
    <p class="cube-title">UW<span>CUBE</span></p>`,
  video: `
    <div class="video-frame" aria-hidden="true"><p class="video-title">Behind the edit.</p><span class="play-button">▶</span></div>`,
};

function projectCard(project) {
  return `
    <article class="project-card">
      <div class="project-visual visual-${project.visual}">
        <div class="visual-topline"><span>${project.category}</span><span class="project-index">${project.number} / 03</span></div>
        ${visualMarkup[project.visual]}
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

function openProject(project) {
  const details = project.details
    .map(([label, copy]) => `<div><span>${label}</span><p>${copy}</p></div>`)
    .join("");
  const sources = project.sources
    .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${label} <span>↗</span></a></li>`)
    .join("");

  dialogContent.innerHTML = `
    <div class="dialog-inner">
      <p class="dialog-eyebrow">${project.number} / ${project.category}</p>
      <h2 id="dialog-title">${project.title}</h2>
      <p class="dialog-summary">${project.summary}</p>
      <div class="dialog-details">${details}</div>
      <ul class="source-list">${sources}</ul>
    </div>`;
  dialog.showModal();
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
