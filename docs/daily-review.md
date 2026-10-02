# Daily review and backup workflow

## Review work

On a phone, use **More → Review work**, or expand an attention/upcoming list from Home. On desktop, use **Review work** in the sidebar.

Choose **Needs attention**, **Coming up**, **Open / active**, or **All records**. Filter by module, owner or text. On phones, expand **Filters** when needed. Owner choices come from your records; PMD does not assume who you are. Disabled modules retain their data but are excluded from the normal review queue.

The queue displays 30 records per page with no fixed 100-record cutoff. Open a card, inspect links, edit routine fields or append a note, then use **Back to review** to return to the same filters. More detailed work remains available in the full editor. Closing an unfinished quick form offers **Keep editing** or **Discard changes**. These drafts are not automatically persisted, even in Trusted Device Mode; press Save to commit them.

Attention uses your configured inactive/blocker statuses, dates, risk framework and applicable thresholds. A test execution date is history; a scheduled test date belongs in upcoming work. Decision review dates also appear in upcoming work. PMD does not infer a poor or healthy program from absent inputs.

## Backup & recovery

Use **More → Backup & recovery** on phones or the matching sidebar button on desktop.

1. Download or share a Program Backup.
2. Verify that the file exists at the intended destination.
3. Choose **I verified the downloaded file is saved**. If the program changed after the download, PMD asks for a fresh backup instead of marking the new changes covered.

The backup filename does not include your program name. The file itself includes the complete program and retained history; handle it accordingly.

**Choose a backup JSON to check** validates the file and compares its content with the active workspace without importing it. A valid older backup can differ from the current workspace; that is not a validation failure. This check does not certify the data's correctness or authenticity.

Import still requires explicit replacement confirmation. Expand **Review record changes** to see collection counts and added/changed/removed records. IDs identify records within their collections; this preview is not a merge. Settings, relationships and history are replaced too. Keep your previous file until you review the result.

## Another window changed the device copy

Trusted Device Mode pauses saving when another window changes or clears the saved program. Your current session stays in memory. Export that session first, then open **Data mode & device storage → Review latest saved program**. Restoring is an explicit replacement; there is no automatic merge.

Browser notification support can vary. The transactional revision check still prevents a stale write when immediate window notices are unavailable. A separate JSON backup remains essential.
