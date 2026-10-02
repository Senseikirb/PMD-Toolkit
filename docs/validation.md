# Validation report — PMD 10.2.0

**138 browser test groups passed**, plus static syntax/packaging/security-boundary checks. Executed on 2026-10-02 using installed Google Chrome on Windows through Playwright. The retained suites ran end to end; the final numeric-audit fix was followed by the targeted resilience suite and static checks. Phone/touch sizes are emulated. No physical iPhone result is implied.

## Executed

| Suite | Passing groups |
| --- | ---: |
| Engine and modules | 40 |
| Migration and desktop interactions | 21 |
| Mobile, storage and PWA | 41 |
| Interaction and accessibility checks | 11 |
| Security, recovery and review workflows | 25 |

- Blank and fictional populated programs across all 21 destinations at 320, 360, 390, 430, 768 and 1440 px, plus 844 × 390 touch landscape. Existing checks cover navigation, CRUD, undo/redo, global search, sorting, filtering, renamed/reordered/disabled modules, relationships and reports.
- Real form/button/keyboard interactions, file downloads and selections, JSON round trips, V10.0 imports and V9.5 migration. Sparse optional fields, custom zero-based risk scales, measured zero/missing-input semantics and referenced deletion remain covered.
- New review queue pagination beyond 100 items, owner/module context, detail return, phone/desktop fit, and light/dark themes. Quick-edit/note Escape/Close keep-discard behavior was exercised with actual typed inputs.
- Download requests retain the dirty marker. Stale acknowledgment cannot cover newer edits. Chosen backup files are validated/compared without replacing current data. Replacement previews report changed/added/removed counts.
- Malformed notes, audit/filter metadata, risk-key collisions, unsafe counters, impossible dates, invalid relationship collections and prototype-shaped labels have focused tests. Nested template/active SVG/tracking attributes were removed by the guard. CSV formula-like text was neutralized in an actual download. Numeric audit values including zero remain readable and exportable.
- Default Session Mode did not create program storage. Trusted Device Mode consent, transactions, reload restore, quota errors, corrupt current/previous recovery, invalid envelopes, clearing and concurrent windows were exercised. Revision notices paused stale windows; explicit saved-program recovery retained the latest copy. A cancelled startup cannot replace an in-progress form with late recovery UI.
- Failure injection confirms import commit rollback restores records, counters, undo/redo and dirty state. Handler repetition checks, focus/keyboard behavior, named controls, primary contrast/touch targets, compressed viewport Save visibility, and print-to-PDF remain covered.
- Service-worker registration at root/project paths, shell-only caching, offline reload/capture, offline-to-online update, explicit update acknowledgment, secondary-window blocking and cache cleanup passed. A null-registration offline issue discovered during this work was repaired and re-tested.
- No unhandled page exceptions or off-origin application requests in the completed suites. Test programs were synthetic and are not part of production startup.

## Measured performance

These are single-machine observations, not promises about iPhone hardware. One throttled startup run exceeded the 3-second guard during development; subsequent completed runs passed. No timing threshold was relaxed to obtain a pass.

| Measurement | Result |
| --- | ---: |
| Fresh blank DOM | 357 elements |
| 5,000-record program: phone cards rendered | 40 |
| Total DOM in that phone list | 606 elements |
| Phone module render | 17.5 ms |
| First indexed search | 37.2 ms |
| Cached search | 3.7 ms |
| 5,000-record backup validation | 108.0 ms |
| Reported JS heap at measurement (not peak/RSS) | 26.5 MiB |
| Phone render with 4× CPU slowdown | 54.2 ms |
| Fresh program ready with 4× CPU slowdown | 2404.6 ms |
| 10,000 records / 10,000 combined references: backup validation | 94.9 ms |

A separate before/after probe of the same 10,000-record graph measured 693.2 ms before temporary relationship indexes and 86.2 ms afterward. The final suite measurement above is a different run. Lookup indexes are local to each operation, avoiding stale cache state.

## Statically inspected

Source and diffs: JSON/schema/storage boundaries, error/rollback paths, guarded sinks, handler registry, spreadsheet encoding, URLs, manifest/asset paths, worker allowlist/update policy, safe-area/reduced-motion CSS and public-content/credential patterns. New CI uses pinned actions, read-only permissions and no deployment step. Generated handlers and Git whitespace checks are included. Static inspection is not an executed attack test for every legacy renderer.

GitHub's repository API reports Pages built from `main` at the project URL. This branch is **not** merged or deployed by the agent. CI execution is reported on the PR; local results above do not claim that a remote job ran.

## Manual verification remaining

- Physical iPhone Safari/Home Screen installation, actual safe-area cutouts and keyboard behavior, Files/native sharing, VoiceOver, private browsing, eviction and OS termination.
- Independent security/accessibility review; every specialist drag/context-menu/clipboard/printing permutation and long sessions under mobile memory pressure.
- 50 MB inputs, substantially larger graphs, deployment-specific headers and a complete production-device acceptance pass after merge.

See [machine-readable results](validation-results.json), [product review](product-review.md), [threat model](threat-model.md), [limitations](limitations.md), and [current screenshots](images/).
