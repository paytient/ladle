import { capitalize } from "./story-name";

export const packageToTitle = (s: string) => {
  if (!s) return "";
  const capitalized = capitalize(s);
  return `${capitalized} | `;
};

export const sanitizeAndPascalCase = (input: string) => {
  return input
    .replace(/[^a-zA-Z0-9\-_\s]/g, "") // Keep letters, numbers, hyphens, and underscores
    .split(/[-_\s]+/) // Split on hyphens, underscores, or spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
    .join(""); // Join into PascalCase
};
