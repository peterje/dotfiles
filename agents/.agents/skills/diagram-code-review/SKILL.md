---
name: diagram-code-review
description: Run an extremely strict maintainability review for abstraction quality, giant files, spaghetti-condition growth, and API-design drift away from fig's zen. Use for a thermo-nuclear code quality review, thermonuclear review, deep code quality audit, or especially harsh maintainability review.
disable-model-invocation: true
---
# Thermo-Nuclear Code Quality Review

Use this skill for an unusually strict review focused on implementation quality,
maintainability, abstraction quality, API design, and codebase health.

Above all, this skill should push the reviewer to be **ambitious** about
structure. Do not merely identify local cleanup opportunities. Actively search
for "code judo" moves: restructurings that preserve behavior while making the
implementation dramatically simpler, smaller, more direct, and more elegant.

**This is a pre-1.0 library with no external users. There is no backward-compat
obligation. Renaming, deleting, or wholesale replacing an API is cheap and
encouraged. Prefer the right design over the compatible one, always.**

## The Zen We Are Defending

Every review decision serves these principles:

1. There should be one, and ideally only one, way of doing things.
2. The obvious solution should be the right one.
3. It should be hard to make bad-looking diagrams; defaults should be what you
   want most of the time.
4. You should not have to compile a diagram to imagine what it looks like.
5. The API should feel composable with similar patterns throughout.
6. The author never computes geometry the library can compute. If correct output
   requires solving for coordinates the library could derive, that computation
   belongs in the library — solved deterministically or failing loudly, never
   silently wrong. (This is load-bearing: diagrams are generated blind, without
   rendering and iterating.)

A change that adds a second way to do something, or pushes computation the
library should own onto the author, is a design regression even if it works.

## Core Prompt

Start from this baseline:

> Perform a deep code quality audit of the current branch's changes.
> Rethink how to structure / implement the changes to meaningfully improve code
> quality without impacting behavior — and where the *public API* drifts from the
> zen, propose replacing it outright. There is no backward-compat constraint.
> Work to improve abstractions, modularity, reduce spaghetti code, improve
> succinctness and legibility, and collapse multiple ways of doing one thing into
> one.
> Be ambitious. If there is a clear path to a better design that involves
> deleting or replacing an existing API, go for it.
> Be extremely thorough and rigorous. Measure twice, cut once.

## Non-Negotiable Additional Standards

Apply the baseline prompt above, plus these explicit review rules:

0. **Be ambitious about structural simplification — including deleting APIs.**
   - Do not stop at "this could be a bit cleaner."
   - Look for opportunities to reframe the change so that whole branches, helpers,
     modes, conditionals, layers, or *entire public functions* disappear.
   - Prefer the solution that makes the code feel inevitable in hindsight.
   - Assume there is often a "code judo" move available: a re-organization that
     uses the existing architecture more effectively and makes the change
     dramatically simpler.
   - **Backward compatibility is not a reason to keep anything.** If an API is
     wrong, propose replacing it, not wrapping it. No deprecation shims, no
     compat layers, no "keep the old one too."
   - If you see a path to delete complexity rather than rearrange it, push hard
     for that path.

1. **Enforce "one way to do it." Two APIs for the same concept is a blocker.**
   - If the diff adds a second path to an existing capability (a new overload, a
     parallel constructor, a sugar form that forks the call shape), treat it as a
     design regression by default.
   - Sugar is only acceptable when it is overwhelmingly the common case AND it
     does not make the reader learn two contradictory argument shapes. When in
     doubt, collapse to one form.
   - If a primitive quietly accepts two contradictory argument sets, split them
     into distinct named things or pick one. Do not overload a noun to mean two
     concepts (e.g. a profile and a cross-section both called `section`).

2. **Enforce the zen's "intent owns geometry" rule.**
   - Flag any public API that forces the author to supply *computed* coordinates —
     intersection corners, tangent points, winding-ordered vertices — that the
     library could derive from a simpler statement of intent.
   - Prefer an intent-level operator (`cut(solid, plane)`) over a coordinate dump
     (`section([...corners])`), even when the operator breaks the "constructors
     only" grain. The safety win under blind generation outweighs the consistency
     cost — but the tradeoff must be made consciously, not by accident.
   - Distinguish "meaning expressed as points" (legitimate — a polygon's vertices
     *are* its meaning) from "geometry the author had to pre-solve" (a smell).
   - Any operator that consumes geometry must **fail loudly** on degenerate input.
     Silent empty/wrong output is the worst outcome under blind generation. Flag
     missing loud-failure paths as a blocker.

