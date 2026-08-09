# Rapid Trigger for GunZ

Public guide and supporting research notebook by **HYPNATIQ**.

## Pages

- `index.html` — public method and quick-reference guide
- `research-notebook.html` — full testing history, checkpoints, references, and evidence limits
- `assets/` — extracted logos, favicon files, watermark, and the future social-preview image

The two pages link to each other with relative paths, so they work locally and on GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to the repository root.
2. In **Settings → Pages**, deploy from the branch containing these files.
3. Open the generated Pages URL and test both page links.
4. Only after the final URL is live, add the canonical and social image URLs described below.

The `.nojekyll` file tells GitHub Pages to serve the static files directly.

## Metadata to finish after the site is live

Both HTML files intentionally omit final `canonical`, `og:url`, `og:image`, and `twitter:image` URLs. After GitHub Pages provides the public address, add absolute HTTPS values such as:

```html
<link rel="canonical" href="https://YOUR-NAME.github.io/YOUR-REPOSITORY/">
<meta property="og:url" content="https://YOUR-NAME.github.io/YOUR-REPOSITORY/">
<meta property="og:image" content="https://YOUR-NAME.github.io/YOUR-REPOSITORY/assets/social-preview.png">
<meta name="twitter:image" content="https://YOUR-NAME.github.io/YOUR-REPOSITORY/assets/social-preview.png">
```

Use the notebook page URL for the notebook canonical value:

```html
<link rel="canonical" href="https://YOUR-NAME.github.io/YOUR-REPOSITORY/research-notebook.html">
```

Do not use a local path or embedded image for social metadata; social platforms need a public HTTPS image URL.

## Author and evidence boundary

- Public credit name: **HYPNATIQ**
- Public guide: Version 1.3, updated August 2026
- Research notebook: Research Revision 1.0, updated August 2026
- Personal settings are documented results, not universal presets.
- Manufacturer documentation supports keyboard behavior; the GunZ method and profile results come from personal testing.
