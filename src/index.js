const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { last, get } = require("lodash");
const config = require("./config.js");

// 从yapi获取接口信息数据
function getApiDataFromYapi(_id, token, server) {
  const url = `${server}/api/interface/get?id=${_id}&token=${token}`;
  return axios.get(url);
}

async function genCode(project_id, _id) {
  const { projectConfig, outputDir, outputFile, server } = config;
  const { token, prefix } = projectConfig[project_id];

  const apiData = await getApiDataFromYapi(_id, token, server);
  const { data, errcode, errmsg } = get(apiData, "data", {});

  if (errcode === 0) {
    const fileName = `${outputDir}/${outputFile}`;
    const baseSrc = path.resolve(__dirname);
    fs.mkdirSync(path.join(baseSrc, outputDir), { recursive: true });

    const { path: apiPath, method, title, req_query, username } = data;
    const importContent = `import { request } from 'services';\n`;
    const titleComment = `// ${title}`;
    const linkComment = `// ${server}/project/${project_id}/interface/api/${_id}`;
    const authorNameComment = `// 接口对接人: ${username}`;
    const functionName = `_${last(apiPath.split("/"))}`;

    const queryTypes = req_query.map((x) =>
      x.required === "1" ? `${x.name}: any` : `${x.name}?: any`
    );
    const query = `query: { ${queryTypes.join("; ")} }`;

    const firstLine = `export async function ${functionName}(${query}) {`;
    const secondLine = `  return await request(\`${prefix}/v1/schBranchNetwork/getSchoolsByNetwork\`, \"${method}\", query);`;
    const thirdLine = `}`;
    const fileContent = `${importContent}\n${titleComment}\n${linkComment}\n${authorNameComment}\n${firstLine}\n${secondLine}\n${thirdLine}\n`;

    fs.writeFileSync(path.join(baseSrc, fileName), fileContent);
  } else {
    console.log(`Error: ${errmsg}`);
  }
}

module.exports = function cli() {
  inquirer.prompt([{ name: "apiUrl" }]).then((answers) => {
    const { apiUrl } = answers;
    const arr = apiUrl.split("/");
    const _id = arr[7];
    const project_id = arr[4];
    genCode(project_id, _id);
  });
};
