# Development and deployment

## No production build

Serve or copy the checked-in static files. Node is only for development and tests.

```text
index.html                 application shell and retained workstation dialogs
assets/app.js              completed V10 engine, configuration and workstation modules
assets/app.css             dense desktop presentation
assets/companion.js/.css   adaptive navigation, cards, quick edits and search
assets/device.js           explicit device-storage lifecycle
assets/pwa.js              offline/update interface
assets/security.js        guarded HTML sinks and safe external event dispatch
assets/handlers.js         generated external functions for legacy handler templates
manifest.webmanifest      relative start URL, scope and icons
sw.js                     versioned application-shell cache
```

The baseline was the completed PMD Toolkit V10.0 delivery, SHA-256 `495becc8f96bab1b37902ea05b676c0a6cd05875aa2711a18150c37dc9a6c33a`. V9.5 was not re-imported or rebuilt for this release. The desktop engine/configuration model and schema were preserved.

New code should use delegated events or function listeners rather than inline handler templates. If you change a retained template in `app.js`, run `npm run handlers` and commit `assets/handlers.js`. The development-only generator uses Acorn to translate known templates into functions; the browser does not compile strings into JavaScript.

## Run locally

```sh
npm install
npx playwright install chromium
npm start
```

Open `http://127.0.0.1:4173/PMD-Toolkit/`. The preview uses the same project subpath as GitHub Pages. You can also open `index.html` with its adjacent assets through `file://` for Session Mode; service workers and Trusted Device Mode require HTTPS or localhost.

## Validation

```sh
npm test
```

The suite uses synthetic data and creates disposable output under `test-results/`, which is ignored by Git. The PWA suite serves an isolated temporary copy to test updates without changing the checked-in worker. `PMD_BROWSER` optionally supplies an installed Chromium executable; `PMD_PLAYWRIGHT` can point to an existing development installation of Playwright. Neither belongs in production files.

Tests cover the legacy engine, actual UI actions, mobile presentations, backups, storage faults, concurrency, shell caching, update consent and performance. They do not establish physical iPhone behavior. See [validation results](validation.md) for executed/static/manual boundaries.

Performance budgets in the Chromium suite: at 5,000 synthetic records, mobile content remains bounded to 40 cards, total DOM below 2,500 nodes, ordinary mobile render below 1 second, cached search below 250 ms, full backup validation below 3 seconds. A 4× CPU-throttled mobile render has a 2-second guard. These are regression budgets, not promises for every phone or dataset. Matrix/report workloads remain desktop-oriented.

## Release updates

1. Change the application version and release notes.
2. Regenerate handlers if retained templates changed.
3. Run tests and inspect screenshots.
4. Bump `RELEASE` in `sw.js` whenever any cached application asset changes. Update the `SHELL` list when assets are added/removed.
5. Submit a PR. Deploy the complete static directory together after review.

The worker installs a complete versioned shell before it can activate. It does not call `skipWaiting()` during installation. The user reviews an update, confirms their backup, and explicitly reloads. Other open PMD windows block this update action. Trusted Device Mode must complete a save first. A failed installation leaves the current shell active.

## GitHub Pages

After reviewing and merging the PR, open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save. The intended project URL is `https://senseikirb.github.io/PMD-Toolkit/`.

The manifest, scripts, icons and worker use relative paths. `.nojekyll` keeps this a plain static deployment. No framework build or environment secrets are required. The implementation does not enable Pages or merge the PR automatically.

GitHub's current instructions are in [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Background on shell caching is in [MDN's PWA caching guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching).
