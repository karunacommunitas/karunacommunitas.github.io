# Karuna Communitas Static Mirror

This repository contains a static GitHub Pages-friendly mirror of the current site at `https://www.karunacommunitas.com/`, captured on July 18, 2026.

## What is included

- The current homepage
- About, Team, Practitioners, Store, Contact, and Cart pages
- Current article pages that were discoverable from the live site
- Practitioner profile pages linked from the practitioners directory

## Deployment notes

- This is structured for a root-level GitHub Pages deployment, such as a user/organization site or a repo using a custom domain.
- Internal links are kept in the same clean-URL style as the live site, so a project site deployed under a subpath like `username.github.io/repo-name/` would need an additional path-prefix pass.
- Styling and content assets are now localized for static GitHub Pages deployment.
- Forms, cart, and commerce flows may not fully function on GitHub Pages because there is no backend on a static host.

## Printing

All content pages load `/print.css` with `media="print"`. Use the browser's Print command to print or save a PDF. The stylesheet supports A4 and US Letter with 16 mm margins, removes navigation and forms, uses black text on white, and includes external link destinations. Long articles flow across pages; images are scaled to fit.

When adding a page, include `<link rel="stylesheet" href="/print.css" media="print">` after the screen stylesheet. Check print preview for long text, images, and page breaks as well as the normal screen layout.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose the default branch and the `/ (root)` folder.
5. If you want to use `www.karunacommunitas.com`, add the custom domain in GitHub Pages settings and point DNS at GitHub Pages.


Change

## Community readings

`/resources/community-readings/` loads the published Google Sheet in `community-readings.js` on each visit. No rebuild or website deployment is needed for reading-list edits after the initial page deployment; Google's publication cache can delay updates by a few minutes.

Keep the published tab's header row as `Title`, `Author`, `Link`, `Genres`, and `Why we recommend it`. Use one recommendation per row, comma-separated genres, and a full HTTP or HTTPS URL in `Link`. Blank titles are skipped; invalid links are omitted. Cell text is displayed as text, including line breaks in recommendations. Publish only content intended for public viewing.

The page shows a retry option when the sheet cannot be loaded. If the published sheet or tab is replaced, update `KC_READINGS_CSV_URL` and the no-JavaScript reading-list link in the page.
