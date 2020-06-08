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
    headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  },
    compress: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    contentBase: "./",
    publicPath: "/bin",
    port: 443,
    https: {
        key: fs.readFileSync('/etc/letsencrypt/live/hubapi.falemaisvoip.com.br/privkey1.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/hubapi.falemaisvoip.com.br/cert1.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/hubapi.falemaisvoip.com.br/chain1.pem')
    }
  }
};
