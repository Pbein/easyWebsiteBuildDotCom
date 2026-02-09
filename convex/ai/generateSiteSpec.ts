"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  content: Record<string, unknown>;
}

interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

interface SiteIntentDocument {
  sessionId: string;
  siteType: string;
  conversionGoal: string;
  personalityVector: number[];
  businessName: string;
  tagline: string;
  pages: PageSpec[];
  metadata: {
    generatedAt: number;
    method: "ai" | "deterministic";
  };
}

/* ────────────────────────────────────────────────────────────
 * Industry-specific content for deterministic fallback
 * ──────────────────────────────────────────────────────────── */

interface IndustryContent {
  taglines: Record<string, string>;
  headline: (businessName: string) => string;
  features: Array<{ icon: string; title: string; description: string }>;
  testimonials: Array<{ quote: string; name: string; role: string; rating: number }>;
  aboutBody: (businessName: string, description: string) => string;
}

const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  business: {
    taglines: {
      contact: "Professional solutions tailored to your needs",
      book: "Book your consultation today",
      showcase: "Excellence in every detail",
      sell: "Quality products and services you can trust",
    },
    headline: (name) => `${name} — Where Results Meet Excellence`,
    features: [
      {
        icon: "Target",
        title: "Strategic Approach",
        description:
          "We start with your goals and work backwards to create a tailored strategy that delivers measurable results.",
      },
      {
        icon: "Zap",
        title: "Fast Delivery",
        description: "Quick turnaround without compromising on quality or attention to detail.",
      },
      {
        icon: "Shield",
        title: "Proven Results",
        description:
          "Track record of delivering measurable outcomes for our clients across every project.",
      },
      {
        icon: "HeadphonesIcon",
        title: "Dedicated Support",
        description: "Responsive, personalized support from real people whenever you need it.",
      },
    ],
    testimonials: [
      {
        quote:
          "They transformed our online presence completely. We saw a 40% increase in inquiries within the first month — couldn't believe the difference.",
        name: "Sarah Chen",
        role: "CEO, TechVenture",
        rating: 5,
      },
      {
        quote:
          "Professional, responsive, and incredibly talented. They understood our vision immediately and delivered beyond what we expected.",
        name: "Marcus Johnson",
        role: "Founder, GreenLeaf Co",
        rating: 5,
      },
      {
        quote:
          "Working with them was a game-changer. Our conversion rates doubled and the design still feels fresh a year later.",
        name: "Elena Rodriguez",
        role: "Director, Bright Ideas Agency",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is committed to delivering exceptional results that exceed expectations. Our approach combines deep industry expertise with a genuine understanding of what our clients need to succeed.</p>`,
  },
  portfolio: {
    taglines: {
      hire: "Creative work that speaks for itself",
      attention: "Pushing boundaries, creating impact",
      audience: "Stories worth sharing",
      sell: "Unique creations, exceptional quality",
    },
    headline: (name) => `${name} — Creative Work That Moves People`,
    features: [
      {
        icon: "Palette",
        title: "Creative Direction",
        description:
          "Thoughtful design choices that elevate every project and leave a lasting impression.",
      },
      {
        icon: "Eye",
        title: "Attention to Detail",
        description: "Every pixel considered, every element purposeful — nothing is accidental.",
      },
      {
        icon: "Lightbulb",
        title: "Fresh Perspectives",
        description: "Innovative approaches that stand out from the crowd and capture attention.",
      },
      {
        icon: "Award",
        title: "Award-Winning",
        description: "Recognized for excellence in design, execution, and creative innovation.",
      },
    ],
    testimonials: [
      {
        quote:
          "An exceptional creative talent. Their work elevated our entire brand identity and every marketing touchpoint.",
        name: "David Park",
        role: "Creative Director, Nova Studio",
        rating: 5,
      },
      {
        quote:
          "Stunning work with incredible attention to detail. Every project exceeded what we thought was possible.",
        name: "Amara Williams",
        role: "Marketing Lead, Pulse Agency",
        rating: 5,
      },
      {
        quote:
          "True artistry combined with professional reliability. A rare combination in the creative world.",
        name: "James Mitchell",
        role: "CEO, Vanguard Media",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings a distinctive creative vision to every project — blending artistic craft with strategic thinking to produce work that resonates.</p>`,
  },
  ecommerce: {
    taglines: {
      products: "Shop our curated collection",
      digital: "Digital products that deliver real value",
      subscriptions: "Subscribe to something special",
      marketplace: "Your one-stop marketplace",
    },
    headline: (name) => `${name} — Discover Something You'll Love`,
    features: [
      {
        icon: "Package",
        title: "Quality Products",
        description:
          "Carefully curated selection of premium products that meet our exacting standards.",
      },
      {
        icon: "Truck",
        title: "Fast Shipping",
        description:
          "Quick and reliable delivery to your doorstep, with tracking every step of the way.",
      },
      {
        icon: "RotateCcw",
        title: "Easy Returns",
        description:
          "Hassle-free returns within 30 days. No questions asked, no hoops to jump through.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure Checkout",
        description:
          "Your data is protected with industry-standard encryption and secure payment processing.",
      },
    ],
    testimonials: [
      {
        quote:
          "The quality exceeded my expectations. Packaging was beautiful and delivery was faster than promised. Already ordered again.",
        name: "Rachel Kim",
        role: "Verified Buyer",
        rating: 5,
      },
      {
        quote:
          "Best online shopping experience I've had. The product descriptions were accurate and customer service was incredibly helpful.",
        name: "Tom Bradley",
        role: "Repeat Customer",
        rating: 5,
      },
      {
        quote:
          "Found exactly what I was looking for. The curated selection made it easy to choose — no endless scrolling through junk.",
        name: "Maya Patel",
        role: "Verified Buyer",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is dedicated to bringing you products that combine quality, value, and style. Every item in our collection is hand-selected to meet our exacting standards.</p>`,
  },
  booking: {
    taglines: {
      contact: "Your appointment is a click away",
      book: "Book your next appointment in seconds",
      showcase: "Premium services, effortless booking",
      sell: "Transform your experience today",
    },
    headline: (name) => `${name} — Book Your Experience Today`,
    features: [
      {
        icon: "Calendar",
        title: "Easy Online Scheduling",
        description:
          "Book your preferred time slot in seconds. No phone calls, no waiting on hold.",
      },
      {
        icon: "Star",
        title: "Premium Service",
        description:
          "Every visit is tailored to your preferences by experienced professionals who care.",
      },
      {
        icon: "Clock",
        title: "Flexible Hours",
        description:
          "Early morning, evening, and weekend appointments available to fit your schedule.",
      },
      {
        icon: "Heart",
        title: "Client Satisfaction",
        description:
          "Thousands of happy clients trust us with their regular appointments and special occasions.",
      },
    ],
    testimonials: [
      {
        quote:
          "The online booking is so convenient — I can see exactly what's available and pick a time that works. No more phone tag.",
        name: "Jessica Tran",
        role: "Regular Client",
        rating: 5,
      },
      {
        quote:
          "Best experience I've had. The staff remembers my preferences and the results are always exactly what I wanted.",
        name: "Andre Foster",
        role: "Monthly Client",
        rating: 5,
      },
      {
        quote:
          "I've been coming here for two years and have never been disappointed. The consistency and attention to detail is unmatched.",
        name: "Lauren McBride",
        role: "Loyal Customer",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>At ${name}, we believe great service starts with a great experience. From easy online booking to personalized attention during every visit, we're dedicated to exceeding your expectations.</p>`,
  },
  blog: {
    taglines: {
      contact: "Stories, insights, and ideas worth reading",
      inform: "Perspectives that make you think",
      convert: "Join a community of curious minds",
      sell: "Knowledge that empowers",
    },
    headline: (name) => `${name} — Fresh Perspectives, Bold Ideas`,
    features: [
      {
        icon: "BookOpen",
        title: "In-Depth Articles",
        description: "Well-researched, thoughtfully written pieces that go beyond the surface.",
      },
      {
        icon: "TrendingUp",
        title: "Trending Topics",
        description: "Stay ahead with coverage of the latest developments and emerging trends.",
      },
      {
        icon: "MessageCircle",
        title: "Active Community",
        description: "Join conversations with readers who share your curiosity and passion.",
      },
      {
        icon: "Mail",
        title: "Newsletter",
        description:
          "Get our best content delivered straight to your inbox — no spam, just substance.",
      },
    ],
    testimonials: [
      {
        quote:
          "One of the few blogs I actually look forward to reading. The writing is sharp, the insights are original, and every post teaches me something new.",
        name: "Chris Nakamura",
        role: "Subscriber",
        rating: 5,
      },
      {
        quote:
          "Finally a blog that respects its readers' time. Every article is well-researched and gets straight to the point.",
        name: "Priya Sharma",
        role: "Regular Reader",
        rating: 5,
      },
      {
        quote:
          "I've shared more articles from this blog than any other. The content is genuinely useful and always well-written.",
        name: "Daniel Okafor",
        role: "Newsletter Subscriber",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is a space for thoughtful exploration and honest perspectives. We write about the things that matter — with depth, clarity, and a commitment to substance over clickbait.</p>`,
  },
  personal: {
    taglines: {
      contact: "Let's connect and create something great",
      inform: "My journey, my perspective",
      hire: "Available for projects and collaborations",
      convert: "Join me on this journey",
    },
    headline: (name) => `Hi, I'm ${name}`,
    features: [
      {
        icon: "Briefcase",
        title: "Experience",
        description: "Years of hands-on experience across diverse projects and challenges.",
      },
      {
        icon: "Lightbulb",
        title: "Creative Problem Solving",
        description: "Turning complex challenges into elegant, effective solutions.",
      },
      {
        icon: "Users",
        title: "Collaboration",
        description:
          "Working closely with teams and clients to achieve exceptional results together.",
      },
      {
        icon: "TrendingUp",
        title: "Continuous Growth",
        description: "Always learning, always improving — staying sharp in a fast-moving field.",
      },
    ],
    testimonials: [
      {
        quote:
          "Incredibly talented and a pleasure to work with. They brought fresh ideas to the table and delivered on every promise.",
        name: "Morgan Ellis",
        role: "Project Collaborator",
        rating: 5,
      },
      {
        quote:
          "Professional, creative, and reliable. Exactly the kind of person you want on your team or leading your project.",
        name: "Sam Whitfield",
        role: "Former Client",
        rating: 5,
      },
      {
        quote:
          "Exceeded our expectations in every way. Their work ethic and attention to quality set them apart.",
        name: "Nina Vasquez",
        role: "Team Lead, Apex Digital",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings passion and precision to every project. Whether collaborating with teams or working independently, the focus is always on delivering work that makes a real impact.</p>`,
  },
  educational: {
    taglines: {
      contact: "Learn from the best, at your own pace",
      inform: "Knowledge that transforms",
      convert: "Start your learning journey today",
      sell: "Invest in your future",
    },
    headline: (name) => `${name} — Learn Skills That Matter`,
    features: [
      {
        icon: "GraduationCap",
        title: "Expert-Led Content",
        description:
          "Courses and materials designed by industry professionals with real-world experience.",
      },
      {
        icon: "BookOpen",
        title: "Structured Curriculum",
        description:
          "Clear learning paths that take you from beginner to proficient, step by step.",
      },
      {
        icon: "Users",
        title: "Community Support",
        description: "Learn alongside peers, ask questions, and get feedback from instructors.",
      },
      {
        icon: "Award",
        title: "Recognized Credentials",
        description:
          "Earn certificates and credentials that demonstrate your expertise to employers.",
      },
    ],
    testimonials: [
      {
        quote:
          "The course structure is excellent — clear, practical, and immediately applicable to my work. Best educational investment I've made.",
        name: "Kevin Park",
        role: "Career Changer",
        rating: 5,
      },
      {
        quote:
          "The instructors genuinely care about student success. I got personalized feedback that accelerated my learning dramatically.",
        name: "Lisa Johannsen",
        role: "Graduate",
        rating: 5,
      },
      {
        quote:
          "Went from complete beginner to landing a job in my new field. The curriculum is that good.",
        name: "Raj Mehta",
        role: "Alumni",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is dedicated to making high-quality education accessible and practical. Our programs are designed to equip you with skills that translate directly to real-world success.</p>`,
  },
  nonprofit: {
    taglines: {
      contact: "Join us in making a difference",
      inform: "See the impact we're making together",
      convert: "Every contribution counts",
      sell: "Support a cause that matters",
    },
    headline: (name) => `${name} — Together, We Make a Difference`,
    features: [
      {
        icon: "Heart",
        title: "Impact Tracking",
        description:
          "See exactly how every dollar and volunteer hour translates into real-world change.",
      },
      {
        icon: "Users",
        title: "Volunteer Management",
        description:
          "Easy sign-up and coordination for volunteers who want to make a hands-on difference.",
      },
      {
        icon: "CreditCard",
        title: "Donation Processing",
        description: "Secure one-time and recurring donations that go directly toward our mission.",
      },
      {
        icon: "Globe",
        title: "Community Outreach",
        description:
          "Programs and events that bring people together and amplify our collective impact.",
      },
    ],
    testimonials: [
      {
        quote:
          "Volunteering here has been one of the most rewarding experiences of my life. The organization is transparent, effective, and genuinely passionate.",
        name: "Angela Torres",
        role: "Volunteer Coordinator",
        rating: 5,
      },
      {
        quote:
          "I've donated to many nonprofits over the years, but few show the tangible results and transparency that this organization does.",
        name: "Robert Chen",
        role: "Monthly Donor",
        rating: 5,
      },
      {
        quote:
          "They turned our small community grant into a program that now serves hundreds of families. Incredible impact with limited resources.",
        name: "Patricia Owens",
        role: "Community Partner",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} believes in the power of collective action. Every donation, every volunteer hour, and every shared story brings us closer to a world where our mission is realized.</p>`,
  },
  event: {
    taglines: {
      contact: "Don't miss out — secure your spot",
      inform: "Everything you need to know about the event",
      convert: "Register now before spots fill up",
      sell: "Get your tickets today",
    },
    headline: (name) => `${name} — An Experience You Won't Forget`,
    features: [
      {
        icon: "Calendar",
        title: "Event Schedule",
        description:
          "Full agenda with speakers, sessions, and activities so you can plan your experience.",
      },
      {
        icon: "MapPin",
        title: "Venue & Logistics",
        description:
          "Directions, parking, accommodations, and everything you need to get there stress-free.",
      },
      {
        icon: "Users",
        title: "Networking",
        description: "Connect with like-minded attendees, speakers, and industry leaders.",
      },
      {
        icon: "Sparkles",
        title: "Exclusive Perks",
        description:
          "VIP access, early-bird pricing, and special bonuses for registered attendees.",
      },
    ],
    testimonials: [
      {
        quote:
          "Best event I attended all year. The organization was flawless, the speakers were inspiring, and the networking opportunities were incredible.",
        name: "Jason Wright",
        role: "Attendee",
        rating: 5,
      },
      {
        quote:
          "From registration to the final session, everything was seamless. Already looking forward to next year.",
        name: "Sophia Lin",
        role: "VIP Ticket Holder",
        rating: 5,
      },
      {
        quote:
          "The caliber of speakers and the energy of the crowd made this a truly unforgettable experience. Worth every penny.",
        name: "Michael Osei",
        role: "Repeat Attendee",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings together passionate people for an experience that inspires, connects, and energizes. Whether you're a first-timer or a returning attendee, there's something extraordinary waiting for you.</p>`,
  },
  landing: {
    taglines: {
      contact: "Take the first step today",
      inform: "Everything you need, one page",
      convert: "Join thousands who already have",
      sell: "Limited time — act now",
    },
    headline: (name) => `${name} — The Smarter Way Forward`,
    features: [
      {
        icon: "Zap",
        title: "Quick Results",
        description: "See real results faster than you thought possible with our proven approach.",
      },
      {
        icon: "Shield",
        title: "Risk-Free",
        description: "Try it with confidence. Our guarantee means you have nothing to lose.",
      },
      {
        icon: "TrendingUp",
        title: "Proven Track Record",
        description:
          "Thousands of satisfied customers can't be wrong. See the numbers for yourself.",
      },
      {
        icon: "CheckCircle",
        title: "Simple Process",
        description: "No complicated setup. Get started in minutes and see results right away.",
      },
    ],
    testimonials: [
      {
        quote:
          "Signed up on a whim and it turned out to be one of the best decisions I've made this year. The results were immediate and measurable.",
        name: "Alex Rivera",
        role: "Early Adopter",
        rating: 5,
      },
      {
        quote:
          "I was skeptical at first, but the results spoke for themselves. Wish I'd started sooner.",
        name: "Jasmine Powell",
        role: "Customer",
        rating: 5,
      },
      {
        quote:
          "Simple to get started, powerful results. Exactly what was promised — no fluff, no hidden catches.",
        name: "Derek Huang",
        role: "Verified User",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} was built to solve a real problem with a straightforward solution. No gimmicks, no unnecessary complexity — just results.</p>`,
  },
};

/* ────────────────────────────────────────────────────────────
 * Deterministic fallback spec generator
 * ──────────────────────────────────────────────────────────── */

function generateDeterministicSpec(args: {
  sessionId: string;
  siteType: string;
  goal: string;
  businessName: string;
  description: string;
  personality: number[];
  aiResponses: Record<string, string>;
}): SiteIntentDocument {
  const { sessionId, siteType, goal, description, personality } = args;

  // Use explicitly provided business name, fall back to extraction from description
  const businessName = args.businessName || extractBusinessName(description);
  const industry = INDUSTRY_CONTENT[siteType] || INDUSTRY_CONTENT.business;
  const tagline = industry.taglines[goal] || "Building something remarkable together";

  // Determine hero variant based on personality
  const isMinimal = personality[0] < 0.5;
  const heroVariant = isMinimal ? "gradient-bg" : "with-bg-image";
  const heroComponent = personality[2] < 0.5 ? "hero-centered" : "hero-split";
  const heroSplitVariant = personality[4] > 0.5 ? "image-right" : "image-left";

  const components: ComponentPlacement[] = [];
  let order = 0;

  // Nav
  components.push({
    componentId: "nav-sticky",
    variant: "transparent",
    order: order++,
    content: {
      logoText: businessName,
      links: [
        { label: "Home", href: "#" },
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Contact", href: "#contact" },
      ],
      cta: { text: getCtaText(goal), href: "#contact" },
    },
  });

  // Hero
  const headline = industry.headline(businessName);
  if (heroComponent === "hero-centered") {
    components.push({
      componentId: "hero-centered",
      variant: heroVariant,
      order: order++,
      content: {
        headline,
        subheadline: tagline,
        ctaPrimary: { text: getCtaText(goal), href: "#contact" },
        ctaSecondary: { text: "Learn More", href: "#about" },
      },
    });
  } else {
    components.push({
      componentId: "hero-split",
      variant: heroSplitVariant,
      order: order++,
      content: {
        headline,
        subheadline: description.slice(0, 200),
        ctaPrimary: { text: getCtaText(goal), href: "#contact" },
        ctaSecondary: { text: "Learn More", href: "#about" },
        image: {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          alt: businessName,
        },
      },
    });
  }

  // Content sections based on site type
  components.push({
    componentId: "content-text",
    variant: "centered",
    order: order++,
    content: {
      id: "about",
      eyebrow: "About Us",
      headline: `Why Choose ${businessName}`,
      body: industry.aboutBody(businessName, description),
    },
  });

  components.push({
    componentId: "content-features",
    variant: "icon-cards",
    order: order++,
    content: {
      id: "services",
      subheadline: getServicesEyebrow(siteType),
      headline: getServicesHeadline(siteType),
      features: industry.features,
    },
  });

  // Stats section for business, booking, ecommerce, educational, nonprofit
  if (["business", "booking", "ecommerce", "educational", "nonprofit"].includes(siteType)) {
    components.push({
      componentId: "content-stats",
      variant: personality[3] > 0.6 ? "animated-counter" : "cards",
      order: order++,
      content: {
        headline: "By the Numbers",
        stats: getStatsForSiteType(siteType, businessName),
      },
    });
  }

  // Services section for booking and business with service offerings
  if (["booking", "ecommerce"].includes(siteType)) {
    components.push({
      componentId: "commerce-services",
      variant: personality[3] > 0.5 ? "card-grid" : "list",
      order: order++,
      content: {
        headline: siteType === "booking" ? "Our Services" : "What We Offer",
        subheadline:
          siteType === "booking" ? "Choose the perfect service for you" : "Explore our offerings",
        services: getServicesForSiteType(siteType),
      },
    });
  }

  // Team section for business, booking, portfolio
  if (["business", "booking", "personal"].includes(siteType)) {
    components.push({
      componentId: "team-grid",
      variant: personality[0] > 0.5 ? "cards" : "minimal",
      order: order++,
      content: {
        headline: siteType === "personal" ? "Collaborators" : "Meet the Team",
        subheadline:
          siteType === "personal"
            ? "People I love working with"
            : `The people behind ${businessName}`,
        members: getTeamForSiteType(siteType),
      },
    });
  }

  // Logos section for business, ecommerce, educational
  if (["business", "ecommerce", "educational", "landing"].includes(siteType)) {
    components.push({
      componentId: "content-logos",
      variant: personality[4] > 0.5 ? "scroll" : "grid",
      order: order++,
      content: {
        headline: siteType === "educational" ? "Recognized By" : "Trusted By",
        logos: getTrustLogos(siteType),
      },
    });
  }

  // Social proof
  components.push({
    componentId: "proof-testimonials",
    variant: "carousel",
    order: order++,
    content: {
      eyebrow: "Testimonials",
      headline: "What Our Clients Say",
      testimonials: industry.testimonials,
    },
  });

  // FAQ accordion for booking, ecommerce, educational, event
  if (["booking", "ecommerce", "educational", "event", "nonprofit"].includes(siteType)) {
    components.push({
      componentId: "content-accordion",
      variant: "single-open",
      order: order++,
      content: {
        headline: "Frequently Asked Questions",
        subheadline: "Everything you need to know",
        items: getFaqForSiteType(siteType, businessName),
      },
    });
  }

  // CTA
  components.push({
    componentId: "cta-banner",
    variant: personality[3] > 0.5 ? "full-width" : "contained",
    order: order++,
    content: {
      headline: getCtaHeadline(goal),
      subheadline: "Take the next step and see what we can do for you.",
      ctaPrimary: { text: getCtaText(goal), href: "#contact" },
      backgroundVariant: "primary",
    },
  });

  // Contact form (if goal involves contact/booking)
  if (["contact", "book", "convert", "hire"].includes(goal)) {
    components.push({
      componentId: "form-contact",
      variant: "simple",
      order: order++,
      content: {
        id: "contact",
        headline: "Get in Touch",
        subheadline: `Ready to get started? Drop us a message and we'll get back to you within 24 hours.`,
        fields: [
          { name: "name", label: "Your Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
        ],
        submitText: "Send Message",
      },
    });
  }

  // Footer
  components.push({
    componentId: "footer-standard",
    variant: "multi-column",
    order: order++,
    content: {
      logoText: businessName,
      tagline,
      columns: [
        {
          title: "Quick Links",
          links: [
            { label: "Home", href: "#" },
            { label: "About", href: "#about" },
            { label: "Services", href: "#services" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Contact",
          links: [
            { label: "hello@example.com", href: "mailto:hello@example.com" },
            { label: "(555) 123-4567", href: "tel:+15551234567" },
          ],
        },
      ],
      socialLinks: [
        { platform: "twitter", url: "#" },
        { platform: "instagram", url: "#" },
        { platform: "linkedin", url: "#" },
      ],
      copyright: `${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
  });

  return {
    sessionId,
    siteType,
    conversionGoal: goal,
    personalityVector: personality,
    businessName,
    tagline,
    pages: [
      {
        slug: "/",
        title: "Home",
        purpose: "Primary landing page",
        components,
      },
    ],
    metadata: {
      generatedAt: Date.now(),
      method: "deterministic",
    },
  };
}

function extractBusinessName(description: string): string {
  // Try to extract a proper name from the description
  const patterns = [
    /(?:called|named)\s+["']?([A-Z][A-Za-z\s&']+?)["']?(?:\.|,|\s+(?:is|and|that|which|in))/,
    /(?:my|our)\s+(?:company|business|brand|studio|agency|shop|store)\s+["']?([A-Z][A-Za-z\s&']+?)["']?/i,
    /^I(?:'m| am)\s+(?:a\s+)?([A-Z][A-Za-z\s]+?)(?:\s+(?:based|in|from|who|that|and))/,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  // Fallback: extract first capitalized phrase or use generic
  const words = description.split(/\s+/).slice(0, 3);
  if (words.length > 0 && /^[A-Z]/.test(words[0])) {
    return words.slice(0, 2).join(" ");
  }
  return "My Business";
}

function getCtaText(goal: string): string {
  const ctas: Record<string, string> = {
    contact: "Get in Touch",
    book: "Book Now",
    showcase: "View Our Work",
    sell: "Shop Now",
    hire: "Hire Me",
    attention: "View Portfolio",
    audience: "Follow Along",
    products: "Shop Now",
    digital: "Browse Products",
    subscriptions: "Subscribe",
    marketplace: "Explore",
    inform: "Learn More",
    convert: "Sign Up",
  };
  return ctas[goal] || "Get Started";
}

function getServicesEyebrow(siteType: string): string {
  const map: Record<string, string> = {
    business: "Our Services",
    portfolio: "What I Do",
    ecommerce: "Why Choose Us",
    booking: "Our Services",
  };
  return map[siteType] || "What We Offer";
}

function getServicesHeadline(siteType: string): string {
  const map: Record<string, string> = {
    business: "Services That Drive Results",
    portfolio: "Areas of Expertise",
    ecommerce: "The Difference We Make",
    booking: "Services & Treatments",
  };
  return map[siteType] || "What Makes Us Different";
}

function getCtaHeadline(goal: string): string {
  const headlines: Record<string, string> = {
    contact: "Ready to Start Your Project?",
    book: "Book Your Appointment Today",
    showcase: "Let's Work Together",
    sell: "Start Shopping Today",
    hire: "Let's Create Something Amazing",
    convert: "Join Thousands of Happy Customers",
  };
  return headlines[goal] || "Ready to Get Started?";
}

function getStatsForSiteType(
  siteType: string,
  _businessName: string
): Array<{ value: number; label: string; suffix?: string }> {
  const statsMap: Record<string, Array<{ value: number; label: string; suffix?: string }>> = {
    business: [
      { value: 500, label: "Clients Served", suffix: "+" },
      { value: 98, label: "Satisfaction Rate", suffix: "%" },
      { value: 12, label: "Years of Experience", suffix: "+" },
      { value: 50, label: "Team Members" },
    ],
    booking: [
      { value: 10000, label: "Appointments Booked", suffix: "+" },
      { value: 49, label: "Average Rating" },
      { value: 8, label: "Years in Business", suffix: "+" },
      { value: 99, label: "Return Clients", suffix: "%" },
    ],
    ecommerce: [
      { value: 25000, label: "Happy Customers", suffix: "+" },
      { value: 48, label: "Average Review" },
      { value: 48, label: "Hour Shipping", suffix: "h" },
      { value: 30, label: "Day Returns" },
    ],
    educational: [
      { value: 5000, label: "Students Enrolled", suffix: "+" },
      { value: 95, label: "Completion Rate", suffix: "%" },
      { value: 200, label: "Courses Available", suffix: "+" },
      { value: 49, label: "Student Rating" },
    ],
    nonprofit: [
      { value: 100000, label: "Lives Impacted", suffix: "+" },
      { value: 15, label: "Years of Service" },
      { value: 92, label: "Funds to Mission", suffix: "%" },
      { value: 2500, label: "Volunteers", suffix: "+" },
    ],
  };
  return statsMap[siteType] || statsMap.business;
}

function getServicesForSiteType(
  siteType: string
): Array<{ name: string; description: string; price?: string; icon?: string; featured?: boolean }> {
  if (siteType === "booking") {
    return [
      {
        name: "Standard Session",
        description: "Our most popular option — perfect for regular appointments.",
        price: "$45",
        icon: "Clock",
      },
      {
        name: "Premium Experience",
        description: "Extended session with premium products and extra attention to detail.",
        price: "$75",
        icon: "Star",
        featured: true,
      },
      {
        name: "Express Service",
        description: "Quick and efficient for busy schedules. In and out in 30 minutes.",
        price: "$30",
        icon: "Zap",
      },
      {
        name: "VIP Package",
        description: "The ultimate experience with complimentary extras and priority scheduling.",
        price: "$120",
        icon: "Award",
      },
    ];
  }
  return [
    {
      name: "Starter Plan",
      description: "Everything you need to get started with core features included.",
      price: "$29/mo",
      icon: "Package",
    },
    {
      name: "Professional",
      description: "Advanced features for growing businesses and teams.",
      price: "$79/mo",
      icon: "Briefcase",
      featured: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions with dedicated support and premium features.",
      price: "Custom",
      icon: "Shield",
    },
  ];
}

function getTeamForSiteType(siteType: string): Array<{ name: string; role: string; bio?: string }> {
  if (siteType === "personal") {
    return [
      {
        name: "Jordan Rivera",
        role: "Design Partner",
        bio: "Bringing visual concepts to life with precision and creativity.",
      },
      {
        name: "Alex Kim",
        role: "Strategy Advisor",
        bio: "Helping shape brand direction and growth strategy.",
      },
      {
        name: "Sam Chen",
        role: "Development Lead",
        bio: "Turning ideas into functional, beautiful digital products.",
      },
    ];
  }
  return [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Leading the vision with over a decade of industry experience.",
    },
    {
      name: "Jordan Lee",
      role: "Creative Director",
      bio: "Crafting memorable brand experiences that resonate with audiences.",
    },
    {
      name: "Taylor Brooks",
      role: "Head of Operations",
      bio: "Ensuring seamless delivery and exceptional client satisfaction.",
    },
    {
      name: "Casey Rivera",
      role: "Lead Strategist",
      bio: "Turning data into actionable insights that drive real results.",
    },
  ];
}

function getTrustLogos(siteType: string): Array<{ name: string }> {
  if (siteType === "educational") {
    return [
      { name: "Stanford University" },
      { name: "MIT" },
      { name: "Google" },
      { name: "Microsoft" },
      { name: "Coursera" },
      { name: "edX" },
    ];
  }
  return [
    { name: "Forbes" },
    { name: "TechCrunch" },
    { name: "Product Hunt" },
    { name: "Y Combinator" },
    { name: "Bloomberg" },
    { name: "Wired" },
  ];
}

function getFaqForSiteType(
  siteType: string,
  businessName: string
): Array<{ question: string; answer: string }> {
  const faqMap: Record<string, Array<{ question: string; answer: string }>> = {
    booking: [
      {
        question: "How do I book an appointment?",
        answer: `<p>You can book online through our website 24/7, or call us during business hours. We recommend booking at least 48 hours in advance for your preferred time slot.</p>`,
      },
      {
        question: "What is your cancellation policy?",
        answer: `<p>We understand plans change. Please give us at least 24 hours notice for cancellations. Late cancellations may incur a fee of 50% of the service price.</p>`,
      },
      {
        question: "Do you offer gift cards?",
        answer: `<p>Yes! ${businessName} gift cards are available in any denomination and make the perfect gift for any occasion. They can be purchased in-store or online.</p>`,
      },
      {
        question: "What forms of payment do you accept?",
        answer: `<p>We accept all major credit cards, debit cards, Apple Pay, and Google Pay. Cash is also welcome.</p>`,
      },
    ],
    ecommerce: [
      {
        question: "What is your shipping policy?",
        answer: `<p>We offer free shipping on orders over $50. Standard shipping (3-5 business days) is $5.99, and express shipping (1-2 business days) is $12.99.</p>`,
      },
      {
        question: "How do I return an item?",
        answer: `<p>Returns are accepted within 30 days of delivery. Items must be in original condition with tags attached. We provide a prepaid return label for your convenience.</p>`,
      },
      {
        question: "Do you ship internationally?",
        answer: `<p>Yes, ${businessName} ships to over 50 countries worldwide. International shipping rates and delivery times vary by destination.</p>`,
      },
      {
        question: "How can I track my order?",
        answer: `<p>Once your order ships, you'll receive an email with a tracking number. You can also check your order status in your account dashboard.</p>`,
      },
    ],
    educational: [
      {
        question: "Are the courses self-paced?",
        answer: `<p>Most of our courses are self-paced, allowing you to learn on your own schedule. Some live cohort courses have set schedules for interactive sessions.</p>`,
      },
      {
        question: "Do I get a certificate upon completion?",
        answer: `<p>Yes! All ${businessName} courses include a verified certificate upon successful completion that you can add to your resume or LinkedIn profile.</p>`,
      },
      {
        question: "What if I'm not satisfied with a course?",
        answer: `<p>We offer a 30-day money-back guarantee on all courses. If you're not satisfied, contact our support team for a full refund.</p>`,
      },
      {
        question: "Can I access courses on mobile devices?",
        answer: `<p>Absolutely. Our platform is fully responsive and works on smartphones, tablets, and desktops. We also offer a dedicated mobile app.</p>`,
      },
    ],
    event: [
      {
        question: "What's included in my ticket?",
        answer: `<p>Your ticket includes full access to all sessions, keynotes, and networking events. VIP tickets also include exclusive workshops, priority seating, and a swag bag.</p>`,
      },
      {
        question: "Is there a group discount?",
        answer: `<p>Yes! Groups of 5 or more receive a 15% discount, and groups of 10+ receive 25% off. Contact us for custom group pricing.</p>`,
      },
      {
        question: "What is the refund policy?",
        answer: `<p>Full refunds are available up to 30 days before the event. After that, tickets can be transferred to another attendee at no charge.</p>`,
      },
      {
        question: "Will sessions be recorded?",
        answer: `<p>Yes, all main stage sessions will be recorded and made available to ticket holders within 48 hours of the event.</p>`,
      },
    ],
    nonprofit: [
      {
        question: "How are donations used?",
        answer: `<p>92% of all donations go directly to our programs and mission. We publish detailed annual reports showing exactly how every dollar is spent.</p>`,
      },
      {
        question: "Is my donation tax-deductible?",
        answer: `<p>Yes, ${businessName} is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law.</p>`,
      },
      {
        question: "How can I volunteer?",
        answer: `<p>We'd love to have you! Visit our volunteer page to see current opportunities, or contact us directly to discuss how your skills can make a difference.</p>`,
      },
      {
        question: "Can I set up a recurring donation?",
        answer: `<p>Absolutely. Monthly recurring donations help us plan ahead and maximize impact. You can set up recurring giving through our secure online portal.</p>`,
      },
    ],
  };
  return faqMap[siteType] || faqMap.booking;
}

/* ────────────────────────────────────────────────────────────
 * Main action
 * ──────────────────────────────────────────────────────────── */

export const generateSiteSpec = action({
  args: {
    sessionId: v.string(),
    siteType: v.string(),
    goal: v.string(),
    businessName: v.string(),
    description: v.string(),
    personality: v.array(v.float64()),
    aiResponses: v.any(),
  },
  handler: async (ctx, args): Promise<SiteIntentDocument> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const spec = generateDeterministicSpec(args);
      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
      });
      return spec;
    }

    try {
      const client = new Anthropic({ apiKey });

      const aiResponsesSummary = Object.entries(args.aiResponses as Record<string, string>)
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: `You are a website assembly AI. The business is called "${args.businessName}". Use this name consistently in all content (nav logoText, footer logoText, headlines, etc.).

Given client intake data, generate a SiteIntentDocument — a JSON spec that determines exactly which components and content make up their website.

Available components (use these exact component IDs):

NAVIGATION & FOOTER:
- "nav-sticky" — variants: "transparent", "solid"
  Content: { logoText: string, links: { label, href }[], cta: { text, href } }
- "footer-standard" — variant: "multi-column"
  Content: { logoText, tagline, columns: { title, links: { label, href }[] }[], socialLinks: { platform, url }[], copyright }

HERO SECTIONS (pick ONE per page):
- "hero-centered" — variants: "with-bg-image", "gradient-bg"
  Content: { headline, subheadline, ctaPrimary: { text, href }, ctaSecondary: { text, href } }
- "hero-split" — variants: "image-right", "image-left"
  Content: { headline, subheadline, ctaPrimary: { text, href }, ctaSecondary: { text, href }, image: { src, alt } }

CONTENT SECTIONS:
- "content-features" — variant: "icon-cards"
  Content: { subheadline, headline, features: { icon, title, description }[] }
- "content-split" — variant: "alternating"
  Content: { headline, rows: { headline, body, image: { src, alt } }[] }
- "content-text" — variant: "centered"
  Content: { id?, eyebrow, headline, body (HTML string) }
- "content-stats" — variants: "inline", "cards", "animated-counter"
  Content: { headline?, subheadline?, stats: { value: string, label: string, prefix?, suffix? }[] }
- "content-accordion" — variants: "single-open", "multi-open", "bordered"
  Content: { headline?, subheadline?, items: { question: string, answer: string (HTML) }[] }
- "content-timeline" — variants: "vertical", "alternating"
  Content: { headline?, subheadline?, items: { date?: string, title: string, description: string }[] }
- "content-logos" — variants: "grid", "scroll", "fade"
  Content: { headline?, subheadline?, logos: { name: string, src?: string, href?: string }[] }

COMMERCE & SERVICES:
- "commerce-services" — variants: "card-grid", "list", "tiered"
  Content: { headline?, subheadline?, services: { name, description, price?, duration?, icon?: string, featured?: boolean, ctaText?, ctaLink? }[] }

TEAM:
- "team-grid" — variants: "cards", "minimal", "hover-reveal"
  Content: { headline?, subheadline?, members: { name, role, bio?, image?: { src, alt }, socials?: { platform, url }[] }[] }

SOCIAL PROOF:
- "proof-testimonials" — variant: "carousel"
  Content: { eyebrow, headline, testimonials: { quote, name, role, rating }[] }
- "proof-beforeafter" — variants: "slider", "side-by-side"
  Content: { headline?, subheadline?, comparisons: { beforeImage: { src, alt }, afterImage: { src, alt }, beforeLabel?, afterLabel?, caption? }[] }

MEDIA:
- "media-gallery" — variants: "grid", "masonry", "lightbox"
  Content: { headline?, subheadline?, images: { src, alt, caption?, category? }[], columns?: 2|3|4, showCaptions?: boolean, enableFilter?: boolean }

CTA & FORMS:
- "cta-banner" — variants: "full-width", "contained"
  Content: { headline, subheadline, ctaPrimary: { text, href }, backgroundVariant: "primary"|"secondary"|"accent"|"dark" }
- "form-contact" — variant: "simple"
  Content: { id?, headline, subheadline, fields: { name, label, type, required }[], submitText }

COMPONENT SELECTION GUIDELINES:
- Use "commerce-services" for businesses with distinct service/product offerings (booking, business, ecommerce)
- Use "content-stats" when the business has impressive numbers to showcase (years in business, clients served, etc.)
- Use "team-grid" for businesses where the team matters (agencies, consulting, salons, studios)
- Use "content-accordion" for FAQ sections or detailed info that benefits from expandability
- Use "content-logos" when a business has notable clients, partners, or brands they work with
- Use "content-timeline" for businesses with a compelling history or process steps
- Use "media-gallery" for visual businesses (photography, real estate, restaurants, design)
- Use "proof-beforeafter" for transformative services (beauty, renovation, fitness, design)
- A typical site uses 8-12 components. Don't force every component — pick what fits the business.

For Lucide icons in content-features & commerce-services, use PascalCase: Target, Zap, Shield, Star, Users, Heart, TrendingUp, Eye, Package, Truck, RotateCcw, ShieldCheck, Palette, Lightbulb, Award, HeadphonesIcon, Globe, Clock, CheckCircle, Sparkles, BookOpen, GraduationCap, MessageCircle, Mail, Phone, MapPin, Scissors, Calendar, CreditCard, Briefcase, Camera

Every page MUST start with nav-sticky (order: 0) and end with footer-standard (last order).

CRITICAL content rules:
- Use "${args.businessName}" as the business name everywhere — NEVER invent a different name.
- Headlines MUST be compelling and specific to ${args.businessName}, NOT generic like "Welcome to [name]". Example: "Premium Grooming, Downtown Austin" instead of "Welcome to Luxe Cuts".
- Content MUST be specific to their industry. No generic filler.
- Feature descriptions should reference the actual services/products of this business.
- Testimonials must feel real — use industry-appropriate job titles and specific outcomes (e.g., "Finally found a barber who understands thick hair" not "Great service!").
- Body text: 2-3 sentences, professional, no lorem ipsum.
- socialLinks[].url should be "#" (placeholder).

Return ONLY a JSON object with this structure:
{
  "businessName": string,
  "tagline": string,
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "purpose": string,
      "components": [
        {
          "componentId": string,
          "variant": string,
          "order": number (starting at 0),
          "content": { ...component-specific props }
        }
      ]
    }
  ]
}

No markdown fencing. No explanation. Just the JSON.`,
        messages: [
          {
            role: "user",
            content: `Business Name: ${args.businessName}
Site Type: ${args.siteType}
Goal: ${args.goal}
Description: ${args.description}
Personality Vector: [${args.personality.join(", ")}]
(axes: minimal_rich, playful_serious, warm_cool, light_bold, classic_modern, calm_dynamic)

Discovery Responses:
${aiResponsesSummary}

Generate the SiteIntentDocument for ${args.businessName}.`,
          },
        ],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from AI");
      }

      let raw = textBlock.text.trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(raw) as {
        businessName: string;
        tagline: string;
        pages: PageSpec[];
      };

      const spec: SiteIntentDocument = {
        sessionId: args.sessionId,
        siteType: args.siteType,
        conversionGoal: args.goal,
        personalityVector: args.personality,
        businessName: args.businessName || parsed.businessName,
        tagline: parsed.tagline,
        pages: parsed.pages,
        metadata: {
          generatedAt: Date.now(),
          method: "ai",
        },
      };

      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
      });

      return spec;
    } catch (error) {
      console.error("Failed to generate AI spec, falling back to deterministic:", error);
      const spec = generateDeterministicSpec(args);
      await ctx.runMutation(internal.siteSpecs.saveSiteSpecInternal, {
        sessionId: spec.sessionId,
        siteType: spec.siteType,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        businessName: spec.businessName,
        tagline: spec.tagline,
        pages: spec.pages,
        metadata: spec.metadata,
      });
      return spec;
    }
  },
});
