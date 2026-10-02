# Security and private data

PMD is a local-data application served as static files. Session Mode is the default. Trusted Device Mode is an explicit opt-in. There is no PMD account, backend, analytics, synchronization or application-provided encryption.

Do not put program exports, proprietary data, credentials or private screenshots in public issues, pull requests, test fixtures or this repository. Use only clearly fictional material to reproduce problems.

For a suspected security issue, use GitHub's **Report a vulnerability** option if it is enabled for this repository. Otherwise contact the repository owner privately before sharing exploit details. Private vulnerability reporting must be enabled by the repository owner; this file does not claim it is enabled.

Useful reports describe the affected PMD version, browser, steps, expected behavior, observed behavior and a minimal synthetic input. Never include a real program backup.

See [the data model and privacy guidance](docs/data-and-security.md) and [the threat model](docs/threat-model.md). Testing reduces specific risks; it does not establish certification or guarantee security. Browser profiles, extensions, the operating system and other applications on the same web origin are outside PMD's isolation boundary.
