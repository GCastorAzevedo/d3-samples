const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const histograms = {
  entries: ["poll", "simple", "threshold"].reduce((entries, fileDirectory) => {
    return {
      ...entries,
      [`histograms/${fileDirectory}`]: `./src/samples/histograms/${fileDirectory}/index.js`,
    };
  }, {}),
  plugins: ["poll", "simple", "threshold"].map((fileDirectory) => {
    return new HtmlWebpackPlugin({
      template: `./public/views/samples/index.pug`,
      filename: `./histograms/${fileDirectory}/index.html`,
      chunks: [`histograms/${fileDirectory}`],
    });
  }),
};

const plots = {
  entries: ["densityPlots", "gaussianMixture"].reduce(
    (entries, fileDirectory) => {
      return {
        ...entries,
        [`plots/${fileDirectory}`]: `./src/samples/plots/${fileDirectory}/index.js`,
      };
    },
    {}
  ),
  plugins: ["densityPlots", "gaussianMixture"].map((fileDirectory) => {
    return new HtmlWebpackPlugin({
      template: `./public/views/samples/index.pug`,
      filename: `./plots/${fileDirectory}/index.html`,
      chunks: [`plots/${fileDirectory}`],
    });
  }),
};

module.exports = [
  {
    mode: "production",
    entry: {
      ...plots.entries,
      ...histograms.entries,
    },
    output: {
      path: path.resolve(__dirname, "production"),
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
    mode: "production",
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
        template: path.resolve(__dirname, "public/views/samples/index.pug"),
        filename: path.resolve(__dirname, "index.html"),
        chunks: ["main"],
      }),
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
];
