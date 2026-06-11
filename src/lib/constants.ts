export const SITE = {
  name: "{alqode}",
  domain: "alqode.com",
  title:
    "{alqode} — Web Apps, Automation & WhatsApp Systems · Cape Town + UAE",
  description:
    "Cape Town agency building custom web apps, n8n automation, and WhatsApp systems for SMBs in South Africa and the UAE. Free mockup in 24h. Projects from R8,000.",
  url: "https://alqode.com",
  founder: "Mohammed Hamdaan Dhaler",
  location: "Cape Town, South Africa",
  email: "alqodez@gmail.com",
  whatsapp: "https://wa.me/27685394482",
  github: "https://github.com/alqode-dev",
  instagram: "https://www.instagram.com/alqode.dev/",
};

/**
 * Generate a WhatsApp URL with UTM tracking + optional pre-filled message.
 * Use everywhere instead of raw SITE.whatsapp so we can track which CTAs convert.
 */
export function waUrl(source: string, text?: string): string {
  const params = new URLSearchParams();
  params.set("utm_source", source);
  if (text) params.set("text", text);
  return `https://wa.me/27685394482?${params.toString()}`;
}

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  boot: {
    command: "> alqode.init",
    lines: [
      "✓ business scanned",
      "✓ friction mapped",
      "✓ system online · accepting projects",
    ],
  },
  preHeadlineLabel: "deploying",
  headline: "We don't build websites.",
  headlineAccent: "We build machines that make you money.",
  subline:
    "Web apps, automation, WhatsApp systems, e-commerce. Built fast. Built right. Built for businesses that need to compound.",
  primaryCta: "Get a system built",
  secondaryCta: "See our work",
  mockupOffer: {
    label: "Free mockup in 24h. No obligation.",
    cta: "Request a mockup",
    href: waUrl("hero_mockup", "Hi, I'd like to request a free mockup"),
  },
  metadata: ["Cape Town", "UAE", "booking · may 2026"],
  founderTag: "Founded by Mohammed Hamdaan Dhaler in Cape Town. Building for SA + UAE.",
};

export const CLIENTS = {
  label: "Building for businesses across SA + UAE",
  logos: [
    {
      key: "faida" as const,
      name: "Faida",
      url: "https://www.faida.ae",
      brandColor: "#7B5BE5",
    },
    {
      key: "bochi" as const,
      name: "Bochi Croffle",
      url: "https://bochinsh.com",
      brandColor: "#7B1818",
    },
    {
      key: "trophy" as const,
      name: "Trophy SA",
      url: "https://trophysa.co.za",
      brandColor: "#B8895A",
    },
  ],
};

export const THE_BUILD = {
  tag: "The Build",
  heading: "Watch a system being deployed.",
  subline:
    "What we ship for businesses — visualized, in 30 seconds. Scroll to watch a real automation pipeline run end-to-end.",
  nodes: [
    {
      id: "form",
      label: "Customer Form",
      caption: "Lead submits through your site",
      states: { idle: "pending", active: "receiving", done: "received" },
    },
    {
      id: "automation",
      label: "Automation Engine",
      caption: "n8n workflow fires the pipeline",
      states: { idle: "pending", active: "executing", done: "executed" },
    },
    {
      id: "notify",
      label: "WhatsApp Notify",
      caption: "You're alerted in real time",
      states: { idle: "pending", active: "sending", done: "delivered" },
    },
    {
      id: "booking",
      label: "Calendar Booked",
      caption: "Qualified lead lands in your day",
      states: { idle: "pending", active: "scheduling", done: "confirmed" },
    },
    {
      id: "revenue",
      label: "Revenue +1",
      caption: "Your machine just compounded",
      states: { idle: "pending", active: "compounding", done: "shipped" },
    },
  ],
  closer: "Multiply this across every customer. While you sleep.",
};

export const QUICKSTART = {
  tag: "Start fast",
  heading: "Proof. Not promises.",
  subline:
    "Pick your entry point. Free, fast, no commitment. Projects start from R8,000 — you see what you're getting before you pay a cent.",
  options: [
    {
      title: "Get a mockup",
      description:
        "See the design before you commit. We build a visual prototype of your idea — same look, same feel as the final product. Free.",
      cta: "Request a mockup",
      href: waUrl("quickstart_mockup", "Hi, I'd like to request a free mockup"),
      eta: "24h",
    },
    {
      title: "Get a quote",
      description:
        "Clear pricing within the hour. Tell us what you need and we'll tell you exactly what it costs — no hidden fees, no surprises.",
      cta: "Request a quote",
      href: waUrl("quickstart_quote", "Hi, I'd like to request a quote"),
      eta: "1h",
    },
  ],
};

