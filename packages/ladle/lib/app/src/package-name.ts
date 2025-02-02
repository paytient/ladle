import { capitalize } from "./story-name";

export const packageToTitle = (s: string) => {
  if (!s) return "";
  const capitalized = capitalize(s);
  return `${capitalized} | `;
};
