# Initial Setup Prompt for Claude Code

Copy and paste the prompt below into Claude Code to bootstrap the project.

---

## Prompt

```
Read the CLAUDE.md file in this project root first. Then read all files in the docs/ directory: ARCHITECTURE.md, COMPONENT_SPEC.md, INTAKE_FLOW.md, THEME_SYSTEM.md, ASSEMBLY_ENGINE.md, KNOWLEDGE_BASE.md, and ROADMAP.md.

We are building EasyWebsiteBuild — an AI-powered website assembly platform. You now have the full context of what this project is.

We are starting Phase 1: Platform Website & Foundation.

Please set up the project and build the initial 3-page website:

## Project Setup

1. Initialize a Next.js 14+ project with:
   - App Router
   - TypeScript (strict mode)
   - Tailwind CSS v4
   - ESLint
   
2. Set up Convex:
   - Install convex
   - Initialize with `npx convex init`
   - Create initial schema in convex/schema.ts with tables for: projects, intakeResponses, intentPaths, components, themes, assets, recipes, users
   
3. Install dependencies:
   - @anthropic-ai/sdk (Claude integration)
   - framer-motion (animations)
   - lucide-react (icons)
   
4. Set up the project structure as defined in CLAUDE.md

## Pages to Build

### Page 1: Homepage (/)

Build a stunning, premium landing page for easywebsitebuild.com. This is a website builder product — it needs to look BETTER than what it builds. 

Design direction: Premium SaaS aesthetic. Think Vercel meets Linear. NOT generic AI-builder vibes.

Content sections:
- Hero: Bold headline about AI-powered website assembly. Subheadline explaining the value prop. CTA button to "Try the Demo". Should feel premium and confident.
- "How It Works" section: 3-4 step visual flow showing: Answer questions about your vision → AI assembles your perfect site → Review & customize → Launch. Use icons or illustrations.
- "What Makes Us Different" section: Key differentiators — Not templates (assembled from modular components), Learns & improves (gets smarter with every site built), Your brand not ours (no cookie-cutter look), AI-powered decisions (smart component and theme selection).
- "Site Types" section: Visual grid showing the types of websites that can be built (Business, E-commerce, Portfolio, Booking, Blog, etc). Make these look like mini preview cards.
- Social proof / trust section (can use placeholder content)
- CTA section: "Ready to build something amazing?" with button to demo
- Footer with links

Typography: Choose a distinctive heading font + clean body font. NOT Inter, Roboto, or Arial. Something with character.

Color palette: Create a unique, premium palette. Dark mode or rich colors — something that says "we take design seriously."

Add meaningful animations: scroll reveals, hover effects, smooth transitions. Use framer-motion.

### Page 2: Demo (/demo)

Build the intake flow experience — Steps 1 through 4 of the Intent Capture system as described in INTAKE_FLOW.md.

This should be a multi-step form experience:
- Step 1: Site type selection (visual cards with icons)
- Step 2: Primary goal selection (contextual based on Step 1)
- Step 3: Business description (text input with smart placeholder)
- Step 4: Brand personality (visual A/B comparisons with slider)

Use React state to manage the flow. Include:
- Progress indicator
- Smooth transitions between steps
- Back navigation
- The personality step should show visual previews representing each axis pole (can be styled div mockups — they don't need to be real website screenshots yet)

After Step 4, show a "Coming Soon" preview mockup that summarizes their choices and shows what the system captured. This demonstrates the concept even before the assembly engine is built.

Store intake responses in Convex.

### Page 3: Documentation (/docs)

Build a documentation page styled like a developer docs site (think Stripe docs, Tailwind docs, Next.js docs).

Structure:
- Left sidebar navigation with sections matching our doc files
- Main content area
- Table of contents on the right (for the current section)

Sections to include (pull content from the docs/ files):
1. Overview (project summary)
2. Architecture (from ARCHITECTURE.md)
3. Component Library (from COMPONENT_SPEC.md)
4. Theme System (from THEME_SYSTEM.md)
5. Intake Flow (from INTAKE_FLOW.md)
6. Assembly Engine (from ASSEMBLY_ENGINE.md)
7. Knowledge Base (from KNOWLEDGE_BASE.md)
8. Roadmap (from ROADMAP.md)

The content should be formatted with proper headings, code blocks, tables, and visual hierarchy. This is a LONG page with deep content — make it navigable and readable.

### Shared Layout

- Platform navigation bar at the top with logo "EasyWebsiteBuild" and links to Home, Demo, Docs
- Consistent design language across all pages
- Responsive — works well on mobile, tablet, desktop
- Smooth page transitions if possible

## Important Design Notes

- This is a PREMIUM product. Every pixel should feel intentional.
- NO generic AI aesthetics (purple gradients on white, etc.)
- Choose fonts that have character and work beautifully together
- The platform itself is the best demo of what we can build — it should be impressive
- Use framer-motion for meaningful animations, not gratuitous ones
- Dark theme preferred but open to a distinctive light theme if it's exceptional
- Add subtle background textures, gradients, or visual depth — avoid flat/plain backgrounds
```

---

## After Initial Setup

Once the initial 3 pages are built, the next Claude Code prompt should be:

```
Read CLAUDE.md and docs/ROADMAP.md. We've completed the initial Phase 1 website. Now we need to begin Phase 2: Core Component Library.

Start by:
1. Creating the theme token system (CSS Custom Properties)
2. Building the theme generation function that maps a personality vector to tokens
3. Creating 3 theme presets: Luxury, Modern Clean, Warm Professional
4. Building the first component: nav-sticky with transparent and solid variants
5. Building the Section wrapper component

Follow the specifications in docs/THEME_SYSTEM.md and docs/COMPONENT_SPEC.md exactly.
Each component needs: the React component, TypeScript types, and a manifest JSON file.
Components must consume theme tokens via CSS custom properties — never hardcode visual values.
```
