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
];

export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);
