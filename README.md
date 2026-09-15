# Caitlyn Tan — Portfolio

A responsive, dependency-free portfolio site for an undergraduate designer. It is intentionally structured as a small static application so it can be hosted directly on GitHub Pages, Netlify, or any static host.

## Run locally

No build step is required. Open `index.html` in a browser, or serve the directory with any static-file server.

## Stack

- Semantic HTML for structure and accessibility
- Modern CSS, split into design tokens and component/layout styles
- Native ES modules for project data, rendering, filtering, modal details, and scroll reveals
- Google Fonts (`DM Sans` and `DM Mono`); no framework or third-party JavaScript dependencies

## Architecture

```text
.
├── index.html              # Page structure and content sections
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Design tokens: colour, type, spacing, layout
│   │   └── main.css        # Responsive layout and component styles
│   └── js/
│       ├── projects.js     # Portfolio project content and source links
│       └── main.js         # Rendering and interaction behaviour
├── .gitignore
└── LICENSE
```

## Updating work

Edit `assets/js/projects.js` to add, remove, or update projects. The project grid and detail dialogue render from that single data source, keeping content separate from the visual implementation.

## Notes

The source resume was used for name and contact details; it is intentionally not copied into this public repository. Add a resume download only after confirming the public version contains the information you want to share.
