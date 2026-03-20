# Blog Style Guide

## Philosophy

Write for practitioners with skin in the game. Your reader builds systems, ships code, and makes decisions under uncertainty. They don't need motivation — they need signal. Respect their time by leading with insight, backing claims with evidence, and cutting everything that doesn't earn its place.

The best technical writing reads like a brilliant colleague walking you through something they actually built. Not a tutorial. Not a press release. A conversation between equals.

---

## Voice & Tone

### Core Identity

- **Practitioner-first** — Write from the perspective of someone who has done the work, not someone who has read about it. Your credibility comes from showing your process, including the dead ends.
- **Direct without being terse** — Every sentence earns its place, but don't starve the reader of context. Provide enough scaffolding that someone slightly outside your domain can follow along.
- **Opinionated with receipts** — Take positions. "I think X because Y" is more useful than a balanced survey of everything. But show the reasoning, cite the data, and acknowledge where you might be wrong.
- **Conversational formality** — Professional register without corporate stiffness. Contractions are fine. First person is fine. Swearing is not.

### Calibrated Confidence

Vary your certainty based on actual confidence. This is how practitioners actually think:

- Strong conviction: "The economics favor multi-tenancy. Full stop."
- Moderate confidence: "My guess is that all of the following had to come together for this to work."
- Speculation: "I suspect the only way we made this work is through incredibly strong product-led growth."
- Acknowledged ignorance: "I don't have a good model for this yet."

Don't hedge everything uniformly. That signals you have no actual opinion. Don't assert everything uniformly either. That signals you haven't thought carefully.

### What to Avoid

- **Marketing speak** — "game-changing", "revolutionary", "unlock", "supercharge". If the work is impressive, the numbers will show it.
- **Excessive hedging** — "it seems like maybe possibly". Pick a confidence level and commit.
- **Apologetic preamble** — "Sorry this is long", "I'm no expert but", "This might be obvious". If it's worth writing, just write it.
- **Inflated scope claims** — "A Complete Guide to X" when it covers 30% of X. Be honest about what you're covering.
- **Emoji in prose** — Almost never. One or two in an aside is the ceiling. 👌 is acceptable if used very sparingly for code output. 🚀 is never acceptable.
- **Hashtag culture** — No #distributed-systems or #ML vibes. This isn't LinkedIn (even when posting on LinkedIn).

---

## Structure

### Article Anatomy

```
Title (specific, often a subtitle with a colon or dash)
Date
Optional: one-line context setter or embedded tweet
Body sections with clear H2 headers
Code / data / charts woven throughout
Practical takeaways (when relevant)
Acknowledgements or related work
Footnotes for tangents
```

### Titles

Good titles are specific and signal-dense. They tell the reader exactly what they're getting.

**Strong patterns:**
- Quantified results: "Building a high recall vector database serving 1 billion embeddings from a single machine"
- Problem framing: "Why software projects take longer than you think: a statistical model"
- Declarative stance: "Software companies buying software: a story of ecosystems and vendors"
- Practitioner framing: "The hacker's guide to uncertainty estimates"

**Weak patterns:**
- Vague clickbait: "You Won't Believe What Happened When We Tried X"
- Overly broad: "Thoughts on Infrastructure"
- Question-only: "Is Open Source Dead?" (works as a section header, not a title)

### Opening Paragraph

The first paragraph is a filter. It should let the right reader know they're in the right place and the wrong reader bail quickly. Lead with the core insight, the motivating question, or a concrete result.

**Strong openings:**

Starting with a motivating observation:
> "Anyone who built software for a while knows that estimating how long something is going to take is hard. It's hard to come up with an unbiased estimate of how long something will take, when fundamentally the work in itself is about solving something."

Starting with the result, then unwinding:
> "I decided to experiment with writing an object store from scratch as a fun learning exercise, and to see how much I could get out of NVMe disks I had on my bare metal machines."

Starting with a provocative framing:
> "If we consider life to be a sort of open-ended MMO, the game server has just received a major update."

**Weak openings:**
- "In this blog post, I will discuss..."
- "As we all know, [obvious thing]..."
- A dictionary definition of the topic

### Section Headers

Use H1 (`#`) for the article title only. Use H2 (`##`) for major sections. Use H3 (`###`) for subsections within a section.

Headers should be short, declarative, and scannable:
- "Enter the cloud" not "A Discussion of How Cloud Computing Changed Things"
- "Direct I/O" not "Using Direct I/O for Better Performance"
- "Bootstrapping, rebooted" — wordplay is fine if it's brief and actually clever

### Paragraphs

