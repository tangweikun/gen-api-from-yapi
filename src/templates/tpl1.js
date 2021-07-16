const { last, upperFirst } = require("lodash");
const { SERVER } = require("../config.js");
const genComment = require("./genComment");

function genTemplate({ data, project_id, _id, prefix }) {
  const { path: apiPath, method, title, req_query, username } = data;
  const globalCode = `import { request } from 'services';\n\n`;
  const commentCode = genComment({ project_id, _id, server: SERVER, title, username });
  const functionName = `_${last(apiPath.split("/"))}`;
  const typeName = `I${upperFirst(last(apiPath.split("/")))}`;
  const typeDefinitionCode = genTypeDefinition(typeName, req_query);
  const functionCode = genApi({ functionName, typeName, prefix, apiPath, method });

  return { fileContent: `${globalCode}${commentCode}${typeDefinitionCode}${functionCode}`, fileName: "tpl1.ts" };
}

// 生成 typescript 类型声明
function genTypeDefinition(typeName, req_query) {
  const queryTypes = req_query.map((x) => (x.required === "1" ? `${x.name}: any; // ${x.desc}` : `${x.name}?: any; // ${x.desc}`));
  const typeDefinition = `type ${typeName} = {\n\t${queryTypes.join("\n\t")}\n}\n`;
  return typeDefinition;
}

// 生成接口函数
function genApi({ functionName, typeName, prefix, apiPath, method }) {
  const firstLine = `export async function ${functionName}(query: ${typeName}) {`;
  const secondLine = `  return request(\`${prefix}${apiPath}\`, \"${method}\", query);`;
  const thirdLine = `}`;
  return `${firstLine}\n${secondLine}\n${thirdLine}\n`;
}

module.exports = genTemplate;
