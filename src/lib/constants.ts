export const SITE = {
  name: "{alqode}",
  domain: "alqode.com",
  title: "{alqode} | Digital Systems Agency, Cape Town",
  description:
    "Custom web apps, automation, and smart systems that cut your costs, multiply your output, and never clock out. Founded by Mohammed Hamdaan Dhaler.",
  url: "https://alqode.com",
  founder: "Mohammed Hamdaan Dhaler",
  location: "Cape Town, South Africa",
  email: "alqodez@gmail.com",
  whatsapp: "https://wa.me/27685394482",
  github: "https://github.com/alqode-dev",
  instagram: "https://www.instagram.com/alqode.dev/",
};

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  tag: "{alqode}",
  headline: "We don't build websites.",
  headlineAccent: "We build machines that make you money.",
  subline:
    "{alqode} builds custom web apps, automation, and smart systems that cut your costs, multiply your output, and never clock out.",
  primaryCta: "Get a system built",
  secondaryCta: "See our work",
  mockupOffer: {
    label: "Free mockup in 24h. No obligation.",
    cta: "Request a mockup",
    href: "https://wa.me/27685394482?text=Hi%2C%20I%27d%20like%20to%20request%20a%20free%20mockup",
  },
  founderTag: "Founded by Mohammed Hamdaan Dhaler in Cape Town. Building for SA + UAE.",
};

