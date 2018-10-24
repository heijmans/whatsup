const path = require("path");
const PrettierPlugin = require("prettier-webpack-plugin");

let config = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "tslint-loader",
          options: {
            typeCheck: true,
          },
        },
        enforce: "pre",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$|\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new PrettierPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  watchOptions: {
    ignored: ["dist", "node_modules"],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config = Object.assign({}, config, {
      devServer: {
        contentBase: "public",
        historyApiFallback: true,
        overlay: {
          warnings: true,
          errors: true,
        },
        port: 3000,
        proxy: {
          '/api': 'http://localhost:4000'
        },
      },
      devtool: "cheap-module-eval-source-map",
    });
  } else {
    config = Object.assign({}, config, {
      devtool: "nosources-source-map",
    });
  }
  return config;
};
