# [DSA Vault](https://amitkumar70512.github.io/DsaAlgoVault/)

A static, GitHub Pages-ready personal knowledge base for DSA, interview prep, Android notes, and future technical tracks.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, MDX frontmatter (`gray-matter`), Fuse.js search, React Markdown, Monaco editor, Lucide, and browser-only LocalStorage administration.

## Start

```bash
npm install
npm run dev
npm run build
```

The static site is written to `out/`. `next.config.ts` detects GitHub Actions and supplies the repository base path automatically.

## Content

Add one `.mdx` file per note in `content/problems/`. Every file uses frontmatter like the provided samples. Files are parsed at build time, so no API, database, or runtime server is needed. Add content folders for `patterns`, `algorithms`, `datastructures`, `android`, or `system-design` using the same model when those sections are introduced.

## Admin Mode

`/admin` is entirely client-side. It autosaves one draft in LocalStorage and exports a valid `.mdx` file. Move exported files into `content/problems/`, then rebuild/deploy.

## GitHub Pages

Use a workflow that runs `npm ci`, `npm run build`, and uploads the `out` directory with the official Pages actions. Set Pages source to GitHub Actions.

## Google Drive authoring

Admin Mode includes **Save to Drive**. It uses a browser OAuth access token and writes each MDX note to the configured Drive folder; no download is required. The app requests the least-privileged `drive.file` scope, so it can manage notes that it creates. In Google Cloud Console, enable the Drive API and add your development URL (`http://localhost:3000`) plus your GitHub Pages origin to the OAuth client’s authorized JavaScript origins. The public client ID and folder ID are configured in `components/drive-save-button.tsx`.

Drive saves do not automatically change the already-deployed static site. Add a Drive-to-GitHub Actions sync before publishing so GitHub Pages rebuilds from the Drive folder.