3. **Enforce "one gesture, one signature" across families of primitives.**
   - When several primitives share a gesture (e.g. solids that are all upright
     sweeps), they should share a call shape and vary only in the one slot that
     distinguishes them.
   - Flag a new primitive that joins such a family with a gratuitously different
     signature, a different origin/axis convention, or a different label hook.
   - Reject an abstraction whose "base" cannot host every member of the family
     (e.g. a profile-extrude base that can't express `cylinder`). The shared
     concept must actually be shared.

4. **Do not let a PR push a file from under 1k lines to over 1k lines without a
   very strong reason.**
   - Treat this as a strong code-quality smell by default.
   - Prefer extracting helpers, subcomponents, modules, or local abstractions.
   - If the diff crosses that threshold, explicitly ask whether the code should be
     decomposed first.
   - Only waive this if there is a compelling structural reason and the resulting
     file is still clearly organized.

5. **Do not allow random spaghetti growth in existing code.**
   - Be highly suspicious of new ad-hoc conditionals, scattered special cases, or
     one-off branches inserted into unrelated flows.
   - If a change adds "weird if statements in random places", treat that as a
     design problem, not a stylistic nit.
   - Prefer pushing logic into a dedicated abstraction, helper, state machine,
     policy object, or separate module instead of tangling an existing path.

6. **Bias toward cleaning the design, not just accepting working code.**
   - If behavior can stay the same while the structure becomes meaningfully
     cleaner, push for the cleaner version.
   - Strongly prefer simplifications that remove moving pieces altogether over
     refactors that merely spread the same complexity around.

7. **Prefer direct, boring, maintainable code over hacky or magical code.**
   - Treat brittle, ad-hoc, or "magic" behavior as a code-quality problem.
   - Be skeptical of generic mechanisms that hide simple data-shape assumptions.
   - Flag thin abstractions, identity wrappers, or pass-through helpers that add
     indirection without buying clarity.

8. **Push hard on type and boundary cleanliness when they affect maintainability.**
   - Question unnecessary optionality, `unknown`, `any`, or cast-heavy code when a
     clearer type boundary could exist.
   - Prefer explicit typed models or shared contracts over loosely-shaped ad-hoc
     objects.
   - If a branch relies on silent fallback to paper over an unclear invariant, ask
     whether the boundary should be made explicit instead. Under the zen, an
     explicit loud boundary beats a silent fallback every time.

9. **Keep logic in the canonical layer and respect the public-surface rules.**
   - Call out feature logic leaking into shared paths or implementation details
     leaking through APIs.
   - Enforce fig's surface conventions: shared primitives at the root, domain
     recipes behind focused submodules, no implementation engines exported, frame
     callbacks expose a small local mark language (not arbitrary root SVG
     primitives).
   - Enforce the options-vs-children litmus: canonical meaning → structured
     options; author-directed composition in a local space → frame callback /
     children. Flag generic children bolted onto recipe APIs, and one-off options
     that really belong to a frame.
   - Enforce label ownership: routine measurement labels go through measured marks,
     not hand-placed coordinates/offsets.

10. **Treat unnecessary sequential orchestration and non-atomic updates as design
    smells when the cleaner structure is obvious.**
    - If independent work is serialized for no good reason, ask whether it should
      run in parallel.
    - If related updates can leave state half-applied, push for a more atomic
      structure.

## Primary Review Questions

For every meaningful change, ask:

- Is there a "code judo" move that would make this dramatically simpler?
- **Should we just delete or replace the existing API instead of extending it?**
- **Does this add a second way to do something we already do one way?**
- **Does this force the author to compute geometry the library could derive?**
- **If this joins a family of primitives, does it share their call shape?**
- Can this be reframed so fewer concepts, branches, or helper layers are needed?
- Does this improve or worsen the local architecture?
- Did the diff add branching complexity where a better abstraction should exist?
- Did a cohesive module become more coupled, stateful, or harder to scan?
- Is this logic living in the right file, layer, and public submodule?
- Did this change enlarge a file past a healthy size boundary?
- Are there repeated conditionals signaling a missing model or helper?
- Is the implementation direct and legible, or special-cased and incidental?
- Is this abstraction actually earning its keep, or is it just a wrapper?
- Did the diff introduce casts, optionality, or ad-hoc shapes that obscure the
  real invariant — or a silent fallback where a loud failure belongs?
- Does an operator that consumes geometry fail loudly on degenerate input?
- Is this orchestration more sequential or less atomic than it needs to be?

## What to Flag Aggressively

Escalate findings when you see:

- A complicated implementation where a cleaner reframing could delete whole
  categories of complexity.
- **A new API that duplicates an existing capability instead of replacing it.**
- **A public API forcing authors to hand-author computed coordinates the library
  should derive.**
- **An operator consuming geometry with no loud-failure path for degenerate
  input.**
- **A noun overloaded to mean two different concepts.**
- **A primitive joining a family with a gratuitously different signature.**
- Refactors that move code around but fail to reduce the number of concepts a
  reader must hold in their head.
- A file crossing 1000 lines due to the PR, especially if the new code could split.
- New conditionals bolted onto unrelated code paths.
- One-off booleans, nullable modes, or flags that complicate existing control flow.
- Feature-specific logic leaking into general-purpose modules or the wrong submodule.
- Generic "magic" handling that hides simple structure.
- Thin wrappers or identity abstractions that add indirection.
- Unnecessary casts, `any`, `unknown`, or optional params that muddy the contract.
- Silent fallbacks papering over an unclear invariant.
- Copy-pasted logic instead of extracted helpers.
- Narrow edge-case handling buried in an already busy function.
- Refactors that pass tests but make the code less modular or readable.
- "Temporary" branching that is likely to become permanent debt.
- Bespoke helpers where a canonical utility already exists.
- Generic children bolted onto a recipe API; one-off options that belong to a frame.
- Hand-placed measurement labels where a measured mark should own placement.

## Preferred Remedies

When you identify a code-quality problem, prefer suggestions like:

- **Delete the old API and replace it — do not wrap or deprecate it.**
- **Collapse two ways of doing something into the one right way.**
- **Replace a computed-coordinate input with an intent-level operator that derives
  the geometry.**
- **Unify a primitive's signature with the rest of its family.**
- Delete a whole layer of indirection rather than polishing it.
- Reframe the state model so conditionals disappear instead of getting centralized.
- Change the ownership boundary so the feature becomes a natural extension of an
  existing abstraction.
- Turn special-case logic into a simpler default flow with fewer exceptions.
- Extract a helper or pure function.
- Split a large file into smaller focused modules.
- Replace condition chains with a typed model or explicit dispatcher.
- Separate orchestration from business logic.
- Collapse duplicate branches into a single clearer flow.
- Make type boundaries explicit and fail loudly instead of falling back silently.
- Move logic to the package/module/submodule that already owns the concept.
- Parallelize independent work when that also simplifies the orchestration.

Do not be satisfied with "maybe rename this" when the real issue is structural.
Do not be satisfied with a merely cleaner version of the same messy idea if there
is a plausible path to a much simpler idea — including throwing the API away.

## Review Tone

Be direct, serious, and demanding about quality.
Do not be rude, but do not soften major maintainability issues into mild suggestions.
If the code is making the codebase messier, say so clearly.
If the implementation missed an opportunity for a dramatic simplification — or
should have replaced an API outright — say that clearly too.

Good phrases:

- `this pushes the file past 1k lines. can we decompose this first?`
- `this adds a second way to do something we already do. let's delete the old path and keep one.`
- `there's no compat constraint here — let's just replace this API rather than wrap it.`
- `this makes the author compute coordinates the library could derive. let's take intent and solve it internally.`
- `this operator silently no-ops on bad input. it needs to fail loudly under blind generation.`
- `this primitive joins the solids family with a different signature. can we match the shared call shape?`
- `we're overloading this noun for two concepts. let's rename one.`
- `this adds another special-case branch into an already busy flow. can we move this behind its own abstraction?`
- `this works, but it makes the surrounding code more spaghetti. let's keep the behavior and restructure.`
- `this abstraction seems unnecessary. can we just keep the direct flow?`
- `i think there's a code-judo move here that makes this much simpler. can we reframe this so these branches disappear?`
- `this refactor moves complexity around, but doesn't really delete it. is there a way to make the model itself simpler?`

## Output Expectations

Prioritize findings in this order:

1. Zen violations: a second way to do one thing; author-computed geometry the
   library should own; a primitive breaking its family's signature
2. Structural code-quality regressions
3. Missed opportunities for dramatic simplification / code-judo restructuring —
   including deleting or replacing an API
4. Spaghetti / branching complexity increases
5. Boundary / abstraction / type-contract problems (incl. silent fallbacks where
   loud failure belongs)
6. File-size and decomposition concerns
7. Modularity, surface-convention, and legibility concerns

Do not flood the review with low-value nits if there are larger structural issues.
Prefer a smaller number of high-conviction comments over a long list of cosmetic
notes.

## Approval Bar

Do not approve merely because behavior seems correct.
The bar for approval is:

- no clear structural regression
- no second way to do something the library already does one way
- no API that forces the author to compute geometry the library could derive
- no geometry-consuming operator missing a loud-failure path
- no primitive that breaks its family's shared signature
- no obvious missed opportunity to make the implementation dramatically simpler
  when such a path is visible — including replacing an API outright
- no unjustified file-size explosion
- no obvious spaghetti-growth from special-case branching
- no hacky/magical abstraction that makes the code harder to reason about
- no unnecessary wrapper/cast/optionality churn, and no silent fallback where a
  loud boundary belongs
- no architecture-boundary leak, surface-convention violation, or avoidable
  canonical-helper duplication

Treat these as presumptive blockers unless the author can justify them clearly:

- the PR keeps an inferior API for compat reasons (there is no compat constraint —
  replace it)
- the PR adds a second way to do an existing thing
- the PR makes the author hand-author computed coordinates instead of stating intent
- the PR adds a geometry-consuming operator that can fail silently
- the PR preserves incidental complexity when a code-judo move would delete it
- the PR pushes a file from below 1000 lines to above 1000 lines
- the PR adds ad-hoc branching that tangles an existing flow
- the PR scatters feature checks across shared code
- the PR adds an unnecessary abstraction, wrapper, or cast-heavy contract
- the PR duplicates an existing helper or puts logic in the wrong layer/submodule

If those conditions are not met, leave explicit, actionable feedback and push for
a cleaner decomposition — or for throwing the API away and replacing it.
