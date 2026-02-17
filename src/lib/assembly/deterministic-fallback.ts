/**
 * Deterministic fallback spec generator — extracted from convex/ai/generateSiteSpec.ts
 * for testability. These pure functions generate a SiteIntentDocument without AI.
 *
 * NOTE: The canonical copy of these functions also exists in convex/ai/generateSiteSpec.ts.
 * If you update logic here, update the Convex copy as well (and vice versa).
 */

import type { SiteIntentDocument, ComponentPlacement } from "./spec.types";
import { getVoiceKeyedHeadline, getVoiceKeyedCtaText } from "@/lib/content/voice-keyed";

/* ────────────────────────────────────────────────────────────
 * Industry-specific content
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
        quote: "One of the few blogs I actually look forward to reading.",
        name: "Chris Nakamura",
        role: "Subscriber",
        rating: 5,
      },
      {
        quote: "Finally a blog that respects its readers' time.",
        name: "Priya Sharma",
        role: "Regular Reader",
        rating: 5,
      },
      {
        quote: "I've shared more articles from this blog than any other.",
        name: "Daniel Okafor",
        role: "Newsletter Subscriber",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is a space for thoughtful exploration and honest perspectives.</p>`,
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
        quote: "Incredibly talented and a pleasure to work with.",
        name: "Morgan Ellis",
        role: "Project Collaborator",
        rating: 5,
      },
      {
        quote: "Professional, creative, and reliable.",
        name: "Sam Whitfield",
        role: "Former Client",
        rating: 5,
      },
      {
        quote: "Exceeded our expectations in every way.",
        name: "Nina Vasquez",
        role: "Team Lead, Apex Digital",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings passion and precision to every project.</p>`,
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
        quote: "The course structure is excellent.",
        name: "Kevin Park",
        role: "Career Changer",
        rating: 5,
      },
      {
        quote: "The instructors genuinely care about student success.",
        name: "Lisa Johannsen",
        role: "Graduate",
        rating: 5,
      },
      {
        quote: "Went from complete beginner to landing a job.",
        name: "Raj Mehta",
        role: "Alumni",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} is dedicated to making high-quality education accessible and practical.</p>`,
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
        quote: "Volunteering here has been one of the most rewarding experiences of my life.",
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
          "They turned our small community grant into a program that now serves hundreds of families.",
        name: "Patricia Owens",
        role: "Community Partner",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} believes in the power of collective action.</p>`,
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
        quote: "Best event I attended all year.",
        name: "Jason Wright",
        role: "Attendee",
        rating: 5,
      },
      {
        quote: "From registration to the final session, everything was seamless.",
        name: "Sophia Lin",
        role: "VIP Ticket Holder",
        rating: 5,
      },
      {
        quote:
          "The caliber of speakers and the energy of the crowd made this a truly unforgettable experience.",
        name: "Michael Osei",
        role: "Repeat Attendee",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} brings together passionate people for an experience that inspires, connects, and energizes.</p>`,
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
          "Signed up on a whim and it turned out to be one of the best decisions I've made this year.",
        name: "Alex Rivera",
        role: "Early Adopter",
        rating: 5,
      },
      {
        quote: "I was skeptical at first, but the results spoke for themselves.",
        name: "Jasmine Powell",
        role: "Customer",
        rating: 5,
      },
      {
        quote: "Simple to get started, powerful results.",
        name: "Derek Huang",
        role: "Verified User",
        rating: 5,
      },
    ],
    aboutBody: (name, desc) =>
      `<p>${desc}</p><p>${name} was built to solve a real problem with a straightforward solution.</p>`,
  },
};

/* Re-export voice-keyed functions from canonical source for backwards compatibility */
export { getVoiceKeyedHeadline, getVoiceKeyedCtaText } from "@/lib/content/voice-keyed";

export function getStatsForSiteType(
  siteType: string
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

export function getServicesForSiteType(
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

export function getTeamForSiteType(
  siteType: string
): Array<{ name: string; role: string; bio?: string }> {
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
        answer: `<p>You can book online through our website 24/7, or call us during business hours.</p>`,
      },
      {
        question: "What is your cancellation policy?",
        answer: `<p>Please give us at least 24 hours notice for cancellations.</p>`,
      },
      {
        question: "Do you offer gift cards?",
        answer: `<p>Yes! ${businessName} gift cards are available in any denomination.</p>`,
      },
      {
        question: "What forms of payment do you accept?",
        answer: `<p>We accept all major credit cards, debit cards, Apple Pay, and Google Pay.</p>`,
      },
    ],
    ecommerce: [
      {
        question: "What is your shipping policy?",
        answer: `<p>We offer free shipping on orders over $50.</p>`,
      },
      {
        question: "How do I return an item?",
        answer: `<p>Returns are accepted within 30 days of delivery.</p>`,
      },
      {
        question: "Do you ship internationally?",
        answer: `<p>Yes, ${businessName} ships to over 50 countries worldwide.</p>`,
      },
      {
        question: "How can I track my order?",
        answer: `<p>Once your order ships, you'll receive an email with a tracking number.</p>`,
      },
    ],
    educational: [
      {
        question: "Are the courses self-paced?",
        answer: `<p>Most of our courses are self-paced.</p>`,
      },
      {
        question: "Do I get a certificate upon completion?",
        answer: `<p>Yes! All ${businessName} courses include a verified certificate.</p>`,
      },
      {
        question: "What if I'm not satisfied with a course?",
        answer: `<p>We offer a 30-day money-back guarantee.</p>`,
      },
      {
        question: "Can I access courses on mobile devices?",
        answer: `<p>Absolutely. Our platform is fully responsive.</p>`,
      },
    ],
    event: [
      {
        question: "What's included in my ticket?",
        answer: `<p>Your ticket includes full access to all sessions, keynotes, and networking events.</p>`,
      },
      {
        question: "Is there a group discount?",
        answer: `<p>Yes! Groups of 5 or more receive a 15% discount.</p>`,
      },
      {
        question: "What is the refund policy?",
        answer: `<p>Full refunds are available up to 30 days before the event.</p>`,
      },
      {
        question: "Will sessions be recorded?",
        answer: `<p>Yes, all main stage sessions will be recorded.</p>`,
      },
    ],
    nonprofit: [
      {
        question: "How are donations used?",
        answer: `<p>92% of all donations go directly to our programs and mission.</p>`,
      },
      {
        question: "Is my donation tax-deductible?",
        answer: `<p>Yes, ${businessName} is a registered 501(c)(3) nonprofit organization.</p>`,
      },
      {
        question: "How can I volunteer?",
        answer: `<p>We'd love to have you! Visit our volunteer page.</p>`,
      },
      {
        question: "Can I set up a recurring donation?",
        answer: `<p>Absolutely. Monthly recurring donations help us plan ahead.</p>`,
      },
    ],
  };
  return faqMap[siteType] || faqMap.booking;
}

