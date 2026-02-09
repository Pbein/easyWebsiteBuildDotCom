# Brand Character System — Design Document

> **Add this file to the `docs/` directory.** It captures the design philosophy and technical approach for moving beyond generic website generation toward culturally-aware, emotionally-specific site creation.

## The Problem

The 6 personality dimensions (Minimal↔Rich, Playful↔Serious, Warm↔Cool, Light↔Bold, Classic↔Modern, Calm↔Dynamic) are effective for broad structural decisions — layout density, animation speed, typography category, spacing — but they cannot express the SPECIFIC CULTURAL AND EMOTIONAL IDENTITY that makes a website feel like it belongs to one business and no other.

A luxury med spa and a high-end law firm might have identical personality vectors (serious, bold, classic, calm) but should produce completely different websites. The med spa should feel nurturing and sensory; the law firm should feel authoritative and precise.

Similarly, a barbershop could be:

- A neighborhood classic (warm, trusted, community-oriented)
- A streetwear-adjacent culture spot (edgy, confident, identity-signaling)
- A premium men's grooming experience (refined, sophisticated, elevated)

All three are "barbershops" but they answer different unspoken questions and need completely different copy, imagery guidance, and emotional tone.

## Core Insight: Users Don't Lack Taste — They Lack Vocabulary

Most clients:

- Know instantly when something feels right or wrong
- Cannot explain why in design terms
- Panic when asked open-ended creative questions ("Describe your brand")
- Excel at comparative judgment ("Which of these feels more like you?")
- Can articulate what they DON'T want more easily than what they do

The intake system must therefore be built on **reaction and selection, not description**.

## The Three Missing Layers

### Layer 1: Emotional Identity

**What the site should make someone FEEL in the first 5 seconds.**

This is distinct from personality dimensions. "Calm" as a personality dimension means slow animations and generous spacing. "Calm" as an emotional goal means the visitor feels stress leave their body — which requires specific copy tone, image treatment, and content rhythm.

Supported emotional outcomes:

- **Safe & Trusted** → Symmetry, real photos, testimonials early, reassuring copy
- **Impressed & Elevated** → Whitespace, fewer elements, slow rhythm, premium everything
- **Curious & Intrigued** → Progressive disclosure, questions in headlines, tease before reveal
- **Energized & Excited** → Bold color, punchy copy, strong verbs, fast motion
- **Calm & Reassured** → Pastels, organic shapes, gentle language, no urgency
- **Inspired & Motivated** → Aspirational imagery, possibility language, upward motion
- **Part of Something** → In-group signals, shared values, community language
- **Refined & Sophisticated** → Understatement, refined vocabulary, quality signals
- **Delighted & Playful** → Unexpected elements, humor, personality in every section
- **Confident & Authoritative** → Data, credentials, declarative statements, strong grid

### Layer 2: Brand Voice (Copy DNA)

**How the brand SOUNDS when it speaks.**

Three primary voice modes:

- **Warm** — Conversational, emotionally present, uses "you" and "we," contractions okay, feels like a caring friend
- **Polished** — Refined, every word earns its place, elegant sentence structure, no slang, considered
- **Direct** — Efficient, confident, short sentences, strong verbs, no fluff, says it and moves on

Voice affects:

- Headline length and structure
- CTA phrasing
- Body copy density and sentence rhythm
- Whether copy uses questions, commands, invitations, or statements
- Formality level throughout

### Layer 3: Cultural Identity (Archetype + Anti-References)

**What WORLD the brand lives in.**

Brand archetypes:

- **The Guide** — Trusted companion, walks alongside, "we'll help you..."
- **The Expert** — Authority figure, top of field, credentials visible, "the best..."
- **The Creative** — Visionary, breaks conventions, shows don't tell, unexpected
- **The Caretaker** — Nurturing, warm embrace, "you deserve...", gentle
- **The Rebel** — Challenges status quo, unapologetic, "no compromises"
- **The Artisan** — Handcrafted, detail-obsessed, story-driven, process emphasis

Anti-references (what the site must NOT feel like):

