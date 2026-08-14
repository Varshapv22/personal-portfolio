export interface ProjectFlowStep {
  label: string;
}

export interface Project {
  id: string;
  name: string;
  stack: string;
  kit: "portal-jobs" | "portal-map" | "portal-ai" | "portal-shop" | "portal-turf";
  description: string;
  flow: ProjectFlowStep[];
  accent: string;
}

export const projects: Project[] = [
  {
    id: "bulkapply",
    name: "BulkApply",
    stack: "Laravel + React.js + MySQL",
    kit: "portal-jobs",
    accent: "#4fd1ff",
    description:
      "Full-stack platform for applying to multiple vacancies through a single workflow with automated email scheduling and real-time application tracking.",
    flow: [
      { label: "Job Listings" },
      { label: "Multi-select Applications" },
      { label: "REST API" },
      { label: "Queue" },
      { label: "Scheduler" },
      { label: "Email" },
      { label: "Application Tracking" },
    ],
  },
  {
    id: "restofinder",
    name: "RestoFinder",
    stack: "Laravel + Geolocation API + MySQL",
    kit: "portal-map",
    accent: "#7ef7c4",
    description:
      "Location-aware restaurant discovery with live distance calculation, ratings, and menu browsing.",
    flow: [
      { label: "Location Pin" },
      { label: "API" },
      { label: "Distance Calculation" },
      { label: "Restaurant Discovery" },
      { label: "Ratings" },
      { label: "Menu" },
    ],
  },
  {
    id: "intq",
    name: "IntQ",
    stack: "Laravel + AI + MySQL",
    kit: "portal-ai",
    accent: "#c39bff",
    description:
      "AI-powered interview preparation — parses a resume, extracts skills, and generates personalized interview questions.",
    flow: [
      { label: "Resume" },
      { label: "Resume Parsing" },
      { label: "Skill Extraction" },
      { label: "AI Processing" },
      { label: "Personalized Questions" },
      { label: "Candidate Preparation" },
    ],
  },
  {
    id: "shopit",
    name: "WordPress Shop It",
    stack: "WordPress + WooCommerce",
    kit: "portal-shop",
    accent: "#ffb37e",
    description: "A complete e-commerce storefront — from catalog to checkout to deployment.",
    flow: [
      { label: "Products" },
      { label: "Cart" },
      { label: "Checkout" },
      { label: "Payment Gateway" },
      { label: "Order" },
      { label: "Hosting & DNS" },
      { label: "Deployment" },
    ],
  },
  {
    id: "turf",
    name: "Turf Booking Application",
    stack: "PHP + JavaScript + MySQL",
    kit: "portal-turf",
    accent: "#6fe07a",
    description: "Real-time turf availability and booking with instant confirmation.",
    flow: [
      { label: "Turf" },
      { label: "Availability" },
      { label: "Booking" },
      { label: "Confirmation" },
      { label: "Database" },
    ],
  },
];