export const CLIENTS = {
  label: "Trusted by businesses building real momentum",
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

export const SERVICES = {
  heading: "What we do",
  subline: "Three things. We do them extremely well.",
  cards: [
    {
      icon: "braces" as const,
      title: "Build",
      body: "Custom web apps, e-commerce stores, websites, and digital experiences. Modern frameworks, clean code, built to scale. Not to break.",
    },
    {
      icon: "zap" as const,
      title: "Automate",
      body: "Your receptionist or admin goes home at 5. Your machine doesn't. Lead generation, WhatsApp automation, workflow systems that run while you sleep.",
    },
    {
      icon: "shield" as const,
      title: "Support",
      body: "We don't disappear after launch. As technology evolves, so do your systems. Ongoing improvements, performance upgrades, and scaling support to keep you ahead.",
    },
  ],
};

export const QUICKSTART = {
  tag: "Start fast",
  heading: "Proof. Not promises.",
  subline:
    "Pick your entry point. Free, fast, no commitment. You see exactly what you're getting before you pay a cent.",
  options: [
    {
      title: "Get a mockup",
      description:
        "See the design before you commit. We build a visual prototype of your idea — same look, same feel as the final product. Free.",
      cta: "Request a mockup",
      href: "https://wa.me/27685394482?text=Hi%2C%20I%27d%20like%20to%20request%20a%20free%20mockup",
      eta: "24h",
    },
    {
      title: "Get a quote",
      description:
        "Clear pricing within the hour. Tell us what you need and we'll tell you exactly what it costs — no hidden fees, no surprises.",
      cta: "Request a quote",
      href: "https://wa.me/27685394482?text=Hi%2C%20I%27d%20like%20to%20request%20a%20quote",
      eta: "1h",
    },
  ],
};

export const PORTFOLIO = {
  heading: "Built by",
  headingAccent: "{alqode}",
  subline: "Real systems. Real businesses. Real results.",
  projects: [
    {
      name: "Masjid Notify",
      result: "A 24/7 community hub — scheduling, archives, and access for everyone.",
      description:
        "The digital backbone for a Masjid: prayer times, event scheduling, and a permanent archive of every recorded lecture. Open access, always live.",
      tags: ["WhatsApp API", "Community", "Database"],
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind", "React", "Meta"],
      image: "/images/masjid-notify.png",
      fallbackImage: null,
      url: "https://masjid-notify.vercel.app",
    },
    {
      name: "FAIDA",
      result: "Lead-to-calendar automation. No manual step, no missed booking.",
      description:
        "Brand site plus the automation pipeline that captures every form submission and books qualified leads straight into the calendar — built for a UAE finance brand.",
      tags: ["Automation", "Finance", "UAE"],
      tech: ["Python", "n8n", "JSON", "Airtable"],
      image: "/images/faida-automation.png",
      fallbackImage: "/images/faida.webp",
      url: "https://www.faida.ae",
    },
    {
      name: "Bochi Croffle",
      result: "An in-browser game that turns every play into a customer record.",
      description:
        "Full brand, site, and a custom game built into the experience. Every play feeds a loyalty database — driving revenue and the community that keeps it growing.",
      tags: ["Brand", "Game", "F&B"],
      tech: ["Next.js", "React", "Tailwind", "Vercel"],
      image: "/images/bochi-cafe.png",
      fallbackImage: "/images/bochi.webp",
      url: "https://bochinsh.com",
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
    "Three businesses across two countries. Same outcome — systems that pay for themselves.",
  items: [
    {
      client: "Faida",
      clientKey: "faida" as const,
      url: "https://www.faida.ae",
      name: "Founder",
      role: "Faida · UAE",
      quote:
        "Hamdaan thinks like a business operator, not just a developer. The automation he built turned hours of manual form processing into minutes — and the website now books qualified leads straight into my calendar.",
      photo: "/images/clients/faida-owner.png",
    },
    {
      client: "Bochi Croffle",
      clientKey: "bochi" as const,
      url: "https://bochinsh.com",
      name: "Founder",
      role: "Bochi Croffle · Cape Town",
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
      text: 'I\'m Mohammed Hamdaan Dhaler, founder of {alqode}, based in Cape Town.',
      bold: true,
      highlight: true,
    },
    {
      text: "I started building because I saw businesses bleeding time and money on things that should run themselves. A receptionist who can't answer calls during lunch. A sales team manually filling forms that software could handle in seconds. Five people doing the work of one good system.",
      bold: false,
      highlight: false,
    },
    {
      text: "So I built the systems.",
      bold: true,
      highlight: false,
    },
    {
      text: "{alqode} exists to give businesses the tools that actually move the needle. Not a pretty website that sits there, but a machine that generates leads, automates workflows, and works at 2am when nobody else does.",
      bold: false,
      highlight: false,
    },
    {
      text: "Every project I take on gets the same treatment: built fast, built right, built to last. Speed doesn't mean cutting corners. It means I've done this enough to know exactly what works.",
      bold: false,
      highlight: false,
    },
  ],
  founderImage: "/images/founder.jpg",
};

export const PROCESS = {
  heading: "How it works",
  subline: "From first message to live system. No fluff, no delays.",
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
        "We map it out before we code. Architecture, user flow, and visual direction. All approved before a single line ships.",
    },
    {
      num: "03",
      title: "Build",
      description:
        "Fast execution, clean code. You see progress in days, not months. Regular check-ins so nothing surprises you.",
    },
    {
      num: "04",
      title: "Support",
      description:
        "Launch is the beginning, not the end. We stay on retainer, keep improving your systems, and scale what's working. Your tech grows with your business.",
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
  cta: "Start the conversation",
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
    { name: "Airbnb", project: "Automate our guest bookings" },
    { name: "Tesla", project: "Build a 3D product showcase" },
    { name: "Nike", project: "Scale our e-commerce system" },
    { name: "Your company", project: "Your next big idea" },
  ],
};

export const FOOTER = {
  tagline: "Digital systems agency. Cape Town.",
  copyright: `\u00A9 ${new Date().getFullYear()} {alqode}. All rights reserved.`,
  navigate: ["Services", "Work", "About", "Process", "Contact"],
  connect: [
    { label: "WhatsApp", href: "https://wa.me/27685394482" },
    { label: "GitHub", href: "https://github.com/alqode-dev" },
    { label: "Instagram", href: "https://www.instagram.com/alqode.dev/" },
    { label: "Email", href: "mailto:alqodez@gmail.com" },
  ],
};
