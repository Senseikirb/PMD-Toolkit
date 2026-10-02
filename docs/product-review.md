# Product and engineering review — PMD 10.2

The strongest improvement is to make the existing toolkit more trustworthy and easier to use every day. PMD already has substantial program-management coverage. This release keeps all major modules, the configurable program model, dense desktop registers, the phone companion, offline operation and explicit data control.

The source was the merged 10.1 release on `main` (`9f8ef51`), not the original V9.5 file. Production still starts with no program records. This review did not select a license, introduce accounts or networking for program data, or enable device saving by default.

## Decisions and changes

| Capacity | Finding | Implemented response |
| --- | --- | --- |
| Product focus | Many valuable features already exist; adding modules would increase navigation cost. | Add shared **Review work** and **Backup & recovery** entry points to existing capabilities. No new program-record module. |
| Daily program execution | Home's compact lists could not expose more than the first 100 queue items. | A paginated cross-module review queue offers attention, upcoming, active and all-record views; owner/module/text filters; and a return path from details. |
| Mobile usefulness | Quick capture can lose typed input on Escape, backdrop or Close. Review controls can crowd records out. | Explicit keep/discard for unfinished quick edits and notes. Collapsed phone review filters, 30-record review pages, existing 40-card module pages, shared detail/quick-edit flows. |
| Desktop power | Desktop depends on dense tables, full editors and keyboard behavior. | Retain existing workstation layouts and operations. Add compact sidebar shortcuts to the same review and backup sheets. |
| Dashboard semantics | Historical execution dates and scheduled work need different meanings. | A shared scheduled-date helper includes decision review dates and planned tests, excludes historical test execution dates, and prioritizes configured blockers before overdue items. Missing inputs still do not imply program health. |
| Import integrity | Nested notes, audit fields and filter metadata could pass validation despite incorrect types. Risk dimensions could collide with record fields. | Shared nested validation, safe date/ID/counter boundaries, reserved risk keys, aggregate input limits and real collection checks for relationships. Replacement preview shows additions, changes and removals by collection. |
| Recovery | A failed import commit could leave an extra undo entry. Download initiation was treated as completed backup retention. | Roll back records/counters/history and undo/redo state on commit failure. Keep the unsaved marker until the user confirms the downloaded file. Validate and compare a backup without replacing the workspace. |
| Security | Prototype-shaped text crashed grouped views. The sink guard missed nested template contents/tracking attributes. CSV paths differed in formula protection. | Prototype-safe grouping, removal of unused active/nested markup and tracking attributes, escaped audit attributes, and shared spreadsheet cell encoding. Generic backup filenames omit the program name. |
| Local persistence | Revision checks prevented overwrites but did not promptly tell another window it was stale. | Revision-only notices pause stale saves and offer a deliberate recovery review. Clearing a device copy also pauses other active windows. No program content is broadcast. |
| Offline/PWA | Offline startup could lose its in-memory service-worker registration handle. | Reuse the installed registration on offline launch; retry unavailable registration on reconnect. Preserve explicit update consent and the public-shell cache boundary. |
| Performance | Relationship validation repeatedly scanned full arrays. | Temporary per-operation indexes replace repeated endpoint scans. A 10,000-record/10,000-link probe improved from about 693 ms to 86 ms on the same local test setup; see the final validation report for subsequent measurements. No stale global relationship cache. |
| Maintainability | Security and everyday workflows need clear ownership without a wholesale rewrite. | Isolate reusable validation and workspace workflows in two small static scripts; retain the engine, model and generated-handler mechanism. Add adversarial regression cases and read-only GitHub CI. |
| Public operation | The project is already served by GitHub Pages. Public code and private local records have different boundaries. | Document the current deployment, same-origin storage limitations, responsible issue reporting, backup ownership and migration. No deployment or merge is performed by this change. |

## Architecture kept deliberately simple

The runtime remains a no-build static application. Session Mode uses memory and explicit files. Trusted Device Mode remains optional IndexedDB storage; public shell caching is independent of program storage. Schema `pmd.program-backup` version `1` is unchanged. New workflow state is transient and does not add a separate phone data model.

Relationship indexes exist only for a single validation or integrity operation. This improves large graphs without relying on every legacy mutation to invalidate a long-lived cache. Imported risk scores keep their attached methodology. Currency and units remain labels, not automatic conversions.

Security controls are defense in depth. The legacy sink guard remains necessary while older renderers construct HTML. New code uses escaped data and function/event listeners. A broad framework rewrite would add migration and regression risk without solving the important data boundaries by itself.

## Prioritized next work

1. **Physical iPhone acceptance:** Safari and installed Home Screen mode, VoiceOver, real keyboards/cutouts, Files/share destinations, storage eviction and app termination. Desktop Chromium emulation cannot establish these results.
2. **Independent security and accessibility review:** especially legacy string templates, every specialized editor, imported extension fields, focus order, screen readers and same-origin deployment policy.
3. **Long-session reliability:** measure repeated snapshots and large attachment-free backups under real mobile memory pressure; consider a byte budget for undo history based on those measurements.
4. **Continue consolidating shared record editors:** migrate remaining legacy link fields and inline templates gradually, with behavior tests before each replacement. Preserve specialist power.
5. **Procurement allocation:** if real users need partial receipts or split quantities/costs, introduce an explicit receipt transaction model. Current full-receipt behavior remains documented and unchanged.
6. **Deployment isolation:** for sensitive permitted data, consider a dedicated trusted origin. Database naming by path is convenience, not security isolation.

Cloud synchronization, accounts, automatic demo data, speculative new modules and application-provided encryption are outside this release. They would need separate product and threat-model decisions. No claim of exhaustive security, compatibility or compliance is made.
