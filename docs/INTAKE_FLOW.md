# Intake Flow Design — Intent Capture System

## Overview

The intake flow is the guided discovery experience that replaces the traditional "pick a template" approach. It extracts what a client actually needs through structured questions, visual comparisons, and AI-powered conversation.

## User Experience Flow

### Step 1: Welcome & Quick Start
**Screen**: Clean welcome screen with a single question
**Question**: "What kind of website are you building?"

Options presented as visual cards with icons:
- 🏢 Business Website — "Showcase your business and attract clients"
- 📅 Booking Website — "Let customers book appointments or services"
- 🛍️ Online Store — "Sell products directly online"
- ✍️ Blog — "Share your writing and ideas"
- 💼 Portfolio — "Showcase your creative work"
- 👤 Personal Website — "Your personal corner of the internet"
- 🎓 Educational — "Teach, train, or share knowledge"
- 👥 Community — "Build a membership or community space"
- 💝 Nonprofit — "Rally support for your cause"
- 🎉 Event — "Promote and manage an event"
- 📄 Landing Page — "One focused page with a single goal"
- 📋 Directory — "List and organize businesses or resources"
- ❓ Something else — (Free text → AI interpretation)

### Step 2: Primary Goal
**Screen**: Based on Step 1 selection, show the most relevant goals

For Business Website:
- "Get people to contact me" → Contact/inquiry conversion
- "Get people to book a consultation" → Booking conversion
- "Showcase my services and build trust" → Information + credibility
- "Sell my products/services directly" → Commerce conversion
- "Something else" → Free text

For Portfolio:
- "Get hired / freelance work" → Professional showcase
- "Get gallery/label/publisher attention" → Industry showcase
- "Build my audience/following" → Fan engagement
- "Sell my work directly" → Commerce
- "Something else" → Free text

### Step 3: Industry & Context
**Screen**: Text input with smart suggestions

"Tell us about your business or project in a sentence or two."

Examples shown as placeholder text:
- "I'm opening a luxury med spa in Miami"
- "I'm a wedding photographer based in Portland"
- "We sell handmade ceramics online"

The AI extracts: industry, location, scale, target audience, competitive positioning.

### Step 4: Brand Personality
**Screen**: Series of visual A/B comparisons (5-6 rounds)

Each round shows two rendered website sections side by side, representing opposite poles of a personality axis. User clicks the one that feels more like their brand, or adjusts a slider between them.

**Round 1: Density**
Left: A spacious, minimal hero section with lots of whitespace
Right: A rich, layered hero with background textures, multiple elements

**Round 2: Tone**
Left: A playful, colorful section with rounded elements and casual copy
Right: A serious, refined section with sharp lines and professional copy

**Round 3: Temperature**
Left: A warm section with earth tones, cream backgrounds, organic shapes
Right: A cool section with blue-gray tones, crisp whites, geometric shapes

**Round 4: Weight**
Left: A light, airy section with thin fonts and subtle colors
Right: A bold, heavy section with thick fonts and strong contrast

**Round 5: Era**
Left: A classic section with serif fonts, traditional layout, timeless feel
Right: A modern section with sans-serif, contemporary layout, cutting-edge feel

**Round 6: Energy**
Left: A calm, serene section with no animation, static elements
Right: A dynamic section with motion, scroll effects, interactive elements

Each choice maps to a value on the 0-1 axis. Clicking "left" = 0.1-0.3, "slightly left" = 0.3-0.4, "center" = 0.5, etc.

### Step 5: Deep Discovery (AI-Powered)
**Screen**: Chat-like interface with AI-generated questions

Based on all previous answers, Claude generates 3-5 targeted questions. These are presented one at a time in a conversational format.

Example for luxury med spa (business + booking + luxury personality):

Question 1: "What specific services does your med spa offer? (This helps us build your services section)"
→ User types: "Botox, dermal fillers, chemical peels, facials, body sculpting, IV therapy"

Question 2: "How should clients book — directly online with a calendar, or contact you first for a consultation?"
→ User selects: "Contact first for consultation" or "Book directly online"

Question 3: "What makes your med spa different from competitors? What's your unique selling point?"
→ User types: "Board-certified physicians only, private luxury suites, personalized treatment plans"

Question 4: "Do you have professional brand photography, or will you need us to source imagery?"
→ User selects: "I have photos" / "I need sourced imagery" / "Mix of both"

