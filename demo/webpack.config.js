const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new CleanWebpackPlugin("build")],
  output: {
    filename: "index_combined.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "/")
  },
  devServer: {
    headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  },
    compress: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    contentBase: "./",
    publicPath: "/",
    port: 8082,
    https: false,
  }
};
