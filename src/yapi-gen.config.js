module.exports = {
  server: "http://192.168.192.132:3000",
  outputDir: "../output",
  outputFile: "foo.ts",
  projectConfig: {
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
  },
};
