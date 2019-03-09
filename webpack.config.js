// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
      app: ['./src/common/tweaks.js', './src/app/app.jsx'],
  },
  output: {
      path: path.resolve(__dirname, 'dist/public'),
      filename: '[name].bundle.js'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'inline-source-map',
  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test:/\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
      },
      {
        test: /\.html?$/,
         loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              "@babel/preset-react",
            ],
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
          from: './src/app/**/*.html',
          to: "./",
          flatten: true
      }
    ])
  ]
};