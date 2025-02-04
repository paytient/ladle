import fs from "fs";
import path from "path";
import debugFactory from "debug";
import { traverse } from "../babel.js";
import { sanitizeAndPascalCase } from "../utils.js";
import getAst from "../get-ast.js";
import cleanupWindowsPath from "./cleanup-windows-path.js";

const debug = debugFactory("ladle:vite");

/**
 * @param {string} namedExport
 * @param {string} sourceCode
 * @param {string} filename
 */
const checkIfNamedExportExists = (namedExport, sourceCode, filename) => {
  let exists = false;
  const ast = getAst(sourceCode, filename);
  traverse(ast, {
    /**
     * @param {any} astPath
     */
    ExportNamedDeclaration: (astPath) => {
      if (astPath.node.declaration.declarations[0].id.name === namedExport) {
        exists = true;
      }
    },
  });
  return exists;
};

/**
 * @param {string} originalPath
 * @param {packageName} packageName
 */
const updatePath = (originalPath, packageName) => {
  return originalPath.replace(/(\/\.ladle)/, `/packages/${packageName}$1`);
};

/**
 * @param {string} configFolder
 * @param config {import("../../../shared/types.js").Config}
 */
const generateExports = (configFolder, config) => {
  let exports = [];
  config.addons.packages.state.options.forEach((pkg) => {
    const pkgPath = updatePath(configFolder, pkg);

    const componentsPaths = [
      path.join(pkgPath, "components.tsx"),
      path.join(pkgPath, "components.ts"),
      path.join(pkgPath, "components.jsx"),
      path.join(pkgPath, "components.js"),
    ];
    const firstFoundComponentsPath = componentsPaths.find((componentsPath) =>
      fs.existsSync(componentsPath),
    );

    if (!firstFoundComponentsPath) {
      debug(`Custom components.{tsx,ts,jsx,js} not found for ${pkg} package.`);
      return;
    }

    const sourceCode = fs.readFileSync(firstFoundComponentsPath, "utf8");
    const filename = path.basename(firstFoundComponentsPath);
    console.log("firstFoundComponentsPath; ", firstFoundComponentsPath);

    firstFoundComponentsPath && debug(`${pkgPath}/${filename} found.`);

    const isProvider = checkIfNamedExportExists(
      "Provider",
      sourceCode,
      filename,
    );
    const isStorySourceHeader = checkIfNamedExportExists(
      "StorySourceHeader",
      sourceCode,
      filename,
    );
    const isArgs = checkIfNamedExportExists("args", sourceCode, filename);
    const isArgTypes = checkIfNamedExportExists(
      "argTypes",
      sourceCode,
      filename,
    );

    let output = "";
    const componentsPath = cleanupWindowsPath(path.join(pkgPath, filename));

    if (isProvider) {
      debug(`Custom Provider found.`);
      output += `export { Provider as ${sanitizeAndPascalCase(pkg)}Provider } from '${componentsPath}';\n`;
    }

    if (isStorySourceHeader) {
      debug(`Custom StorySourceHeader found.`);
      output += `export { StorySourceHeader as ${sanitizeAndPascalCase(pkg)}StorySourceHeader } from '${componentsPath}';\n`;
    }

    if (isArgs) {
      debug(`Global args found.`);
      output += `export { args as ${sanitizeAndPascalCase(pkg)}args } from '${componentsPath}';\n`;
    }

    if (isArgTypes) {
      debug(`Global argTypes found.`);
      output += `export { argTypes as ${sanitizeAndPascalCase(pkg)}argTypes } from '${componentsPath}';\n`;
    }

    if (output) {
      exports.push(output);
    }
  });

  return exports;
};

/**
 * @param {string} configFolder
 * @param config {import("../../../shared/types.js").Config}
 */
const getComponents = (configFolder, config) => {
  let defaultProvider = `export const Provider = ({children}) => /*#__PURE__*/createElement(Fragment, null, children);\n`;
  let defaultStorySourceHeader = `export const StorySourceHeader = ({ path }) => /*#__PURE__*/createElement('div', { style: { paddingTop: "2em" }}, /*#__PURE__*/createElement('code', { className: "ladle-code" }, path));\n`;
  let defaultArgs = `export const args = {};\n`;
  let defaultArgTypes = `export const argTypes = {};\n`;
  let output = "";

  if (config.packages) {
    const exports = generateExports(configFolder, config);
    const defaultExports = `${defaultProvider}${defaultStorySourceHeader}${defaultArgs}${defaultArgTypes}`;
    output += exports.join("\n");
    output += defaultExports;
    console.log("output: ", output);

    return output;
  } else {
    const componentsPaths = [
      path.join(configFolder, "components.tsx"),
      path.join(configFolder, "components.ts"),
      path.join(configFolder, "components.jsx"),
      path.join(configFolder, "components.js"),
    ];
    const firstFoundComponentsPath = componentsPaths.find((componentsPath) =>
      fs.existsSync(componentsPath),
    );

    if (!firstFoundComponentsPath) {
      debug(`Custom components.{tsx,ts,jsx,js} not found.`);
      return `${defaultProvider}${defaultStorySourceHeader}${defaultArgs}${defaultArgTypes}`;
    }

    const sourceCode = fs.readFileSync(firstFoundComponentsPath, "utf8");
    const filename = path.basename(firstFoundComponentsPath);

    firstFoundComponentsPath && debug(`${configFolder}/${filename} found.`);

    const isProvider = checkIfNamedExportExists(
      "Provider",
      sourceCode,
      filename,
    );
    const isStorySourceHeader = checkIfNamedExportExists(
      "StorySourceHeader",
      sourceCode,
      filename,
    );
    const isArgs = checkIfNamedExportExists("args", sourceCode, filename);
    const isArgTypes = checkIfNamedExportExists(
      "argTypes",
      sourceCode,
      filename,
    );

    if (!isStorySourceHeader && !isProvider && !isArgs && !isArgTypes) {
      return `import '${cleanupWindowsPath(
        path.join(configFolder, filename),
      )}';\n${defaultProvider}${defaultStorySourceHeader}${defaultArgs}${defaultArgTypes}`;
    }
    const componentsPath = cleanupWindowsPath(
      path.join(configFolder, filename),
    );

    if (isProvider) {
      debug(`Custom Provider found.`);
      output += `export { Provider } from '${componentsPath}';\n`;
    } else {
      debug(`Custom Provider not found. Returning the default.`);
      output += defaultProvider;
    }

    if (isStorySourceHeader) {
      debug(`Custom StorySourceHeader found.`);
      output += `export { StorySourceHeader } from '${componentsPath}';\n`;
    } else {
      debug(`Custom StorySourceHeader not found. Returning the default.`);
      output += defaultStorySourceHeader;
    }

    if (isArgs) {
      debug(`Global args found.`);
      output += `export { args } from '${componentsPath}';\n`;
    } else {
      debug(`Global args not found.`);
      output += defaultArgs;
    }

    if (isArgTypes) {
      debug(`Global argTypes found.`);
      output += `export { argTypes } from '${componentsPath}';\n`;
    } else {
      debug(`Global argTypes not found.`);
      output += defaultArgTypes;
    }

    return output;
  }
};

export default getComponents;