export const PORTFOLIO = {
  tag: "> deployed.services",
  heading: "Built by",
  headingAccent: "{alqode}",
  subline: "Live in production. Real businesses. Real voices.",
  projects: [
    {
      name: "Masjid Notify",
      deployedSince: "2025",
      category: "community" as const,
      result: "A 24/7 community hub. Scheduling, archives, and access for everyone.",
      description:
        "The digital backbone for a Masjid: prayer times, event scheduling, and a permanent archive of every recorded lecture. Open access, always live.",
      tags: ["WhatsApp API", "Community", "Database"],
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind", "React", "Meta"],
      image: "/images/masjid-notify.webp",
      fallbackImage: null,
      url: "https://masjid-notify.vercel.app",
    },
    {
      name: "FAIDA",
      deployedSince: "2024",
      category: "client" as const,
      result: "Lead-to-calendar automation. No manual step, no missed booking.",
      description:
        "Brand site plus the automation pipeline that captures every form submission and books qualified leads straight into the calendar. Built for a UAE finance brand.",
      tags: ["Automation", "Finance", "UAE"],
      tech: ["Python", "n8n", "JSON", "Airtable"],
      image: "/images/faida-automation.webp",
      fallbackImage: "/images/faida.webp",
      url: "https://www.faida.ae",
    },
    {
      name: "Bochi Croffle",
      deployedSince: "2025",
      category: "client" as const,
      result: "An in-browser game that turns every play into a customer record.",
      description:
        "Full brand, site, and a custom game built into the experience. Every play feeds a loyalty database that drives revenue and the community that keeps it growing.",
      tags: ["Brand", "Game", "F&B"],
      tech: ["Next.js", "React", "Tailwind", "Vercel"],
      image: "/images/bochi-home.jpg",
      fallbackImage: "/images/bochi-cafe.webp",
      url: "https://bochinsh.com",
    },
    {
      name: "Trophy SA",
      deployedSince: "2025",
      category: "client" as const,
      result:
        "Premium e-commerce experience on a free-tier WordPress budget.",
      description:
        "Full WooCommerce store for South Africa's leading online awards shop. Built to feel premium, engineered to convert, without the premium plugin price tag.",
      tags: ["E-commerce", "WordPress", "Retail"],
      tech: ["WordPress", "WooCommerce", "PayFast"],
      image: "/images/trophy-sa.jpg",
      fallbackImage: null,
      url: "https://trophysa.co.za",
    },
  ],
};

/**
 * TESTIMONIALS — DRAFT COPY pending client signoff.
 * Quotes are based on what was actually built for each client.
 * Get verified quotes from each owner before sharing widely.
 */
export const TESTIMONIALS = {
  tag: "Client voices",
  heading: "In their words.",
  subline:
    "Three businesses across two countries. Same outcome: systems that pay for themselves.",
  items: [
    {
      client: "Faida",
      clientKey: "faida" as const,
      url: "https://www.faida.ae",
      name: "Founder",
      role: "Faida · UAE",
      metric: "Hours → minutes",
      problem:
        "Manual form processing was eating hours and leads slipped through. Now the site captures and books qualified leads on its own.",
      quote:
        "Hamdaan thinks like a business operator, not just a developer. The automation he built turned hours of manual form processing into minutes, and the website now books qualified leads straight into my calendar.",
      photo: "/images/clients/faida-owner.png",
    },
    {
      client: "Bochi Croffle",
      clientKey: "bochi" as const,
      url: "https://bochinsh.com",
      name: "Founder",
      role: "Bochi Croffle · Cape Town",
      metric: "Buyers → community",
      problem:
        "A great product, but no way to bring customers back. Now an in-store game turns every buyer into a returning community, and feeds the data behind it.",
      quote:
        "He didn't just build us a website. He built the engine. Every customer who plays the game becomes part of our community, and the data fuels everything from promotions to new launches.",
      photo: "/images/clients/bochi-owner.png",
    },
    {
      client: "Trophy SA",
      clientKey: "trophy" as const,
      url: "https://trophysa.co.za",
      name: "Founder",
      role: "Trophy SA · South Africa",
      metric: "Budget → premium",
      problem:
        "Wanted a premium store, but on a startup budget. Now a full e-commerce shop that looks like ten times what it cost.",
      quote:
        "Premium look on a budget I could afford. I'm running a full e-commerce store that looks like I paid ten times what I did. Hamdaan made every rand work twice.",
      photo: "/images/clients/trophy-owner.png",
    },
  ],
};

export const ABOUT = {
  heading: "The person behind the code",
  paragraphs: [
    {
      text: "I'm Mohammed Hamdaan Dhaler, founder of {alqode}. I build systems for businesses bleeding time and money on things that should run themselves — receptionists who can't answer at lunch, sales teams filling forms software could handle in seconds.",
      bold: true,
      highlight: true,
    },
    {
      text: "So I built the systems.",
      bold: true,
      highlight: false,
    },
    {
      text: "{alqode} exists to give businesses the tools that actually move the needle — machines that generate leads, automate workflows, and work at 2am when nobody else does. Every project gets the same treatment: built fast, built right, built to last.",
      bold: false,
      highlight: false,
    },
  ],
  founderImage: "/images/founder.jpg",
};

