export interface ProjectFlowStep {
  label: string;
}

export interface Project {
  id: string;
  name: string;
  stack: string;
  kit: "portal-jobs" | "portal-map" | "portal-ai" | "portal-shop" | "portal-turf" | "portal-finance" | "portal-os" | "portal-hr";
  category: string;
  icon: string;
  description: string;
  flow: ProjectFlowStep[];
  accent: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: "bulkapply",
    name: "BulkApply",
    stack: "Laravel + React.js + MySQL",
    kit: "portal-jobs",
    category: "Job Platform",
    icon: "briefcase",
    accent: "#4fd1ff",
    description:
      "Full-stack platform for applying to multiple vacancies through a single workflow with automated email scheduling and real-time application tracking.",
    flow: [
      { label: "Job Listings" },
      { label: "Multi-select" },
      { label: "REST API" },
      { label: "Queue" },
      { label: "Scheduler" },
      { label: "Email" },
      { label: "Tracking" },
    ],
    url: "#",
  },
  {
    id: "restofinder",
    name: "RestoFinder",
    stack: "Laravel + Geolocation API + MySQL",
    kit: "portal-map",
    category: "Location Platform",
    icon: "map",
    accent: "#7ef7c4",
    description:
      "Location-aware restaurant discovery with live distance calculation, ratings, and menu browsing.",
    flow: [
      { label: "Location Pin" },
      { label: "Geolocation API" },
      { label: "Distance Calc" },
      { label: "Discovery" },
      { label: "Ratings" },
      { label: "Menu" },
    ],
    url: "#",
  },
  {
    id: "intq",
    name: "IntQ",
    stack: "Laravel + AI + MySQL",
    kit: "portal-ai",
    category: "AI Tool",
    icon: "ai",
    accent: "#c39bff",
    description:
      "AI-powered interview preparation — parses a resume, extracts skills, and generates personalized interview questions.",
    flow: [
      { label: "Resume Upload" },
      { label: "Parsing" },
      { label: "Skill Extraction" },
      { label: "AI Processing" },
      { label: "Questions" },
      { label: "Preparation" },
    ],
    url: "#",
  },
  {
    id: "shopit",
    name: "WordPress Shop It",
    stack: "WordPress + WooCommerce",
    kit: "portal-shop",
    category: "E-Commerce",
    icon: "shop",
    accent: "#ffb37e",
    description: "A complete e-commerce storefront — from product catalog to checkout to live deployment.",
    flow: [
      { label: "Products" },
      { label: "Cart" },
      { label: "Checkout" },
      { label: "Payment Gateway" },
      { label: "Order" },
      { label: "Hosting & DNS" },
      { label: "Deploy" },
    ],
    url: "#",
  },
  {
    id: "turf",
    name: "Turf Booking",
    stack: "PHP + JavaScript + MySQL",
    kit: "portal-turf",
    category: "Booking System",
    icon: "turf",
    accent: "#6fe07a",
    description: "Real-time turf availability and slot booking with instant confirmation and database-backed scheduling.",
    flow: [
      { label: "Turf Listing" },
      { label: "Availability" },
      { label: "Slot Booking" },
      { label: "Confirmation" },
      { label: "Database" },
    ],
    url: "#",
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    stack: "Laravel + React.js + MySQL",
    kit: "portal-finance",
    category: "Finance Tracker",
    icon: "finance",
    accent: "#ffd166",
    description:
      "Full-stack personal finance app for tracking income, expenses, transfers, accounts, budgets, bills, debts, and subscriptions — with a dashboard that breaks down daily and monthly spending at a glance.",
    flow: [
      { label: "Accounts" },
      { label: "Transactions" },
      { label: "Categories" },
      { label: "Budget" },
      { label: "Bills & Debts" },
      { label: "Dashboard" },
    ],
    url: "#",
  },
  {
    id: "lifeos",
    name: "LifeOS",
    stack: "Laravel + React.js + MySQL",
    kit: "portal-os",
    category: "Productivity Suite",
    icon: "os",
    accent: "#ff7eb6",
    description:
      "A personal Life Operating System — a centralized command center for tasks, goals, calendar, bills, subscriptions, expenses, habits, learning, and journaling, built incrementally module by module.",
    flow: [
      { label: "Auth & Onboarding" },
      { label: "Tasks" },
      { label: "Calendar" },
      { label: "Bills & Payments" },
      { label: "Dashboard" },
    ],
    url: "#",
  },
  {
    id: "worksphere",
    name: "WorkSphere",
    stack: "Laravel + Next.js + MySQL",
    kit: "portal-hr",
    category: "HR SaaS",
    icon: "hr",
    accent: "#5b7fff",
    description:
      "Multi-tenant HR SaaS platform with per-company tenant isolation and an internal app marketplace for enabling HR modules — employee directory, org chart, attendance, leave, recruitment, payroll, and more, deployed on Docker Swarm.",
    flow: [
      { label: "Multi-Tenant Auth" },
      { label: "App Marketplace" },
      { label: "Employees" },
      { label: "Org Chart" },
      { label: "HR Modules" },
      { label: "Analytics" },
    ],
    url: "#",
  },
];
