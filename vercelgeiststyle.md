# Vercel Geist Design System Style Guide

## Philosophy

Build with **simplicity, minimalism, and speed**. Every design decision should enhance clarity and functionality, drawing from the precision of Swiss design. Geist represents the intersection of developer tooling and refined aesthetics—where form serves function without compromise.

## Core Principles

### Swiss Design Foundation
- **Geometric precision** - Everything aligns to a grid
- **Typographic hierarchy** - Let type do the work
- **Functional minimalism** - Remove everything unnecessary
- **High contrast** - Strong, accessible color relationships
- **Systematic thinking** - Consistent patterns, scalable components

### Design Values
- **Clarity over cleverness** - Users should never guess
- **Speed as a feature** - Performance is design
- **Accessibility by default** - High contrast, semantic HTML
- **Developer-first** - Built for people who build
- **Production-ready** - Every component ships to real users

## Typography

### Font Family: Geist

**Geist Sans** - Primary typeface for all UI and content
- Modern geometric sans-serif
- Weights: 100 (Thin) → 900 (Black)
- Optimized for screen readability
- Based on Swiss typography principles

**Geist Mono** - Monospace for code and technical content
- Pairs seamlessly with Geist Sans
- Same design language, monospaced metrics
- Use in: code blocks, terminals, technical data

**Geist Pixel** (Optional/Experimental) - Bitmap display font
- Five variants: Square, Grid, Circle, Triangle, Line
- For experimental UI, banners, special moments
- Grid-based but manually refined
- Ships to production (not just decorative)

### Typography Scale

Use Tailwind classes that preset font-size, line-height, letter-spacing, and font-weight:

```
Display (48px+)  - Hero headlines, major sections
Title 1 (32px)   - Page titles, primary headers
Title 2 (24px)   - Section headers
Title 3 (20px)   - Subsection headers
Body (16px)      - Main content, descriptions
Label (14px)     - Form labels, UI text
Caption (12px)   - Secondary info, metadata
```

### Typography Rules

- **Single-line preference** - Headers designed with ample line-height for icons
- **Strong modifier** - Use `<strong>` within typography classes for emphasis
- **Subtle vs Strong** - System supports weight variations within same size
- **No body text in mono** - Reserve Geist Mono exclusively for code
- **Optical alignment** - Trust the metrics, they're precise

## Color System

### Philosophy
High contrast, accessible, systematic. 10 color scales with P3 display support on capable browsers.

### Color Structure

**Backgrounds (2 levels)**
- `background-100` - Primary page/component background (use 95% of the time)
- `background-200` - Subtle differentiation only when needed

**UI Colors (3 levels each)**
- `color-1` - Hover states
- `color-2` - Active states / small badges
- `color-3` - Small UI element backgrounds

**Borders (3 levels)**
- `border-1`, `border-2`, `border-3` - Progressive border emphasis

**High Contrast Backgrounds (2 levels)**
- For emphasis and important UI elements

**Text & Icons (2 levels)**
- `color-9` - Secondary text and icons
- `color-10` - Primary text and icons

### Color Usage Patterns

```css
/* Component background progression */
default: background-100
hover:   color-1
active:  color-2

/* Border emphasis */
subtle:   border-1
default:  border-2
emphasis: border-3
```

### Accessibility
- All text color combinations meet WCAG AA minimum
- High contrast mode supported
- P3 colors gracefully degrade to sRGB

## Layout & Spacing

### Grid System
"A huge part of the new Vercel aesthetic" - Grid is fundamental, not decorative.

**Grid Principles:**
- **Consistent spacing scale** - 4px base unit (4, 8, 12, 16, 24, 32, 48, 64...)
- **Optical rhythm** - Spacing feels natural, not mathematical
- **Responsive breakpoints** - Mobile-first, progressive enhancement
- **Alignment discipline** - Everything snaps to grid

### Layout Patterns

**Container Widths:**
```css
max-width: 1200px  /* Standard content container */
max-width: 800px   /* Prose/reading content */
max-width: 1600px  /* Wide layouts (dashboards) */
```

**Common Spacing:**
```
Section padding:     64px - 128px (vertical)
Component padding:   16px - 32px
Element spacing:     8px - 16px
Micro spacing:       4px - 8px
```

**Responsive Strategy:**
- Desktop-first for developer tools
- Mobile-first for marketing/content
- Breakpoints: 640px, 768px, 1024px, 1280px

## Components

### Component Philosophy
- **Composition over configuration** - Simple building blocks
- **Semantic HTML** - Proper elements, accessible by default
- **Controlled by design** - Consistent behavior across contexts
- **Production-tested** - If it ships, it works

### Component Patterns

**Buttons**
```jsx
// Primary action
<button className="bg-primary text-white">Deploy</button>

// Secondary action
<button className="border border-gray">Cancel</button>

// Danger action
<button className="bg-error text-white">Delete</button>
```

