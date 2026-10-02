# Changelog

## 10.2.0 — Safer data and daily review

- Build on merged 10.1 with all major modules, blank startup, schema 1 and the existing offline/privacy modes preserved.
- Add shared Review work: cross-module views, owner/module/text filters, paginated queues beyond 100 items, and return-to-review record navigation. Keep phone filters compact and desktop tables dense.
- Protect unfinished quick edits/notes from accidental Close/Escape/backdrop discard. Correct upcoming review/test dates and attention ordering.
- Add Backup & recovery: download acknowledgment, generic filenames, check-only backup validation/content comparison, and collection-level import replacement previews.
- Strengthen nested input validation, risk-key/counter/date boundaries, aggregate JSON limits and relationship endpoint validation. Fix prototype-shaped grouping values, saved-filter creation/undo and import rollback history.
- Harden legacy HTML sinks against nested templates, active SVG mutation and link tracking attributes. Centralize CSV/TSV formula protection without changing JSON data.
- Pause stale device saves on revision-only window notices and provide explicit latest-save review. Validate storage envelopes and retain atomic revision checks.
- Reuse the installed service worker during offline startup, keep explicit update consent, and include the new local scripts in the shell.
- Use temporary relationship indexes for large-program validation/integrity checks. Add 10,000-record linked fixtures, new adversarial/workflow checks and read-only CI with pinned actions.
- Add security reporting guidance, same-origin storage limits, a product review, migration guidance and current screenshots. No license, backend, telemetry or automatic program persistence was added.

## 10.1.0 — Public static app and mobile companion

- Continue the completed blank V10.0 toolkit and schema 1; extract CSS/JavaScript into maintainable static assets without a production build.
- Add phone navigation with Home, Search, New, Modules and More; include touch-device landscape behavior, safe-area spacing and full-screen record sheets.
- Add bounded record cards, configurable filter sheets, quick capture, individual quick edits and dated notes on the existing record model. Preserve workstation tables, bulk tools, specialist editors and keyboard shortcuts.
- Cache a shared search index between mutations. Limit phone lists to 40 records and prioritize five items per Home section. Keep absent inputs distinct from calculated results.
- Add relative-path PWA manifest, app icons, Apple touch icon, application-shell-only offline caching and explicit updates that protect active sessions.
- Keep Session Mode as default. Add explicit Trusted Device Mode with transactional IndexedDB saves, current/previous backups, schema validation, revision conflict checks, failure states, recovery, and disable/clear controls.
- Add feature-detected native Share Backup with ordinary JSON download fallback.
- Remove runtime inline-script permission. Translate legacy event templates into external functions, guard HTML sinks, tighten URL protocols, and remove residual default classification from new specialist records.
- Preserve Program Backup compatibility. No cloud, account, telemetry, automatic synchronization or production dependency was introduced.
- Add synthetic fixtures, desktop/mobile screenshots, regression/performance/PWA tests and deployment/data guidance. No license was selected.

## 10.0.0 — Completed baseline

Blank production state; centralized program configuration; configurable modules, terminology and risk methodology; generalized structure; intentional relationships; validated full Program Backups; data-aware Home; retained specialist workstation capabilities. See the configuration and migration guides.