- **3-5 sentences typical.** One-sentence paragraphs are fine for emphasis. Eight-sentence paragraphs are too dense.
- **One idea per paragraph.** If you're covering two things, split.
- **Transition naturally.** You don't need "Furthermore" and "Moreover." The logical flow should carry the reader.
- **Short sentences for impact.** Long sentences for nuance. Vary the rhythm.

### Lists

Lists are a tool, not a default. Use prose for explanation and narrative. Use lists for:

- Enumerating discrete, parallel items (dependencies, configuration options, benchmark results)
- Steps in a process where order matters
- Quick comparisons where a table would be overkill

Never use bullet points for content that should be a flowing argument. If each bullet is 3+ sentences, it should be paragraphs.

### Footnotes

Use footnotes for interesting tangents that would break the flow of the main argument. Footnotes are a gift to the reader — they signal "this is a bonus, not required reading." Erik Bernhardsson's style of footnotes that contain entire mini-arguments is excellent.

---

## Technical Content

### Code: The Core Differentiator

Code is what separates practitioner writing from punditry. Show real, working code from actual projects. This is the single biggest signal that you have skin in the game.

**Principles:**

- **Real over toy** — Use code from your actual work, not contrived examples. If you must simplify, say so: "This is simplified for brevity."
- **Runnable when possible** — The reader should be able to copy-paste and get a result. Include imports, setup, and data generation.
- **Context before code** — Explain what problem the code solves before showing it. "We need to fit a model and estimate uncertainty at the same time" → code block.
- **Comments for the non-obvious** — Don't comment `x = x + 1`. Do comment `# Note: we add the random term to the predictions!` when it's the key insight.
- **Language-specified code blocks** — Always use fenced code blocks with the language identifier.

```python
# Good: real code with context
def neg_log_likelihood(tup, xs, ys):
    k, m, log_sigma = tup
    sigma = numpy.exp(log_sigma)
    delta = model(xs, k, m) - ys
    return len(xs)/2*numpy.log(2*numpy.pi*sigma**2) + \
        numpy.dot(delta, delta) / (2*sigma**2)
```

```rust
// Good: production code that shows actual design decisions
impl UringFile {
  async fn read_at(&self, offset: u64, len: u64) -> Vec<u8> {
    let (tx, rx) = oneshot::channel();
    self.userspace_requests_queue.send(Request::Read {
      req: ReadRequest { out_buf: vec![0u8; len], offset, len: u32!(len) },
      res: tx,
    });
    rx.await
  }
}
```

**Anti-patterns:**
- Pseudocode that can't run
- Code without surrounding explanation
- Fifty lines with no comments in a teaching context
- `# TODO: implement this` in published code

### Data & Benchmarks

Numbers are persuasive. Vague claims are not.

- **Tables for precise comparisons** — When you have multiple metrics across multiple conditions, use a table. Don't narrate what a table can show at a glance.

| Store | 12 KB | 77 KB | 338 KB | 1.4 MB | 9.7 MB |
|-------|-------|-------|--------|--------|--------|
| **blobd** | **0.330 ms** | **0.339** | **0.380** | **0.360** | **0.553** |
| xfs | 22.527 | 23.065 | 22.593 | 22.225 | 22.321 |
| minio | 66.454 | 69.126 | 85.882 | 105.755 | 195.205 |

- **Specify your setup** — Hardware, OS, kernel version, compiler flags. Practitioners will ask; answer preemptively.
- **Acknowledge limitations** — "Note that I'm comparing specifically around performance, which is what blobd is designed for. Other systems were designed with additional goals in mind."
- **Show your work** — Link to repos, notebooks, datasets. "The code is on my GitHub, as usual."

### Charts & Diagrams

Charts should convey what prose cannot. They should not decorate.

- **Labeled axes.** Always. Include units.
- **Uncertainty when possible.** Confidence intervals, error bars, shaded regions. This is the single biggest upgrade to most technical charts.
- **Clean, minimal styling.** No 3D effects, no gratuitous color gradients, no chartjunk. Matplotlib defaults are fine if the data is clear.
- **Inline placement** — Charts go where they're discussed, not in an appendix.
- **Diagrams for architecture** — Simple box-and-arrow diagrams for system design. ASCII art is fine for inline:

```
┌────────────────────┬────────────────────┐
│  Main Content      │  Sticky Sidebar    │
│  (prose, ideas)    │  (code, examples)  │
└────────────────────┴────────────────────┘
```

### Math & Equations

Use math when it clarifies. Skip it when prose suffices.

