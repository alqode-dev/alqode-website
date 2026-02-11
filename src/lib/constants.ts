export const SITE = {
  name: "{alqode}",
  domain: "alqode.com",
  title: "{alqode} | Digital Systems Agency, Cape Town",
  description:
    "Custom web apps, automation, and AI systems that cut your costs, multiply your output, and never clock out. Founded by Mohammed Hamdaan Dhaler.",
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
    "{alqode} builds custom web apps, automation, and AI systems that cut your costs, multiply your output, and never clock out.",
  primaryCta: "Get a system built",
  secondaryCta: "See our work",
  founderTag: "Founded by Mohammed Hamdaan Dhaler. Cape Town.",
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
      body: "Your receptionist or admin goes home at 5. Your AI doesn't. Lead generation, WhatsApp automation, workflow systems that run while you sleep.",
    },
    {
      icon: "shield" as const,
      title: "Support",
      body: "We don't disappear after launch. As technology evolves, so do your systems. Ongoing improvements, performance upgrades, and scaling support to keep you ahead.",
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
      description:
        "WhatsApp notification system serving a mosque community. Prayer reminders, announcements, and daily hadith, all automated.",
      tags: ["WhatsApp API", "Automation", "Community"],
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind", "React", "Meta"],
      image: "/images/masjid-notify.png",
      fallbackImage: null,
      url: "https://masjid-notify.vercel.app",
    },
    {
      name: "FAIDA",
      description:
        "Automated bank form processing for a UAE real estate finance company. Cutting hours of manual paperwork to minutes.",
      tags: ["Automation", "Finance", "UAE"],
      tech: ["Python", "n8n", "JSON", "Airtable"],
      image: "/images/faida-automation.png",
      fallbackImage: "/images/faida.webp",
      url: null,
    },
    {
      name: "Bochi Cafe",
      description:
        "Modern website for a Cape Town cafe. Mobile-first, fast, and deployed in a single day. Great work doesn't need a big budget.",
      tags: ["Web Design", "Mobile-first", "F&B"],
      tech: ["Next.js", "React", "Tailwind", "Vercel"],
      image: "/images/bochi-cafe.png",
      fallbackImage: "/images/bochi.webp",
      url: "https://bochinsh.com",
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
