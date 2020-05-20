const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const samples = {
  entries: fs
    .readdirSync("./src/components")
    .reduce((entries, fileDirectory) => {
      return {
        ...entries,
        [fileDirectory]: `./src/components/${fileDirectory}/index.js`,
      };
    }, {}),
  plugins: fs.readdirSync("./src/components").map((fileDirectory) => {
    const filename = `./src/components/${fileDirectory}/locals.js`;
    const locals = fs.existsSync(filename)
      ? require(filename)
      : {
          title: fileDirectory,
        };
    return new HtmlWebpackPlugin({
      template: `./src/components/${fileDirectory}/index.pug`,
      filename: `./${fileDirectory}/index.html`,
      chunks: [fileDirectory],
      locals: {
        ...locals,
        mode: "development",
        sample: fileDirectory,
      },
    });
  }),
};

module.exports = [
  {
    mode: "development",
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
    },
    entry: {
      ...samples.entries,
    },
    output: {
      path: path.resolve(__dirname, "dist", "development"),
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
    plugins: [
      ...samples.plugins,
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
  {
    mode: "development",
    devtool: "source-map",
    entry: {
      main: "./src/components/densityPlots/index.js",
    },
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
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
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/views/index.pug"),
        filename: path.resolve(__dirname, "index.dev.html"),
        chunks: ["main"],
        locals: {
          mode: "development",
        },
      }),
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
];
