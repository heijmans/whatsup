import yaml from "js-yaml";
import fs from "fs";

const schema = yaml.safeLoad(fs.readFileSync("src/swagger.yaml", "utf8"));
console.log(schema);
