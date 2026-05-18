import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE, FAQ } from "@/lib/constants";
import { LenisProvider } from "@/components/lenis-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  keywords: [
    "web automation Cape Town",
    "WhatsApp automation South Africa",
    "n8n automation agency",
    "custom web apps Cape Town",
    "digital agency South Africa",
    "small business website Cape Town",
    "WooCommerce developer South Africa",
    "automation agency UAE",
    "lead capture automation",
    "alqode",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}#org`,
  name: "alqode",
  url: SITE.url,
  logo: `${SITE.url}/favicon.svg`,
  description: SITE.description,
  founder: {
    "@type": "Person",
    name: SITE.founder,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cape Town",
    addressCountry: "ZA",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE.email,
    contactType: "customer service",
    areaServed: ["ZA", "AE"],
  },
  sameAs: [
    "https://github.com/alqode-dev",
    "https://www.instagram.com/alqode.dev/",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}#service`,
  name: "alqode — Digital Systems Agency",
  url: SITE.url,
  description:
    "Custom web apps, automation, WhatsApp systems, and e-commerce — built for South African and UAE businesses.",
  provider: { "@id": `${SITE.url}#org` },
  areaServed: [
    { "@type": "Country", name: "South Africa" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "alqode services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Web Apps",
          description:
            "Custom web applications, websites, and digital experiences built on modern frameworks.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Automation Systems",
          description:
            "n8n workflows, WhatsApp automation, lead capture pipelines, form-to-calendar automation.",
        },
      },
      {
        "@type": "Service",
        name: "E-commerce",
        description: "WooCommerce stores, payment integration, retail systems.",
      },
      {
        "@type": "Service",
        name: "Ongoing Retainer",
        description:
          "Monthly retainer — uptime monitoring, fast fixes, content updates, campaigns, and quarterly performance reviews.",
      },
    ],
  },
  priceRange: "From R8,000",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <LenisProvider>
          {children}
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
