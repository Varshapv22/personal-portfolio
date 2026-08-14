export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
  accent: string;
}

export const skillCategories: SkillCategory[] = [
  { id: "backend", title: "Backend", items: ["PHP", "Laravel", "REST APIs", "MVC", "OOP"], accent: "#4fd1ff" },
  { id: "frontend", title: "Frontend", items: ["JavaScript", "React", "HTML5", "CSS3", "Bootstrap"], accent: "#7ef7c4" },
  { id: "database", title: "Database", items: ["MySQL", "SQL", "Database Optimization"], accent: "#ffb37e" },
  { id: "ecommerce", title: "E-Commerce", items: ["WordPress", "WooCommerce", "Payment Gateway Integration"], accent: "#ff8a8a" },
  { id: "tools", title: "Tools", items: ["Git", "Hostinger", "Namecheap", "AI-assisted Development"], accent: "#c39bff" },
  { id: "ai", title: "AI", items: ["GitHub Copilot", "Claude", "ChatGPT", "Prompt Engineering", "AI Code Review", "AI Debugging"], accent: "#ffe27e" },
];