**Inputs**
```jsx
// Standard input with label
<label className="label">Project Name</label>
<input className="input" type="text" />

// With validation state
<input className="input error" />
<span className="caption error">Invalid input</span>
```

**Cards**
```jsx
// Standard card
<div className="card">
  <h3 className="title-3">Card Title</h3>
  <p className="body">Card content</p>
</div>

// Hover-responsive card
<div className="card hover:border-accent">
  {/* Interactive content */}
</div>
```

### Component Library Structure

```
Avatar, Badge, Book, Browser, Button
Calendar, Checkbox, Choicebox, Code Block
Collapse, Combobox, Command Menu
Context Card, Context Menu, Description
Drawer, Empty State, Entity, Error
Feedback, Gauge, Grid, Input
Keyboard Input, Loading Dots, Material
Menu, Modal, Multi Select, Note
Pagination, Phone, Pill, Progress
Radio, Scroller, Select, Sheet
Skeleton, Slider, Snippet, Spinner
Status Dot, Switch, Table, Tabs
Textarea, Toast, Toggle, Tooltip
```

## Materials & Surfaces

### Material Principles
- **Elevation through borders** - Not shadows (usually)
- **Subtle depth** - Minimal z-axis hierarchy
- **Transparency** - Strategic use of backdrop blur
- **Consistent surfaces** - Predictable layering

### Surface Hierarchy
```
1. Page background (background-100)
2. Component surfaces (background-100 + border)
3. Elevated cards (background-100 + border + subtle shadow)
4. Overlays (backdrop-blur + border)
5. Modals/Dialogs (solid background + strong border)
```

## Interaction & Motion

### Animation Principles
- **Purposeful motion** - Every animation has a reason
- **Speed preference** - Fast by default (150-250ms)
- **Ease curves** - Subtle, natural easing
- **Respect prefers-reduced-motion** - Always

### Common Transitions
```css
/* Standard transition */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Button hover */
transition: background-color 150ms, border-color 150ms;

/* Modal entrance */
transition: opacity 200ms, transform 200ms;
transform: scale(0.95);
```

### Micro-interactions
- Hover states: Subtle background change
- Active states: Slight scale reduction (0.98)
- Focus states: Visible outline (accessibility)
- Loading states: Subtle spinner or skeleton

## Icons

### Icon System
"Icon set tailored for developer tools"

**Icon Principles:**
- **16px and 24px base sizes** - Scale from there
- **Stroke-based** - Consistent 1.5-2px stroke
- **Pixel-aligned** - Crisp at all sizes
- **Semantic usage** - Icons reinforce, don't replace text

**Icon Usage:**
```jsx
// Icon with label
<button>
  <Icon name="deploy" size={16} />
  <span>Deploy</span>
</button>

// Icon-only (with aria-label)
<button aria-label="Close">
  <Icon name="close" size={16} />
</button>
```

## Responsive Design

### Mobile-First Mindset
- Start with mobile constraints
- Progressive enhancement for larger screens
- Touch targets minimum 44px
- Readable without zoom (16px+ body text)

### Breakpoint Strategy
```css
/* Mobile */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Responsive Patterns
- **Stack to horizontal** - Mobile stacks, desktop spreads
- **Hide/show strategically** - Reduce, don't remove
- **Scale typography** - Smaller on mobile, but readable
- **Adjust spacing** - Tighter mobile spacing

## Code & Technical Content

### Code Block Styling
```jsx
<pre className="bg-code border border-gray rounded">
  <code className="font-mono text-sm">
    {codeContent}
  </code>
</pre>
```

### Inline Code
```jsx
<p>
  Run <code className="bg-gray-100 px-1 rounded font-mono">npm install</code> to get started.
</p>
```

### Syntax Highlighting
- Dark mode optimized
- Subtle color palette
- High contrast variables/keywords
- Consistent with Geist Mono

## Dark Mode

### Dark Mode Principles
- Not inverted colors, purpose-built palette
- Higher contrast for text (color-10 in dark)
- Softer backgrounds (true black is harsh)
- Consistent component behavior

### Implementation
```jsx
// Theme switcher component provided
<ThemeSwitcher />

// CSS variables adapt automatically
.card {
  background: var(--background-100);
  border: 1px solid var(--border-1);
  color: var(--color-10);
}
```

## Accessibility

### Non-Negotiable Standards
- **WCAG AA minimum** - AAA where possible
- **Keyboard navigation** - All interactive elements
- **Screen reader support** - Semantic HTML, ARIA when needed
- **Focus indicators** - Always visible
- **Color blind safe** - Don't rely on color alone

### Accessibility Checklist
- [ ] All text meets 4.5:1 contrast ratio
- [ ] Interactive elements have focus states
- [ ] Forms have associated labels
- [ ] Images have alt text
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes

## Implementation

### Tech Stack
```bash
# Install Geist fonts
npm install geist

