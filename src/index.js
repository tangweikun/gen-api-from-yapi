const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { get } = require("lodash");
const { SERVER, OUTPUT_DIR, PROJECT_CONFIG } = require("./config.js");
const { logSuccess, logError, logInfo, logWarn } = require("./log");
const genTemplate = require("./templates/tpl1");
const genTemplate2 = require("./templates/tpl2");

// 从yapi获取接口信息数据
function getApiDataFromYapi(_id, token) {
  const url = `${SERVER}/api/interface/get?id=${_id}&token=${token}`;
  return axios.get(url);
}

// 将生成内容写入文件
function createFileAndWriteContent({ fileContent, fileName }) {
  const folderPath = path.join(process.cwd(), OUTPUT_DIR);
  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(path.join(folderPath, fileName), fileContent);
  logSuccess(`文件路径：${path.join(folderPath, fileName)}`);
}

// 生成文件内容
async function genContent(project_id, _id) {
  const { token, prefix } = get(PROJECT_CONFIG, project_id, {});
  const apiData = await getApiDataFromYapi(_id, token);
  const { data, errcode, errmsg } = get(apiData, "data", {});

  if (errcode === 0) {
    return [genTemplate({ data, project_id, _id, prefix }), genTemplate2({ data, project_id, _id, prefix })];
  }

  logWarn(errmsg, "获取接口数据失败");
}

async function genCode(project_id, _id) {
  logInfo("正在生成接口代码...");
  const fileContents = await genContent(project_id, _id);
  if (fileContents) {
    fileContents.forEach((content) => {
      createFileAndWriteContent(content);
    });

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
