# Data, backups and device storage

## Two modes

**Session Mode is the default.** Program records remain in memory. A fresh browser profile starts blank. There is no automatic program write to localStorage, sessionStorage or IndexedDB. The service worker may cache public application files so the app itself can open offline; those files contain no user program records.

**Trusted Device Mode requires an explicit checkbox and confirmation.** It saves the active program in IndexedDB on this browser/device. The database name includes the application path, keeping deployments on different paths separate. This choice is not imported or exported as part of a program backup.

The current and one previous Program Backup are written in one database transaction. Saves are debounced after changes and also requested when the page becomes hidden. A visible state distinguishes pending changes, saving, saved and failed saves. Do not leave before “Saved on this device” appears. Mobile operating systems can suspend or terminate an app before a final write completes.

Stored backups use the same schema validator as imported files. A corrupt current save offers a validated previous copy for recovery. Neither an invalid file nor invalid saved data partially replaces the active program. Quota/storage failures retain the in-memory program and prior committed save. Export immediately after a save error.

Each saved transaction checks a revision. A second window cannot silently overwrite changes from another window. Conflicts require exporting the affected session and reopening PMD; there is no automatic merge.

**Disable & clear device copy** removes both saved copies and keeps the active in-memory session. It does not delete previously downloaded files, other browser profiles, other devices, or the public offline app shell.

## A separate backup is still essential

Program Backup JSON contains settings, configuration, records, relationships, ID counters, retained audit history, saved filters and applicable session configuration. Undo/redo stacks are intentionally not restored from JSON. The schema remains `pmd.program-backup`, version `1`; PMD 10.0 backups remain compatible. Device storage uses its own version `1` envelope.

Import validates before asking to replace the active dataset. Keep the old backup until you have reviewed the result. Imports are undoable within the current session. Share Backup uses the native file share sheet when supported; otherwise it downloads an ordinary JSON file. A completed download request does not prove that you retained the file—verify important backups yourself.

Storage can be removed through browser settings, device cleanup, quota pressure, private browsing behavior, or OS decisions. Safari tabs and Home Screen apps may have separate storage. PMD requests persistent storage after opt-in when the browser supports it, but cannot guarantee the browser will grant or retain it.

## Public hosting and privacy

GitHub Pages serves the generic application code and sees normal requests for those public files. PMD does not send entered or imported program data to GitHub, an API, telemetry, analytics or cloud storage. There is no account, synchronization or backend. Explicitly opening a link contacts that destination; explicitly sharing/exporting transfers the selected backup to the destination you choose.

Determine whether your organization's data is permitted on the device and browser you use. Anyone with access to that browser profile may be able to open its saved program. Backups and device storage are not encrypted by PMD. No certification, security approval or compliance status is claimed.

## Rendering boundary

Imported text is untrusted. Standard renderers escape text; legacy HTML insertion also passes through a centralized guard. The app's Content Security Policy blocks inline script and inline script attributes, remote script dependencies, embedded active documents and off-origin connections. Legacy event templates are translated into external, generated functions at development time; no runtime `eval` or `Function` constructor is used. URLs use an allowlist of protocols. New companion code uses delegated events and escapes rendered values.

These controls and automated attack fixtures reduce specific risks; they are not a substitute for an independent security review. Report a suspected vulnerability privately to the repository owner without including confidential program exports in a public issue.

## Browser-storage reference

WebKit documents storage quotas, eviction and persistence heuristics in [Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/). Treat device saving as a convenience and retain independent JSON backups.
