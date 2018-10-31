/*
TODO
reduce function complexity
jwt token as param
required
*/

import fs from "fs";
import yaml from "js-yaml";
import {
  ContentObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
} from "openapi3-ts";

const GEN_ROOT = "src/api";
const GEN_COMMENT = "// auto generated, do not edit\n\n";

const oao: OpenAPIObject = yaml.safeLoad(fs.readFileSync("src/swagger.yaml", "utf8"));
const customTypes: string[] = [];

function write(path: string, content: string): void {
  path = `${GEN_ROOT}/${path}`;
  content = content.replace(/\n\n\n+/, "\n\n").replace(/\n+$/, "\n");
  const oldContent = fs.readFileSync(path, "utf8");
  if (content !== oldContent) {
    fs.writeFileSync(path, content);
  }
}

function ucfirst(s: string): string {
  return s[0].toUpperCase() + s.substr(1);
}

function lcfirst(s: string): string {
  return s[0].toLowerCase() + s.substr(1);
}

function each<V>(map: { [key: string]: V }, fn: (value: V, key: string) => void): void {
  Object.keys(map).forEach((key) => {
    const value = map[key];
    fn(value, key);
  });
}

function getType(o: SchemaObject | ReferenceObject): string {
  if (o.$ref) {
    const parts = (o.$ref as string).split("/");
    return parts[parts.length - 1];
  } else {
    const schema = o as SchemaObject;
    const { type } = schema;
    if (type === "integer" || type === "number") {
      return "number";
    } else if (type === "string" || type === "boolean") {
      return type;
    } else if (type === "array") {
      const { items } = schema;
      return `Array<${getType(items!)}>`;
    } else {
      throw new Error("unknown type: " + type);
    }
  }
}

function makeInterface(name: string, schema: SchemaObject): string {
  let res = `export interface ${name} {\n`;
  each(schema.properties!, (prop, propName) => {
    res += `  ${propName}: ${getType(prop)};\n`;
  });
  res += `}\n\n`;
  customTypes.push(name);
  return res;
}

function makeTypeDef(name: string, schema: SchemaObject): string {
  customTypes.push(name);
  return `export type ${name} = ${getType(schema)};\n\n`;
}

function generateTypes(): void {
  let content = GEN_COMMENT;
  content += "// tslint:disable: array-type interface-name\n\n";
  each(oao.components!.schemas!, (schema, schemaKey) => {
    const { type } = schema;
    if (type === "object") {
      content += makeInterface(schemaKey, schema);
    } else {
      content += makeTypeDef(schemaKey, schema);
    }
  });

  write("api-types.ts", content);
}

interface IOperationInfo {
  method: string;
  path: string;
  operation: OperationObject;
}

function operationHasTag(operation: OperationObject | undefined, tag: string): boolean {
  return !!operation && !!operation.tags && operation.tags.indexOf(tag) >= 0;
}

function getOperationsByTag(tag: string): IOperationInfo[] {
  const res: IOperationInfo[] = [];
  each(oao.paths, (pathObject: PathItemObject, path) => {
    if (operationHasTag(pathObject.get, tag)) {
      res.push({ method: "GET", path, operation: pathObject.get! });
    }
    if (operationHasTag(pathObject.post, tag)) {
      res.push({ method: "POST", path, operation: pathObject.post! });
    }
    if (operationHasTag(pathObject.put, tag)) {
      res.push({ method: "PUT", path, operation: pathObject.put! });
    }
    if (operationHasTag(pathObject.delete, tag)) {
      res.push({ method: "DELETE", path, operation: pathObject.delete! });
    }
  });
  return res;
}

function getContentType(o: RequestBodyObject | ResponseObject): string {
  const { content } = o;
  const schema = (content as ContentObject)["application/json"].schema!;
  return getType(schema);
}

function getBodyName(o: RequestBodyObject): string {
  const { content } = o;
  const schema = (content as ContentObject)["application/json"].schema!;
  if (schema.$ref) {
    return lcfirst(getType(schema));
  } else {
    return "body";
  }
}

function generateImports(operations: IOperationInfo[]): string {
  const typeSet = new Set<string>();
  operations.forEach((operInfo) => {
    const { operation } = operInfo;
    const { requestBody, parameters } = operation;
    if (parameters) {
      parameters.forEach((parameter) => {
        typeSet.add(getType((parameter as ParameterObject).schema!));
      });
    }
    if (requestBody) {
      typeSet.add(getContentType(requestBody as RequestBodyObject));
    }
    const okResponse = operation.responses && operation.responses["200"];
    if (okResponse && okResponse.content) {
      typeSet.add(getContentType(okResponse));
    }
  });
  const types = [...typeSet];
  types.sort();
  const importTypes = types.filter((x) => customTypes.indexOf(x) >= 0);
  return `import { ${importTypes.join(", ")} } from "./api-types";\n\n`;
}

