const axios = require("axios");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { last } = require("lodash");
const config = require("./yapi-gen.config.js");

const projectConfig = {
  183: {
    token: "8974c416a008eddacc9f29b535a743889df8f0891c30f2dea3b70a3c18084bdc",
    prefix: "/api/jp-train-noncore-svc",
    desc: "非核心服务",
  },
  193: {
    token: "6d69c4df0fb9eec01eb13e466fd2bd0bd374e5e8710d15156a2ff8a1494337c8",
    prefix: "/api/jp-train-core-svc",
    desc: "核心服务",
  },
  223: {
    token: "1b225b019664316d8b650107fc1f3a67450f153aa33bd94cf14890564ec50fb5",
    prefix: "/api/jp-train-statistic-svc",
    desc: "数据分析服务",
  },
  198: {
    token: "ad9f7820de433989542579323b53a7966d70e077367c223e6fc2aa4e468a434e",
    prefix: "/api/usercenter",
    desc: "用户中心",
  },
  188: {
    token: "04f0cf16cb29dea17067a80f33c6fc7e33d6126165e958b14e61f2753972e240",
    prefix: "/api/orderpay-service",
    desc: "对内-商品订单支付中心",
  },
  178: {
    token: "3a1dde2603c3aa581f76bf5928e0248c0a1432bfa1ebf957534b0ae636e2ef76",
    prefix: "/api/video-face",
    desc: "对内-视频人脸识别服务",
  },
  203: {
    token: "d0926ccacffd051ed72bd59b3646d0ce8a2114fe129146da9a3c444906b0b832",
    prefix: "/api/data-exchange",
    desc: "计时第三方服务",
  },
};

function getApiData(_id, token) {
  const url = `${config.server}/api/interface/get?id=${_id}&token=${token}`;

  return axios.get(url);
}

async function genCode({ apiUrl }) {
  const arr = apiUrl.split("/");
  const _id = arr[7];
  const project_id = arr[4];
  const { token, prefix } = projectConfig[project_id];

  const apiData = await getApiData(_id, token);
  const { data, errcode, errmsg } = apiData.data;
  const outputDir = `${config.outputDir}`;
  const fileName = `${config.outputDir}/${config.outputFile}`;
  const baseSrc = path.resolve(__dirname);

  fs.mkdirSync(path.join(baseSrc, outputDir), { recursive: true });

  if (errcode === 0) {
    const { path: urlPath, method, title, req_query, username } = data;
    const importRequest = `import { request } from 'services';`;
    const importContent = `${importRequest}\n`;

    const titleComment = `// ${title}`;
    const linkComment = `// ${config.server}/project/${project_id}/interface/api/${_id}`;
    const authorName = `// 接口对接人: ${username}`;
    const methodName = `_${last(urlPath.split("/"))}`;
    const queryArr = [];
    for (const key of req_query) {
      queryArr.push(`${key.name}: any`);
    }
    const query = `query: { ${queryArr.join("; ")} }`;

    const firstLine = `export async function ${methodName}(${query}) {`;
    const secondLine = `  return await request(\`${prefix}/v1/schBranchNetwork/getSchoolsByNetwork\`, ${method}, query);`;
    const thirdLine = `}`;
    const fileContent = `${importContent}\n${titleComment}\n${linkComment}\n${authorName}\n${firstLine}\n${secondLine}\n${thirdLine}\n`;

    fs.writeFileSync(path.join(baseSrc, fileName), fileContent);
  } else {
    console.log(`Error: ${errmsg}`);
  }
}

function foo() {
  inquirer.prompt([{ name: "apiUrl" }]).then((answers) => {
    const { apiUrl } = answers;
    genCode({ apiUrl });
  });
}

module.exports = foo;
