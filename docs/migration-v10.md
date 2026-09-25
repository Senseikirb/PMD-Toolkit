# Migration notes — V9.5 to V10.0

## Recommended procedure

1. In V9.5, export the current program as JSON. Preserve that original export unchanged.
2. Open the new blank V10.0 HTML.
3. Select Import and choose the V9.5 JSON.
4. Review the staged preview and confirm replacement.
5. Review Settings, the risk register, Program Structure, and Data integrity.
6. Export a new V10.0 Program Backup under a new filename.

Opening the new HTML does not read another browser tab or recover unexported V9.5 memory. The original application was not modified by this delivery.

## What migrates

- Existing configuration, module names, dropdown values, records, available audit/history, and counters are preserved where present.
- Existing V9.5 risk records receive a saved copy of the original Q/C/S/R methodology. Their entered values are retained. Sum and maximum-factor criticality rules, original scale descriptions, and legacy partial-assessment behavior remain intact.
- Existing assembly IDs remain unchanged. Legacy subassemblies are represented as child structure nodes with a `_legacySubId` mapping; their original subassembly records remain in the backup for compatibility.
- Existing explicit linked-ID fields are available to the relationship engine. The `all` risk-assembly assignment is preserved.
- Collections omitted from an older backup become empty; records from the previously open program do not leak into the imported program.
- Counters are raised to at least one above the largest existing ID. Higher saved counters and supported older `nextId` aliases are retained.
- Missing relationship endpoints remain recorded and are reported for review. Import does not silently remove them.
- Unknown top-level legacy fields are retained under `_extensions`; unknown record fields are preserved.

Legacy imports enable all known modules so existing capabilities remain discoverable. Turn off unwanted modules afterward without deleting data.

## New backup contract

The export root contains:

```json
{
  "schema": "pmd.program-backup",
  "schemaVersion": 1,
  "applicationVersion": "10.0.0",
  "exportedAt": "…",
  "state": { "settings": {}, "relationships": [] },
  "counters": {},
  "auditTrail": [],
  "session": { "raci": {}, "savedFilters": {}, "subViews": {} }
}
```

This is an abbreviated structural illustration, not an importable backup. Actual backups include every defined record collection and the complete settings object.

Supported imports are schema 1 backups and recognizable legacy PMD objects, including the V9.5 export version `4.0.0` shape. Unsupported future schemas are rejected rather than guessed. Representative V9.5 migration was executed in the test suite; arbitrary historical variants were not all tested.

Parsing and validation occur before replacement. Invalid structure, incompatible field types, duplicate IDs, cycles, unsafe object-property keys, and invalid scoring definitions cause rejection. Import size is limited to 50 MB; validation also bounds nesting and collection size. A replacement is undoable within the active session.

## Intentional behavior changes

- Brand-new launches contain no records or example program context.
- A missing numeric value is different from zero. V9.5 numeric zeroes already stored in an export are preserved; the importer cannot know whether those old zeroes represented measurements or old defaults.
- New risk-framework settings affect new assessments. Existing scored risks retain their frameworks; no bulk semantic conversion is performed.
- Part-number/text equality no longer establishes a semantic link. Create an intentional relationship when one is needed.
- No automatic overall program-health grade is generated from incomplete data.
- Disabling modules controls visibility and Home participation, not data retention.
- An exported JSON backup is the reconstruction format. CSV and Markdown are not round-trip formats.

V9.5 is not expected to understand the new envelope, relationship collection, or per-record risk contracts. Keep the original export if backward compatibility is required.
