export const storyDelimiter = "-";
export const storyEncodeDelimiter = "$";

// BUT preserving delimiters --
const wordSeparators =
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^_`{|}~]+/;

/**
 * @param {string} str
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {string} str
 * @returns {{name: string; levels: string[]}}
 */
export const storyIdToMeta = (str) => {
  const parts = str
    .split(`${storyDelimiter}${storyDelimiter}`)
    .map((level) => capitalize(level.replace(/-/g, " ")));
  return {
    name: /** @type {string} */ (parts.pop()),
    levels: parts,
  };
};

/**
 * @param {string} str
 */
export const kebabCase = (str) => {
  return str
    .replace(
      /[A-Z\u00C0-\u00D6\u00D9-\u00DD]+(?![a-z])|[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g,
      ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
    )
    .replace(/\s-/g, "-")
    .trim()
    .split(wordSeparators)
    .join("-");
};

/**
 * @param {string} title
 */
export const titleToFileId = (title) =>
  title
    .toLocaleLowerCase()
    .replace(/\s*\/\s*/g, `${storyDelimiter}${storyDelimiter}`)
    .replace(/\s+/g, storyDelimiter);

/**
 * @param {string} filename
 */
export const getFileId = (filename) => {
  const pathParts = filename.split("/");
  return pathParts[pathParts.length - 1].split(".")[0];
};

/**
 * @param {string} fileId
 * @param {string} namedExport
 * @param {string} packageName
 */
export const getEncodedStoryName = (fileId, namedExport, packageName) => {
  return `${packageName}${storyEncodeDelimiter}${storyEncodeDelimiter}${storyEncodeDelimiter}${fileId}${storyEncodeDelimiter}${storyEncodeDelimiter}${namedExport}`
    .toLocaleLowerCase()
    .replace(new RegExp(storyDelimiter, "g"), storyEncodeDelimiter);
};

/**
 * @param {string} story
 */
export const getPackageNameFromStory = (story) => {
  if (!story) return "";
  return story.split("/")[1] || "";
};

/**
 * Removes the "/packages/{packageName}" segment from the end of the given path, if present.
 *
 * @param {string} originalPath - The original file path.
 * @returns {string} The path with the "/packages/{packageName}" segment removed.
 *
 * @example
 * // returns "/Path/to/repo-name"
 * removePackageSegment("/Path/to/repo-name/packages/ui");
 */
export const removePackageSegment = (originalPath) => {
  return originalPath.replace(/\/packages\/[^/]+$/, "");
};
