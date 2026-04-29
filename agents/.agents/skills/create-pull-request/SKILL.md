---
name: create-pull-request
description: Create a pull request for the current branch.
compatibility: opencode
---

using the github cli, create a pull request. here's a good example of a pr:

<pr>
<title>
feat(api): add wide event logging for rpc handlers
</title>
<description>
**summary**
we've been experiencing memory spikes in production and needed better observability into what's happening during RPC requests. this PR adds "wide event" logging to apps/api - a structured logging pattern where each request emits a single log entry containing all relevant context.

the wide event middleware captures standard HTTP metadata (method, path, status, duration, railway edge headers) automatically. handlers can then annotate requests with domain-specific context using `annotateWideEvent()`, which deep-merges properties and strips undefined values to keep logs clean.

we've instrumented all RPC handlers with annotations that will help debug memory issues:
- input sizes (`source_length_chars`, `html_length_chars`)
- output sizes (`output_length_bytes`, `pptx_buffer_length_bytes`)
- configuration (`dpi`, `page_format`, `css_urls`)
- result metadata (`slide_count`, google slides `url`)

**testing**
- bun typecheck
- bun lint
</description>
</pr>

notice:
 - all lowercase text, except for source code blocks
 - narrative style summary, no mention to specific lines or files or niche technical details
 - provide a clearly readable explanation of what and why, not the precise how