- **Inline for simple expressions:** The confidence interval is x̄ ± 1.96σ/√n.
- **Block format for derivations** — When the equation is the point, give it space.
- **Always define variables on first use** — "where x̄ is the mean and σ is the standard deviation."
- **Intuition first, formalism second** — "Intuitively the reason the mean is so large is that tasks that complete faster than estimated have no way to compensate for the tasks that take much longer." Then show the math.
- **Memorable heuristics** — "The size of the confidence interval is inversely related to the square root of the number of samples. If you want to detect a 1% difference then you need something on the order of 0.01⁻² = 10,000 samples."

### Citations & Links

- **Link liberally to primary sources** — Papers, repos, documentation. Not aggregator articles.
- **Inline links for flow** — "I wrote a lot about this [in a previous blog post](url)."
- **Numbered footnotes for substantive asides** — When a citation needs context or argument.
- **Credit generously** — "Thanks to Jim Savage for some feedback on an earlier draft!"
- **Link to your own prior work** — Build a web of interconnected ideas across posts.

---

## Visual Design & Layout

### Design Philosophy

Borrowed from Vercel's Geist system and Eric Jang's minimalism: the design should be invisible. The reader should see content, not chrome.

- **Monochrome foundation** — Black text on white/cream. Color only for links, code highlighting, and chart data.
- **Generous whitespace** — Let content breathe. Dense walls of text signal "this wasn't edited."
- **Single column for narrative** — The main content column should be 60-80 characters wide for comfortable reading.
- **Typography does the heavy lifting** — Clean sans-serif for prose, monospace for code. Strong hierarchy through size and weight, not color or decoration.

### Desktop Layout

For long-form technical posts with code, the sticky sidebar pattern works well:

```
┌─────────────────────────────────────────┐
│ Minimal nav (name, date, maybe tags)    │
├────────────────────┬────────────────────┤
│                    │                    │
│  Prose / argument  │  Code / data /    │
│  (scrolls)         │  charts (sticks)  │
│                    │                    │
└────────────────────┴────────────────────┘
```

This lets the reader follow the argument while keeping the relevant code or data in view. Use native CSS `position: sticky` — no JavaScript required.

For simpler posts without a sidebar, a centered single column at ~800px max-width is clean and readable.

### Mobile

- Stack to single column
- Code blocks should scroll horizontally, not wrap
- Tables should scroll horizontally
- 16px+ body text
- Consider a note: "This content is best viewed on desktop" for heavily visual/code-heavy posts

### Typography Specifics

```
Body text:       16px, line-height 1.6-1.8
Code blocks:     14px monospace, generous padding
H1 (title):      28-36px, bold
H2 (section):    22-26px, bold
H3 (subsection): 18-20px, bold or semi-bold
Footnotes:       14px
```

Use a system font stack or a clean web font (Inter, Geist Sans, -apple-system). For code, use a proper monospace (Geist Mono, JetBrains Mono, SF Mono).

---

## Content Types & Patterns

### Deep Technical Build Posts (Wilson Lin style)

Structure: "I built X. Here's what I learned, in excruciating useful detail."

- **Lead with the result** — Performance numbers, what it does, why it matters.
- **Table of contents** — For posts >15 min read, a TOC respects the reader's time.
- **Show the evolution** — "Initial attempt" → "Problems with that" → "Better design." Don't pretend you got it right the first time.
- **Benchmark honestly** — Test against real alternatives. Acknowledge their different design goals.
- **Hardware details** — CPU, RAM, disk specs, OS, kernel version. Practitioners care.
- **Open source it** — Link to the repo. Let people verify your claims.

### Systems Thinking / Thesis Posts (Erik Bernhardsson style)

Structure: "Here's a model for understanding why [phenomenon] is happening."

- **Start with the observation** — "Why are new startups growing so fast? Why is the wage distribution getting larger?"
- **Build the model incrementally** — Each section adds a layer. Use diagrams to show the evolving picture.
- **Ground in personal experience** — "A long time ago, I spent seven years at Spotify." Your own experience makes abstract claims concrete.
- **Connect to broader implications** — Don't just describe; predict. "My prediction is all this VPC and BYOC stuff will be seen as outdated in a few years."
- **Acknowledge self-interest** — "If you're familiar with my background, this blog post might come off as a bit self-serving!" Transparency builds trust.
- **Use tweets as evidence** — Embedding your own past tweets shows you've been thinking about this for a while, not just chasing a trend.

### Quantitative / Statistical Posts (Erik Bernhardsson style)

Structure: "Here's a question → here's data → here's a model → here's what it means."

