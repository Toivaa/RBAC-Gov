const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
        pageSupervisor: "./src/pageSupervisor.js",
        index: "./src/index.js",
        pageOrganizationMaster: "./src/pageOrganizationMaster.js",
        pageUser: "./src/pageUser.js",
        organization3:"./src/organization3.js",
        organization1:"./src/organization1.js",
        organization2:"./src/organization2.js",
    },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, '/dist')
  },
  watch:true,
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/pageSupervisor.html", to: "pageSupervisor.html" }]),
    new CopyWebpackPlugin([{ from: "./src/pageUser.html", to: "pageUser.html" }]),
    new CopyWebpackPlugin([{ from: "./src/pageOrganizationMaster.html", to: "pageOrganizationMaster.html" }]),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/organization3.html", to: "organization3.html" }]),
    new CopyWebpackPlugin([{ from: "./src/organization1.html", to: "organization1.html" }]),
    new CopyWebpackPlugin([{ from: "./src/organization2.html", to: "organization2.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
