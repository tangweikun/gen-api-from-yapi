const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { last, get, upperFirst } = require("lodash");
const { SERVER, OUTPUT_DIR, OUTPUT_FILE, PROJECT_CONFIG } = require("./config.js");

// 从yapi获取接口信息数据
function getApiDataFromYapi(_id, token) {
  const url = `${SERVER}/api/interface/get?id=${_id}&token=${token}`;
  return axios.get(url);
}

// 生成 typescript 类型声明
function genTypeDefinition(typeName, req_query) {
  const queryTypes = req_query.map((x) => (x.required === "1" ? `${x.name}: any; // ${x.desc}` : `${x.name}?: any; // ${x.desc}`));
  const typeDefinition = `type ${typeName} = {\n\t${queryTypes.join("\n\t")}\n}\n`;
  return typeDefinition;
}

// 生成接口相关信息
function genApiComment({ project_id, _id, title, username }) {
  const titleComment = `// ${title}`;
  const linkComment = `// ${SERVER}/project/${project_id}/interface/api/${_id}`;
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

// 将生成内容写入文件
function createFileAndWriteContent(fileContent) {
  const fileName = `${OUTPUT_DIR}/${OUTPUT_FILE}`;
  console.log("文件路径：" + path.join(process.cwd(), OUTPUT_DIR));
  fs.mkdirSync(path.join(process.cwd(), OUTPUT_DIR), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), fileName), fileContent);
}

async function genContent(project_id, _id) {
  const { token, prefix } = PROJECT_CONFIG[project_id];

  const apiData = await getApiDataFromYapi(_id, token);
  const { data, errcode, errmsg } = get(apiData, "data", {});

  if (errcode === 0) {
    const { path: apiPath, method, title, req_query, username } = data;
    const globalCode = `import { request } from 'services';\n\n`;
    const commentCode = genApiComment({ project_id, _id, SERVER, title, username });
    const functionName = `_${last(apiPath.split("/"))}`;
    const typeName = `I${upperFirst(last(apiPath.split("/")))}`;
    const typeDefinitionCode = genTypeDefinition(typeName, req_query);
    const functionCode = genApi({ functionName, typeName, prefix, apiPath, method });
    const fileContent = `${globalCode}${commentCode}${typeDefinitionCode}${functionCode}`;

    return fileContent;
  }

  console.log(`Error: ${errmsg}`);
}

async function genCode(project_id, _id) {
  const fileContent = await genContent(project_id, _id);
  createFileAndWriteContent(fileContent);
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
