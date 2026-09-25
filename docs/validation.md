# Validation report — PMD 10.1.0

**113 browser test groups passed**, plus the static preflight checks. Final execution: 2026-09-25T19:07:49.677Z. The suite ran against the delivered static source using installed Google Chrome on Windows through Playwright. It included real DOM interactions, file input/download operations, IndexedDB transactions and service-worker lifecycle operations. Phone sizes and touch behavior were emulated in Chromium; these results are not physical iPhone certification.

## Executed

| Suite | Passing groups |
| --- | ---: |
| Retained engine / module regression | 40 |
| Backup, legacy migration and desktop interactions | 21 |
| Mobile companion, data modes, PWA and performance | 41 |
| Final interaction, recovery and accessibility checks | 11 |

- Blank and fictional populated programs: every one of 21 destinations at 320, 360, 390, 430, 768 and 1440 pixels, plus 844 × 390 touch-phone landscape. No horizontal page overflow in those module renders.
- Software, hardware, general-project and full-feature synthetic configuration scenarios; presets never inserted records into startup.
- Retained create/edit/delete paths, undo/redo, typed structure, configurable scoring, EVM missing/zero arithmetic, receipts, intentional relationships and referenced-record deletion.
- Mobile module picker, renamed/reordered/disabled modules, search including nested notes and vendor/part information, quick capture, individual edits, dated notes, detail links, owner/open/overdue/status filtering, sorting and pagination.
- Required-title validation; custom dropdowns; deep fields retained during quick edits; primary Save-button dispatch across 16 workstation editors; context-menu event propagation; exactly one action-row activation after 15 renders.
- Actual backup downloads and file imports, JSON round trips, malformed-import preservation, V10.0 backup import and representative V9.5 migration. Native Share Backup's ordinary-download fallback was executed.
- Fresh Session Mode created no program database or Web Storage; reload intentionally cleared the session. Trusted Device Mode required an explicit checkbox, saved transactionally and restored on reload. Simulated quota failure, concurrent-window conflict, corrupt current save, previous-copy recovery, malformed device envelope and disable/clear paths were exercised.
- Service-worker registration under both root and /PMD-Toolkit/ paths; exact shell-cache contents; offline reload and offline capture; a simulated new release waiting for explicit backup acknowledgment; activation blocked by another open window; approved update/reload and old cache cleanup.
- Light/dark screenshots; named quick-form controls; primary-button contrast; 44 px primary touch targets; sheet focus trap/Escape; sortable-header keyboard activation; compressed visual viewport keeping Save visible; Chromium print-to-PDF generation.
- Script/event/URL injection fixtures were inert. No unhandled page exceptions or off-origin application requests occurred in the completed runs.

## Measured performance

One run on the test machine; timings are regression evidence, not phone hardware promises. The large fixture contains 5,000 records across actions, requirements, tests, BOM and purchases, 1,000 per collection.

| Measurement | Result |
| --- | ---: |
| Blank initial DOM | 352 elements |
| 5,000-record program: rendered phone cards | 40 |
| Total DOM in that phone list | 601 elements |
| Phone list render | 7.7 ms |
| First global search, including index construction | 11.8 ms |
| Subsequent cached-index search | 1.6 ms |
| Complete backup validation | 65.4 ms |
| Reported JS heap at measurement (not peak/RSS) | 19.8 MiB |
| Phone list render with 4× CPU slowdown | 26.2 ms |
| Fresh program ready with 4× CPU slowdown | 1274.8 ms |
| Offline shell ready, observed upper bound at 4× slowdown | 1469.6 ms |

The large desktop action register remained paginated at 50 rows. Applicable regression budgets passed. Search indexing is lazy and invalidated on mutations; phone lists and queues are bounded.

## Statically inspected

Manifest fields, icon dimensions, relative project paths, worker cache allowlist, no automatic skipWaiting, schema/version boundaries, storage opt-in boundary, URL allowlist, guarded HTML sinks, external event registry, CSP, safe-area and reduced-motion CSS, public-source credential/path patterns, package/runtime dependency separation and absence of a project license were inspected or checked without claiming physical browser behavior.

Source security inspection is not a penetration test. Desktop code remains the retained specialist engine; this change refactors the boundaries needed for public/mobile operation without replacing it.

## Manual verification remaining

- Physical iPhone Safari and Home Screen installation, actual safe-area cutouts, virtual keyboard transitions, swipe/back expectations, native share-sheet destinations, Files import/export and private-browsing behavior.
- Real iOS memory pressure, storage eviction and abrupt termination; permanent retention is not guaranteed.
- VoiceOver and a complete accessibility audit; all printer/clipboard/email integrations; every specialist context-menu or drag permutation.
- GitHub Pages deployment headers and the final public URL after owner review/merge/Pages configuration. Local tests exercised the equivalent project subpath, not a deployed live site.
- 50 MB imports, much larger graphs, long-running sessions and independent security review.

See [machine-readable results](validation-results.json), [development instructions](development.md) and [known limitations](limitations.md). Screenshots in [images](images/) show the actual current application with blank or clearly fictional data.