- **Concrete example first** — "Let's generate some data. We're going to generate a fake time series of elephant weights." Never start with abstract formalism.
- **Iterative complexity** — Start with the simplest model, show its limitations, then upgrade. Bootstrap → MLE → MCMC is a natural ramp.
- **Show every chart** — Each method gets a chart. Each chart gets an explanation. The reader should be able to follow the visual story even without the code.
- **Memorable takeaways** — "People estimate the median completion time well, but not the mean." One sentence that sticks.
- **All code on GitHub** — Always. No exceptions.

### Commentary / Analysis Posts

- **Take a clear position** — "I don't think open source is dead, but I think it makes sense only for a very small set of software products today."
- **Support with structural reasoning** — Not just opinions, but models of why things are the way they are.
- **Link heavily** — Primary sources, data, prior work. Let the reader go deeper.
- **End with implications** — What should the reader do differently given this analysis?

---

## Platform Adaptations

### Blog (canonical)

Full-length posts. All code, charts, footnotes, sidebar layout. This is the primary artifact. Everything else is derived from this.

### X / Twitter

Distill the core insight into a thread or single tweet. Patterns that work:

- One strong claim + the reasoning in 2-3 follow-ups
- A chart or benchmark table as an image with a one-line caption
- "New blog post: [title]" + the single most compelling paragraph or result
- Embedded code screenshots for visual code

Don't: write threads that are just the blog post chopped into 280-character pieces. A thread should stand alone as a compressed version.

### LinkedIn

Slightly more context than X. The audience is broader — include a sentence of "why this matters" framing that you'd skip on your blog. Keep the same voice; don't switch to corporate speak just because it's LinkedIn.

Structure: Hook paragraph → 2-3 key points → link to full post. No emoji bullets. No "Agree? 👇"

### README / Documentation

Use the same clean prose voice. Code examples should be real and runnable. Don't write marketing copy in your README.

---

## Anti-Patterns

- ❌ Walls of bullet points instead of flowing argument
- ❌ Generic stock images or decorative illustrations
- ❌ Tutorial-style step-by-step when you should be teaching concepts
- ❌ "In this blog post, I will discuss" openings
- ❌ Clickbait titles that don't deliver
- ❌ Code screenshots instead of actual code blocks (for blog posts)
- ❌ Benchmarks without specifying hardware and methodology
- ❌ Charts without labeled axes or units
- ❌ "As everyone knows" or "It's well known that" (if it's well known, why are you writing about it?)
- ❌ Excessive **bold** and *italic* formatting. If everything is emphasized, nothing is.
- ❌ Social media engagement-bait ("What do you think? Let me know in the comments!")
- ❌ Animated GIFs, autoplay video, popups, or any interruption

---

## Pre-Publish Checklist

### Content
- [ ] Does the title accurately describe what the reader will get?
- [ ] Does the opening paragraph hook a practitioner?
- [ ] Is every section necessary? Could any be cut or merged?
- [ ] Are technical claims backed by code, data, or citations?
- [ ] Have I acknowledged uncertainty where appropriate?
- [ ] Have I acknowledged related/prior work and credited others?
- [ ] Is there a clear takeaway the reader can act on?

### Technical
- [ ] Is all code runnable (or clearly marked as simplified)?
- [ ] Are benchmark conditions specified (hardware, methodology)?
- [ ] Are charts clearly labeled with units?
- [ ] Do all links work?
- [ ] Is the code/notebook available in a linked repo?

### Presentation
- [ ] Is the layout clean and distraction-free?
- [ ] Does it read well on both desktop and mobile?
- [ ] Is the line length comfortable (~60-80 chars)?
- [ ] Are code blocks properly syntax-highlighted?
- [ ] Is there enough whitespace between sections?

### The Final Test
- [ ] Would I want to read this myself in 5 years?
- [ ] Would I share this with a colleague I respect?
- [ ] Does this respect the reader's intelligence and time?

---

## Summary Principles

1. **Practitioner voice** — Write from experience, not observation. Show your work.
2. **Skin in the game** — Code, data, and benchmarks over opinions and hand-waving.
3. **Calibrated confidence** — Strong claims where warranted, honest uncertainty everywhere else.
4. **Clean minimalism** — Remove everything that doesn't serve the reader. Design is invisible.
5. **Iterative depth** — Start simple, add complexity. Let the reader follow your thinking.
6. **Systems framing** — Connect specifics to broader implications. One post should link to others.
7. **Respect the reader** — Assume intelligence. Provide depth. Don't waste their time.

---

*Write like you're explaining your work to a brilliant colleague who ships code and has opinions. Keep it real, keep it clean, keep it substantive. The work speaks; let it.*
