# Claude Code Project Context

## Project Overview
Personal portfolio website for Jacob Lee - Software Engineer and Data Scientist.

**Tech Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Project Goals
1. Modern, clean portfolio showcasing work experience, projects, and skills
2. Blog functionality with MDX support
3. Learn Next.js best practices and modern web development
4. SEO-optimized for professional discoverability

## Architecture Decisions

### Why Next.js App Router?
- Server Components for better performance
- Built-in SEO features (metadata, sitemaps)
- File-based routing for blog posts
- MDX support for rich blog content
- Industry standard for React applications

### Why Vercel?
- Full Next.js feature support (SSR, API routes)
- Zero-config deployment
- Preview deployments for PR reviews
- Scales with future product development

## Coding Standards

### Components
- **Use Server Components by default** - only add `"use client"` when needed (interactivity, hooks, browser APIs)
- **Keep components small and focused** - single responsibility
- **Co-locate related code** - component + types in same file when simple

### TypeScript
- **Strict mode enabled** - catch errors early
- **Explicit return types** for functions (readability)
- **Interface over type** for object shapes (extendable)
- **Avoid `any`** - use `unknown` if type is truly unknown

### Styling
- **Tailwind utility classes** - prefer over custom CSS
- **Responsive by default** - mobile-first approach
- **Dark mode support** - using `dark:` variants
- **Semantic HTML** - proper tags for accessibility

### File Structure
```
app/
  layout.tsx          # Root layout
  page.tsx            # Home page
  blog/
    page.tsx          # Blog listing
    [slug]/
      page.tsx        # Individual blog post
components/
  Header.tsx          # Shared header
  Footer.tsx          # Shared footer
  ui/                 # Reusable UI primitives
lib/
  utils.ts            # Utility functions
public/
  images/             # Static assets
```

## Anti-Patterns to Avoid

### Don't Over-Engineer
- ❌ Don't create abstractions for one-off code
- ❌ Don't add features not explicitly requested
- ❌ Don't refactor code unrelated to current task
- ✅ Keep it simple, add complexity when needed

### Don't Over-Complicate
- ❌ Don't use Client Components when Server Components suffice
- ❌ Don't create custom hooks for trivial logic
- ❌ Don't add error boundaries everywhere (only at key boundaries)
- ✅ Start simple, add features incrementally

### Don't Bloat
- ❌ Don't add unnecessary dependencies
- ❌ Don't include unused code "for future use"
- ❌ Don't create wrappers around libraries without good reason
- ✅ Add dependencies only when they solve real problems

## Development Workflow

### Starting Dev Server
```bash
npm run dev
```
Access at `http://localhost:3000` (with Turbopack for fast refresh)

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

### Vercel Setup (First Time)
1. Push code to GitHub
2. Import repository at vercel.com
3. Vercel auto-detects Next.js, deploys automatically
4. Every push to `main` triggers deployment
5. Preview URLs for all PRs

### Environment Variables
Add sensitive keys in Vercel dashboard (Settings → Environment Variables).
Never commit `.env` files.

## Content from Old Site

**Sections to migrate:**
- Header: Jacob Lee, location, introduction
- Academic Background: University of Utah education
- Work Experience: Domo internship, Teaching Assistant roles
- Projects: ML, Statistics, Linear Algebra, Databases
- Skills: Python, SQL, React, Pandas, PyTorch, Tableau, certifications
- Blog: To be built (was placeholder in old site)

**Old Layout:**
Two-panel design with fixed sidebar and scrollable content.
Consider modern alternative: single-column responsive layout.

## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Guides](https://vercel.com/guides)

## Notes for Claude Code

- **Check assumptions** - ask clarifying questions before implementing
- **Surface tradeoffs** - present options when multiple approaches exist
- **Keep context tight** - focus on current task, avoid scope creep
- **Test incrementally** - build in small steps, verify each works
- **Clean up after yourself** - remove dead code, unused imports
