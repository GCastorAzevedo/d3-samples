const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const histograms = {
  entries: fs
    .readdirSync("./src/samples/histograms")
    .reduce((entries, fileDirectory) => {
      return {
        ...entries,
        [`histograms/${fileDirectory}`]: `./src/samples/histograms/${fileDirectory}/index.js`,
      };
    }, {}),
  plugins: fs.readdirSync("./src/samples/histograms").map((fileDirectory) => {
    const filename = `./src/samples/histograms/${fileDirectory}/locals.js`;
    const locals = fs.existsSync(filename)
      ? require(filename)
      : {
          title: fileDirectory,
        };
    return new HtmlWebpackPlugin({
      template: `./public/views/samples/index.pug`,
      filename: `./histograms/${fileDirectory}/index.html`,
      chunks: [`histograms/${fileDirectory}`],
      locals: {
        ...locals,
        mode: "development",
        sample: fileDirectory,
      },
    });
  }),
};

const plots = {
  entries: fs
    .readdirSync("./src/samples/plots")
    .reduce((entries, fileDirectory) => {
      return {
        ...entries,
        [`plots/${fileDirectory}`]: `./src/samples/plots/${fileDirectory}/index.js`,
      };
    }, {}),
  plugins: fs.readdirSync("./src/samples/plots").map((fileDirectory) => {
    const filename = `./src/samples/plots/${fileDirectory}/locals.js`;
    const locals = fs.existsSync(filename)
      ? require(filename)
      : {
          title: fileDirectory,
        };
    return new HtmlWebpackPlugin({
      template: `./public/views/samples/index.pug`,
      filename: `./plots/${fileDirectory}/index.html`,
      chunks: [`plots/${fileDirectory}`],
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
      ...plots.entries,
      ...histograms.entries,
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
    plugins: [
      ...histograms.plugins,
      ...plots.plugins,
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
  {
    mode: "development",
    devtool: "source-map",
    entry: {
      main: "./src/samples/plots/densityPlots/index.js",
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
        filename: path.resolve(__dirname, "index.html"),
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
