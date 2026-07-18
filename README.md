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

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose the default branch and the `/ (root)` folder.
5. If you want to use `www.karunacommunitas.com`, add the custom domain in GitHub Pages settings and point DNS at GitHub Pages.
