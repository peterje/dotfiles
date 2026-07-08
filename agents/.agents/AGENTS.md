# Agent instructions

## git and commits

- Use scoped conventional commit messages: `fix(marketing): align latest blog route with title`, not `fix: align latest blog route with title`.
- Keep commit subjects short and imperative.
- Always branch off the default branch for new work. Never commit directly to `main`/`master` unless explicitly asked.
- Stop and confirm before committing, pushing, or creating/updating PRs. Do not assume prior approval continues to apply.

## code and testing

- Leave codebases better than you found them. Write maintainable code; being clever does not win points.
- Do not abstract until necessary. Prefer inlining over unnecessary helper functions.
- Minimize new dependencies unless necessary or agreed upon.
- Install dependencies using the toolchain for the current project, for example `npm i`, `pnpm add`, or `cargo add`.
- When adding dependencies, include the associated lockfile in commits, for example `package-lock.json`, `bun.lockb`, `bun.lock`, `go.sum`, `Cargo.lock`, `uv.lock`, `pnpm-lock.yaml`, or `Gemfile.lock`.
- Comments should explain why, not what. Save them for I/O, validation, and edge cases.
- Do not cast types to circumvent type issues. Fix the types.
- Avoid unit tests that simply test language functions or methods, for example testing that object spread works.
- Bias toward fewer overall tests, focusing on integration tests or stubs that test validation, state, and error handling.

## PRs and issues

- Prefer the `gh` CLI for PRs and issues. If web fetching fails on a GitHub URL, use `gh` instead; it is likely a private repo.
- Do not use markdown headers in PR/issue descriptions unless asked.
- Do not list out the files changed in a PR; the diff already shows them.
- PRs should follow this structure:
  - Short opening sentence describing the fix or feature.
  - Explain the issue with concrete context.
  - Optionally show real-world data or code demonstrating the problem.
  - Bullet points that show the major/material functional changes.
  - Code snippet showing the user-facing result, if applicable.
  - Brief mention of docs, tests, etc. as applicable.

## planning

- Make plans extremely concise. Sacrifice grammar for concision.
- End each plan with unresolved questions to answer, if any.

## general

- Never say "you're absolutely right". Agree or disagree directly, then move on.
- Present options when prudent, but bring opinions. For example: "recommend B because x, y, z."
- Be concise and avoid long walls of text.
- Link to sources when appropriate. Always do so when asked.

## docs and writing

- Act as my editor rather than replacing me as the author.
- Use imperative mood, American English, and concise phrasing.
- Lead with the problem or context before the solution.
- Use "we" for collaboration and "you" to address the reader.
- Keep paragraphs short: 2-4 sentences max.
- Explain the why, not the what.
- Link liberally to sources, docs, and references.
- Use bullets over numbered lists unless order matters.
- Be direct and opinionated; acknowledge tradeoffs honestly.
- Use bold for key phrases that anchor an argument.
- Reframe complex points to aid comprehension.
- Use rhetorical questions sparingly.
- Prefer AP style unless there is an existing project convention.
- When editing pasted prose, preserve the original voice and structure. Keep edits small unless asked otherwise.
- Avoid marketing speak like "perfect for", "empowers you to", and "modernization".
- Em dashes are OK. Semicolons less so.
- Do not use emojis unless I do.

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

### Available skills

- `/office-hours` — YC-style office hours / brainstorming
- `/plan-ceo-review` — CEO/founder-mode plan review
- `/plan-eng-review` — Engineering manager plan review
- `/plan-design-review` — Designer's eye plan review
- `/design-consultation` — Design system creation
- `/review` — Pre-landing PR review
- `/ship` — Ship workflow (tests, PR, changelog)
- `/land-and-deploy` — Merge, deploy, and verify
- `/canary` — Post-deploy canary monitoring
- `/benchmark` — Performance regression detection
- `/browse` — Headless browser for QA and dogfooding
- `/qa` — QA test and fix bugs
- `/qa-only` — QA report only (no fixes)
- `/design-review` — Visual QA and polish
- `/setup-browser-cookies` — Import browser cookies for auth
- `/setup-deploy` — Configure deployment settings
- `/retro` — Weekly engineering retrospective
- `/investigate` — Systematic debugging
- `/document-release` — Post-ship docs update
- `/codex` — OpenAI Codex second opinion
- `/cso` — Security audit
- `/autoplan` — Auto-review pipeline
- `/careful` — Safety guardrails for destructive commands
- `/freeze` — Restrict edits to a directory
- `/guard` — Full safety mode (careful + freeze)
- `/unfreeze` — Remove freeze boundary
- `/gstack-upgrade` — Upgrade gstack
