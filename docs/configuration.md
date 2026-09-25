# Configuration and New Program guide

## 1. Begin without examples

Open the hosted PMD app, or `index.html` with its adjacent assets. **Start Blank** dismisses onboarding without creating records or requiring a program name. The standard navigation contains general planning, execution, and knowledge tools. Specialist modules are available in Settings.

**New Program Setup** can set an optional name, subtitle, team, initial workstreams, risk framework, and optional capabilities. Only workstream names you actually type become structure records. Team names become owner suggestions.

The General Project, Hardware Development, Software Development, Systems Integration, and Product Development presets configure module availability and terminology. They do not insert program records. All choices can be changed later. Applying a preset to an existing workspace retains its records.

## 2. Use Settings as the configuration center

Changes are staged. **Save settings** applies them; **Close** or Escape discards the current settings draft, including dropdown edits.

| Section | Controls |
|---|---|
| Program | Name, subtitle, program type, report preparer, structural wording, team suggestions |
| Modules | Enable/disable, rename, reorder with arrows, group, restore default names |
| Dropdowns | Categories, statuses, priorities, types, locations, verification methods, and other module lists |
| Risk framework | Calculation, dimensions, scale bounds/descriptions, criticality thresholds |
| Workflow & metrics | Complete/inactive statuses, blocked statuses, successful/unsuccessful test and verification outcomes, upcoming window, optional EVM/cost thresholds |
| Format & reports | Currency label, date format, default units, report heading, ID prefixes, home sections |
| Help & tools | Backups, reports, relationships, data integrity, audit trail, calendar, owner view, RACI, dependency paths, metrics, reset |

Dropdowns accept one value per line. Leaving a list empty means it is not configured. Existing record values are retained when a list changes. Status names and their meanings are separate: after renaming a status, update **Workflow & metrics** so Home and summary calculations interpret it correctly.

Currency is initially unspecified. Set a currency label before interpreting entered amounts. Changing the label does not convert existing amounts. Date choices are ISO (`YYYY-MM-DD`), month/day/year, or day/month/year. Default units are program metadata; they do not convert quantities or override specialist units such as memory capacity.

## 3. Make modules fit the effort

Disable capabilities you do not need. Their records and relationships remain in memory and in Program Backups. Disabled modules disappear from regular navigation, global search, and Home calculations. A relationship to a disabled module remains visible and explains how to enable that module for editing.

Home is always enabled. Names and navigation ordering are independent of stable record IDs. Group labels are optional; ordering is explicit, so place related modules together for a compact navigation layout.

Software review remains a subview of the optional Hardware Security Review module. Strategy and stakeholders share one module; links and specifications share another. Action Planning retains its existing lane/card workflow alongside the main action register.

## 4. Build a general structure

The structure editor supports name, parent, type, identifier, description, and owner. Use it for products/systems/components, or workstreams/teams/deliverables. Types are configurable suggestions, and the type field also accepts your own wording.

The hierarchy supports up to eight levels and rejects cycles. Deleting a parent retains its children without a parent; the confirmation explains reference removal and Undo can restore the original structure. Existing assembly IDs remain valid relationship targets.

## 5. Configure risk deliberately

The blank workspace has no selected risk methodology. You can record unscored risks immediately.

Available configuration starting points:

- **Likelihood × Impact:** two dimensions, product calculation.
- **Multi-factor sum:** generic quality, cost, schedule, and reliability dimensions with editable scales.
- **V9.5 methodology:** the original four-factor scales, partial-assessment behavior, sum thresholds, and maximum-factor overrides for compatibility.

You can edit the name, use sum/product/maximum, define one to eight dimensions, set whole-number scale bounds from 0 through 100, describe scale values, and set ordered medium/high/critical thresholds. Optional per-dimension overrides can force high/critical treatment.

A newly saved assessment stores its scoring contract with the record. Changing the program default does not rescore existing assessments. Editing an assessed risk retains its recorded framework. Mixed-framework registers label each methodology and do not calculate a combined average. A mass conversion between methodologies is intentionally not provided.

New frameworks require every dimension before calculating a score. A blank value is unknown. Zero can be a valid score when the configured scale starts at zero. In migrated V9.5 records, zero retains its original “not assessed” meaning.

## 6. Connect records intentionally

Open a record and use **Everything related to this item → Link item**. Choose an existing target, relationship type, and optional note. Relationships can cross the main record collections. A dependency points from the dependent record to its prerequisite.

Existing explicit linked-ID fields are read by the same relationship engine. Matching titles, part numbers, or other text do not automatically become relationships. The relationship index, impact inspection, and risk dependency paths use intentional links. Inspection shows retained links into disabled modules and flags missing endpoints.

Deleting a referenced record removes its references in the same undoable transaction. Imports preserve unresolved references for review instead of silently erasing them. Use **Data integrity** to identify them.

Procurement has an explicit **Apply receipt to linked records** operation. It proposes changes only when the linked BOM/cost records and the required numeric inputs exist. Confirmed receipt application is recorded, prevents duplicate application, and can be undone. Each selected linked target receives the full quantity/value shown in the confirmation; split allocations should be entered manually.

## 7. Interpret metrics correctly

Record counts are actual counts. Performance metrics require their underlying inputs. “—”, “Not configured,” and “No data” are not measured zeroes.

For cost and EVM, leave unknown inputs empty. Enter `0` only when it is a known value. Aggregates require the applicable inputs for every included record. CPI requires actual cost greater than zero; SPI requires planned value greater than zero. EAC requires a valid positive CPI and a budget. Thresholds are optional and do not create an automatic overall program-health grade.

Test and requirement success summaries use the outcome mappings in Workflow & metrics. Unmapped, pending, and nonapplicable outcomes are excluded from the measured denominator. Home focuses on attention, dated upcoming work, recent activity, dependencies, and program contents.

## 8. Back up and resume

**Program Backup · JSON** includes settings, module configuration, all record collections (including disabled modules), relationships, ID counters, risk contracts, retained audit/history, RACI entries, saved filter presets, and remembered subviews.

Import first parses and validates a separate candidate state. A preview identifies the program, record count, and migration/reference warnings. Confirm replacement only after reviewing it. A failed import leaves the current program unchanged. An imported workspace can be undone during the current session.

The browser receives a download request; verify that the JSON appeared in your chosen download location. Session Mode retains no automatic copy. Trusted Device Mode, if deliberately enabled, keeps a current and previous device copy; see [data modes and security](data-and-security.md). CSV and Markdown exports are review copies, not complete backups.

## 9. Useful interactions

- `Ctrl+K`: global search.
- `Ctrl+E`: Program Backup.
- `Ctrl+,`: Settings.
- `Ctrl+I`: import outside a text field.
- Escape: close dialogs or detail views.
- Tab/Shift+Tab: move through forms; dialogs retain keyboard focus.
- Up/Down, Home/End: move through module navigation when it is focused.
- Sortable table headers support Enter/Space where applicable.

Use **Export → Print report** for a program report, or the browser's print command for the current module. Theme and layout preferences remain part of the exported configuration.
