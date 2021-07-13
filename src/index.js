const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { last, get, upperFirst } = require("lodash");
const config = require("./config.js");

// 从yapi获取接口信息数据
function getApiDataFromYapi(_id, token, server) {
  const url = `${server}/api/interface/get?id=${_id}&token=${token}`;
  return axios.get(url);
}

// 生成 typescript 类型声明
function genTypeDefinition(typeName, req_query) {
  const queryTypes = req_query.map((x) => (x.required === "1" ? `${x.name}: any; // ${x.desc}` : `${x.name}?: any; // ${x.desc}`));
  const typeDefinition = `type ${typeName} = {\n\t${queryTypes.join("\n\t")}\n}\n`;
  return typeDefinition;
}

// 生成接口相关信息
function genApiComment({ project_id, _id, server, title, username }) {
  const titleComment = `// ${title}`;
  const linkComment = `// ${server}/project/${project_id}/interface/api/${_id}`;
  const authorNameComment = `// 接口对接人: ${username}`;
  return `${titleComment}\n${linkComment}\n${authorNameComment}\n`;
}

// 生成接口函数
function genApi({ functionName, typeName, prefix, apiPath, method }) {
  const firstLine = `export async function ${functionName}(query: ${typeName}) {`;
  const secondLine = `  return await request(\`${prefix}${apiPath}\`, \"${method}\", query);`;
  const thirdLine = `}`;
  return `${firstLine}\n${secondLine}\n${thirdLine}\n`;
}

async function genCode(project_id, _id) {
  const { projectConfig, outputDir, outputFile, server } = config;
  const { token, prefix } = projectConfig[project_id];

  const apiData = await getApiDataFromYapi(_id, token, server);
  const { data, errcode, errmsg } = get(apiData, "data", {});

  if (errcode === 0) {
    const { path: apiPath, method, title, req_query, username } = data;
    const globalCode = `import { request } from 'services';\n\n`;
    const commentCode = genApiComment({ project_id, _id, server, title, username });
    const functionName = `_${last(apiPath.split("/"))}`;
    const typeName = `I${upperFirst(last(apiPath.split("/")))}`;
    const typeDefinitionCode = genTypeDefinition(typeName, req_query);
    const functionCode = genApi({ functionName, typeName, prefix, apiPath, method });
    const fileContent = `${globalCode}${commentCode}${typeDefinitionCode}${functionCode}`;

    const fileName = `${outputDir}/${outputFile}`;
    const baseSrc = path.resolve(__dirname);
    fs.mkdirSync(path.join(baseSrc, outputDir), { recursive: true });
    fs.writeFileSync(path.join(baseSrc, fileName), fileContent);
  } else {
    console.log(`Error: ${errmsg}`);
  }
}

module.exports = function cli() {
  inquirer.prompt([{ name: "yapiUrl" }]).then((answers) => {
    const { yapiUrl } = answers;
    const arr = yapiUrl.split("/");
    const _id = arr[7];
    const project_id = arr[4];
    genCode(project_id, _id);
  });
};