# Use in Next.js
import { GeistSans, GeistMono } from 'geist/font'

# Tailwind integration (built-in classes)
className="text-body text-color-10"
```

### Component Import
```jsx
// Official Geist UI components
import { Button, Input, Modal } from '@geist-ui/core'

// Or build your own using Geist primitives
import { GeistProvider } from '@geist-ui/core'
```

### File Structure
```
src/
  components/
    ui/          # Geist components
    layouts/     # Page layouts
  styles/
    globals.css  # Geist variables
    components/  # Component styles
  fonts/
    geist/       # Font files
```

## Best Practices

### Do's ✓
- Use Geist Sans for all UI text
- Maintain high contrast ratios
- Align everything to the grid
- Use semantic HTML elements
- Test in both light and dark mode
- Keep components simple and composable
- Follow the spacing scale strictly
- Use provided color variables
- Support keyboard navigation
- Respect system preferences (motion, theme)

### Don'ts ✗
- Don't use custom fonts alongside Geist
- Don't create arbitrary spacing values
- Don't use shadows for elevation (borders first)
- Don't ignore accessibility requirements
- Don't override component internals
- Don't use color for meaning alone
- Don't create custom color scales
- Don't nest interactive elements
- Don't skip mobile testing
- Don't animate without purpose

## Vercel Aesthetic Qualities

### The "Vercel Look"
- **Brutalist elegance** - Honest materials, refined execution
- **Data-driven confidence** - Information density without clutter
- **Developer credibility** - Built by people who ship
- **Quiet sophistication** - Refined without being precious
- **Performance visible** - Speed you can feel

### Design Signatures
- Black and white foundation
- Grid-based layouts everywhere
- Monospace for technical content
- High information density
- Subtle, purposeful animation
- Border-defined elevation
- Precise, generous spacing
- System-first thinking

## Examples

### Marketing Page Header
```jsx
<header className="border-b border-gray">
  <nav className="max-w-[1200px] mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex gap-6">
        <a className="text-body text-color-9 hover:text-color-10">
          Features
        </a>
        <a className="text-body text-color-9 hover:text-color-10">
          Pricing
        </a>
        <Button>Sign Up</Button>
      </div>
    </div>
  </nav>
</header>
```

### Dashboard Card
```jsx
<div className="card p-6 border border-gray rounded-lg">
  <div className="flex items-center justify-between mb-4">
    <h3 className="title-3">Deployments</h3>
    <StatusDot status="success" />
  </div>
  <p className="text-body text-color-9 mb-4">
    24 successful deployments in the last 7 days
  </p>
  <Button variant="secondary" size="small">
    View All →
  </Button>
</div>
```

### Code Documentation
```jsx
<div className="max-w-[800px]">
  <h1 className="title-1 mb-4">Quick Start</h1>
  <p className="text-body text-color-9 mb-6">
    Get started with Next.js in minutes.
  </p>
  
  <CodeBlock language="bash">
    npx create-next-app@latest
  </CodeBlock>
  
  <Note type="info" className="mt-6">
    Make sure you have Node.js 18.17 or later installed.
  </Note>
</div>
```

## Checklist for Geist Compliance

Before shipping, verify:
- [ ] Using Geist Sans (primary) and Geist Mono (code)
- [ ] All colors from the Geist color system
- [ ] Spacing follows the scale (4, 8, 12, 16, 24...)
- [ ] Typography uses system classes
- [ ] Components are accessible (keyboard + screen reader)
- [ ] High contrast maintained (light and dark)
- [ ] Grid alignment is precise
- [ ] Icons are from Geist icon set or match style
- [ ] Animations are subtle and purposeful
- [ ] Mobile responsive and tested
- [ ] Dark mode works correctly
- [ ] Performance is excellent (Core Web Vitals)

## Resources

**Official:**
- Geist Design System: vercel.com/geist
- Geist Font: vercel.com/font
- GitHub: github.com/vercel/geist-font
- Components: vercel.com/geist/avatar (browse all)

**Installation:**
```bash
npm install geist
npm install @geist-ui/core  # Community components
```

**Inspiration:**
- Inter, Univers (typography)
- Swiss International Style (design movement)
- SF Pro, SF Mono (Apple's system fonts)
- Suisse International (Swiss grotesque)

---

## Summary

Geist is **systematic simplicity**. It's Swiss design for the web platform—precise, functional, fast. Every choice serves the user and respects the developer.

Build with:
- **Geist typography** (Sans, Mono, Pixel)
- **10-scale color system** (high contrast, P3-ready)
- **Grid-based layouts** (4px base unit)
- **Semantic components** (accessible by default)
- **Purposeful motion** (150-250ms, subtle)
- **Dark mode native** (not inverted)

The result: interfaces that are **fast, clear, and built to ship**.

*"Specifically designed for developers and designers."*
