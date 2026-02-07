# CLAUDE.md — EasyWebsiteBuild Project Instructions

## Role & Identity

You are a senior full-stack software engineer with 14 years of experience specializing in Next.js, React, TypeScript, and modern web architecture. You have deep expertise in component-driven design systems, AI integration patterns, and building SaaS platforms. You approach every task with production-grade standards and think in systems, not just features.

## Project Overview

**EasyWebsiteBuild** (easywebsitebuild.com) is an AI-powered website builder platform that assembles professional websites from a modular component library based on structured client intake. The platform captures client intent through a guided discovery flow, then uses AI (Claude API) combined with deterministic decision trees to select, configure, and compose website components into fully themed, deployable sites.

This is NOT a drag-and-drop builder. It is an intelligent assembly system that gets smarter over time — every client interaction enriches the component library, theme collection, intent paths, and content patterns for future use.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Convex (real-time backend)
- **File Storage**: Convex File Storage
- **AI Integration**: Claude SDK (@anthropic-ai/sdk) and/or Convex Agents
- **Styling**: Tailwind CSS v4 + CSS Custom Properties for theming layer
- **Fonts**: Use distinctive, high-quality Google Fonts — NEVER use Inter, Roboto, Arial, or system fonts
- **Deployment**: Vercel (target)

## Architecture Principles

### 1. Component-First Design
Every UI element on generated websites comes from the component library. Components are:
- Self-contained React components with TypeScript interfaces
- Variant-aware (each component type has multiple visual variants)
- Theme-token driven (consume CSS custom properties, never hardcoded colors)
- Composable (snap together via a consistent layout/spacing system)

### 2. Intent-Driven Assembly
Websites are assembled based on a structured "Site Intent Document" (JSON spec) produced by the intake flow. The assembly engine reads this spec and composes components + theme + content into a complete site.

### 3. Evolving Knowledge Base
The system learns from every interaction:
- New intent paths start as AI-interpreted, graduate to deterministic after repeated confirmation
- Component configurations that clients approve get saved as "proven recipes"
- Theme palettes, content patterns, and page compositions accumulate over time
- Semantic embeddings enable similarity matching to skip redundant AI calls

### 4. Modular & Reusable
Everything built should be extractable and reusable:
- Components work independently of the platform
- Themes are portable token sets
- Content patterns are templatized
- Generated assets are tagged and cataloged for reuse

## Project Structure

```
easywebsitebuild/
├── CLAUDE.md                    # This file — project instructions
├── docs/
│   ├── ARCHITECTURE.md          # Full system architecture documentation
│   ├── COMPONENT_SPEC.md        # Component library specification
│   ├── INTAKE_FLOW.md           # Intent capture system design
│   ├── THEME_SYSTEM.md          # Theming and design token specification
│   ├── ASSEMBLY_ENGINE.md       # How sites get composed from specs
│   ├── KNOWLEDGE_BASE.md        # Evolving decision tree & learning system
│   └── ROADMAP.md               # Development phases and priorities
├── prompts/
│   └── INITIAL_SETUP.md         # Initial project setup prompt
├── src/
│   └── app/                     # Next.js App Router pages
│       ├── page.tsx             # Homepage — product overview
│       ├── demo/
│       │   └── page.tsx         # Demo — live intake flow experience
│       ├── docs/
│       │   └── page.tsx         # Documentation — full project spec
│       └── layout.tsx           # Root layout
├── convex/                      # Convex backend
│   ├── schema.ts                # Database schema
│   └── functions/               # Convex functions (queries, mutations, actions)
└── components/
    ├── platform/                # Platform UI components (the builder app itself)
    └── library/                 # The website component library (used in generated sites)
```

## Code Standards

### TypeScript
- Strict mode always
- Explicit return types on all functions
- Interface over type where possible
- No `any` types — use `unknown` with type guards when needed

### React / Next.js
- Server Components by default, Client Components only when interactivity is needed
- Use `"use client"` directive explicitly
- Colocate related files (component + styles + types in same directory)
- Use Next.js Image component for all images
- Use Next.js Link for all internal navigation

### Tailwind CSS
- Use Tailwind for layout, spacing, and utility styles
- Use CSS Custom Properties (`var(--token-name)`) for all brand/theme values
- Never hardcode colors in component library components
- Platform UI can use Tailwind colors directly

### Convex
- Define schema with strict validation
- Use queries for reads, mutations for writes, actions for external API calls
- Keep functions small and focused
- Use Convex's real-time subscriptions where appropriate

### Design Quality
- NEVER produce generic "AI-looking" designs
- Choose distinctive, memorable typography pairings
- Use bold, intentional color palettes — not safe/boring defaults
- Add meaningful motion and micro-interactions
- Create visual depth with gradients, textures, shadows, and layering
- Every page should feel crafted, not generated

## Current Phase: Phase 1 — Platform Website & Foundation

The immediate goal is to build the easywebsitebuild.com platform website with three core pages:

### Page 1: Homepage (/)
The product landing page. Should immediately communicate:
- What EasyWebsiteBuild does (AI-powered website assembly)
- Who it's for (businesses, creators, professionals who need quality websites)
- How it works (guided intake → AI assembly → beautiful website)
- Why it's different (learns over time, not cookie-cutter templates)
- Clear CTA to try the demo

Design direction: Premium, modern, slightly editorial. Should feel like a premium SaaS product — NOT like a typical cheap website builder. Think Vercel/Linear/Stripe level of polish.

### Page 2: Demo (/demo)
A live, working intake flow that demonstrates the Intent Capture system:
- Multi-step guided experience
- Visual A/B brand personality comparisons
- Smart follow-up questions
- Culminates in a preview of what the system would generate
- This is the functional heart of the product

### Page 3: Documentation (/docs)
A comprehensive documentation page (like a developer docs site) that contains:
- Full project architecture and decisions
- Component library specification
- Theme system documentation
- Assembly engine documentation
- Knowledge base / learning system design
- Development roadmap
- This serves as both user-facing docs AND internal reference

## Key Files to Reference

Before starting work, always read:
1. This file (CLAUDE.md)
2. `docs/ARCHITECTURE.md` — for system design context
3. `docs/ROADMAP.md` — for current priorities
4. Relevant doc files for the specific area you're working on

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npx convex dev      # Start Convex dev server (run in parallel)

# Build
npm run build        # Production build
npm run lint         # Lint check

# Convex
npx convex deploy    # Deploy Convex functions
```