- Corporate / Sterile
- Cheap / Budget
- Clinical / Cold
- Pushy / Salesy
- Template-y / Generic
- Busy / Cluttered
- Bland / Forgettable
- Childish / Unserious

Anti-references are powerful because they ELIMINATE entire aesthetic and copy branches immediately.

## How Character Data Flows Through the System

```
Intake Steps 5-7
    ↓
emotionalGoals + voiceProfile + brandArchetype + antiReferences + narrativePrompts
    ↓
Stored in SiteIntentDocument
    ↓
    ├──→ AI Question Generation (Step 8): Asks deeper, more targeted questions informed by character
    ├──→ AI Spec Generation (Step 9): Produces component selections AND content that match the character
    ├──→ Theme Generation: Emotional overrides applied on top of personality-vector theme
    └──→ Copy Generation: Every piece of text respects voice tone, emotional goals, and archetype
```

## Character → Design Implications Matrix

| Character Signal    | Layout           | Typography                 | Color                       | Motion             | Copy                      | Spacing              |
| ------------------- | ---------------- | -------------------------- | --------------------------- | ------------------ | ------------------------- | -------------------- |
| Luxury emotion      | Fewer sections   | Larger, serif-leaning      | Muted, less is more         | Slow, elegant      | Premium, restrained       | Generous             |
| Energized emotion   | Dense, punchy    | Bold, large headings       | High contrast, vibrant      | Fast, snappy       | Short, action verbs       | Tighter              |
| Calm emotion        | Breathing room   | Light weight, humanist     | Pastels, earth tones        | Barely perceptible | Flowing, gentle           | Very generous        |
| Rebel archetype     | Asymmetric       | Distressed or condensed    | B&W + one aggressive accent | Punchy, unexpected | Confrontational, short    | Intentionally uneven |
| Caretaker archetype | Symmetric, safe  | Soft serif or rounded sans | Warm, soft                  | Gentle fades       | Nurturing, supportive     | Comfortable          |
| Direct voice        | Minimal sections | Clean sans-serif           | Simple palette              | Functional only    | 3 words where 10 would do | Efficient            |

## Example: The Same Business, Three Characters

### "The Gentleman's Cut" — Barbershop

**Character A: Street Culture Rebel**

- Emotion: Belonging + Energized
- Voice: Direct
- Archetype: Rebel
- Anti: Corporate, Clinical, Boring
- Result: Black background, condensed bold type, short declarative copy ("Fresh. Clean. No wait."), high contrast, cultural imagery, tight layout

**Character B: Premium Grooming Artisan**

- Emotion: Luxury + Sophisticated
- Voice: Polished
- Archetype: Artisan
- Anti: Cheap, Salesy, Cluttered
- Result: Cream/dark navy, serif headings, generous whitespace, refined copy ("The art of the perfect cut"), slow motion, premium imagery descriptions

**Character C: Neighborhood Classic**

- Emotion: Trust + Calm
- Voice: Warm
- Archetype: Guide
- Anti: Corporate, Generic
- Result: Warm earth tones, friendly sans-serif, community-oriented copy ("Your neighborhood barber since 2024"), testimonials prominent, inviting feel

These produce three completely different websites from the same "barbershop + booking" intake — and THAT is the goal.

## Future: Micro-Cultural Styles

Beyond the archetype system, the long-term vision includes recognizing and generating micro-cultural styles:

- **Streetwear / Urban** — Asymmetry, grain, flash photography aesthetic, confrontational copy
- **Wellness / Serenity** — Organic shapes, natural textures, soft focus, reassuring tone
- **Retro / Vintage** — Period-specific typography, nostalgic color palettes, analog textures
- **Hyper-Modern / Tech** — Glass effects, gradient meshes, monospace accents, dark mode
- **Editorial / Magazine** — Strong typography hierarchy, high contrast, structured grid
- **Organic / Natural** — Earth tones, handwritten accents, sustainable materials imagery
- **Maximalist / Expressive** — Color explosion, mixed media, layered elements, visual chaos
- **Japanese Minimal** — Extreme whitespace, delicate type, asymmetric balance, zen

These would eventually be captured through visual mood board reactions (showing curated reference images and letting users react) and would drive even more specific theme and component variant selection.
