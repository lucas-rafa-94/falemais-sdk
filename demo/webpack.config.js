const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new CleanWebpackPlugin("build")],
  output: {
    filename: "index_combined.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "bin")
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: "./",
    publicPath: "/bin",
    https: true,
    port: 8082
  }
};
