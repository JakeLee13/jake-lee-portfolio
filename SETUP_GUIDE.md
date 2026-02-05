# Setup Guide

## ✅ Completed

- [x] Next.js 15 project scaffolded
- [x] TypeScript configured
- [x] Tailwind CSS integrated
- [x] Project structure created
- [x] CLAUDE.md context file added
- [x] Git repository initialized

## 🔧 Next Steps

### 1. Configure Git (Required)

```bash
# Set your git identity
git config --global user.name "Jake Lee"
git config --global user.email "your-email@example.com"

# Then commit the initial setup
git commit -m "Initial Next.js portfolio setup

- Next.js 15 with App Router, TypeScript, Tailwind CSS
- Configured for Vercel deployment
- Added CLAUDE.md with project context and best practices

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 2. Create GitHub Repository

```bash
# Option A: Create new repo on GitHub, then:
git remote add origin https://github.com/JakeLee13/JakeLee13.github.io.git
git branch -M main
git push -u origin main

# Option B: If repo exists, force push new code:
git remote add origin https://github.com/JakeLee13/JakeLee13.github.io.git
git branch -M main
git push -f -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select `JakeLee13.github.io` repository
5. Vercel auto-detects Next.js → Click "Deploy"
6. Done! Your site is live

Every push to `main` will auto-deploy.

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 What's Next

Now that the foundation is ready, you can:

1. **Build the layout** - Create header, footer, navigation
2. **Add content** - Migrate sections from old site (use `OLD_CONTENT.md` as reference)
3. **Style it** - Design with Tailwind CSS
4. **Add blog** - Set up MDX for blog posts
5. **Polish** - SEO, animations, responsive design

See [CLAUDE.md](./CLAUDE.md) for coding standards and best practices.

## 🎯 Claude Code Tips

From the article you shared, here are some tips for working with me:

1. **Declarative over imperative** - Tell me what you want to achieve, not how to do it
2. **Use success criteria** - "Make this responsive" vs "Add media queries to every component"
3. **Test-driven** - Write tests first, then implement (I'll loop until they pass)
4. **Leverage looping** - Give me goals, let me iterate to reach them
5. **Ask clarifying questions** - If something is ambiguous, I should ask first
6. **Surface tradeoffs** - I should present options when multiple approaches exist

## 🚀 Project Status

**Current:** Fresh Next.js setup ready for development
**Next:** Build layout and start migrating content
