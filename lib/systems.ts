// Single source of truth for positioning content — the four practices and the
// systems we build. Shared by the homepage, /services and /work, which
// previously each held their own drifting copy of a nine-item service menu.
//
// Copy rules live in .claude/skills/company-context/SKILL.md. The short version:
// we are an AI Systems Studio, capability is four practices and never a flat
// menu, no prices and no delivery-day promises anywhere, and no number appears
// unless it is attributable to a named engagement.

/** Heroicons-style 24x24 outline path, rendered by whichever component needs it. */
type IconPath = string;

export interface Practice {
  id: string;
  number: string;
  name: string;
  /** One line. What the system does, mechanically. */
  promise: string;
  description: string;
  capabilities: string[];
  iconPath: IconPath;
}

export const PRACTICES: Practice[] = [
  {
    id: "voice",
    number: "01",
    name: "Voice",
    promise: "Agents that answer the phone and make the call.",
    description:
      "An AI agent picks up every inbound call and places the outbound one the moment a lead arrives. It qualifies, books, and follows up — then writes the transcript and outcome back to your CRM. English, Hindi, Hinglish, and regional languages.",
    capabilities: [
      "Inbound calls answered 24/7",
      "Outbound within a minute of a lead",
      "Budget, timeline and intent captured",
      "Appointments booked into the calendar",
      "Every call transcribed and scored",
      "Handoff to a human when it matters",
    ],
    iconPath:
      "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  },
  {
    id: "messaging",
    number: "02",
    name: "Messaging",
    promise: "WhatsApp that keeps working after the call ends.",
    description:
      "Agents on the official Meta Cloud API — not a widget bolted to a website. They nurture leads between calls, answer support questions, send reminders, and bring dormant and no-show leads back into conversation.",
    capabilities: [
      "Official Meta Cloud API",
      "Nurture between touchpoints",
      "Reminders and no-show recovery",
      "Dormant-lead reactivation",
      "Support conversations handled",
      "Threads logged against the lead",
    ],
    iconPath:
      "M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
  },
  {
    id: "automation",
    number: "03",
    name: "Automation",
    promise: "The repeated work, done without anyone driving it.",
    description:
      "We map the process your team actually runs, then build the parts that never needed a person — research, extraction, reporting, routing, publishing. Approval gates stay wherever judgement belongs.",
    capabilities: [
      "Research and data extraction",
      "Scheduled reporting",
      "Lead routing and enrichment",
      "Content and publishing pipelines",
      "Multi-step workflow orchestration",
      "Human approval gates by design",
    ],
    iconPath:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    id: "software",
    number: "04",
    name: "Software",
    promise: "The system needs somewhere to live. We build that too.",
    description:
      "Dashboards, CRMs, lead pipelines, integrations and internal tools — built so the owner can see what the agents did without asking anyone. Every client we run a system for gets a portal of their own.",
    capabilities: [
      "Client-facing operations dashboards",
      "Custom CRMs and lead pipelines",
      "CRM and third-party integrations",
      "Internal tools and admin surfaces",
      "Product and platform builds",
      "Data pipelines and reporting",
    ],
    iconPath:
      "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];

/**
 * `production`  — live for a named client. Only these may carry client outcome numbers.
 * `blueprint`   — a system design we build for that vertical. Described, never
 *                 dressed up as delivered client work: no client, no outcomes.
 * `in-house`    — a product we built and run for ourselves.
 * `in-progress` — a product being built. Says so plainly; claims nothing shipped.
 */
export type SystemStatus = "production" | "blueprint" | "in-house" | "in-progress";

export const STATUS_LABEL: Record<SystemStatus, string> = {
  production: "In production",
  blueprint: "System we build",
  "in-house": "Built in-house",
  "in-progress": "In development",
};

export interface SystemEntry {
  id: string;
  name: string;
  vertical: string;
  status: SystemStatus;
  /** Named only where the client has approved it. */
  client: string | null;
  /** One line, mechanical. Reads on the card without opening anything. */
  headline: string;
  /** What is bleeding today, before anything is built. */
  leak: string;
  whatItDoes: string;
  howItRuns: string[];
  /** What the owner sees on the dashboard once it is live. */
  measured: string[];
  /** Attributable results. Present on `production` entries only. */
  outcomes?: string[];
  practices: string[];
  stack: string[];
}

export const SYSTEMS: SystemEntry[] = [
  {
    id: "furniture-speed-to-lead",
    name: "Speed-to-Lead System",
    vertical: "Multi-location furniture retail",
    status: "production",
    client: "Krishna Furniture",
    headline:
      "Every inbound lead called, qualified and booked onto a showroom visit — including the ones that arrive at midnight.",
    leak: "Around ₹2L a month in ad spend bringing in 30–40 leads a day, worked by hand by a five-to-six person desk. High-ticket furniture buyers shortlist three or four brands the same day, so leads that waited hours had already been won by someone faster.",
    whatItDoes:
      "A two-part agent system with a portal on top. A voice agent answers inbound calls and calls every new lead as it arrives; a WhatsApp agent works the ones who are not ready yet. Everything both agents do is written back to a dashboard the owner can open at any time.",
    howItRuns: [
      "Inbound calls answered and qualified in real time — no hold, no IVR",
      "Outbound agent fires on every new lead and captures budget, timeline and product interest",
      "Showroom visits booked straight into the calendar",
      "WhatsApp agent works dormant and no-show leads back into conversation",
      "Every call transcribed, scored and written to the CRM automatically",
      "Walk-ins matched back to the calls that produced them",
    ],
    measured: [
      "Calls handled, answered and missed",
      "Contact rate and time to first contact",
      "Showroom visits booked and attended",
      "Walk-in conversion traced back to source",
    ],
    outcomes: [
      "500+ calls handled per month",
      "6 showroom visits booked in the first month",
      "Dormant leads — already written off — brought back into conversation",
      "24/7 coverage with zero missed calls",
    ],
    practices: ["Voice", "Messaging", "Software"],
    stack: [
      "Inbound + outbound voice agent",
      "WhatsApp on Meta Cloud API",
      "CRM logging",
      "Live client dashboard",
    ],
  },
  {
    id: "site-visit-engine",
    name: "Site-Visit Engine",
    vertical: "Real estate developers",
    status: "blueprint",
    client: null,
    headline:
      "Portal leads sorted from brokers, called while they are still looking, and booked onto a site visit.",
    leak: "Portal and ad leads arrive in bulk, and most of them are not buyers. By the time the sales desk has separated brokers from real prospects, the serious ones have already walked two competing projects. Nobody can say which project or which portal produced the visit that closed.",
    whatItDoes:
      "A voice agent calls every lead as it lands, establishes budget band, configuration, possession timeline and whether the caller is a broker, then books qualified buyers directly onto the site-visit calendar for the right project. A WhatsApp agent carries the visit — directions on the morning, reschedules without a phone call, and a second slot for anyone who does not turn up.",
    howItRuns: [
      "Every portal, ad and website lead called on arrival, not on a callback list",
      "Budget band, configuration and possession timeline captured on the first call",
      "Brokers identified and routed away from the buyer pipeline",
      "Site visits booked per project, into the project's own calendar",
      "WhatsApp sends location and directions on the morning of the visit",
      "No-shows re-engaged and rebooked without a person chasing them",
    ],
    measured: [
      "Leads by project and by source",
      "Broker versus direct-buyer split",
      "Site visits booked and attended per project",
      "Cost per attended visit, by portal",
    ],
    practices: ["Voice", "Messaging", "Software"],
    stack: [
      "Outbound voice agent",
      "WhatsApp on Meta Cloud API",
      "Per-project routing",
      "Source attribution dashboard",
    ],
  },
  {
    id: "front-desk-system",
    name: "Front-Desk System",
    vertical: "Aesthetic, dental & hair clinics",
    status: "blueprint",
    client: null,
    headline:
      "The calls the front desk cannot take — during a procedure, at lunch, after closing — answered and booked.",
    leak: "The desk is with a patient, so the phone rings out. That caller does not leave a voicemail; they call the clinic down the road that picked up. Nobody in the practice ever sees the enquiry that was lost.",
    whatItDoes:
      "An inbound agent answers whenever the desk cannot, handles the standard questions about procedures, preparation, timings and location, and books consultations straight into the practice calendar. A WhatsApp agent sends preparation instructions before the appointment and runs the recall list afterwards.",
    howItRuns: [
      "Answers on overflow, at lunch, and outside clinic hours",
      "Handles routine questions on procedures, preparation and timings",
      "Consultations booked directly into the practice calendar",
      "Preparation instructions sent on WhatsApp before the appointment",
      "Recall and follow-up cycles run without the desk remembering",
      "Anything clinical handed straight to a human",
    ],
    measured: [
      "Calls answered against calls missed",
      "Bookings taken outside clinic hours",
      "Consultation show rate",
      "Recalls converted back into appointments",
    ],
    practices: ["Voice", "Messaging"],
    stack: [
      "Inbound voice agent",
      "WhatsApp on Meta Cloud API",
      "Practice calendar integration",
      "Recall automation",
    ],
  },
  {
    id: "support-desk-system",
    name: "Support Desk System",
    vertical: "D2C, e-commerce & service businesses",
    status: "blueprint",
    client: null,
    headline:
      "Order status, returns and the same forty questions — answered on WhatsApp before anyone opens a ticket.",
    leak: "A support inbox where most of the volume is the same handful of questions, each one answered by a person, one at a time. The genuinely difficult cases queue up behind the routine ones, and the customer waiting on a real problem waits longest.",
    whatItDoes:
      "A WhatsApp agent fronts the support queue. It answers the routine questions from your own policies and order data, resolves what it can inside the conversation, and opens a ticket the moment it cannot — escalating to a human with the whole thread already attached. A voice agent takes the calls the desk is too busy to reach.",
    howItRuns: [
      "Routine questions answered from your own policies and order data",
      "Order status and tracking resolved inside the conversation",
      "Tickets opened automatically when the agent cannot resolve it",
      "Escalated to a human with the full thread attached, not a summary",
      "Calls answered when the desk is at capacity or closed",
      "Every conversation logged against the customer record",
    ],
    measured: [
      "Share of conversations closed without a human",
      "First-response time, in and out of hours",
      "Tickets opened, escalated and closed",
      "Repeat contacts on the same issue",
    ],
    practices: ["Messaging", "Voice", "Software"],
    stack: [
      "WhatsApp on Meta Cloud API",
      "Inbound voice agent",
      "Ticketing and escalation routing",
      "Support dashboard",
    ],
  },
  {
    id: "agent-console",
    name: "Agent Console",
    vertical: "Multi-tenant operations portal",
    status: "in-house",
    client: null,
    headline:
      "The portal every system we run reports into — one login per client, nothing to ask anyone for.",
    leak: "Owners were emailing their agency to find out what happened to leads they had already paid for. The data existed the whole time; nobody outside the build team could see it without asking.",
    whatItDoes:
      "A tenant-scoped portal that sits on top of whatever agents we have deployed for a client. Calls with transcripts and outcomes, the lead pipeline and its statuses, WhatsApp threads, support tickets, the follow-up queue and walk-in conversion — each client seeing only their own, updating as it happens.",
    howItRuns: [
      "One login per client, scoped to that client's data and nothing else",
      "Every call listed with its transcript, outcome and score",
      "Lead pipeline with status, retry count and next scheduled call",
      "WhatsApp conversations threaded against the lead they belong to",
      "Support tickets and the follow-up queue in the same place",
      "Walk-ins reconciled against the calls that produced them",
      "CSV import for existing lists and campaign uploads",
    ],
    measured: [
      "Calls handled, answered and missed",
      "Lead status across the whole pipeline",
      "Conversations and follow-ups still outstanding",
      "Visit and walk-in conversion, by source",
    ],
    outcomes: [
      "Live today behind every system we run",
      "Replaces the weekly report request entirely",
      "A new client is a new tenant, not a new build",
    ],
    practices: ["Software"],
    stack: ["Next.js", "Supabase", "Realtime updates", "Per-tenant access control"],
  },
  {
    id: "lead-recovery",
    name: "Lead Recovery",
    vertical: "Dormant database reactivation",
    status: "in-progress",
    client: null,
    headline:
      "Point it at a CRM full of leads everyone stopped calling, and it works the backlog.",
    leak: "Every database we open has thousands of leads marked lost that were never actually decided. They went quiet, the desk moved on to this month's leads, and nobody ever had the hours to go back through them.",
    whatItDoes:
      "A product that takes an existing lead database, segments it by how cold it is and why it stalled, then works the backlog on voice and WhatsApp at a pace the sales desk can actually absorb — handing back only the ones that re-engage.",
    howItRuns: [
      "Existing database imported and de-duplicated against the live pipeline",
      "Segmented by age, stall reason and last recorded intent",
      "Worked in controlled batches rather than all at once",
      "Only genuinely re-engaged leads handed back to the sales desk",
      "Do-not-contact records suppressed permanently, checked before every touch",
    ],
    measured: [
      "Reactivation rate by segment",
      "Conversations reopened from the backlog",
      "Meetings booked from leads already written off",
      "Cost per reopened conversation",
    ],
    outcomes: [
      "In development",
      "Built out of the reactivation logic already running in production",
      "Not yet open to pilots",
    ],
    practices: ["Voice", "Messaging", "Automation"],
    stack: ["Voice agent", "WhatsApp on Meta Cloud API", "Segmentation engine", "Suppression list"],
  },
  {
    id: "organic-growth-system",
    name: "Organic Growth System",
    vertical: "Built for ourselves · pilots opening",
    status: "in-house",
    client: null,
    headline: "The SEO and content engine we got tired of rebuilding by hand.",
    leak: "The same bottleneck kept appearing across engagements — organic growth work that stalls the moment it depends on a full-time team to keep it moving. Done manually, it stops the first week someone is busy.",
    whatItDoes:
      "A product that runs the loop itself: topic clusters mapped to real search intent, technical audits with prioritised fixes, scheduled distribution, and continuous rank tracking in one dashboard.",
    howItRuns: [
      "Topic clusters generated against real search intent",
      "Automated technical audits with prioritised, actionable fixes",
      "Distribution scheduled across owned channels",
      "Self-serve dashboard — no in-house SEO team needed to run it",
      "Rankings and traffic tracked continuously, not in one-off reports",
    ],
    measured: [
      "Pages published against plan",
      "Technical issues opened and closed",
      "Keyword movement, tracked weekly",
      "Organic sessions by cluster",
    ],
    outcomes: [
      "Running live on our own content and search footprint",
      "The publishing and audit loop runs without manual scheduling",
      "Opening to early pilot customers now",
    ],
    practices: ["Automation", "Software"],
    stack: ["Next.js", "LLM pipelines", "SEO automation", "Rank tracking"],
  },
];

export const PRODUCTION_SYSTEMS = SYSTEMS.filter((s) => s.status === "production");
export const BLUEPRINT_SYSTEMS = SYSTEMS.filter((s) => s.status === "blueprint");
/** Our own products, shipped or being built. */
export const PRODUCT_SYSTEMS = SYSTEMS.filter(
  (s) => s.status === "in-house" || s.status === "in-progress"
);
/** What we build for clients — the homepage showcase and the /services assemblies. */
export const CLIENT_SYSTEMS = SYSTEMS.filter(
  (s) => s.status === "production" || s.status === "blueprint"
);

/** Verticals we actively build for, in priority order. */
export const VERTICALS = [
  "Furniture & home retail",
  "Interiors & modular kitchens",
  "Aesthetic, dental & hair clinics",
  "Real estate developers",
  "Financial services",
  "Trades & home services",
];
