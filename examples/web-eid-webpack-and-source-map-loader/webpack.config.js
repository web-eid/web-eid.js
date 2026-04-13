import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: "./src/index.js",
  devtool: "eval-source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    port: 8080,
    static: {
      directory: path.resolve(__dirname, "dist"),
      watch: true,
    },
    devMiddleware: {
      publicPath: "/",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Web eID demo - Webpack",
      chunks: ["main"],
      inject: "body",
      scriptLoading: "defer",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
};
