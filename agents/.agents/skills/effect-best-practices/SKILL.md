---
name: effect-best-practices
description: Dynamically researches the local Effect v4 source before writing Effect TypeScript code. Always use when creating, editing, reviewing, or answering questions about Effect, Effect.gen, Layer, Context, Scope, Schema, DateTime, Clock, TestClock, Stream, Sink, Chunk, Option, Either, Cause, Exit, or Effect services.
version: 1.1.0
---

# Effect Best Practices
If subagents are enabled in your environment, ask the `effect-source-researcher` subagent (or an ephemeral subagent if that's all you have) to inspect the current Effect v4 source tree at `/Users/peteredm/.reference/effect-v4` for the specific API or pattern you need. If do not have access to subagents, read through the same source yourself.

## Required workflow

1. Turn the task into one or more narrow research questions.
   - Good: “What is the idiomatic Effect v4 way to get the current datetime as a UTC ISO string?”
   - Good: “How does Effect v4 define and provide a service with Context/Layer?”
   - Avoid vague: “How do I use Effect?”
2. Call the subagent before coding:

```ts
subagent({
  agent: "effect-source-researcher",
  context: "fresh",
  task: `You are in the Effect source code repository at /Users/peteredm/.reference/effect-v4.

Question: <specific Effect API/pattern question>

Search the source, tests, docs, and examples for the current idiomatic v4 approach. Return a concise answer with TypeScript snippets and file references.`
})
```

3. Base the implementation on the subagent’s answer, not memory.
4. If the subagent reports ambiguous or missing evidence, either ask a narrower follow-up or choose the safest minimal Effect pattern and mention the uncertainty.

## Output expectations

When using the answer in code or prose, include the core idiom and any important caveat, for example whether the API uses the `Clock` service and is therefore `TestClock`-friendly.

## Do not

- Do not rely on stale Effect v2/v3 habits without checking the v4 source.
- Do not invent APIs from memory.
- Do not skip the subagent for “small” Effect snippets; the point of this skill is live source-backed guidance.