Question 5: "Describe the feeling someone should have when they first visit your website."
→ User types: "Like they're stepping into a five-star hotel. Luxurious, exclusive, trustworthy."

### Step 6: Preview & Proposal
**Screen**: Full rendered preview of the proposed website

The system generates:
1. A visual preview using real components with placeholder/AI-generated content
2. A proposed sitemap sidebar showing all pages
3. Theme details (color palette, font pairing, style notes)
4. Component breakdown per page

User can:
- Approve and proceed
- Request changes ("make it darker", "use a different hero style", "add a team section")
- Go back and adjust personality or answers
- Start over

## Technical Implementation

### Intake State Management

```typescript
interface IntakeState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: number[];

  // Step 1: Site Type
  siteType: SiteType | null;
  customSiteType?: string;

  // Step 2: Primary Goal
  conversionGoal: ConversionGoal | null;
  customGoal?: string;

  // Step 3: Industry & Context
  businessDescription: string;
  extractedIndustry?: string;
  extractedAudience?: string;
  extractedLocation?: string;

  // Step 4: Brand Personality
  personalityVector: [number, number, number, number, number, number];
  personalityChoices: { axis: string; value: number }[];

  // Step 5: Deep Discovery
  aiQuestions: AIQuestion[];
  aiResponses: { questionId: string; response: string }[];

  // Step 6: Preview
  generatedSpec?: SiteIntentDocument;
  previewApproved: boolean;
  changeRequests: string[];
}

interface AIQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect";
  options?: string[];
  purpose: string;  // What this answer will be used for
}
```

### Decision Tree Storage (Convex)

```typescript
// convex/schema.ts
intakePaths: defineTable({
  step: v.string(),
  question: v.string(),
  inputType: v.union(v.literal("deterministic"), v.literal("ai_generated")),
  userInput: v.string(),
  interpretation: v.string(),
  resultingDecisions: v.object({
    componentsSelected: v.optional(v.array(v.string())),
    themeAdjustments: v.optional(v.object({})),
    pagesAdded: v.optional(v.array(v.string())),
    contentStructure: v.optional(v.object({})),
  }),
  embedding: v.optional(v.array(v.float64())),
  usageCount: v.number(),
  confirmationRate: v.number(),
  status: v.union(
    v.literal("candidate"),
    v.literal("proven"),
    v.literal("deprecated")
  ),
})
```

### AI Integration Points

**Step 3 — Industry Extraction:**
```
System: Extract industry, target audience, location, and business scale
from this description. Return structured JSON.
User input: "{businessDescription}"
```

**Step 5 — Question Generation:**
```
System: You are helping build a website. Based on the following client
profile, generate 3-5 targeted discovery questions that will help us
build their ideal website. Focus on content needs, functional requirements,
and emotional goals.

Client Profile:
- Site Type: {siteType}
- Goal: {conversionGoal}
- Business: {businessDescription}
- Brand Personality: {personalityVector interpretation}

Return questions as JSON array.
```

**Step 6 — Spec Generation:**
```
System: Based on the complete intake data, generate a Site Intent Document
that specifies pages, component selections with variants, and content
structure. Reference available components from the manifest index.

Available Components: {componentManifestIndex}
Available Themes: {themePresetIndex}
Intake Data: {completeIntakeState}

Return a complete SiteIntentDocument as JSON.
```

## Progressive Disclosure

The flow should feel light and fast. Principles:
- One question per screen (mobile-first)
- Visual choices over text whenever possible
- Progress indicator showing completion percentage
- Ability to go back to any step
- Estimated time: "This takes about 3 minutes"
- No required account creation until they want to save/build

## Edge Cases

**User selects "Something else" at any step:**
- Show text input
- AI interprets and maps to closest known category
- Store as candidate path for future promotion

**User has strong existing brand:**
- Option to upload brand guidelines, logo, colors
- System extracts tokens from uploaded assets
- Personality assessment adjusts to complement existing brand

**User is unsure about answers:**
- Provide "I'm not sure" option on personality questions (maps to 0.5 center)
- AI can suggest based on industry norms: "Most luxury service businesses prefer..."

**User wants to skip ahead:**
- Allow skipping to preview with defaults filled in
- Skipped questions use industry-standard defaults
- Note which defaults were used so they can refine later
