const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/front-end/js/main.js", //내가 변경하고자 하는 파일
  mode: "development",
  plugins: [new MiniCssExtractPlugin({ filename: "css/style.css" })],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

/*
1. webpack의 rules 내부의 'test: /\.scss$/,' 코드에서 모든 scss파일들을 긁어온다

2. ' use: ["style-loader", "css-loader", "sass-loader"],' 코드에서 sass-loader -> css-loader -> style-loader 순으로 loader가 적용되어 긁어온 scss 파일들을 변환시킨다

2.1
sass-loader가 scss확장자 파일을 브라우저가 이해할 수 있는 css 파일로 변환시킨다
2.2
css-loader가 @import, url()등의 최신형 css 코드를 브라우저가 이해할 수 있는 코드로 변환시켜 동작할 수 있도록 한다
2.3
style-loader가 위 과정으로 변환시킨 css 코드를 DOM 내부에 적용시켜준다

4. 변환된 코드가 output에서 설정된 파일 경로에 설정된 파일명으로 저장된다

5. 저장된 변환 js 코드를 pug 파일에 적용시키기 위해 'script(src="/static/js/main.js")' 코드를 통해 긁어와 적용시킨다

MiniCssExtractPlugin
이 플러그인은 CSS를 별도의 파일로 추출합니다. 
CSS가 포함된 JS 파일별로 CSS 파일을 생성합니다. 
mini-css-extract-plugin을 css-loader와 결합하는 것이 좋습니다.
*/