function generateServiceInterface(tag: string, operations: IOperationInfo[]): string {
  const service = `I${ucfirst(tag)}Service`;
  let content = `export interface ${service} {\n`;
  operations.forEach((operInfo) => {
    const { operation } = operInfo;
    const { operationId, requestBody, parameters } = operation;
    const paramTypes: string[] = [];
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        const type = getType(parameter.schema!);
        paramTypes.push(`${parameter.name}: ${type}`);
      });
    }
    if (requestBody) {
      const bodyName = getBodyName(requestBody as RequestBodyObject);
      const bodyType = getContentType(requestBody as RequestBodyObject);
      paramTypes.push(`${bodyName}: ${bodyType}`);
    }
    let resultType = "void";
    const okResponse = operation.responses && operation.responses["200"];
    if (okResponse && okResponse.content) {
      resultType = getContentType(okResponse);
    }
    content += `  ${operationId}: (${paramTypes.join(", ")}) => Promise<${resultType}>;\n`;
  });
  content += `}\n\n`;
  return content;
}

function generateControllerFn(tag: string, operations: IOperationInfo[]): string {
  const name = ucfirst(tag);
  let content = `export function create${name}Controller(service: I${name}Service): Router {\n`;
  content += `  const router = express.Router();\n\n`;
  operations.forEach((operInfo) => {
    const { method, path, operation } = operInfo;
    const { operationId, requestBody, parameters } = operation;
    const expressPath = path.replace(/\{(\w+)\}/, ":$1");
    content += `  router.${method.toLowerCase()}(${JSON.stringify(
      expressPath,
    )}, async (req, res) => {\n`;
    content += `    try {\n`;

    const params: string[] = [];
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        const { name: paramName, in: paramIn, schema } = parameter;
        const type = (schema! as SchemaObject).type;
        const from =
          paramIn === "path"
            ? "params"
            : paramIn === "header"
              ? "headers"
              : paramIn === "query"
                ? "query"
                : undefined;
        if (!from) {
          throw new Error("unknown param in");
        }
        const paramExpr = `req.${from}.${paramName} as string`;
        if (type === "integer") {
          content += `      const ${paramName} = parseInt(${paramExpr}, 10);\n`;
        } else if (type === "string") {
          content += `      const ${paramName} = ${paramExpr};\n`;
        } else {
          throw new Error("param type must be integer or string");
        }
        params.push(paramName);
      });
    }
    if (requestBody) {
      const bodyName = getBodyName(requestBody as RequestBodyObject);
      const bodyType = getContentType(requestBody as RequestBodyObject);
      content += `      const ${bodyName} = req.body as ${bodyType};\n`;
      params.push(bodyName);
    }
    const call = `await service.${operationId}(${params.join(", ")})`;
    const okResponse = operation.responses && operation.responses["200"];
    if (okResponse && okResponse.content) {
      content += `      const result = ${call};\n`;
      content += `      res.json(result);\n`;
    } else {
      content += `      ${call};\n`;
    }

    content += `    } catch (e) {\n`;
    content += "      console.warn(e);\n";
    content += "      res.status(500).send(e.toString());\n";
    content += "    }\n";
    content += `  });\n\n`;
  });
  content += `  return router;\n`;
  content += `}\n\n`;
  return content;
}

function generateController(tag: string): void {
  let content = GEN_COMMENT;
  content += "// tslint:disable: array-type\n\n";
  content += `import express, { Router } from "express";\n`;

  const operations = getOperationsByTag(tag);
  content += generateImports(operations);
  content += generateServiceInterface(tag, operations);
  content += generateControllerFn(tag, operations);

  write(`${tag}-controller.ts`, content);
}

function generateControllers(): void {
  oao.tags!.forEach((tag) => {
    generateController(tag.name);
  });
}

function findOpenPaths(): void {
  const openSet = new Set<string>();
  const closeSet = new Set<string>();
  oao.tags!.forEach((tag) => {
    const operations = getOperationsByTag(tag.name);
    operations.forEach((operInfo) => {
      const { path, operation } = operInfo;
      const isOpen = !!operation.security && operation.security.length === 0;
      if (isOpen) {
        openSet.add(path);
      } else {
        closeSet.add(path);
      }
    });
  });

  const both = [...openSet].filter((p) => closeSet.has(p));
  if (both.length !== 0) {
    throw new Error("both open and closed: " + both.join(", "));
  }

  const paths = [...openSet];
  paths.sort();
  let content = GEN_COMMENT;
  content += `const openPaths = ${JSON.stringify(paths).replace(",", ", ")};\n`;
  content += `export default openPaths;\n`;
  write("api-open-paths.ts", content);
}

if (!fs.existsSync(GEN_ROOT)) {
  fs.mkdirSync(GEN_ROOT);
}
generateTypes();
generateControllers();
findOpenPaths();