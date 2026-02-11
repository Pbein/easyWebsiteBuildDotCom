import { redirect } from "next/navigation";
import { DocsShell } from "@/components/platform/docs/DocsShell";

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function DocsPage(): React.ReactElement {
  // Temporarily disconnected from public access.
  // Will be gated behind Clerk admin auth in a future phase.
  // All code below is preserved for when admin access is implemented.
  redirect("/");

  const sectionContent: Record<string, React.ReactNode> = {
    overview: <OverviewContent />,
    "data-flow": <DataFlowContent />,
    "intake-flow": <IntakeFlowContent />,
    "assembly-engine": <AssemblyEngineContent />,
    "component-library": <ComponentLibraryContent />,
    "theme-system": <ThemeSystemContent />,
    architecture: <ArchitectureContent />,
    "knowledge-base": <KnowledgeBaseContent />,
    roadmap: <RoadmapContent />,
  };

  return <DocsShell sectionContent={sectionContent} />;
}

/* ------------------------------------------------------------------ */
/*  Section Content Components                                         */
/* ------------------------------------------------------------------ */

function OverviewContent(): React.ReactElement {
  return (
    <>
      <h1>Overview</h1>
      <p>
        <strong>EasyWebsiteBuild</strong> is an AI-powered website assembly platform that creates
        professional websites from a modular component library based on structured client intake.
        Instead of choosing templates, clients go through an intelligent discovery process that
        captures their real requirements — then the system assembles a unique website tailored to
        their needs.
      </p>

      <h2>What is EasyWebsiteBuild?</h2>
      <p>
        This is <strong>NOT</strong> a drag-and-drop builder. It is an intelligent assembly system
        that:
      </p>
      <ul>
        <li>Captures client intent through a 9-step guided discovery flow</li>
        <li>
          Uses AI (Claude API) combined with deterministic decision trees to make design decisions
        </li>
        <li>Selects, configures, and composes 18 website components into fully themed sites</li>
        <li>Generates downloadable static websites (HTML/CSS ZIP export)</li>
        <li>Gets smarter over time — every client interaction enriches the system</li>
      </ul>

      <h2>Core Principles</h2>
      <ul>
        <li>
          <strong>Component-First Design</strong> — Every UI element comes from a modular library of
          18 components with multiple variants per type
        </li>
        <li>
          <strong>Intent-Driven Assembly</strong> — Websites are assembled based on a structured
          Site Intent Document produced by the intake flow
        </li>
        <li>
          <strong>Evolving Knowledge Base</strong> — New intent paths start as AI-interpreted,
          graduate to deterministic after repeated confirmation
        </li>
        <li>
          <strong>Modular & Reusable</strong> — Components, themes, content patterns, and generated
          assets are all extractable and reusable
        </li>
      </ul>

      <h2>Tech Stack</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Framework</td>
            <td>Next.js 16 (App Router)</td>
          </tr>
          <tr>
            <td>Language</td>
            <td>TypeScript (strict mode)</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>Convex (real-time backend)</td>
          </tr>
          <tr>
            <td>AI Integration</td>
            <td>Claude SDK (@anthropic-ai/sdk)</td>
          </tr>
          <tr>
            <td>Styling</td>
            <td>Tailwind CSS v4 + CSS Custom Properties</td>
          </tr>
          <tr>
            <td>Animations</td>
            <td>framer-motion</td>
          </tr>
          <tr>
            <td>Theme Generation</td>
            <td>chroma-js (color manipulation)</td>
          </tr>
          <tr>
            <td>Export</td>
            <td>JSZip (project bundling)</td>
          </tr>
          <tr>
            <td>State Management</td>
            <td>Zustand with localStorage persistence</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td>Vercel</td>
          </tr>
        </tbody>
      </table>

      <h2>Current Status</h2>
      <p>
        Phases 1–4D plus Pre-Phase 5 are complete. The platform has a working 9-step intake flow
        (with brand character capture), 18-component library (4 with variant extraction), 7 theme
        presets, AI-powered spec generation with deterministic fallback, live preview with
        responsive viewport controls, and a ZIP export pipeline. Homepage and Docs pages are Server
        Components.
      </p>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1: Platform Website & Foundation</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 2: Core Component Library (10 MVP components)</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 3: AI Integration & Assembly Engine</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 4A: Quality & Content Accuracy</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 4B: Component Expansion (18 total) + Export</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 5: Visual Editor & Deployment Pipeline</td>
            <td>Next</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function DataFlowContent(): React.ReactElement {
  return (
    <>
      <h1>Data Flow</h1>
      <p>
        This section traces how data moves through the entire EasyWebsiteBuild system — from the
        first user click through AI processing, assembly, and final export.
      </p>

      <h2>End-to-End Pipeline</h2>
      <p>
        The system operates as a pipeline with four major phases: <strong>User Input</strong>,{" "}
        <strong>AI Processing</strong>, <strong>Assembly</strong>, and <strong>Export</strong>.
      </p>
      <pre>
        <code>{`User Input (Steps 1-4)
  ├── siteType         (e.g., "business")
  ├── conversionGoal   (e.g., "booking")
  ├── businessName     (e.g., "Radiance Med Spa")
  ├── description      (free text about the business)
  └── personalityVector [6 floats, 0-1 each]
        │
        ▼
  bridgeToStore() ──→ Zustand Store (persisted to localStorage)
        │
        ▼
AI Processing (Steps 5-6)
  ├── generateQuestions (Convex Action → Claude Sonnet)
  │   ├── AI Path: 4 personalized follow-up questions
  │   └── Fallback: Curated question bank (11 site types)
  │         │
  │         ▼
  │   User answers 4 questions → aiResponses stored
  │         │
  └── generateSiteSpec (Convex Action → Claude Sonnet)
      ├── AI Path: Full SiteIntentDocument with pages, components, content
      └── Fallback: Deterministic selection using personality vector
              │
              ▼
Assembly
  ├── SiteIntentDocument saved to Convex (siteSpecs table)
  ├── AssemblyRenderer generates theme from personalityVector
  ├── font-loader injects Google Fonts
  ├── COMPONENT_REGISTRY resolves componentId → React components
  └── ThemeProvider wraps render tree with CSS Custom Properties
              │
              ▼
Export
  ├── generateProject(spec) → HTML, CSS, README files
  ├── createProjectZip(result) → ZIP blob via JSZip
  └── downloadBlob() → Browser download trigger`}</code>
      </pre>

      <h2>User Input Phase</h2>
      <p>
        During Steps 1–4, the user provides structured input through the intake flow. This data
        lives in local React state (managed within the Demo page component) until the Step 4→5
        transition, when <code>bridgeToStore()</code> syncs everything to the Zustand store.
      </p>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Data Collected</th>
            <th>Format</th>
            <th>Storage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Site Type</td>
            <td>Category of website</td>
            <td>String enum (13 options)</td>
            <td>Local React state</td>
          </tr>
          <tr>
            <td>2. Goal</td>
            <td>Primary conversion objective</td>
            <td>String enum (9 options)</td>
            <td>Local React state</td>
          </tr>
          <tr>
            <td>3. Description</td>
            <td>Business name + description</td>
            <td>Free text strings</td>
            <td>Local React state</td>
          </tr>
          <tr>
            <td>4. Personality</td>
            <td>6-axis brand personality</td>
            <td>
              <code>[number x 6]</code>, each 0–1
            </td>
            <td>Local → Zustand via bridge</td>
          </tr>
        </tbody>
      </table>
      <p>
        The <strong>bridge pattern</strong> exists because Steps 1–4 are a self-contained UI flow
        within the Demo page, while Steps 5–6 are separate components (<code>Step5Discovery</code>,{" "}
        <code>Step6Loading</code>) that read from the shared Zustand store.
      </p>

      <h2>AI Processing Phase</h2>
      <p>
        Two Convex actions handle AI processing, each with a comprehensive deterministic fallback:
      </p>
      <h3>Question Generation</h3>
      <p>
        <code>convex/ai/generateQuestions.ts</code> sends the user&apos;s profile (site type, goal,
        business description, personality interpretation) to Claude Sonnet and receives 4 targeted
        questions. On failure, a curated question bank provides questions for 11 site types.
      </p>
      <h3>Spec Generation</h3>
      <p>
        <code>convex/ai/generateSiteSpec.ts</code> sends all intake data (including question
        answers) to Claude Sonnet with a system prompt listing all 18 available components and their
        content schemas. Claude returns a complete <code>SiteIntentDocument</code> with page
        structure, component selection, variant configuration, and content.
      </p>
      <p>
        The deterministic fallback selects components based on site type and personality vector,
        using helper functions to generate appropriate content:
      </p>
      <ul>
        <li>
          <code>getStatsForSiteType()</code> — Industry-relevant statistics (number values)
        </li>
        <li>
          <code>getServicesForSiteType()</code> — Service/product listings
        </li>
        <li>
          <code>getTeamForSiteType()</code> — Team member profiles
        </li>
        <li>
          <code>getTrustLogos()</code> — Industry partner/client names
        </li>
        <li>
          <code>getFaqForSiteType()</code> — Common questions and answers
        </li>
      </ul>

      <h2>Assembly Phase</h2>
      <p>
        Once the <code>SiteIntentDocument</code> is saved to Convex, the user is redirected to{" "}
        <code>/demo/preview?session=&lt;sessionId&gt;</code>. The preview page:
      </p>
      <ol>
        <li>
          Fetches the spec from Convex via <code>getSiteSpec(sessionId)</code>
        </li>
        <li>
          Passes it to <code>AssemblyRenderer</code>, which:
          <ul>
            <li>
              Generates a complete theme token set from the personality vector using{" "}
              <code>generateThemeFromVector()</code>
            </li>
            <li>Loads required Google Fonts dynamically (with deduplication)</li>
            <li>
              Resolves each <code>componentId</code> to a React component via{" "}
              <code>COMPONENT_REGISTRY</code>
            </li>
            <li>
              Sorts components by <code>order</code>, wraps in Section containers with alternating
              backgrounds
            </li>
            <li>
              Renders everything inside <code>ThemeProvider</code> with the generated tokens as CSS
              Custom Properties
            </li>
          </ul>
        </li>
      </ol>

      <h2>Export Phase</h2>
      <p>When the user clicks &ldquo;Export&rdquo; in the preview toolbar:</p>
      <ol>
        <li>
          <code>generateProject(spec)</code> converts the <code>SiteIntentDocument</code> into
          static files:
          <ul>
            <li>
              <code>index.html</code> — Semantic HTML for all components, Google Fonts links
            </li>
            <li>
              <code>styles.css</code> — Theme CSS variables, responsive design, component styles
            </li>
            <li>
              <code>README.md</code> — Setup and customization instructions
            </li>
          </ul>
        </li>
        <li>
          <code>createProjectZip(result)</code> bundles files into a ZIP using JSZip
        </li>
        <li>
          <code>downloadBlob(blob, filename)</code> triggers the browser download
        </li>
      </ol>
      <p>
        The exported website is fully standalone — no dependencies on EasyWebsiteBuild. It includes
        all theme tokens as CSS Custom Properties, responsive breakpoints, and Google Fonts loading.
      </p>

      <h2>Data Flow Diagram</h2>
      <pre>
        <code>{`┌─────────────────────────────────────────────────────┐
│                    USER INPUT                        │
│                                                     │
│  Step 1: Site Type ─────┐                           │
│  Step 2: Goal ──────────┤                           │
│  Step 3: Description ───┤  Local React State        │
│  Step 4: Personality ───┘                           │
│         │                                           │
│         ▼ bridgeToStore()                           │
│  ┌──────────────┐                                   │
│  │ Zustand Store │◄── localStorage persistence      │
│  └──────┬───────┘                                   │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│                  AI PROCESSING                       │
│                                                     │
│  Step 5: generateQuestions (Convex Action)           │
│    ├── Claude Sonnet → 4 questions                  │
│    └── Fallback → question bank (11 types)          │
│         │                                           │
│    User answers → aiResponses in store              │
│         │                                           │
│  Step 6: generateSiteSpec (Convex Action)            │
│    ├── Claude Sonnet → SiteIntentDocument            │
│    └── Fallback → deterministic selection            │
│         │                                           │
│         ▼                                           │
│  ┌────────────────────────┐                         │
│  │ Convex DB: siteSpecs   │ ← saveSiteSpec()        │
│  └────────────┬───────────┘                         │
└───────────────┼─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│                    ASSEMBLY                          │
│                                                     │
│  /demo/preview?session=<id>                          │
│    │                                                │
│    ├── getSiteSpec(sessionId) → fetch from Convex   │
│    │                                                │
│    ├── AssemblyRenderer                              │
│    │   ├── generateThemeFromVector() → 87 tokens    │
│    │   ├── font-loader → Google Fonts <link> tags    │
│    │   ├── COMPONENT_REGISTRY → React components    │
│    │   └── ThemeProvider → CSS Custom Properties     │
│    │                                                │
│    ├── PreviewSidebar (metadata, colors, fonts)     │
│    └── PreviewToolbar (viewport, export button)     │
│         │                                           │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│                     EXPORT                           │
│                                                     │
│  generateProject(spec)                               │
│    → index.html + styles.css + README.md             │
│                                                     │
│  createProjectZip(result)                            │
│    → ZIP blob (JSZip)                                │
│                                                     │
│  downloadBlob(blob, filename)                        │
│    → Browser download trigger                        │
│                                                     │
│  Output: standalone-website.zip                      │
│    ├── index.html    (semantic HTML, fonts)           │
│    ├── styles.css    (theme vars, responsive)        │
│    └── README.md     (setup instructions)            │
└─────────────────────────────────────────────────────┘`}</code>
      </pre>
    </>
  );
}

function IntakeFlowContent(): React.ReactElement {
  return (
    <>
      <h1>Intake Flow</h1>
      <p>
        The intake flow is the 9-step guided discovery experience that replaces &quot;pick a
        template.&quot; It captures what a client needs through structured questions, visual
        comparisons, brand character profiling, and AI-powered conversation. Steps are grouped into
        three segments: Setup (1-4), Character (5-7), and Discovery (8-9).
      </p>

      <h2>User Experience Flow</h2>
      <p>
        The flow is designed to feel light and fast — one question per screen, visual choices over
        text, with progressive disclosure. Estimated time: about 3 minutes. Users can navigate
        backward to any previous step and forward through completed steps.
      </p>

      <h2>Step 1: Site Type</h2>
      <p>
        &quot;What kind of website are you building?&quot; — presented as visual cards with icons.
      </p>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Business</td>
            <td>Showcase your business and attract clients</td>
          </tr>
          <tr>
            <td>Booking</td>
            <td>Let customers book appointments or services</td>
          </tr>
          <tr>
            <td>Online Store</td>
            <td>Sell products directly online</td>
          </tr>
          <tr>
            <td>Blog</td>
            <td>Share your writing and ideas</td>
          </tr>
          <tr>
            <td>Portfolio</td>
            <td>Showcase your creative work</td>
          </tr>
          <tr>
            <td>Personal</td>
            <td>Your personal corner of the internet</td>
          </tr>
          <tr>
            <td>Educational</td>
            <td>Teach, train, or share knowledge</td>
          </tr>
          <tr>
            <td>Community</td>
            <td>Build a membership or community space</td>
          </tr>
          <tr>
            <td>Nonprofit</td>
            <td>Rally support for your cause</td>
          </tr>
          <tr>
            <td>Event</td>
            <td>Promote and manage an event</td>
          </tr>
          <tr>
            <td>Landing Page</td>
            <td>One focused page with a single goal</td>
          </tr>
          <tr>
            <td>Directory</td>
            <td>List and organize businesses or resources</td>
          </tr>
          <tr>
            <td>Something else</td>
            <td>Free text → AI interpretation</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 2: Primary Goal</h2>
      <p>
        Based on the Step 1 selection, contextual goals are shown. Goals are site-type-specific:
      </p>
      <ul>
        <li>
          <strong>Business</strong>: Contact, book consultation, showcase services, sell directly
        </li>
        <li>
          <strong>Portfolio</strong>: Get hired, get industry attention, build audience, sell work
        </li>
        <li>
          <strong>Nonprofit</strong>: Accept donations, recruit volunteers, raise awareness
        </li>
        <li>
          <strong>E-commerce</strong>: Physical products, digital products, subscriptions
        </li>
      </ul>

      <h2>Step 3: Industry &amp; Context</h2>
      <p>
        Two text inputs: <strong>Business Name</strong> (short name for the website) and{" "}
        <strong>Business Description</strong> (1-2 sentences about the business/project).
      </p>
      <p>
        Examples: &quot;I&apos;m opening a luxury med spa in Miami,&quot; &quot;We&apos;re a wedding
        photography studio in Portland.&quot;
      </p>

      <h2>Step 4: Brand Personality</h2>
      <p>
        Six visual A/B comparisons across personality axes. Each produces a 0–1 value, together
        forming a 6-dimensional personality vector like <code>[0.2, 0.8, 0.3, 0.6, 0.9, 0.4]</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Axis</th>
            <th>Left (0.0)</th>
            <th>Right (1.0)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Density</td>
            <td>Minimal / Spacious</td>
            <td>Rich / Dense</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Tone</td>
            <td>Playful / Casual</td>
            <td>Serious / Professional</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Temperature</td>
            <td>Warm / Inviting</td>
            <td>Cool / Sleek</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Weight</td>
            <td>Light / Airy</td>
            <td>Bold / Heavy</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Era</td>
            <td>Classic / Traditional</td>
            <td>Modern / Contemporary</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Energy</td>
            <td>Calm / Serene</td>
            <td>Dynamic / Energetic</td>
          </tr>
        </tbody>
      </table>
      <p>
        At the Step 4→5 transition, <code>bridgeToStore()</code> syncs all local state (siteType,
        goal, businessName, description, personalityVector) into the Zustand store with localStorage
        persistence.
      </p>

      <h2>Step 5: Deep Discovery (AI)</h2>
      <p>
        The <code>Step5Discovery</code> component calls the <code>generateQuestions</code> Convex
        action, which sends the user&apos;s profile to Claude Sonnet. Claude returns 4 personalized
        questions presented one at a time in a conversational interface.
      </p>
      <p>Example for a luxury med spa:</p>
      <ol>
        <li>&quot;What specific services does your med spa offer?&quot; (text input)</li>
        <li>&quot;How should clients book — directly online or contact first?&quot; (select)</li>
        <li>&quot;What makes your med spa different from competitors?&quot; (text input)</li>
        <li>&quot;Do you have professional brand photography?&quot; (select)</li>
      </ol>
      <p>
        If the Claude API call fails, a comprehensive fallback question bank provides curated
        questions for 11 site types with mix of text and select inputs.
      </p>

      <h2>Step 6: Generation &amp; Preview</h2>
      <p>
        The <code>Step6Loading</code> component displays an animated 5-phase loading screen while
        calling <code>generateSiteSpec</code>. On success, the user is auto-redirected to{" "}
        <code>/demo/preview?session=&lt;sessionId&gt;</code> where they see their assembled website
        with:
      </p>
      <ul>
        <li>Responsive viewport switcher (desktop / tablet / mobile)</li>
        <li>
          Collapsible sidebar showing business info, theme colors, fonts, component list, and
          personality visualization
        </li>
        <li>Toolbar with viewport controls and ZIP export button</li>
      </ul>

      <h2>State Management</h2>
      <p>
        The intake flow uses a <strong>bridge pattern</strong>:
      </p>
      <ul>
        <li>
          <strong>Steps 1–4</strong>: Local React state within the Demo page component
        </li>
        <li>
          <strong>Step 4→5 transition</strong>: <code>bridgeToStore()</code> syncs to Zustand
        </li>
        <li>
          <strong>Steps 5–6</strong>: Read from Zustand store (<code>useIntakeStore</code>)
        </li>
        <li>
          <strong>Zustand store</strong>: Persisted to localStorage via{" "}
          <code>zustand/middleware</code>, survives page refreshes
        </li>
      </ul>
      <p>Key store fields:</p>
      <pre>
        <code>{`{
  siteType, conversionGoal,
  businessName, businessDescription,
  personalityVector,
  aiQuestions, aiResponses,
  questionsInputKey,  // fingerprint for staleness detection
  sessionId, specId
}`}</code>
      </pre>

      <h2>Staleness Detection</h2>
      <p>
        When a user returns to Step 5 (e.g., after completing a full flow and starting over with
        different inputs), the system needs to determine whether the cached questions are still
        relevant.
      </p>
      <p>
        A <code>questionsInputKey</code> fingerprint is computed from{" "}
        <code>{`\${siteType}|\${goal}|\${businessName}|\${description.slice(0,100)}`}</code> and
        stored when questions are generated.
      </p>
      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Different inputs (key mismatch)</td>
            <td>Clear old Q&amp;A, generate fresh questions</td>
          </tr>
          <tr>
            <td>Same inputs, all answered</td>
            <td>Show review mode (read-only answers + confirm/update buttons)</td>
          </tr>
          <tr>
            <td>Same inputs, partially answered</td>
            <td>Resume from where user left off</td>
          </tr>
          <tr>
            <td>No questions exist</td>
            <td>Generate new questions</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function AssemblyEngineContent(): React.ReactElement {
  return (
    <>
      <h1>Core Engine</h1>
      <p>
        The Assembly Engine takes a Site Intent Document (produced by the intake flow) and composes
        it into a complete, themed website using 18 components from the library. It handles theme
        generation, component resolution, layout composition, and export.
      </p>

      <h2>Assembly Pipeline</h2>
      <pre>
        <code>{`Site Intent Document
       ↓
  1. Resolve Theme (personality vector → 87 CSS tokens)
       ↓
  2. Select Components (COMPONENT_REGISTRY lookup)
       ↓
  3. Configure Variants (personality fit + content)
       ↓
  4. Compose Layout (Section wrappers, alternating BG)
       ↓
  5. Generate Content (AI or deterministic)
       ↓
  6. Render Preview (AssemblyRenderer + ThemeProvider)
       ↓
  7. User Review (viewport controls, sidebar)
       ↓
  8. Export (HTML/CSS ZIP download)`}</code>
      </pre>

      <h2>Theme Resolution</h2>
      <p>
        The <code>generateThemeFromVector()</code> function maps the 6-axis personality vector to a
        complete set of 87 CSS Custom Properties using <strong>chroma-js</strong> for palette
        generation and 10 curated font pairings scored by personality fit.
      </p>
      <p>
        The function selects base hue, saturation, and contrast from the personality axes, generates
        a harmonious color palette, picks the best-matching font pairing, and computes spacing,
        radius, shadow, and animation values — all from the 6 personality numbers.
      </p>

      <h2>Component Selection</h2>
      <p>
        The <code>COMPONENT_REGISTRY</code> maps 18 <code>componentId</code> strings to their React
        components. The <code>UNWRAPPED_COMPONENTS</code> set identifies components that handle
        their own layout (<code>nav-sticky</code>, <code>footer-standard</code>) and render without
        Section wrappers.
      </p>
      <table>
        <thead>
          <tr>
            <th>componentId</th>
            <th>Component</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>nav-sticky</code>
            </td>
            <td>NavSticky</td>
            <td>Navigation</td>
          </tr>
          <tr>
            <td>
              <code>hero-centered</code>
            </td>
            <td>HeroCentered</td>
            <td>Hero</td>
          </tr>
          <tr>
            <td>
              <code>hero-split</code>
            </td>
            <td>HeroSplit</td>
            <td>Hero</td>
          </tr>
          <tr>
            <td>
              <code>content-features</code>
            </td>
            <td>ContentFeatures</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-split</code>
            </td>
            <td>ContentSplit</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-text</code>
            </td>
            <td>ContentText</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-stats</code>
            </td>
            <td>ContentStats</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-accordion</code>
            </td>
            <td>ContentAccordion</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-timeline</code>
            </td>
            <td>ContentTimeline</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>content-logos</code>
            </td>
            <td>ContentLogos</td>
            <td>Content</td>
          </tr>
          <tr>
            <td>
              <code>cta-banner</code>
            </td>
            <td>CtaBanner</td>
            <td>CTA</td>
          </tr>
          <tr>
            <td>
              <code>form-contact</code>
            </td>
            <td>FormContact</td>
            <td>Forms</td>
          </tr>
          <tr>
            <td>
              <code>proof-testimonials</code>
            </td>
            <td>ProofTestimonials</td>
            <td>Social Proof</td>
          </tr>
          <tr>
            <td>
              <code>proof-beforeafter</code>
            </td>
            <td>ProofBeforeAfter</td>
            <td>Social Proof</td>
          </tr>
          <tr>
            <td>
              <code>team-grid</code>
            </td>
            <td>TeamGrid</td>
            <td>Team</td>
          </tr>
          <tr>
            <td>
              <code>commerce-services</code>
            </td>
            <td>CommerceServices</td>
            <td>Commerce</td>
          </tr>
          <tr>
            <td>
              <code>media-gallery</code>
            </td>
            <td>MediaGallery</td>
            <td>Media</td>
          </tr>
          <tr>
            <td>
              <code>footer-standard</code>
            </td>
            <td>FooterStandard</td>
            <td>Footer</td>
          </tr>
        </tbody>
      </table>

      <h2>Variant Configuration</h2>
      <p>Each component supports multiple visual variants. Selection is based on:</p>
      <ul>
        <li>
          <strong>Personality fit</strong> — Component manifests define <code>personalityFit</code>{" "}
          ranges (e.g., hero-centered&apos;s gradient-bg variant fits higher on the &quot;rich&quot;
          axis)
        </li>
        <li>
          <strong>Content availability</strong> — Image-heavy variants are only used when images are
          provided
        </li>
        <li>
          <strong>Site type</strong> — Certain variants are preferred for specific site types
        </li>
      </ul>

      <h2>Layout Composition</h2>
      <p>
        Components are sorted by <code>order</code> field and wrapped in <code>Section</code>{" "}
        containers. The <code>AssemblyRenderer</code> applies alternating background styles (
        <code>default</code> ↔ <code>surface</code>) for visual rhythm. Navigation and footer
        components render outside Section wrappers.
      </p>

      <h2>Content Generation</h2>
      <p>Content for each component is generated through two paths:</p>
      <ul>
        <li>
          <strong>AI path</strong>: Claude Sonnet generates all content fields matching the exact
          component type interfaces
        </li>
        <li>
          <strong>Deterministic path</strong>: Site-type-specific helper functions generate content:
          <ul>
            <li>
              <code>getStatsForSiteType()</code> — Statistics with number values
            </li>
            <li>
              <code>getServicesForSiteType()</code> — Service listings
            </li>
            <li>
              <code>getTeamForSiteType()</code> — Team member profiles
            </li>
            <li>
              <code>getTrustLogos()</code> — Partner/client logo names
            </li>
            <li>
              <code>getFaqForSiteType()</code> — FAQ question/answer pairs
            </li>
          </ul>
        </li>
      </ul>

      <h2>Live Preview</h2>
      <p>
        The preview page at <code>/demo/preview</code> renders the assembled site with:
      </p>
      <ul>
        <li>
          <strong>Viewport switcher</strong> — Desktop (100%), Tablet (768px), Mobile (375px)
        </li>
        <li>
          <strong>Sidebar</strong> — Business name, theme colors/fonts, component list, personality
          radar visualization
        </li>
        <li>
          <strong>Toolbar</strong> — Business name badge, viewport controls, Edit Theme (coming
          soon), Export button
        </li>
      </ul>

      <h2>Export Pipeline</h2>
      <p>
        The export pipeline converts a <code>SiteIntentDocument</code> into a downloadable static
        website ZIP file. Located in <code>src/lib/export/</code>:
      </p>
      <ol>
        <li>
          <code>generateProject(spec)</code> — Produces <code>index.html</code>,{" "}
          <code>styles.css</code>, and <code>README.md</code> with:
          <ul>
            <li>Semantic HTML for all 18 component types</li>
            <li>
              XSS-safe content via <code>escapeHtml()</code>
            </li>
            <li>
              Google Fonts loading via <code>&lt;link&gt;</code> tags
            </li>
            <li>Full CSS with theme variables, responsive breakpoints, and component styles</li>
          </ul>
        </li>
        <li>
          <code>createProjectZip(result)</code> — Bundles into ZIP using JSZip
        </li>
        <li>
          <code>downloadBlob(blob, filename)</code> — Triggers browser download
        </li>
      </ol>
      <p>The exported site is completely standalone with no dependencies on EasyWebsiteBuild.</p>

      <h2>Component Registry</h2>
      <p>
        The <code>COMPONENT_REGISTRY</code> in <code>src/lib/assembly/component-registry.ts</code>{" "}
        is the central mapping that connects string-based component IDs (from the JSON spec) to
        actual React components:
      </p>
      <pre>
        <code>{`const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  "nav-sticky": NavSticky,
  "hero-centered": HeroCentered,
  "hero-split": HeroSplit,
  "content-features": ContentFeatures,
  "content-split": ContentSplit,
  "content-text": ContentText,
  "content-stats": ContentStats,
  "content-accordion": ContentAccordion,
  "content-timeline": ContentTimeline,
  "content-logos": ContentLogos,
  "cta-banner": CtaBanner,
  "form-contact": FormContact,
  "proof-testimonials": ProofTestimonials,
  "proof-beforeafter": ProofBeforeAfter,
  "team-grid": TeamGrid,
  "commerce-services": CommerceServices,
  "media-gallery": MediaGallery,
  "footer-standard": FooterStandard,
};`}</code>
      </pre>
    </>
  );
}

function ComponentLibraryContent(): React.ReactElement {
  return (
    <>
      <h1>Component Library</h1>
      <p>
        The component library contains 18 production-ready components across 8 categories. Every UI
        element on generated websites comes from this library. Components are self-contained,
        variant-aware, theme-token driven, and composable.
      </p>

      <h2>Design Principles</h2>
      <ol>
        <li>
          <strong>Token-driven</strong> — Components NEVER hardcode colors, fonts, or brand values.
          All visuals come from CSS Custom Properties
        </li>
        <li>
          <strong>Variant-rich</strong> — Each component type supports multiple visual variants
          sharing the same data contract
        </li>
        <li>
          <strong>Content-agnostic</strong> — Components accept structured content via props
        </li>
        <li>
          <strong>Responsive</strong> — Fully responsive across mobile, tablet, and desktop
        </li>
        <li>
          <strong>Accessible</strong> — Semantic HTML, ARIA attributes, keyboard navigation
        </li>
      </ol>

      <h2>File Structure</h2>
      <p>
        Components use one of two patterns. Most use a <strong>standard single-file</strong>{" "}
        pattern:
      </p>
      <pre>
        <code>{`components/library/[category]/[component-name]/
├── index.ts                    # Public export
├── [ComponentName].tsx         # Component implementation
├── [component-name].types.ts   # TypeScript interfaces
├── manifest.json               # Manifest for assembly engine
└── [component-name].tokens.ts  # Token consumption declarations`}</code>
      </pre>
      <p>
        Four components use a <strong>variant-extracted</strong> pattern with shared base + variant
        subdirectory (hero-centered, commerce-services, team-grid, media-gallery):
      </p>
      <pre>
        <code>{`components/library/[category]/[component-name]/
├── index.ts                    # Public export (unchanged)
├── [ComponentName].tsx         # Thin dispatcher (~50-70 lines)
├── shared.tsx                  # Shared constants, utilities, sub-components
├── variants/
│   ├── [variant-a].tsx         # Individual variant implementation
│   └── [variant-b].tsx
├── [component-name].types.ts   # TypeScript interfaces
├── manifest.json               # Manifest for assembly engine
└── [component-name].tokens.ts  # Token consumption declarations`}</code>
      </pre>

      <h2>Props Contract</h2>
      <p>All components extend a base interface:</p>
      <pre>
        <code>{`interface BaseComponentProps {
  id?: string;
  className?: string;
  theme?: Partial<ThemeTokens>;  // Inline token overrides
  animate?: boolean;             // Entry animations
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}`}</code>
      </pre>

      <h2>Built Components (18)</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Variants</th>
            <th>Key Features</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>nav-sticky</code>
            </td>
            <td>transparent, solid</td>
            <td>Solidifies on scroll, responsive mobile menu</td>
          </tr>
          <tr>
            <td>
              <code>section</code>
            </td>
            <td>6 bg variants, 5 spacing</td>
            <td>Universal layout wrapper with container constraints</td>
          </tr>
          <tr>
            <td>
              <code>hero-centered</code>
            </td>
            <td>with-bg-image, gradient-bg</td>
            <td>Gradient overlay, radial mesh background</td>
          </tr>
          <tr>
            <td>
              <code>hero-split</code>
            </td>
            <td>image-right, image-left</td>
            <td>Decorative accent element behind image</td>
          </tr>
          <tr>
            <td>
              <code>content-features</code>
            </td>
            <td>icon-cards</td>
            <td>Lucide icon lookup, hover lift, staggered entry</td>
          </tr>
          <tr>
            <td>
              <code>content-split</code>
            </td>
            <td>alternating</td>
            <td>Rows flip image side, scroll animation</td>
          </tr>
          <tr>
            <td>
              <code>content-text</code>
            </td>
            <td>centered</td>
            <td>Eyebrow, headline, body (HTML support)</td>
          </tr>
          <tr>
            <td>
              <code>content-stats</code>
            </td>
            <td>inline, cards, animated-counter</td>
            <td>Number values with prefix/suffix formatting</td>
          </tr>
          <tr>
            <td>
              <code>content-accordion</code>
            </td>
            <td>single-open, multi-open, bordered</td>
            <td>Keyboard accessible, smooth height transitions</td>
          </tr>
          <tr>
            <td>
              <code>content-timeline</code>
            </td>
            <td>vertical, alternating</td>
            <td>Connecting lines, scroll-triggered entry</td>
          </tr>
          <tr>
            <td>
              <code>content-logos</code>
            </td>
            <td>grid, scroll, fade</td>
            <td>Auto-generated placeholder icons for logos</td>
          </tr>
          <tr>
            <td>
              <code>cta-banner</code>
            </td>
            <td>full-width, contained</td>
            <td>4 bg options: primary, dark, gradient, image</td>
          </tr>
          <tr>
            <td>
              <code>form-contact</code>
            </td>
            <td>simple</td>
            <td>Client-side validation, error states, success animation</td>
          </tr>
          <tr>
            <td>
              <code>footer-standard</code>
            </td>
            <td>multi-column</td>
            <td>SVG social icons, link columns, copyright bar</td>
          </tr>
          <tr>
            <td>
              <code>proof-testimonials</code>
            </td>
            <td>carousel</td>
            <td>Pagination dots, star ratings, avatar fallbacks</td>
          </tr>
          <tr>
            <td>
              <code>proof-beforeafter</code>
            </td>
            <td>slider, side-by-side</td>
            <td>Interactive drag slider, keyboard + touch support</td>
          </tr>
          <tr>
            <td>
              <code>team-grid</code>
            </td>
            <td>cards, minimal, hover-reveal</td>
            <td>Member photos, roles, social links</td>
          </tr>
          <tr>
            <td>
              <code>commerce-services</code>
            </td>
            <td>card-grid, list, tiered</td>
            <td>Service descriptions, pricing, feature lists</td>
          </tr>
          <tr>
            <td>
              <code>media-gallery</code>
            </td>
            <td>grid, masonry, lightbox</td>
            <td>Filter tabs, keyboard nav, category filtering</td>
          </tr>
        </tbody>
      </table>

      <h2>Component Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Built</th>
            <th>Planned</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Navigation</td>
            <td>
              <code>nav-sticky</code>
            </td>
            <td>Hamburger, Mega Menu, Centered, Sidebar</td>
          </tr>
          <tr>
            <td>Hero</td>
            <td>
              <code>hero-centered</code>, <code>hero-split</code>
            </td>
            <td>Video, Parallax, Carousel, Minimal</td>
          </tr>
          <tr>
            <td>Content</td>
            <td>
              <code>content-features</code>, <code>content-split</code>, <code>content-text</code>,{" "}
              <code>content-stats</code>, <code>content-accordion</code>,{" "}
              <code>content-timeline</code>, <code>content-logos</code>
            </td>
            <td>Cards, Comparison, Tabs</td>
          </tr>
          <tr>
            <td>Social Proof</td>
            <td>
              <code>proof-testimonials</code>, <code>proof-beforeafter</code>
            </td>
            <td>Reviews, Case Studies</td>
          </tr>
          <tr>
            <td>Team</td>
            <td>
              <code>team-grid</code>
            </td>
            <td>Carousel, Spotlight</td>
          </tr>
          <tr>
            <td>Commerce</td>
            <td>
              <code>commerce-services</code>
            </td>
            <td>Products, Pricing Table</td>
          </tr>
          <tr>
            <td>Media</td>
            <td>
              <code>media-gallery</code>
            </td>
            <td>Video, Portfolio, Showcase</td>
          </tr>
          <tr>
            <td>CTA / Forms / Footer</td>
            <td>
              <code>cta-banner</code>, <code>form-contact</code>, <code>footer-standard</code>
            </td>
            <td>Card CTA, Booking, Newsletter, Mega Footer</td>
          </tr>
        </tbody>
      </table>

      <h2>Field Naming Reference</h2>
      <p>
        When generating content for components (in AI or deterministic spec generation), field names
        must match the TypeScript interfaces exactly:
      </p>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Correct</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>commerce-services</code>
            </td>
            <td>
              <code>name</code>
            </td>
            <td>
              <code>title</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>team-grid</code>
            </td>
            <td>
              <code>image</code>
            </td>
            <td>
              <code>avatar</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>content-timeline</code>
            </td>
            <td>
              <code>date</code>
            </td>
            <td>
              <code>year</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>proof-beforeafter</code>
            </td>
            <td>
              <code>comparisons</code>
            </td>
            <td>
              <code>items</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>content-stats</code>
            </td>
            <td>
              <code>value</code> (number)
            </td>
            <td>
              <code>value</code> (string)
            </td>
          </tr>
          <tr>
            <td>
              <code>content-logos</code>
            </td>
            <td>
              <code>headline</code>
            </td>
            <td>
              (no <code>subheadline</code>)
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ThemeSystemContent(): React.ReactElement {
  return (
    <>
      <h1>Theme System</h1>
      <p>
        The theme system prevents every generated website from looking the same. It translates the
        brand personality captured during intake into a complete set of 87 CSS Custom Properties
        (design tokens) across 6 categories.
      </p>

      <h2>Design Token Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Token Count</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Color</td>
            <td>~20</td>
            <td>
              <code>--color-primary</code>, <code>--color-accent</code>,{" "}
              <code>--color-background</code>, <code>--color-text</code>
            </td>
          </tr>
          <tr>
            <td>Typography</td>
            <td>~20</td>
            <td>
              <code>--font-heading</code>, <code>--font-body</code>, <code>--text-xs</code> to{" "}
              <code>--text-7xl</code>, weights, line heights
            </td>
          </tr>
          <tr>
            <td>Spacing</td>
            <td>~8</td>
            <td>
              <code>--space-section</code>, <code>--space-component</code>,{" "}
              <code>--container-max</code>
            </td>
          </tr>
          <tr>
            <td>Shape</td>
            <td>~6</td>
            <td>
              <code>--radius-sm</code> through <code>--radius-full</code>
            </td>
          </tr>
          <tr>
            <td>Shadows</td>
            <td>~5</td>
            <td>
              <code>--shadow-sm</code> through <code>--shadow-xl</code>
            </td>
          </tr>
          <tr>
            <td>Animation</td>
            <td>~5</td>
            <td>
              <code>--transition-fast</code>, <code>--transition-base</code>,{" "}
              <code>--animation-distance</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Personality Vector Mapping</h2>
      <p>
        The <code>generateThemeFromVector()</code> function maps the 6-axis personality vector to
        theme tokens:
      </p>
      <table>
        <thead>
          <tr>
            <th>Axis</th>
            <th>Low (0)</th>
            <th>High (1)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Density</td>
            <td>Large spacing, no shadows, monochrome</td>
            <td>Compact, layered shadows, decorative borders</td>
          </tr>
          <tr>
            <td>Tone</td>
            <td>Rounded fonts, high saturation, bouncy</td>
            <td>Serif/geometric, desaturated, subtle easing</td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td>Warm neutrals, earth tones</td>
            <td>Cool neutrals, steel/ice tones</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>Thin weights, subtle contrast</td>
            <td>Heavy weights, high contrast, dark backgrounds</td>
          </tr>
          <tr>
            <td>Era</td>
            <td>Serif headings, ornamental, traditional</td>
            <td>Geometric sans, minimal, contemporary</td>
          </tr>
          <tr>
            <td>Energy</td>
            <td>Slow transitions, static layouts</td>
            <td>Fast transitions, parallax, interactive</td>
          </tr>
        </tbody>
      </table>

      <h2>Curated Font Pairings</h2>
      <p>10 curated pairings scored by seriousness and era axes for automatic selection:</p>
      <table>
        <thead>
          <tr>
            <th>Style</th>
            <th>Heading Font</th>
            <th>Body Font</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Luxury Serif</td>
            <td>Cormorant Garamond</td>
            <td>Outfit</td>
          </tr>
          <tr>
            <td>Corporate Modern</td>
            <td>Sora</td>
            <td>DM Sans</td>
          </tr>
          <tr>
            <td>Bold Creative</td>
            <td>Space Grotesk</td>
            <td>Outfit</td>
          </tr>
          <tr>
            <td>Traditional</td>
            <td>Lora</td>
            <td>Merriweather Sans</td>
          </tr>
          <tr>
            <td>Impact Display</td>
            <td>Bebas Neue</td>
            <td>Barlow</td>
          </tr>
          <tr>
            <td>Tech Mono</td>
            <td>JetBrains Mono</td>
            <td>DM Sans</td>
          </tr>
          <tr>
            <td>Editorial</td>
            <td>Playfair Display</td>
            <td>Source Sans 3</td>
          </tr>
          <tr>
            <td>Friendly Rounded</td>
            <td>Nunito</td>
            <td>Nunito Sans</td>
          </tr>
          <tr>
            <td>Geometric Clean</td>
            <td>Poppins</td>
            <td>Inter</td>
          </tr>
          <tr>
            <td>Architectural</td>
            <td>DM Serif Display</td>
            <td>DM Sans</td>
          </tr>
        </tbody>
      </table>

      <h2>Theme Presets (7)</h2>
      <p>Seven curated presets are built and available:</p>
      <table>
        <thead>
          <tr>
            <th>Preset</th>
            <th>Colors</th>
            <th>Fonts</th>
            <th>Character</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Luxury Dark</td>
            <td>Gold / Navy</td>
            <td>Cormorant Garamond / Outfit</td>
            <td>Rich, elegant, generous space</td>
          </tr>
          <tr>
            <td>Modern Clean</td>
            <td>Blue / White</td>
            <td>Sora / DM Sans</td>
            <td>Crisp, minimal, professional</td>
          </tr>
          <tr>
            <td>Warm Professional</td>
            <td>Terracotta / Sage</td>
            <td>Lora / Merriweather Sans</td>
            <td>Warm, approachable, trustworthy</td>
          </tr>
          <tr>
            <td>Bold Creative</td>
            <td>Magenta / Cyan</td>
            <td>Oswald / Lato</td>
            <td>High contrast, 0px radius, bold</td>
          </tr>
          <tr>
            <td>Editorial</td>
            <td>Red / White</td>
            <td>Libre Baskerville / Nunito Sans</td>
            <td>Magazine-like, typographic, 0px radius</td>
          </tr>
          <tr>
            <td>Tech Forward</td>
            <td>Indigo / Cyan</td>
            <td>DM Sans / JetBrains Mono</td>
            <td>Dark mode, glass effects, technical</td>
          </tr>
          <tr>
            <td>Organic Natural</td>
            <td>Sage / Terracotta</td>
            <td>Crimson Pro / Work Sans</td>
            <td>Soft shapes, earthy, organic</td>
          </tr>
        </tbody>
      </table>

      <h2>Theme Application</h2>
      <p>The theme system is implemented with:</p>
      <ul>
        <li>
          <strong>ThemeProvider</strong> — React context provider that injects tokens as CSS custom
          properties on a wrapper div
        </li>
        <li>
          <strong>useTheme()</strong> — Hook to access current tokens and override function
        </li>
        <li>
          <strong>tokensToCSSProperties()</strong> — Converts a token set to a React{" "}
          <code>CSSProperties</code> object
        </li>
        <li>
          <strong>tokensToCSSString()</strong> — Converts a token set to a CSS string for style tags
        </li>
      </ul>
      <p>
        Components consume tokens via CSS custom properties (<code>var(--token-name)</code>). The
        ThemeProvider supports nested overrides, allowing individual components to adjust tokens
        without affecting siblings.
      </p>
    </>
  );
}

function ArchitectureContent(): React.ReactElement {
  return (
    <>
      <h1>Architecture</h1>
      <p>
        EasyWebsiteBuild is built on three core layers that work together in a pipeline:
        <strong> Intent → Spec → Assembly → Preview → Export</strong>.
      </p>

      <h2>System Overview</h2>
      <ol>
        <li>
          <strong>Intent Capture Layer</strong> — 9-step guided discovery flow with AI-powered
          questions (Claude Sonnet) and deterministic fallback
        </li>
        <li>
          <strong>Component Assembly Engine</strong> — 18 modular components + composition logic via
          COMPONENT_REGISTRY + AssemblyRenderer
        </li>
        <li>
          <strong>Theming &amp; Style System</strong> — 87 CSS tokens, 7 presets,
          personality-to-theme generation via chroma-js
        </li>
        <li>
          <strong>Export Pipeline</strong> — Static HTML/CSS ZIP generation via JSZip
        </li>
      </ol>

      <h2>Project Structure</h2>
      <pre>
        <code>{`src/
├── app/
│   ├── page.tsx              # Homepage (Server Component)
│   ├── layout.tsx            # Root layout (ConvexClientProvider)
│   ├── demo/
│   │   ├── page.tsx          # 9-step intake flow
│   │   └── preview/page.tsx  # Live preview + export
│   ├── docs/page.tsx         # This documentation (Server Component)
│   └── preview/page.tsx      # Component library showcase
├── components/
│   ├── platform/             # App UI (Navbar, Footer, MotionFade, DocsShell)
│   └── library/              # 18 website components (8 categories)
│       └── [4 use shared.tsx + variants/ pattern]
└── lib/
    ├── assembly/              # Engine (registry, renderer, font-loader)
    ├── export/                # ZIP generation (generate-project, create-zip)
    ├── stores/                # Zustand intake store (9-step flow)
    ├── types/                 # Brand character types
    └── theme/                 # Token system (types, generator, presets, overrides)

convex/
├── schema.ts                 # 9 database tables
├── siteSpecs.ts              # Site spec CRUD
└── ai/                       # Claude integration actions
    ├── generateQuestions.ts
    └── generateSiteSpec.ts`}</code>
      </pre>

      <h2>Database Schema</h2>
      <p>Nine Convex tables:</p>
      <table>
        <thead>
          <tr>
            <th>Table</th>
            <th>Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>siteSpecs</code>
            </td>
            <td>Generated Site Intent Documents</td>
            <td>Full CRUD implemented</td>
          </tr>
          <tr>
            <td>
              <code>intakeResponses</code>
            </td>
            <td>Individual intake flow responses</td>
            <td>Schema + index</td>
          </tr>
          <tr>
            <td>
              <code>intentPaths</code>
            </td>
            <td>Evolving decision tree</td>
            <td>Schema + index</td>
          </tr>
          <tr>
            <td>
              <code>components</code>
            </td>
            <td>Component library registry</td>
            <td>Schema + index</td>
          </tr>
          <tr>
            <td>
              <code>themes</code>
            </td>
            <td>Theme presets and custom themes</td>
            <td>Schema defined</td>
          </tr>
          <tr>
            <td>
              <code>assets</code>
            </td>
            <td>File references and metadata</td>
            <td>Schema defined</td>
          </tr>
          <tr>
            <td>
              <code>recipes</code>
            </td>
            <td>Proven component configurations</td>
            <td>Schema + index</td>
          </tr>
          <tr>
            <td>
              <code>projects</code>
            </td>
            <td>Client website projects</td>
            <td>Schema defined</td>
          </tr>
          <tr>
            <td>
              <code>users</code>
            </td>
            <td>Platform users</td>
            <td>Schema defined</td>
          </tr>
        </tbody>
      </table>

      <h2>API Integration</h2>
      <p>
        Claude SDK (<code>@anthropic-ai/sdk</code>) is used for two Convex actions:
      </p>
      <ol>
        <li>
          <strong>generateQuestions</strong> — 4 contextual follow-up questions from user profile.
          Fallback: curated question bank for 11 site types.
        </li>
        <li>
          <strong>generateSiteSpec</strong> — Complete SiteIntentDocument with pages, components
          (from 18 available), variants, and content. Fallback: deterministic selection using
          personality vector + site-type-specific content generators.
        </li>
      </ol>
      <p>
        Both actions use Claude Sonnet with structured JSON output. The deterministic fallbacks
        ensure the system works even without API access.
      </p>

      <h2>Deployment Architecture</h2>
      <ul>
        <li>
          <strong>Platform</strong>: Next.js on Vercel + Convex cloud + Claude API
        </li>
        <li>
          <strong>Export (current)</strong>: Static HTML/CSS ZIP download — standalone, no
          dependencies
        </li>
        <li>
          <strong>Hosted (future)</strong>: Separate Next.js deployments per site via Vercel API
        </li>
        <li>
          <strong>Full export (future)</strong>: Complete Next.js project with bundled components
        </li>
      </ul>
    </>
  );
}

function KnowledgeBaseContent(): React.ReactElement {
  return (
    <>
      <h1>Knowledge Base</h1>
      <p>
        The Knowledge Base is what makes EasyWebsiteBuild smarter over time. Every client
        interaction enriches the system. The core principle:{" "}
        <strong>AI bootstraps new paths, but proven paths become deterministic.</strong>
      </p>
      <p>
        The schema foundation is built (Convex tables with indexes), but the active learning system
        (embeddings, similarity matching, path lifecycle management) is planned for Phase 6.
      </p>

      <h2>Learning Mechanisms</h2>
      <p>Five interconnected learning systems:</p>
      <ol>
        <li>
          <strong>Intent Path Evolution</strong> — Decision paths graduate from AI-interpreted to
          deterministic
        </li>
        <li>
          <strong>Proven Recipes</strong> — Approved component configurations are cataloged for
          reuse
        </li>
        <li>
          <strong>Theme Library Growth</strong> — Approved themes are saved and searchable
        </li>
        <li>
          <strong>Content Pattern Templates</strong> — Approved copy patterns are extracted and
          stored
        </li>
        <li>
          <strong>Page Composition Templates</strong> — Full page component sequences that work
        </li>
      </ol>

      <h2>Intent Path Evolution</h2>
      <p>Every decision point creates an intent path entry with lifecycle:</p>
      <ul>
        <li>
          <strong>Birth (Candidate)</strong> — Novel input → AI interprets → stored as candidate
        </li>
        <li>
          <strong>Growth</strong> — Similar input matched (cosine ≥ 0.92) → increment usage
        </li>
        <li>
          <strong>Promotion (Proven)</strong> — Usage ≥ 3 AND confirmation ≥ 0.8 → deterministic
        </li>
        <li>
          <strong>Deprecation</strong> — Confirmation &lt; 0.5 after 5+ uses → deprecated
        </li>
      </ul>

      <h2>Proven Recipes</h2>
      <p>
        Specific component + variant + configuration that was approved, capturing the full context
        (site type, industry, personality, page position). When the assembly engine needs to
        configure a component, it first checks for proven recipes matching the current context.
      </p>

      <h2>Theme Library Growth</h2>
      <p>
        Every approved theme is saved with its personality vector, token set, preset base, and
        industry tags — creating a searchable library of proven themes. Currently seeded with 7
        presets.
      </p>

      <h2>Content Pattern Templates</h2>
      <p>When AI-generated copy is approved, patterns are extracted:</p>
      <pre>
        <code>{`// Example patterns for luxury med spa:
Hero headline: "[Discover/Experience] [Noun] at [Business Name]"
CTA: "[Action Verb] Your [Outcome] Today"
Service card: "[Treatment]: [Benefit-Focused Subtitle]"`}</code>
      </pre>

      <h2>Similarity Matching</h2>
      <p>Semantic embeddings enable matching:</p>
      <table>
        <thead>
          <tr>
            <th>Similarity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥ 0.97</td>
            <td>Exact match — use directly</td>
          </tr>
          <tr>
            <td>0.92 – 0.97</td>
            <td>Strong match — use with confidence</td>
          </tr>
          <tr>
            <td>0.85 – 0.92</td>
            <td>Partial match — AI refines</td>
          </tr>
          <tr>
            <td>&lt; 0.85</td>
            <td>No match — full AI interpretation</td>
          </tr>
        </tbody>
      </table>

      <h2>Feedback Loop</h2>
      <p>
        <strong>Explicit:</strong> Approve/reject previews, request changes, rate satisfaction.
      </p>
      <p>
        <strong>Implicit:</strong> Time per step, change request count, component removal frequency,
        theme modification frequency.
      </p>
    </>
  );
}

function RoadmapContent(): React.ReactElement {
  const phases = [
    {
      number: 1,
      title: "Platform Website & Foundation",
      status: "complete" as const,
      items: [
        "Next.js 16 project with App Router, TypeScript strict, Tailwind CSS v4",
        "Convex backend setup with schema (9 tables, indexes, mutations/queries)",
        "Homepage — product landing page with 6 sections",
        "Demo page — working intake flow (4-step initially, later expanded to 6)",
        "Docs page — full project documentation with sidebar navigation",
        "Platform layout (Navbar, Footer, AnimatedSection, ConditionalLayout)",
        "Premium design system — Space Grotesk/Outfit/JetBrains Mono, dark theme, amber/gold + teal",
        "Developer tooling — Prettier, Husky pre-commit hooks, lint-staged, ESLint",
      ],
    },
    {
      number: 2,
      title: "Core Component Library",
      status: "complete" as const,
      items: [
        "Theme token system — 87 CSS Custom Properties across 6 categories",
        "Theme generation from personality vector — chroma-js, 10 curated font pairings",
        "3 initial theme presets — Luxury Dark, Modern Clean, Warm Professional",
        "ThemeProvider + useTheme hook — React context with CSS custom property injection",
        "10 core components with 2-3 variants each",
        "Section wrapper — 6 background variants, 5 spacing presets",
        "Component manifest system — JSON descriptors with personality fit, site types, tokens",
        "Barrel exports + manifest index with lookup utilities",
        "Preview page (/preview) — live theme switching with all components",
      ],
    },
    {
      number: 3,
      title: "AI Integration & Assembly Engine",
      status: "complete" as const,
      items: [
        "Full intake flow (site type → goal → description → personality → AI discovery → generation)",
        "Claude API integration for questions (generateQuestions) and specs (generateSiteSpec)",
        "Assembly engine — COMPONENT_REGISTRY, AssemblyRenderer, font-loader",
        "Zustand intake state management with localStorage persistence",
        "Convex storage for site specs (saveSiteSpec / getSiteSpec)",
        "Knowledge base schema foundation (intentPaths, recipes, components, themes, assets tables)",
        "Live preview at /demo/preview with viewport switcher, sidebar, and toolbar",
        "Comprehensive deterministic fallbacks for both AI actions",
      ],
    },
    {
      number: "4A",
      title: "Quality & Content Accuracy",
      status: "complete" as const,
      items: [
        "Fixed spec generator content fields to match component type interfaces exactly",
        "Step 5 Discovery fix — fingerprint-based staleness detection (questionsInputKey)",
        "Review mode UI — shows previous answers when returning with same inputs",
      ],
    },
    {
      number: "4B",
      title: "Component Expansion & Export Pipeline",
      status: "complete" as const,
      items: [
        "8 new components (18 total): content-stats, content-accordion, content-timeline, content-logos, proof-beforeafter, team-grid, commerce-services, media-gallery",
        "4 new theme presets (7 total): Bold Creative, Editorial, Tech Forward, Organic Natural",
        "All 18 components registered in assembly engine + AI spec generator",
        "Deterministic fallback enhanced with site-type-specific content generators",
        "Preview page updated to showcase all 18 components",
        "Export pipeline: generate-project.ts → create-zip.ts → downloadable ZIP",
        "Export button wired in PreviewToolbar",
      ],
    },
    {
      number: "4C",
      title: "Brand Character System",
      status: "complete" as const,
      items: [
        "3 new intake steps (Steps 5-7): Emotional Goals, Voice & Narrative, Culture & Anti-References",
        "Brand character types: 10 emotional goals, 3 voice tones, 6 archetypes, 8 anti-references",
        "9-step intake flow with segmented progress bar (Setup | Character | Discovery)",
        "AI prompts enhanced with character context; deterministic fallback with voice-keyed content",
        "Emotional theme overrides: spacing, transitions, radius adjustments based on goals + anti-refs",
      ],
    },
    {
      number: "4D",
      title: "Mobile Responsiveness",
      status: "complete" as const,
      items: [
        "16 of 18 components updated with responsive spacing, padding, and font clamping",
        "Responsive carousels (ProofTestimonials) and masonry layouts (MediaGallery)",
        "CTA button padding reduction to prevent 375px overflow",
        "Gap reduction on mobile for multi-column layouts",
      ],
    },
    {
      number: "Pre-5",
      title: "Architecture Optimizations",
      status: "complete" as const,
      items: [
        "Homepage RSC conversion — Server Component with MotionFade client wrapper",
        "Docs page RSC conversion — Server Component with DocsShell client wrapper",
        "Variant extraction for 4 components: hero-centered, commerce-services, team-grid, media-gallery",
        "shared.tsx + variants/ pattern reduces main component files to ~50-70 line dispatchers",
      ],
    },
    {
      number: 5,
      title: "Visual Editor & Deployment Pipeline",
      status: "current" as const,
      items: [
        "Visual editor — inline text editing, image replacement, component reordering",
        "Multi-page site support",
        "Full Next.js project generation (beyond static HTML export)",
        "Vercel deployment via API (hosted sites)",
        "Preview approval/change request flow",
        "Preview sharing (shareable link for client review)",
        "AI copy generation for refining placeholder content",
      ],
    },
    {
      number: 6,
      title: "Knowledge Base & Learning",
      status: "future" as const,
      items: [
        "Semantic embeddings for intent paths",
        "Vector search for similarity matching",
        "Path lifecycle management (candidate → proven → deprecated)",
        "Proven recipe system",
        "Analytics dashboard",
      ],
    },
    {
      number: 7,
      title: "Subscriptions & Auth",
      status: "future" as const,
      items: [
        "User authentication and project dashboard",
        "Subscription/payment integration (Stripe)",
        "Role-based access (owner, editor, viewer)",
        "Change history / undo",
      ],
    },
    {
      number: 8,
      title: "Commerce & Advanced Features",
      status: "future" as const,
      items: [
        "E-commerce components (product grid, cart, checkout)",
        "Booking/calendar components",
        "Membership/gating",
        "Blog/CMS, SEO tools, analytics",
      ],
    },
    {
      number: 9,
      title: "Scale & Optimize",
      status: "future" as const,
      items: [
        "Performance optimization (Core Web Vitals)",
        "Load testing and scaling",
        "API rate limiting and caching",
        "Public launch",
      ],
    },
  ];

  return (
    <>
      <h1>Roadmap</h1>
      <p>
        EasyWebsiteBuild is being built in progressive phases. Phases 1–4D plus Pre-Phase 5
        architecture optimizations are complete, delivering a working platform with 18 components, 7
        theme presets, 9-step intake with brand character capture, AI-powered spec generation, live
        preview, mobile-responsive components, and ZIP export.
      </p>

      {phases.map((phase) => (
        <div key={String(phase.number)} style={{ marginBottom: "2rem" }}>
          <h2>
            Phase {phase.number}: {phase.title}
            {phase.status === "complete" && (
              <span
                style={{
                  marginLeft: "0.75rem",
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "9999px",
                  background: "rgba(62, 207, 180, 0.1)",
                  color: "#3ecfb4",
                  border: "1px solid rgba(62, 207, 180, 0.25)",
                  verticalAlign: "middle",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Complete
              </span>
            )}
            {phase.status === "current" && (
              <span
                style={{
                  marginLeft: "0.75rem",
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "9999px",
                  background: "var(--color-accent-glow)",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-border-accent)",
                  verticalAlign: "middle",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Next
              </span>
            )}
          </h2>
          <ul>
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
