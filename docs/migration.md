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
