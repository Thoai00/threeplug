// Single source of truth for everything search engines read about the company.
// Update SITE_URL to the live domain before launch — canonicals, sitemap,
// robots and social cards are all derived from it.
export const SITE_URL = "https://threeplug.com";

export const COMPANY = {
  name: "Three Plug",
  legalName: "Three Plug Software Solutions",
  tagline: "Building digital systems that connect, automate & scale businesses.",
  description:
    "Three Plug Software Solutions builds websites, web and mobile applications, desktop software, ERP and CRM systems, digital marketing, animation and interactive 3D — eleven service categories delivered by one team, for clients worldwide.",
  email: "threeplug00@gmail.com",
  phone: "+8801784129360",
  address: {
    street: "Road No-26, Building 17/A, Banani",
    locality: "Dhaka",
    postalCode: "1213",
    country: "BD",
  },
  social: "@threeplug",
  founded: "2023",
};

// Mirrors the service catalog. `keywords` feed page metadata; `name` feeds
// the Service entries in structured data.
export const SERVICES = [
  { name: "Website Development", keywords: ["website development company", "corporate website design", "e-commerce website development", "business website developer"] },
  { name: "Web Applications", keywords: ["web application development", "SaaS platform development", "custom web portal", "admin dashboard development"] },
  { name: "Mobile Applications", keywords: ["mobile app development company", "android app development", "iOS app development", "cross-platform app development"] },
  { name: "Desktop / PC Software", keywords: ["desktop software development", "POS software", "inventory software", "offline-first business software"] },
  { name: "ERP Solutions", keywords: ["ERP software development", "custom ERP system", "school ERP software", "HR and payroll software"] },
  { name: "CRM Solutions", keywords: ["CRM software development", "custom CRM system", "sales pipeline software", "lead management software"] },
  { name: "Digital Marketing", keywords: ["digital marketing agency", "performance marketing", "SEO services", "Facebook and Instagram ads"] },
  { name: "Animation & Motion", keywords: ["2D animation studio", "3D product animation", "explainer video production", "motion graphics"] },
  { name: "Character Animation", keywords: ["character animation studio", "mascot animation", "character rigging", "3D character design"] },
  { name: "3D Web Experience", keywords: ["Three.js development", "WebGL development company", "3D product configurator", "virtual showroom"] },
  { name: "3D Visualisation", keywords: ["3D product visualisation", "architectural visualisation", "3D rendering services", "virtual tour"] },
  { name: "DevOps & Cloud", keywords: ["devops services", "cloud deployment", "CI/CD pipeline setup", "application hosting and monitoring"] },
];

// Buyer-intent questions people actually type. Rendered visibly on the home
// page and mirrored into FAQPage structured data — Google ignores meta
// keywords, but answers real questions in visible copy.
export const FAQS = [
  {
    q: "What services does Three Plug offer?",
    a: "Twelve categories under one team: website development, web applications, mobile apps for Android and iOS, desktop and POS software, ERP systems, CRM systems, digital marketing, 2D and 3D animation, character animation, interactive 3D web experiences built with Three.js and WebGL, 3D visualisation, and DevOps with cloud deployment.",
  },
  {
    q: "Do you work with clients outside Bangladesh?",
    a: "Yes. The team is based in Dhaka and works remotely with clients anywhere in the world, in English and Bengali. Projects run over video calls, shared boards and a working demo at every stage, so distance doesn't change how the work is reviewed.",
  },
  {
    q: "How much does custom software cost?",
    a: "It depends on scope, so every project starts with a discovery call and a written scope before any number is quoted. Cost is driven by how many modules, user roles and integrations a system needs — a single-department tool and a company-wide ERP are very different builds.",
  },
  {
    q: "How long does an ERP or CRM implementation take?",
    a: "Our ERP and CRM systems are modular, so a company can start with one department and extend company-wide later instead of waiting for everything at once. A project runs through discovery, system design, development in sprints, testing with data migration and staff training, then go-live and support.",
  },
  {
    q: "Can you build 3D experiences that run in a web browser?",
    a: "Yes — product configurators, virtual showrooms, 3D real-estate walkthroughs and interactive brand experiences, built on Three.js and WebGL so they load in a browser tab with no app, download or plugin.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. Every build includes admin training, documentation and support, and deployment goes live on cloud or on-premise with rollback ready. After launch we handle maintenance, monitoring and backups, plus new modules and extra branches as the business grows.",
  },
];

// Keyword clusters for content planning — one page should target one cluster.
// Use these when writing service pages, not as meta keywords.
export const KEYWORD_CLUSTERS = {
  transactional: ["hire software development company", "custom ERP development services", "CRM development company", "mobile app development agency", "Three.js developer for hire"],
  local: ["software company in Dhaka", "ERP software company in Bangladesh", "web development company Banani", "digital marketing agency Dhaka"],
  international: ["offshore software development team", "outsource web application development", "remote development team Bangladesh", "dedicated development team hire"],
  industry: ["school management software", "school ERP with guardian app", "garments ERP software", "POS software for retail", "healthcare management system", "real estate 3D walkthrough"],
  informational: ["what is a school ERP", "ERP vs CRM difference", "n8n workflow automation examples", "how much does a mobile app cost", "WebGL vs video for product pages"],
};

export const PRIMARY_KEYWORDS = [
  "software development company",
  "ERP software company",
  "CRM software development",
  "custom software development",
  "web application development",
  "mobile app development company",
  "Three.js WebGL development",
  "3D web experience",
  "digital marketing agency",
  "workflow automation n8n",
  "AI agent development",
  "software company in Bangladesh",
  "offshore software development team",
  "hire dedicated development team",
  "school management software",
  "POS and inventory software",
  "3D product configurator development",
  "devops and cloud deployment services",
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Organization + website, emitted once from the root layout.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        image: `${SITE_URL}/og.jpg`,
        description: COMPANY.description,
        slogan: COMPANY.tagline,
        foundingDate: COMPANY.founded,
        email: COMPANY.email,
        telephone: COMPANY.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: COMPANY.address.street,
          addressLocality: COMPANY.address.locality,
          postalCode: COMPANY.address.postalCode,
          addressCountry: COMPANY.address.country,
        },
        // The team works remotely with clients anywhere.
        areaServed: { "@type": "Place", name: "Worldwide" },
        knowsAbout: SERVICES.map((s) => s.name),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Service catalog",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, provider: { "@id": `${SITE_URL}/#organization` } },
          })),
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: COMPANY.email,
          telephone: COMPANY.phone,
          availableLanguage: ["English", "Bengali"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: COMPANY.name,
        description: COMPANY.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}
