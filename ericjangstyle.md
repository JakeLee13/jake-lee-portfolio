# Eric Jang Style Guide

## Philosophy

Write like a researcher who respects the reader's intelligence. Favor clarity over cleverness, substance over style. Let the ideas speak through clean presentation, not decorative flourishes.

## Content Voice

### Tone
- **Technical but accessible** - Assume intelligence, not expertise
- **Direct and purposeful** - Every sentence earns its place
- **Thoughtfully opinionated** - Take stances, but show your reasoning
- **Conversational formality** - Professional without being stuffy

### Writing Principles
- **Lead with the insight** - Don't bury the lede in preamble
- **Show, don't just tell** - Use concrete examples, code, and data
- **Think in systems** - Connect ideas to broader implications
- **Acknowledge uncertainty** - "I think", "most likely", "my guess is"
- **Credit generously** - Link to sources, thank reviewers

### What to Avoid
- Marketing speak or hype ("game-changing", "revolutionary")
- Excessive hedging ("it seems like maybe possibly")
- Apologizing for length or complexity
- Bullet points for prose that should flow
- Emoji (almost never use them)

## Structure

### Article Anatomy
```
Title (punchy, often a reference or play on words)
Date
Opening epigraph or quote (optional, but effective)
Body sections with clear headers
Practical advice section (when relevant)
Acknowledgements
Citation block
```

### Section Headers
- Use H2 (##) for main sections
- Keep headers short and declarative
- Prefer statements over questions
- Example: "DeepSeek R-1 Era" not "How Does DeepSeek Work?"

### Paragraphs
- **First paragraph is crucial** - Hook with the core insight or provocative statement
- Medium length (3-5 sentences typically)
- One idea per paragraph
- Use line breaks between paragraphs for breathing room

### Lists
- **Sparingly used** - Prose is default, lists are special
- Use when enumerating discrete items or steps
- Don't use for comparisons that deserve narrative explanation
- Prefer numbered lists when order matters, bullets when it doesn't

## Technical Content

### Code Examples
- Show actual, runnable code when possible
- Include context: what problem does this solve?
- Use realistic examples from your own work
- Add comments only when the code isn't self-explanatory
- Format in code blocks with language specification

### Math & Equations
- Inline for simple expressions: P(A|B) = p(B|A)p(A)/P(B)
- Block format for complex derivations
- Define variables on first use
- Prefer intuition over formalism when teaching

### Citations & Links
- Inline citations with number format [[1](url), [2](url)]
- Link liberally to primary sources
- Link to previous work (yours and others)
- Include formal citation block at end when appropriate

## Visual Design

### Layout Philosophy
- **Minimalism over decoration** - Every visual element must serve a purpose
- **Generous whitespace** - Let content breathe
- **Single column for narrative** - Multi-column only for sidebar content
- **Sticky sidebars for code/examples** (desktop only)
- **Typography does the heavy lifting** - Clean fonts, clear hierarchy

### Desktop Layout Pattern
```
┌─────────────────────────────────────────┐
│ Header/Nav (minimal)                     │
├────────────────────┬────────────────────┤
│                    │                     │
│  Main Content      │  Sticky Sidebar    │
│  (prose, ideas)    │  (code, examples,  │
│                    │   prompts, data)   │
│  [scrolls]         │  [sticks in view]  │
│                    │                     │
│                    │                     │
└────────────────────┴────────────────────┘
```

### Mobile Adaptation
- Stack to single column
- Hide or relocate sidebar content
- Maintain readability (larger font, comfortable line length)
- Include notice: "This content is best viewed on desktop"

### Color & Typography
- **Monochrome or near-monochrome** - Black text on white/cream
- **Limited color palette** - Use color sparingly for links, code highlights
- **Readable font stack** - System fonts or clean web fonts
- **Generous line height** - 1.6-1.8 for body text
- **Optimal line length** - 60-80 characters for main content

## Technical Implementation

### Preferred Stack
- **Static site generator** - Jekyll, Hugo, or custom build
- **Markdown source** - Clean, version-controllable content
- **Minimal CSS** - No frameworks, just clean custom styles
- **Native CSS features** - `position: sticky`, Grid, Flexbox
- **No JavaScript dependencies** - Pure CSS scrollytelling

### Key CSS Patterns
```css
/* Sticky sidebar that respects scroll position */
.sticky-content {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

/* Responsive breakpoint */
@media (max-width: 1024px) {
  /* Stack to single column */
  /* Hide or relocate sidebar */
}
```

### File Organization
```
_posts/
  2026-02-04-rocks.html
_layouts/
  post.html
assets/
  css/main.css
  rocks/example_report.pdf
```

## Content Types

### Research Posts
- Deep technical explorations
- Share both process and results
- Include experimental data, graphs, code
- Acknowledge what you don't know

### Commentary/Analysis
- Connect current events to broader trends
- Take clear positions with supporting reasoning
- Link heavily to sources and context
- End with implications or predictions

### Practical Guides
- Lead with concrete advice
- Support with technical depth
- Assume reader competence
- No hand-holding, but be thorough

## Examples of Good Patterns

### Opening Strong
> "You are viewing the mobile version of this page. This content is best viewed on a desktop."
> 
> "If we consider life to be a sort of open-ended MMO, the game server has just received a major update."

### Technical Clarity
```python
# Example from actual work
/experiment I'd like to apply maximal update parameterization...
```

### Connecting to Broader Context
"The world has changed a lot since 2022. ChatGPT happened. You can now ask it to construct novel proofs of Erdos problems."

### Acknowledging Uncertainty
"My guess is that all of the following had to come together for this to work:"

### Practical Advice Section
"I'll end this post with some practical advice for technologists..."

## Anti-Patterns to Avoid

- ❌ Walls of bullet points instead of flowing prose
- ❌ Generic stock photos or decorative images
- ❌ Excessive formatting (bold, italic, colors)
- ❌ Social media style (hashtags, emoji, clickbait)
- ❌ Apologetic disclaimers ("Sorry this is long...")
- ❌ Tutorial-style step-by-step unless teaching
- ❌ Animated GIFs or autoplay videos
- ❌ Pop-ups, overlays, or interruptions

## The Eric Jang Checklist

Before publishing, ask:
- [ ] Does this respect the reader's time and intelligence?
- [ ] Is every paragraph necessary and substantive?
- [ ] Are technical claims backed by code, data, or citations?
- [ ] Is the layout clean and distraction-free?
- [ ] Does it work well on both desktop and mobile?
- [ ] Have I credited others appropriately?
- [ ] Would I want to read this myself in 5 years?

## Summary Principles

1. **Substance over style** - Ideas first, presentation second
2. **Clean minimalism** - Remove everything unnecessary
3. **Technical rigor** - Show your work, cite your sources
4. **Purposeful layout** - Every design choice serves the content
5. **Respect the reader** - Assume intelligence, provide depth
6. **Think systems** - Connect to broader implications
7. **Stay honest** - Acknowledge uncertainty and credit others

---

*"Whenever logical processes of thought are employed — that is, whenever thought for a time runs along an acceptive groove — there is an opportunity for the machine."*

Write like you're explaining your research to a brilliant colleague over coffee. Keep it real, keep it clean, keep it substantive.