export const PROCESS = {
  tag: "Process",
  heading: "How we work",
  subline:
    "From first message to live system — and the years after. No fluff, no delays.",
  steps: [
    {
      num: "01",
      title: "Discovery",
      description:
        "You tell us the problem. We figure out the fastest, cleanest solution. No unnecessary features, no wasted budget.",
    },
    {
      num: "02",
      title: "Design",
      description:
        "We map out architecture, user flow, and visual direction before a single line of code ships. You approve every direction.",
    },
    {
      num: "03",
      title: "Build",
      description:
        "Custom web apps, automation, smart systems, e-commerce. Modern frameworks, clean code, built to scale — not to break. You see progress in days, not months.",
    },
    {
      num: "04",
      title: "Support",
      description:
        "Launch is day one. We stay on retainer — keeping your systems sharp, fixing fast, scaling what works. Your tech grows with your business.",
    },
  ],
};

export const RETAINER = {
  tag: "The retainer",
  heading: "We build. We stay. We compound.",
  subline:
    "Launch is day one. Month three is when the system starts paying for itself. Stay on retainer and we keep your business climbing — campaigns, fixes, refreshes, scaling — every month, on autopilot.",
  pillars: [
    {
      title: "Always live",
      body: "Uptime monitoring, fast error response, security patches. Your system never sleeps and neither do we.",
    },
    {
      title: "Always growing",
      body: "Google campaigns, seasonal promotions, content drops. We keep your business in front of the right eyes.",
    },
    {
      title: "Always refreshed",
      body: "New features, fresh content, items added and updated. Your site evolves with your business — never stale.",
    },
    {
      title: "Always ahead",
      body: "Quarterly performance reviews, A/B tests, fresh strategy. What works stays. What doesn't gets replaced — fast.",
    },
  ],
  closer: {
    line1: "Our job isn't to ship a site and disappear.",
    line2: "Our job is to make you so successful, your competitors run out of business.",
  },
  cta: "Get me on retainer",
};

export const FAQ = {
  tag: "Common questions",
  heading: "Before you message.",
  items: [
    {
      q: "How fast can you actually deliver?",
      a: "A clean mockup is in your hands within 24 hours of your message. Quotes inside 1 hour. Simple sites can go live in 3-5 days; full systems (with automation + e-commerce) usually 2-4 weeks. We move faster than agencies four times our size because we don't burn weeks on slide decks.",
    },
    {
      q: "What does a project cost?",
      a: "Projects start from R8,000. Most fall between R12,000 and R45,000 depending on scope. We send a clear quote within an hour of understanding what you need — no hidden fees, no padding, no surprises. Retainers are priced separately based on what we're keeping live.",
    },
    {
      q: "Do you work with businesses outside South Africa?",
      a: "Yes. We're based in Cape Town but actively build for clients in the UAE (Faida is one) and remotely across timezones. WhatsApp + email keeps communication simple regardless of where you are.",
    },
    {
      q: "What happens after launch?",
      a: "Launch is day one. We stay on retainer to keep your systems sharp — uptime monitoring, fast fixes, monthly content/feature updates, Google campaigns, and quarterly performance reviews. The retainer is built so your business compounds, not stagnates.",
    },
    {
      q: "Can I see what you'd build before I commit?",
      a: "Absolutely — that's the whole point of the free mockup offer. Message us, tell us what you need, and within 24 hours you'll see a visual prototype of your idea. If it lands, we build it. If not, no obligation.",
    },
  ],
};

export const CONTACT = {
  heading: "Let's build something.",
  subline:
    "One message away from a system that changes how your business runs.",
  whatsappCta: "Message us on WhatsApp",
  separator: "or fill in the form below",
  formFields: {
    name: "Name",
    email: "Email",
    project: "Tell us about your project",
    submit: "Send",
  },
  details: {
    location: "Cape Town, South Africa",
    email: "alqodez@gmail.com",
  },
  typingCycles: [
    { name: "Cape Town cafe", project: "Loyalty system + WhatsApp orders" },
    { name: "Joburg plumber", project: "Lead capture + booking automation" },
    { name: "Durban boutique", project: "E-commerce store + Instagram sync" },
    { name: "Your business", project: "What needs to run itself?" },
  ],
};

export const FOOTER = {
  tagline: "Digital systems agency. Cape Town + UAE.",
  copyright: `\u00A9 ${new Date().getFullYear()} {alqode}. All rights reserved.`,
  navigate: ["Work", "About", "Process", "Contact"],
  connect: [
    { label: "WhatsApp", href: waUrl("footer") },
    { label: "GitHub", href: "https://github.com/alqode-dev" },
    { label: "Instagram", href: "https://www.instagram.com/alqode.dev/" },
    { label: "Email", href: "mailto:alqodez@gmail.com" },
  ],
};
