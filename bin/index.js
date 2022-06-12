#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const prettier_1 = __importDefault(require("prettier"));
console.log("Hello from component-cli");
function convertVName(name) {
    const componentName = name
        .split("-")
        .map((item) => item[0].toUpperCase() + item.substring(1))
        .join("");
    return componentName;
}
function createInterfaceFields(fields) {
    return fields.map((field, id) => `${id > 0 ? "\n" : ""}${field.slug}?: string;`);
}
function createPropDefaultValues(fields) {
    return fields.map((field, id) => `${id > 0 ? "\n" : ""}${field.slug} = "${field.defaultValue}"${id !== fields.length ? "," : ""}`);
}
function htmlToJSX(html, fields) {
    let jsx = html.replaceAll("class=", "className=");
    fields.forEach((field) => {
        if (jsx.includes(`v-html="${field.slug}`)) {
            jsx = jsx.replace(`v-html="${field.slug}">`, ">{subtitle}");
        }
        console.log(jsx);
    });
    return jsx;
}
function generateComponent(componentData) {
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
    return prettier_1.default.format(component);
}
function write(component, componentName) {
    fs_1.default.writeFile(`components/${componentName}.tsx`, component, function (err) {
        if (err)
            throw err;
        console.log("Created component at: " + `components/${componentName}.tsx`);
    });
}
try {
    // Open the JSON file. This will be replaced by an API request...
    const rawdata = fs_1.default.readFileSync("src/sample.json");
    // Convert the JSON data into a VersolyComponent object
    const versolyComponent = JSON.parse(rawdata.toString());
    // Show everything from the the JSON object
    // console.log(versolyComponent.id);
    // console.log(versolyComponent.name);
    // console.log(versolyComponent.text.HTML);
    // console.log(versolyComponent.created);
    // console.log(versolyComponent.updated);
    // versolyComponent.fields.forEach((field) => {
    //   console.log(`Logging details about ${field.name} field...`);
    //   console.log(field.slug);
    //   console.log(field.name);
    //   console.log(field.type);
    //   console.log(field.editable);
    //   console.log(field.required);
    //   console.log(field.defaultValue);
    // });
    // Create the component string
    let component = generateComponent(versolyComponent);
    // Temporarily removing lines that cause issues with TypeScript due to JSX rules...
    component = component.replace('href="#click"', '//href="#click"'); // Remove href as it is in a button and causes TS issues
    component = component.replace("style=", "//style="); // Comment out style as it needs to be converted to JSX
    // Write it to a .tsx file
    write(component, convertVName(versolyComponent.name));
}
catch (error) {
    console.log(error);
}
