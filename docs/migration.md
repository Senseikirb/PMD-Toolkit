# PMD 10.1 → 10.2

The source is the merged PMD 10.1 release. Schema `pmd.program-backup` remains version `1`. No program records are seeded, risk scores converted, or relationships inferred. Existing valid 10.0/10.1 backups remain supported; the retained V9.5 migration path remains available.

1. Keep a separate Program Backup before updating.
2. Review the PWA update prompt and explicitly reload, or replace the complete local static folder.
3. Import your backup in Session Mode, or review the restored device program if you previously enabled Trusted Device Mode.
4. Check representative records, configuration and relationships; keep your previous backup until satisfied.

10.2 rejects malformed nested note/audit/filter fields, impossible calendar dates, unsafe IDs and risk dimension keys that overlap built-in fields. A rejected file leaves the workspace unchanged. Correct the source values deliberately; no silent score reinterpretation is performed. Older saved-filter `filters`, `state` and flat representations remain readable without rewriting their exported form.

Backup requests no longer clear the unsaved marker immediately. After verifying the destination file, confirm retention in **Backup & recovery**. The new check-only file workflow does not import or mutate records. Generic filenames omit the program name, but the JSON contents still include the complete configured program.

Trusted Device Mode stays opt-in and separate from backup settings. Device envelope version remains 1. Other windows receive revision notices only; stale saves pause until you review the saved version. There is no synchronization or merge. All saved content remains on the browser's origin, with the same storage limitations as before.

The new `validation.js` and `workspace.js` files must accompany the rest of the static application. The worker caches the complete 10.2 shell. Do not copy just `index.html`. Original single-file V10.0 deliveries are unchanged.

---

# PMD 10.0 → 10.1

PMD 10.1 uses the completed V10.0 application as its baseline. The program schema remains `pmd.program-backup`, version `1`. No score conversion, relationship inference, record seeding or program-specific configuration is applied.

1. Export a Program Backup from V10.0.
2. Open PMD 10.1. A fresh installation is blank and in Session Mode.
3. Import the backup, review the validation summary and confirm replacement.
4. Review your configuration and representative records, then keep a new backup under a distinct filename.

Configuration, module names/order/enabled state, retained records, intentional relationships, counters, custom dropdowns, risk methodologies and retained audit information carry forward. Mobile edits use those same records. Optional scheduled test dates and appended notes are ordinary record fields; there is no parallel mobile database schema.

Trusted Device Mode is a **device decision**, not a program setting. Importing a backup does not enable it. Once you opt in, future edits and imports of the active program are saved on that device. Other browsers/devices remain independent. Use JSON to transfer work.

The public distribution has adjacent static assets instead of embedding all code in one HTML file. Copy the entire application folder for local use. `file://` supports Session Mode, while installation/offline shell caching/device saving require HTTPS or localhost. The original V10.0 single-file delivery is unchanged.

Undo history remains limited to the current session. Existing V9.5 imports continue through the retained migration path described in [the earlier migration notes](migration-v10.md).
