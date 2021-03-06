/*
TODO
extract prefix
basepath
*/

import fs from "fs";
import yaml from "js-yaml";
import {
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
const GEN_COMMENT = "// auto generated from openapi/swagger schema, do not edit\n\n";
const SERVICE_BASE = "/api";

const oao: OpenAPIObject = yaml.safeLoad(fs.readFileSync("src/swagger.yaml", "utf8"));
const customTypes = new Set<string>();

function write(path: string, content: string): void {
  path = `${GEN_ROOT}/${path}`;
  content = content.replace(/\n\n\n+/, "\n\n").replace(/\n+$/, "\n");
  const oldContent = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : undefined;
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
  if ("$ref" in o) {
    const parts = o.$ref.split("/");
    return parts[parts.length - 1];
  } else {
    const schema = o;
    const { type } = schema;
    if (type === "integer" || type === "number") {
      return "number";
    } else if (type === "string" || type === "boolean") {
      return type;
    } else if (type === "array") {
      const { items } = schema;
      return `${getType(items!)}[]`;
    } else {
      throw new Error("unknown type: " + type);
    }
  }
}

function makeInterface(name: string, schema: SchemaObject): string {
  const required = new Set<string>(schema.required || []);
  let res = `export interface ${name} {\n`;
  each(schema.properties!, (prop, propName) => {
    const qm = required.has(propName) ? "" : "?";
    res += `  ${propName}${qm}: ${getType(prop)};\n`;
  });
  res += `}\n\n`;
  customTypes.add(name);
  return res;
}

function makeTypeDef(name: string, schema: SchemaObject): string {
  customTypes.add(name);
  return `export type ${name} = ${getType(schema)};\n\n`;
}

function generateTypes(): void {
  let content = GEN_COMMENT;
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

function hasSecurity(operations: IOperationInfo[]): boolean {
  return !!operations.find((o) => !o.operation.security);
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
  const schema = content!["application/json"].schema!;
  return getType(schema);
}

function getBodyName(o: RequestBodyObject): string {
  const { content } = o;
  const schema = content["application/json"].schema!;
  if (schema.$ref) {
    let type = getType(schema);
    if (type.match(/^I[A-Z]/)) {
      type = type.substr(1);
    }
    return lcfirst(type);
  } else {
    return "body";
  }
}

function generateImports(operations: IOperationInfo[]): string {
  const hasSec = hasSecurity(operations);

  let content = `import express, { Router } from "express";\n`;
  if (hasSec) {
    content += 'import { getAuthorization } from "../lib/api-controller-helpers";\n';
  }

  const typeSet = new Set<string>();
  if (hasSec) {
    typeSet.add("IAuthorizationData");
  }
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
  const importTypes = types.filter((x) => customTypes.has(x));
  content += `import { ${importTypes.join(", ")} } from "./api-types";\n\n`;
  return content;
}

function generateServiceInterface(tag: string, operations: IOperationInfo[]): string {
  const service = `I${ucfirst(tag)}Service`;
  let content = `export interface ${service} {\n`;
  operations.forEach((operInfo) => {
    const { operation } = operInfo;
    const { operationId, parameters } = operation;
    const requestBody = operation.requestBody as RequestBodyObject;
    const paramTypes: string[] = [];
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        if (!parameter.required) {
          throw new Error("cannot handle optional parameters");
        }
        const type = getType(parameter.schema!);
        paramTypes.push(`${parameter.name}: ${type}`);
      });
    }
    if (requestBody) {
      if (!requestBody.required) {
        throw new Error("cannot handle optional request body");
      }
      const bodyName = getBodyName(requestBody);
      const bodyType = getContentType(requestBody);
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
  const jwtParam = hasSecurity(operations) ? ", jwtSecret: string" : "";
  let content = `export default function create${name}Controller(service: I${name}Service${jwtParam}): Router {\n`;
  content += `  const router = express.Router();\n\n`;
  operations.forEach((operInfo) => {
    const { method, path, operation } = operInfo;
    const { operationId, parameters } = operation;
    const requestBody = operation.requestBody as RequestBodyObject;
    const expressPath = path.replace(/\{(\w+)\}/, ":$1");
    content += `  router.${method.toLowerCase()}(${JSON.stringify(
      expressPath,
    )}, async (req, res) => {\n`;
    content += `    try {\n`;

    if (!operation.security) {
      content +=
        "      const authorization = getAuthorization<IAuthorizationData>(req, jwtSecret);\n";
      content += "      if (!authorization) {\n";
      content += '        res.status(403).send("forbidden");\n';
      content += "        return;\n";
      content += "      }\n";
    }

    const params: string[] = [];
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        const { name: paramName, in: paramIn, schema } = parameter;
        params.push(paramName);
        if (paramName === "authorization" && paramIn === "header") {
          return;
        }
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
      });
    }
    if (requestBody) {
      const bodyName = getBodyName(requestBody);
      const bodyType = getContentType(requestBody);
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
      content += `      res.json({ success: true });\n`;
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

function hasBody(operations: IOperationInfo[]): boolean {
  return !!operations.find((o) => !!o.operation.requestBody);
}

function generateServiceImports(operations: IOperationInfo[]): string {
  const hasSec = hasSecurity(operations);

  const names = ["checkResponse"];
  if (hasBody) {
    names.push("jsonBodyHeaders");
  }
  if (hasSec) {
    names.push("jwtHeaders");
  }
  let content = `import { ${names.join(", ")} } from "../lib/api-service-helpers";\n`;

  const typeSet = new Set<string>();
  operations.forEach((operInfo) => {
    const { operation } = operInfo;
    const { requestBody, parameters } = operation;
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        if (parameter.name === "authorization" && parameter.in === "header") {
          return;
        }
        typeSet.add(getType(parameter.schema!));
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
  const importTypes = types.filter((x) => customTypes.has(x));
  content += `import { ${importTypes.join(", ")} } from "./api-types";\n\n`;
  return content;
}

function generateServiceObject(tag: string, operations: IOperationInfo[]): string {
  const service = `${tag}Service`;
  let content = `const ${service} = {\n`;
  operations.forEach((operInfo) => {
    const { method, path, operation } = operInfo;
    const { operationId, parameters } = operation;
    const requestBody = operation.requestBody as RequestBodyObject;
    const hasSec = !operation.security;
    let url = `${SERVICE_BASE}${path}`;
    const paramTypes: string[] = [];
    if (hasSec) {
      paramTypes.push("token: string");
    }
    if (parameters) {
      parameters.forEach((x) => {
        const parameter = x as ParameterObject;
        const { name, in: paramIn, schema } = parameter;
        if (name === "authorization" && paramIn === "header") {
          return;
        }
        if (paramIn !== "path") {
          throw new Error("can only handle path parameters");
        }
        url = url.replace(`{${name}}`, `\${${name}}`);
        const type = getType(schema!);
        paramTypes.push(`${name}: ${type}`);
      });
    }
    if (requestBody) {
      const bodyName = getBodyName(requestBody);
      const bodyType = getContentType(requestBody);
      paramTypes.push(`${bodyName}: ${bodyType}`);
    }
    let resultType = "void";
    const okResponse = operation.responses && operation.responses["200"];
    if (okResponse && okResponse.content) {
      resultType = getContentType(okResponse);
    }
    content += `  async ${operationId}(${paramTypes.join(", ")}): Promise<${resultType}> {\n`;
    content += `    const response = await fetch(\`${url}\`, {\n`;
    if (requestBody) {
      content += `      body: JSON.stringify(${getBodyName(requestBody)}),\n`;
    }
    if (requestBody || hasSec) {
      const headers: string[] = [];
      if (requestBody) {
        headers.push("...jsonBodyHeaders()");
      }
      if (hasSec) {
        headers.push("...jwtHeaders(token)");
      }
      content += `      headers: { ${headers.join(", ")} },\n`;
    }
    content += `      method: ${JSON.stringify(method)},\n`;
    content += `    });\n`;
    content += `    checkResponse(response);\n`;
    if (resultType === "void") {
      content += `    await response.json();\n`;
    } else {
      content += `    return await response.json();\n`;
    }
    content += `  },\n\n`;
  });
  content += `};\n\n`;
  content += `export default ${service};\n\n`;
  return content;
}

function generateService(tag: string): void {
  let content = GEN_COMMENT;

  const operations = getOperationsByTag(tag);
  content += generateServiceImports(operations);
  content += generateServiceObject(tag, operations);

  write(`${tag}-service.ts`, content);
}

function generateServices(): void {
  oao.tags!.forEach((tag) => {
    generateService(tag.name);
  });
}

if (!fs.existsSync(GEN_ROOT)) {
  fs.mkdirSync(GEN_ROOT);
}
generateTypes();
generateControllers();
generateServices();
