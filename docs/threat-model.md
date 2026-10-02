# PMD trust boundaries

Reviewed for PMD 10.2. This is a bounded engineering review, not a penetration-test certification.

| Boundary | Threat | Controls and remaining limits |
| --- | --- | --- |
| Imported JSON → active workspace | Malformed fields, unsafe property names, excessive nesting, prototype collisions, incompatible schemas | Isolated validation precedes replacement. Shared limits cover total fields/text, depth and collection size. Consumed nested fields, risk keys, dates, counters and saved filters are checked. Unsupported inputs leave memory unchanged. Unknown JSON extension fields remain portable; they are not executed. |
| Program text → rendered views | Executable markup, unsafe URLs, event injection, nested active content | Escaped text, external handler registry, strict script CSP and a legacy sink guard. Nested templates, active embeds and SVG URL mutation are removed. Link tracking attributes are stripped. The guard supports PMD's templates; it is not a general-purpose rich-HTML sanitizer. Prefer `textContent` and explicit listeners in new code. |
| CSV/clipboard → spreadsheet | Formula-like user text interpreted by spreadsheet software | Shared cell encoding quotes CSV and prefixes formula-like strings, including whitespace/control-prefixed formulas. Numeric zero and negative measured numbers remain numbers. JSON is the fidelity-preserving backup format. Spreadsheet behavior still varies; treat external files as untrusted. |
| Download/share → user-selected destination | Lost backups or identifying filenames | Generic backup filenames. A requested download does not clear the unsaved marker until the user confirms retention. A check-only file workflow validates and compares content without importing. PMD cannot prove OS retention or control files after export. |
| Memory → IndexedDB | Unexpected persistence, quota failure, corrupted state, stale window overwrite | Explicit opt-in, validated current/previous snapshots, atomic transactions and revision checks. Revision-only window notices pause stale saving; no program content is broadcast. Failed writes preserve memory and the prior commit. Clearing affects both saved copies. No encryption or secure-erasure claim. |
| Hosted shell → service worker | Unrequested reload, stale code, caching private data | Relative project scope, exact public-shell allowlist, versioned cache, explicit update/reload confirmation and multi-window check. Exports, user records and third-party pages are not added to shell caches. |
| Repository → published app | Accidental real data or dependency changes | Blank production state, separate fictional fixtures, static scans, pinned development dependencies and pinned validation-action revisions. CI has read-only permissions and does not deploy or merge. Human review remains necessary. |

## Same-origin limitations

IndexedDB is isolated by **origin**, not by URL path. PMD includes its path in the database name to avoid accidental collisions, but another application served from the same scheme/host/port may access that origin's storage. A GitHub project URL and other project URLs under the same `username.github.io` host share an origin. Service-worker scope does not change this rule.

For data requiring a stronger boundary, use Session Mode and appropriately controlled backups, or host PMD on a dedicated trusted origin. Determine what your organization permits before entering data. A compromised PMD deployment, same-origin application, browser extension, browser profile or device can defeat application-level controls. Offline mode is not a substitute for device security.

## What this review changed

Browser probes reproduced accepted malformed nested notes/audit/filter metadata, risk field collisions, a prototype-shaped vendor rendering crash, unchecked nested template content and link tracking attributes. These cases now have regression tests. Additional tests cover formula exports, stale backup acknowledgments, calendar dates, safe counters, explicit form discard, and cross-window save/clear behavior.

## References

- [OWASP: CSV Injection](https://community.owasp.org/attacks/CSV_Injection) informed spreadsheet boundary checks.
- [MDN: template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) explains why nested template content needs separate handling.
- [MDN: Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) describes communication between eligible browser contexts; PMD sends revision notices only.
- [MDN: same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy) describes the browser boundary. Path-specific database names are not access controls.
