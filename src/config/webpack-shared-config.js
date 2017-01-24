// Webpack configuration that is shared between the client and tests
import path from "path";
import process from "process";
import { GLUESTICK_ADDON_DIR_REGEX } from "./vars";

const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const getWebpackAdditions = require("../lib/getWebpackAdditions").default;
const { additionalAliases } = getWebpackAdditions();

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require("../config/webpack-isomorphic-tools-config"))
.development(process.env.NODE_ENV !== "production");

const ExtractCSSPlugin = new ExtractTextPlugin("[name]-[chunkhash].css")

module.exports = {
  resolve: {
    extensions: [".js", ".css", ".json"],
    alias: {
      "assets": path.join(process.cwd(), "assets"),
      "actions": path.join(process.cwd(), "src", "actions"),
      "components": path.join(process.cwd(), "src", "components"),
      "containers": path.join(process.cwd(), "src", "containers"),
      "reducers": path.join(process.cwd(), "src", "reducers"),
      "config": path.join(process.cwd(), "src", "config"),
      ...additionalAliases
    }
  },
  rules: [
    {
      test: /\.js$/,
      loader: "babel-loader",
      options: {
        plugins: [
          "transform-decorators-legacy"
        ],
        presets: [
          "react",
          "es2015",
          "stage-0"
        ]
      },
      include: [
        path.join(process.cwd(), "Index.js"),
        path.join(process.cwd(), "src"),
        path.join(process.cwd(), "test"),
        GLUESTICK_ADDON_DIR_REGEX
      ]
    },
    {
      test: webpackIsomorphicToolsPlugin.regular_expression("images"),
      loaders: [
        "file-loader?name=[name]-[hash].[ext]",
        "image-webpack-loader"
      ]
    },
    {
      test: webpackIsomorphicToolsPlugin.regular_expression("fonts"),
      loader: "file-loader?name=[name]-[hash].[ext]"
    },
    {
      test: webpackIsomorphicToolsPlugin.regular_expression("styles"),
      use:
        isProduction ?
        ExtractCSSPlugin.extract({
          fallbackLoader: "style-loader",
          loader: [
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ],
        }) : [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
    },
  ],
  plugins: [
    ExtractCSSPlugin,
    new OptimizeCSSAssetsPlugin()
  ],
};
