module.exports = {
  // 다른 설정들...
  module: {
    rules: [
      // 다른 로더들...
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [
          /node_modules\/parse5/, // parse5 모듈을 제외
        ],
      },
    ],
  },
};
