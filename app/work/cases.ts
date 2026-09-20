export type CaseImage = { src: string; alt: string; width: number; height: number };

export type CaseSection = {
  label: string;
  heading: string;
  body: string[];
  image?: CaseImage;
  palette?: { name: string; hex: string }[];
  stats?: { value: string; label: string }[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  year: string;
  industry: string;
  services: string;
  tagline: string;
  video?: { src: string; poster: string };
  sections: CaseSection[];
};

const shot = (file: string, alt: string): CaseImage => ({ src: `/bidyaloy/${file}`, alt, width: 2000, height: 1054 });

export const CASES: CaseStudy[] = [
  {
    slug: "bidyaloy",
    name: "Bidyaloy",
    year: "2025",
    industry: "Education",
    services: "Web platform · iOS & Android",
    tagline: "Bangladesh's most complete school ERP — one platform for principals, teachers, students and guardians.",
    video: { src: "/bidyaloy/bidyaloy.mp4", poster: "/bidyaloy/bidyaloy-poster.jpg" },
    sections: [
      {
        label: "Overview",
        heading: "One school, one system.",
        body: [
          "Bidyaloy.academy is a subscription-based school management platform built for schools across Bangladesh. It brings principals, teachers, students, guardians and accountants onto the same system — attendance, exams and results, fees, notices and analytics — on the web and on iOS and Android.",
        ],
      },
      {
        label: "Challenge",
        heading: "Registers, spreadsheets and phone calls.",
        body: [
          "Most schools were running on paper registers, spreadsheets and phone calls. Attendance lived in one notebook and fees in another, and results were compiled by hand at the end of every term.",
          "Guardians only heard about an absence or an unpaid fee once it had already become a problem, and principals had no live view of how their school was actually doing.",
        ],
        image: shot("principal-panel.jpg", "Bidyaloy principal panel showing students, teachers, fee collection and attendance at a glance"),
      },
      {
        label: "Brand strategy",
        heading: "The complete school ERP — not another attendance app.",
        body: [
          "Every role gets a dashboard built around what it actually does: Principal, Vice-Principal, Class Teacher, Subject Teacher, Examiner, Accountant and Guardian, each with precise permissions.",
          "Bangla and English sit one tap apart, because the people using it every day aren't all comfortable in one language. And every action — an absence, a published result, a fee due — fires a real-time notification to whoever needs to know, so the system does the chasing instead of the office.",
        ],
      },
      {
        label: "Brand identity",
        heading: "Warm, trustworthy and unmistakably academic.",
        body: [
          "A school-house mark and a classic serif for headlines give Bidyaloy the weight of an institution, while a warm amber-to-gold accent on soft cream keeps it approachable rather than corporate.",
          "Each panel carries its own accent — amber for the principal, violet for students — so users always know which seat they're in.",
        ],
        palette: [
          { name: "Amber", hex: "#C8893A" },
          { name: "Gold", hex: "#E7B94A" },
          { name: "Cream", hex: "#FBF7F0" },
          { name: "Espresso", hex: "#1E1714" },
          { name: "Student violet", hex: "#7B5CE6" },
        ],
        image: shot("landing.jpg", "Bidyaloy.academy landing page — Bangladesh's Most Complete School ERP"),
      },
      {
        label: "Result",
        heading: "Live across Bangladesh.",
        body: [
          "Bidyaloy.academy is live on the web and on iOS and Android. Attendance, results, fees and notices now run through one system, and guardians hear about what matters the moment it happens instead of at the end of term.",
        ],
        stats: [
          { value: "500+", label: "Schools on the platform" },
          { value: "3", label: "Platforms — web, iOS, Android" },
          { value: "2", label: "Languages — English & Bangla" },
        ],
        image: shot("student-panel.jpg", "Bidyaloy student panel with attendance, results, fee status, class teacher and guardian"),
      },
    ],
  },
  {
    slug: "bidyaloy-app",
    name: "Bidyaloy App",
    year: "2025",
    industry: "Education",
    services: "iOS & Android",
    tagline: "The Bidyaloy platform in every parent's and teacher's pocket.",
    sections: [
      { label: "Overview", heading: "The school, on the phone everyone already carries.", body: ["The mobile companion to Bidyaloy.academy. Attendance, results, fees and notices — the things people check daily — in an app for iOS and Android, signed in as whichever role you hold."] },
      { label: "Challenge", heading: "Principals sit at a desk. Nobody else does.", body: ["A web-only platform meant the people who most needed to know about an absence, a published result or an unpaid fee had to remember to go and look for it."] },
      { label: "Strategy", heading: "Put the daily three first.", body: ["Attendance, results and notices lead; everything else sits behind them. Anything that changes fires a notification, so the app reaches out instead of waiting to be opened.", "Bangla and English, one tap apart, exactly as on the web."] },
      { label: "Solution", heading: "One codebase, every role.", body: ["A cross-platform build with role-aware screens for guardians, students and teachers, push notifications for absences, published results and fee dues, and release to both the App Store and Play Store."] },
      { label: "Result", heading: "Live on both stores.", body: ["The app ships alongside the web platform, so the school's system is reachable wherever the people using it happen to be."] },
    ],
  },
  {
    slug: "health-app",
    name: "Health App",
    year: "2025",
    industry: "Healthcare",
    services: "iOS & Android",
    tagline: "A health and wellness app built to make daily tracking a habit.",
    sections: [
      { label: "Overview", heading: "Day-to-day health in one place.", body: ["A cross-platform health and wellness app for iOS and Android, built to help people record and follow their own health without juggling notes, reminders and separate apps."] },
      { label: "Challenge", heading: "Most health tracking dies in week two.", body: ["Logging takes too long, reminders live somewhere else, and progress stays invisible until the next check-up — so the habit breaks before it forms."] },
      { label: "Strategy", heading: "Few taps, timely nudges, visible progress.", body: ["Make each entry quick enough to do standing up, bring reminders inside the app, and show progress plainly enough to be worth opening again tomorrow."] },
      { label: "Solution", heading: "One build for both platforms.", body: ["Quick daily logging, reminders and notifications, a straightforward progress view, secure accounts, and deployment to both app stores from a single codebase."] },
      { label: "Result", heading: "Shipped to iOS and Android.", body: ["Live on both platforms from one codebase, structured so new tracking features slot in without a rebuild."] },
    ],
  },
  {
    slug: "business-erp",
    name: "Business ERP",
    year: "2025",
    industry: "Enterprise",
    services: "ERP · Web platform",
    tagline: "One platform. One database. One source of truth.",
    sections: [
      { label: "Overview", heading: "Every department on one system.", body: ["A modular ERP connecting HR and payroll, accounting, inventory, sales and purchase on a single database, with a live management dashboard and role-based access for every branch."] },
      { label: "Challenge", heading: "Four files, four versions of the truth.", body: ["Each department kept its own: HR in one spreadsheet, stock in another, accounts in a third. Nothing reconciled until month end, and nobody could see the business whole without asking four people first."] },
      { label: "Strategy", heading: "Start with one department. Extend without rebuilding.", body: ["Modular from the outset, so a company can begin where the pain is and grow company-wide later — all on one database, so every module reads the same numbers rather than its own copy."] },
      { label: "Solution", heading: "The modules a business actually runs on.", body: ["HR and payroll, accounting and finance, inventory and stock, sales and purchase, and production — with role-based access per branch and a management dashboard that rolls up live."] },
      { label: "Result", heading: "One system instead of separate files.", body: ["Departments work in the same place, and head office reads the same numbers as the floor without waiting for month end."] },
    ],
  },
  {
    slug: "sales-crm",
    name: "Sales CRM",
    year: "2025",
    industry: "Sales",
    services: "CRM · Web platform",
    tagline: "Every lead, call and deal recorded — performance measured, not estimated.",
    sections: [
      { label: "Overview", heading: "From first contact to closed deal.", body: ["Lead capture, sales pipeline, follow-up reminders and customer communication in one place, with a dashboard that shows how the team is actually performing."] },
      { label: "Challenge", heading: "Leads lived wherever they landed.", body: ["They arrived by form, phone and WhatsApp and stayed with whoever took them. Follow-ups depended on memory, and nobody could say what the pipeline was really worth."] },
      { label: "Strategy", heading: "One place, and the system does the remembering.", body: ["Every lead enters the same pipeline, and follow-ups are scheduled by the system rather than relied on from memory."] },
      { label: "Solution", heading: "Pipeline, follow-ups, dashboard.", body: ["Lead capture and assignment, a stage-by-stage pipeline, follow-up reminders, a full communication history per customer, and a sales dashboard by person and stage."] },
      { label: "Result", heading: "A pipeline the whole team works from.", body: ["Deals move through recorded stages, and performance is visible in the dashboard instead of estimated in a meeting."] },
    ],
  },
  {
    slug: "n8n-flows",
    name: "n8n Flows",
    year: "2025",
    industry: "Automation",
    services: "n8n · Self-hosted",
    tagline: "The manual glue between your tools, automated.",
    sections: [
      { label: "Overview", heading: "Systems that talk to each other.", body: ["Self-hosted n8n workflows connecting forms, CRM, email, WhatsApp and spreadsheets, so leads, invoices and notifications move between tools without anyone copying them across."] },
      { label: "Challenge", heading: "Copy, paste, repeat.", body: ["The same data was re-typed between a website form, the CRM, an invoice, an email and a spreadsheet — slow work, and wrong often enough to cost real money."] },
      { label: "Strategy", heading: "Automate the glue, keep the tools.", body: ["Nothing gets replaced; the gaps between systems get closed. Self-hosting n8n keeps the workflows and the data with the business rather than on someone else's platform."] },
      { label: "Solution", heading: "Workflows for the paths data actually takes.", body: ["New leads routed and assigned, invoices and reminders sent on schedule, records kept in sync across tools, and alerts raised the moment a run fails instead of silently."] },
      { label: "Result", heading: "People handle exceptions, not copying.", body: ["Routine hand-offs run on their own, and staff step in only where judgement is genuinely needed."] },
    ],
  },
  {
    slug: "enterprise-crm",
    name: "Enterprise CRM",
    year: "2025",
    industry: "Enterprise",
    services: "CRM · Multi-branch",
    tagline: "One customer record, shared across every branch.",
    sections: [
      { label: "Overview", heading: "Customers, support and marketing in one platform.", body: ["Customer management, support tickets, marketing automation and communication across every branch, with role-based access and reporting that rolls up to head office."] },
      { label: "Challenge", heading: "The same customer, three times over.", body: ["Each branch kept its own list, so one customer existed in several places with several histories. Support requests fell between branches, and head office had no consolidated view of any of it."] },
      { label: "Strategy", heading: "Shared record, scoped access.", body: ["One customer record for the whole company, with permissions that let a branch work on its own customers while head office sees the full picture."] },
      { label: "Solution", heading: "Branch floor to head office.", body: ["Customer management, a support ticket queue, marketing automation, full communication history, and reporting that aggregates branch by branch."] },
      { label: "Result", heading: "A consistent view of every customer.", body: ["Branches and head office work from the same record, and support and reporting live in the same system rather than in separate tools."] },
    ],
  },
  {
    slug: "agentic-ai",
    name: "Agentic AI",
    year: "2025",
    industry: "AI",
    services: "AI agents · Integrations",
    tagline: "Agents that plan, use your systems, and wait for approval.",
    sections: [
      { label: "Overview", heading: "Autonomous agents for routine business work.", body: ["AI agents that plan and carry out multi-step work across your systems — reading requests, querying ERP and CRM data, drafting replies and updating records, with a human approval step before anything goes out."] },
      { label: "Challenge", heading: "The work that fixed automation can't reach.", body: ["Chasing overdue invoices, answering the same request in a slightly different form, updating records after a call: multi-step, varied each time, and exactly where rule-based workflows stop being able to help."] },
      { label: "Strategy", heading: "Let it plan. Keep a person on the send button.", body: ["Agents decide the sequence and use the systems that hold the answer, but nothing leaves the business without someone approving it — which is what makes them safe to point at real customers."] },
      { label: "Solution", heading: "Tools, approval, audit trail.", body: ["Agents with access to ERP and CRM data, email and messaging; an approval queue in front of anything outbound; and a log of every step taken, so each action can be traced after the fact."] },
      { label: "Result", heading: "Drafted, not assembled.", body: ["Routine follow-ups arrive ready to review, and staff spend their time approving and correcting rather than gathering and typing."] },
    ],
  },
];

export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);
