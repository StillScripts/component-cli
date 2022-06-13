#!/usr/bin/env node

import fs from "fs";
import prettier from "prettier";
import { VersolyComponent, VersolyComponentField } from "./types";

/**
 * Convert the v-name of a component into a capitalised JSX component name.
 * For example: "v-header" -> "VHeader"
 * @param {string} name - The v-name of the component. For example: "v-header"
 * @returns {string}
 */
function convertVName(name: string): string {
  const componentName = name
    .split("-")
    .map((item) => item[0].toUpperCase() + item.substring(1))
    .join("");
  return componentName;
}

/**
 * Create the body of the props interface for the component.
 * @param {VersolyComponentField[]} fields - The custom fields associated with a component
 * @returns {string}
 */
function createInterfaceFields(fields: VersolyComponentField[]): string {
  return fields
    .map((field, id) => `${id > 0 ? "\n" : ""}${field.slug}?: string;`)
    .join();
}

/**
 * Create the body of the destructured props in the component
 * @param {VersolyComponentField[]} fields - The custom fields (props) associated with a component
 * @returns {string}
 */
function createPropDefaultValues(fields: VersolyComponentField[]): string {
  return fields
    .map(
      (field, id) =>
        `${id > 0 ? "\n" : ""}${field.slug} = "${field.defaultValue}"${
          id !== fields.length ? "," : ""
        }`
    )
    .join();
}

/**
 * Convert HTML into JSX for the component
 * @param {string} html - The HTML string returned by the API (text.HTML)
 * @param {VersolyComponentField[]} fields - The custom fields (props) associated with a component
 * @returns {string}
 */
function htmlToJSX(html: string, fields: VersolyComponentField[]): string {
  let jsx = html.replaceAll("class=", "className=");
  fields.forEach((field) => {
    // Convert the v-html tag into a variable.
    if (jsx.includes(`v-html="${field.slug}`)) {
      jsx = jsx.replace(`v-html="${field.slug}">`, ">{subtitle}");
    }
  });
  return jsx;
}

// Disregard for now.

function getKids(node: ChildNode, memo: ChildNode[]) {
  if (node.hasChildNodes()) {
    const kids = node.childNodes; // Each child should be added to array
    memo = [...memo, ...kids]; // Add each child to the existing memo array
    // Each child should also be tested for children
    kids.forEach((grandChild) => {
      memo = getKids(grandChild, memo); // Get grandkids
      const htmlKid = grandChild as HTMLElement;
      if (htmlKid.innerText && htmlKid.innerText.trim().length > 0) {
        console.log(htmlKid.innerText);
        // We need to create a string props variable...s
      }
    });
    return memo;
  } else {
    return memo;
  }
}

function getEachNode(node: ChildNode, nodes: ChildNode[]): ChildNode[] {
  let currentNode = node; // Initialise currentNode value
  if (currentNode.hasChildNodes()) {
    node.childNodes.forEach((child) => {
      // Get each child of the current element that is 1 layer deep (<ul><li>1</li><li>2</li></ul> -> 2 li elements)
      currentNode = child;
      if (currentNode.hasChildNodes()) {
        // Get each child
      }
      // Nodes gets each child in the current iteration and stores them recursively
      nodes.push(child); // Add this child
    });
  }
  return nodes;
}

// function htmlToCustomJSX(
//   html: string,
//   fields: VersolyComponentField[]
// ): string {
//const jsx = html.replaceAll("class=", "className=");
// This is complex. Replace everything within a html tag with a variable
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");
//   const bod: HTMLBodyElement = doc.body;
//   bod.childNodes.forEach(child=>{
//     child.childNodes.forEach((i)=>{
//       console.log(d)
//     })
//   })
//   console.log(bod.children);
//   return jsx;
// }

/**
 * Create a file for a component
 * @param {string} content - The contents of the .tsx file containing the component
 * @param {string} componentName - The name of the .tsx file
 */
function writeComponent(content: string, componentName: string) {
  fs.writeFile(`components/${componentName}.tsx`, content, function (err) {
    if (err) throw err;
    console.log("Created component at: " + `components/${componentName}.tsx`);
  });
}

/**
 * Take the JSON data from the API and convert it into a string which will be used as
 * the content in a .tsx file for that component.
 * @param {VersolyComponent} componentData - The data parsed from the API for a component
 * @returns {string}
 */
function generateComponentContent(componentData: VersolyComponent): string {
  const { name, fields, text } = componentData;
  // Get a capilised component name. For example: v-header -> VHeader
  const componentName = convertVName(name);
  // Create the component as a string containing all the necessary .tsx file content
  const component = `interface ${componentName}Props {
  ${createInterfaceFields(fields)}
}

export default function ${componentName}({
  ${createPropDefaultValues(fields)}
}: ${componentName}Props) {
  return (
${htmlToJSX(text.HTML, fields)}
  );
}`;
  return prettier.format(component);
}

try {
  // Open the JSON file. This will be replaced by an API request...
  const rawdata = fs.readFileSync("src/sample.json");

  // Convert the JSON data into a VersolyComponent object
  const versolyComponent: VersolyComponent = JSON.parse(rawdata.toString());

  // Create the component string
  let content = generateComponentContent(versolyComponent);
  // Removing lines that cause issues with TypeScript due to JSX rules...
  content = content.replace('href="#click"', '//href="#click"'); // Remove href as it is in a button and causes TS issues
  content = content.replace("style=", "//style="); // Comment out style as it needs to be converted to JSX

  // Write the component to a .tsx file
  const componentName = convertVName(versolyComponent.name);
  writeComponent(content, componentName);

  // Create an index.tsx file to use for exporting all components
  // *Note - (For multiple components this would need an array and a loop to create an export for each component)
  writeComponent(
    prettier.format(
      `export { default as ${componentName} } from "./${componentName}";`
    ),
    "index"
  );
} catch (error) {
  console.log(error);
}
