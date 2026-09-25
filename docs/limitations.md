# Known limitations and next verification

- Physical iPhone Home Screen installation, Safari/VoiceOver, real cutouts/safe areas, native keyboard transitions, native file sharing and OS termination/eviction have **not** been verified on a device. Chromium touch/viewport emulation and compressed-viewport checks are useful but do not establish these behaviors.
- There is no account, access-control system, encryption provided by PMD, cloud synchronization or multiuser collaboration. Trusted Device Mode is a convenience for a browser you trust; backups are essential.
- Concurrent saved-program edits are detected and blocked, not merged. Export the affected session before reopening. On browsers without IndexedDB database enumeration, automatic restore is unavailable; the explicit device-mode workflow can discover an existing saved copy.
- Browser/OS clearing, quota pressure and abrupt termination can lose local data. A “Saved on this device” state describes a completed transaction, not guaranteed permanent retention.
- Home prioritizes five items per section; expanded queues show the first 100, and search the first 40 matches. Module filters and 40-record pages provide deeper review. These bounds are intentional for phone performance.
- Full matrices, deep BOM operations, complex trade-study editing, large imports and report authoring remain desktop-oriented. Their workstation views are accessible from a phone but are not designed to reproduce a large spreadsheet on a small screen.
- Performance measurements use 5,000 synthetic records on a Windows Chromium test machine, including a 4× CPU-throttled check. They do not establish performance on every iPhone, a 50 MB import, a very large relationship graph, or prolonged sessions.
- Undo/redo retains up to 30 session operations. Audit/recent-activity windows remain bounded at 500/200 entries; these are not an immutable compliance log. Undo history is not in Program Backups.
- Specialist hardware/software review retains fixed technical fields. Some retained specialist display rules and legacy analytic details recognize canonical vocabulary. Changing currency/units does not convert values, and changing the default risk model does not re-score existing assessments.
- Legacy single linked-ID fields and centralized relationships coexist. A relationship-panel edit does not rewrite every legacy form field. Unresolved imported links are retained for review.
- Procurement receipt application uses the full purchase quantity/value for each confirmed linked target. Partial receipts and split allocations require manual entries.
- Shell updates require explicit confirmation and closed secondary PMD windows. A new deployment is not visible offline until it has been fetched and accepted. Browser storage clearing can also remove the offline shell.
- The stricter rendering boundary and attack fixtures are not a comprehensive independent security or accessibility audit. Review the legacy workstation code before expanding its trusted handler templates.
- The GitHub Pages URL is not verified as deployed by this change. The owner must review/merge the PR, enable Pages, and perform the physical-device acceptance pass. No project license has been selected.

Recommended next work: physical iPhone acceptance with both data modes; independent security and screen-reader review; larger and longer-running program fixtures; continued consolidation of legacy linked-ID editors into shared pickers. No new modules are needed to complete those improvements.
