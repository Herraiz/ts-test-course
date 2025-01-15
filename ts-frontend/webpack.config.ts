import { Configuration } from "webpack";
import { resolve } from "path";

const config: Configuration = {
  entry: "./src/Launcher.ts",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // maybe you need to add .tsx here, because some extension can use react or something
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist"),
  },
};

export default config;
