const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { last, get, upperFirst } = require("lodash");
const { SERVER, OUTPUT_DIR, OUTPUT_FILE, PROJECT_CONFIG } = require("./config.js");
const { logSuccess, logError, logInfo, logWarn } = require("./log");

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
  fs.mkdirSync(path.join(process.cwd(), OUTPUT_DIR), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), fileName), fileContent);
  logSuccess(`文件路径：${path.join(process.cwd(), fileName)}`);
}

// 生成文件内容
async function genContent(project_id, _id) {
  const { token, prefix } = get(PROJECT_CONFIG, project_id, {});
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

    return `${globalCode}${commentCode}${typeDefinitionCode}${functionCode}`;
  }

  logWarn(errmsg, "获取接口数据失败");
}

async function genCode(project_id, _id) {
  logInfo("正在生成接口代码...");
  const fileContent = await genContent(project_id, _id);
  if (fileContent) {
    createFileAndWriteContent(fileContent);
    logSuccess("生成成功");
  } else {
    logError("生成失败");
  }
}

module.exports = function cli() {
  logInfo("请输入yapi文档URL，按回车确定");
  inquirer.prompt([{ name: "yapiUrl" }]).then((answers) => {
    const { yapiUrl } = answers;
    const arr = yapiUrl.split("/");
    const _id = arr[7];
    const project_id = arr[4];
    genCode(project_id, _id);
  });
};
