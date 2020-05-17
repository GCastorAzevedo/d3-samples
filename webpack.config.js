const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    entry: {
      poll: path.resolve(__dirname, "src", "samples", "poll", "index.js"),
      plots: path.resolve(__dirname, "src", "samples", "plots", "index.js"),
      mixtures: path.resolve(__dirname, "src/samples/mixtures/index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name]/bundle.js",
      library: "app",
      libraryTarget: "umd",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.pug$/,
          use: ["pug-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "templates", "index.html"),
        filename: path.resolve(__dirname, "dist", "poll", "index.html"),
        chunks: ["poll"],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "templates", "index.html"),
        filename: path.resolve(__dirname, "dist", "mixtures", "index.html"),
        chunks: ["mixtures"],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "templates", "index.html"),
        filename: path.resolve(__dirname, "dist", "plots", "index.html"),
        chunks: ["plots"],
      }),
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
];
