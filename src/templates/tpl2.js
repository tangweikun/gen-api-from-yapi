const { last, upperFirst } = require("lodash");
const { SERVER } = require("../config.js");
const genComment = require("./genComment");

function genTemplate2({ data, project_id, _id, prefix }) {
  const { path: apiPath, method, title, username } = data;
  const globalCode = `import { request } from 'services';\n\n`;
  const commentCode = genComment({ project_id, _id, server: SERVER, title, username });
  const functionName = `_${last(apiPath.split("/"))}`;
  const typeName = `I${upperFirst(last(apiPath.split("/")))}`;
  const functionCode = genApi({ functionName, typeName, prefix, apiPath, method });

  return { fileContent: `${globalCode}${commentCode}${functionCode}`, fileName: "tpl2.js" };
}

// 生成接口函数
function genApi({ functionName, prefix, apiPath, method }) {
  const firstLine = `export async function ${functionName}(query) {`;
  const secondLine = `  return request(\`${prefix}${apiPath}\`, \"${method}\", query);`;
  const thirdLine = `}`;
  return `${firstLine}\n${secondLine}\n${thirdLine}\n`;
}

module.exports = genTemplate2;