function extractBusinessName(description: string): string {
  const patterns = [
    /(?:called|named)\s+["']?([A-Z][A-Za-z\s&']+?)["']?(?:\.|,|\s+(?:is|and|that|which|in))/,
    /(?:my|our)\s+(?:company|business|brand|studio|agency|shop|store)\s+["']?([A-Z][A-Za-z\s&']+?)["']?/i,
    /^I(?:'m| am)\s+(?:a\s+)?([A-Z][A-Za-z\s]+?)(?:\s+(?:based|in|from|who|that|and))/,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  const words = description.split(/\s+/).slice(0, 3);
  if (words.length > 0 && /^[A-Z]/.test(words[0])) {
    return words.slice(0, 2).join(" ");
  }
  return "My Business";
}

/* ────────────────────────────────────────────────────────────
 * Main deterministic spec generator
 * ──────────────────────────────────────────────────────────── */

export interface DeterministicSpecArgs {
  sessionId: string;
  siteType: string;
  goal: string;
  businessName: string;
  description: string;
  personality: number[];
  aiResponses: Record<string, string>;
  emotionalGoals?: string[];
  voiceProfile?: string;
  brandArchetype?: string;
  antiReferences?: string[];
  narrativePrompts?: Record<string, string>;
}

export function generateDeterministicSpec(args: DeterministicSpecArgs): SiteIntentDocument {
  const { sessionId, siteType, goal, description, personality } = args;
  const voiceTone = (args.voiceProfile || "polished") as "warm" | "polished" | "direct";
  const antiRefs = args.antiReferences || [];

  const businessName = args.businessName || extractBusinessName(description);
  const industry = INDUSTRY_CONTENT[siteType] || INDUSTRY_CONTENT.business;
  const tagline = industry.taglines[goal] || "Building something remarkable together";

  const isMinimal = personality[0] < 0.5;
  const heroVariant = isMinimal ? "gradient-bg" : "with-bg-image";
  const heroComponent = personality[2] < 0.5 ? "hero-centered" : "hero-split";
  const heroSplitVariant = personality[4] > 0.5 ? "image-right" : "image-left";

  const components: ComponentPlacement[] = [];
  let order = 0;

  const ctaText = getVoiceKeyedCtaText(goal, voiceTone, antiRefs);

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
      cta: { text: ctaText, href: "#contact" },
    },
  });

  // Hero
  const headline = getVoiceKeyedHeadline(businessName, siteType, voiceTone);
  if (heroComponent === "hero-centered") {
    components.push({
      componentId: "hero-centered",
      variant: heroVariant,
      order: order++,
      content: {
        headline,
        subheadline: tagline,
        ctaPrimary: { text: ctaText, href: "#contact" },
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
        ctaPrimary: { text: ctaText, href: "#contact" },
        ctaSecondary: { text: "Learn More", href: "#about" },
        image: {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
          alt: businessName,
        },
      },
    });
  }

  // Content sections
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

  // Stats
  if (["business", "booking", "ecommerce", "educational", "nonprofit"].includes(siteType)) {
    components.push({
      componentId: "content-stats",
      variant: personality[3] > 0.6 ? "animated-counter" : "cards",
      order: order++,
      content: {
        headline: "By the Numbers",
        stats: getStatsForSiteType(siteType),
      },
    });
  }

  // Commerce services
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

  // Team
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

  // Logos
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

  // Testimonials
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

  // FAQ
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
      ctaPrimary: { text: ctaText, href: "#contact" },
      backgroundVariant: "primary",
    },
  });

  // Contact form
  if (["contact", "book", "convert", "hire"].includes(goal)) {
    components.push({
      componentId: "form-contact",
      variant: "simple",
      order: order++,
      content: {
        id: "contact",
        headline: "Get in Touch",
        subheadline:
          "Ready to get started? Drop us a message and we'll get back to you within 24 hours.",
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
    emotionalGoals: args.emotionalGoals,
    voiceProfile: args.voiceProfile,
    brandArchetype: args.brandArchetype,
    antiReferences: args.antiReferences,
    narrativePrompts: args.narrativePrompts,
  };
}

/** All known site types in the deterministic fallback */
export const SUPPORTED_SITE_TYPES = [
  "business",
  "booking",
  "ecommerce",
  "portfolio",
  "blog",
  "personal",
  "educational",
  "nonprofit",
  "event",
  "landing",
] as const;
