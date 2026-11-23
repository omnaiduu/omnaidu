# How to write a post for omnaidu.com

This guide is for any AI (or person) writing or editing a post on omnaidu.com. These are defaults, not hard rules. If a post reads better another way, do that, and keep the goal in mind.

## The goal

The reader is usually someone deciding whether to hire Om: a recruiter skimming for 30 seconds, or an engineer reading closely. Both should come away knowing:

- **What I built**
- **What I used**
- **What happened**, with real numbers
- **How I did it**: data, method, how I checked it

If a recruiter reads only the top of the post, they should still get the first three.

## Voice

- Simple, clear Indian English. Short sentences. Write as "I": "I tried…", "I found…".
- Sound like a person explaining their work to a friend who is an engineer, not like a paper or a sales page.
- Explain each technical word once, in plain words, the first time it appears ("a reranker reads each passage together with the question and scores it"). Then use it freely.
- Use everyday examples where they help: a support email, a bill in rupees, a shop with one cashier.
- Prefer "91%" to "2,972 / 3,270". Prefer "$80 vs $9" to a paragraph of figures.
- No buzzwords ("revolutionary", "leveraging", "passionate"), and no filler intros.

## A good default shape

Adapt this freely. A short project might skip sections; a big one might add some.

1. **In short**: a `:::callout{tone="result" title="In short"}` with 3 bullets: what I built, what I used or compared with, what happened.
2. **The problem**: why this matters, with one concrete example.
3. **How it works**: the idea, plus one worked example (one small prompt, JSON or code snippet is better than three).
4. **Results**: one clear table. Bold the winner.
5. **What went wrong and what I learnt**: honest failures. Readers who hire trust this part most.
6. **Setup and method**: a compact two-column table: data and where it came from, splits and held-out tests, model and training settings, hardware, how answers were scored.
7. **Limits**: one run? synthetic data? untuned baseline? Say it.
8. **Tools I used**: one line, `·`-separated.

## Length

- Most posts: about 800–1,500 words (4–7 minutes).
- A big project can go to about 3,000 words if every section earns its place.
- If it is longer, move detail to the repo README and link to it. The post tells the story; the README holds every number, file path and setting.

## Keep, move or cut

**Keep in the post:**
- The key results, the method in brief, at least one failure, and fair comparisons.
- Quotes or links to well-known sources (papers, Anthropic, NVIDIA, Google docs) when they support a point.

**Move to the README:**
- Full hyperparameter lists, file names, every sub-table, per-label breakdowns, long reference lists.

**Cut:**
- Repeating the same result in several boxes.
- Long maths or cost calculations that don't change the conclusion.
- Explanations of internals that don't help the reader understand the result.

## Honesty rules

- Every number must come from the repo's results or the original write-up. Never invent or round in a misleading way.
- Don't oversell. If the baseline was untuned or the test was small, say "matched", not "beat", and give the caveat.
- Say which test set was held out and whether it was used while building.
- One post per project. Update the existing post instead of writing a second one on the same work.

## Formatting on this site

- **Blocks:** use a few on purpose.
  - At most one callout per point.
  - Use `:::theorem` / `:::lemma` / `:::definition` only for real maths, not as decoration.
  - `:::steps` is good for a pipeline.
  - `:::details` is fine for an optional deep-dive.
- **Top numbers:** `proofBenches` show as the 3 big numbers under the title. Give them readable labels ("Real shop receipts: trained vs plain"), not internal names ("Exam 4"). About 3 is right.
- **Currency:** write prices as `\$12.65`. An unescaped `$` next to short words like "vs" or "to" can render as maths.
- **Preview before publishing:** render the page locally (`npx vite dev`) and look at it on desktop and phone width. Check that every block actually renders, that tables fit, and that nothing shows as raw markup.

## Before you publish

- [ ] Could a recruiter get what / used / result from the first screen?
- [ ] Is every jargon word explained once?
- [ ] Is there a setup and method section an engineer would accept?
- [ ] Is at least one thing that did not work included?
- [ ] Is every number traceable to the repo?
- [ ] Previewed and checked on phone width?
- [ ] Old version backed up before overwriting a published post?
