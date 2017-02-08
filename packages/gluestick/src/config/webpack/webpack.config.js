const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssCustomProperties = require('postcss-custom-properties');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssCalc = require('postcss-calc');

module.exports = assetsPath => {
  const appRoot = process.cwd(); // not sure about that
  const outputPath = path.resolve(appRoot, assetsPath);

  const configuration = {
    // resolve all relative paths from the project root folder
    context: appRoot,
    resolve: {
      extensions: ['.js', '.css', '.json'],
      alias: {
        // default aliases
        assets: path.join(process.cwd(), 'assets'),
        actions: path.join(process.cwd(), 'src', 'actions'),
        components: path.join(process.cwd(), 'src', 'components'),
        containers: path.join(process.cwd(), 'src', 'containers'),
        reducers: path.join(process.cwd(), 'src', 'reducers'),
        config: path.join(process.cwd(), 'src', 'config'),
      },
    },

    // https://webpack.github.io/docs/multiple-entry-points.html
    entry: {
      main: './src/config/.entry.js',
    },

    output: {
      // filesystem path for static files
      path: outputPath,

      // network path for static files
      publicPath: '/assets/',

      // file name pattern for entry scripts
      filename: '[name].[hash].js',

      // file name pattern for chunk scripts
      chunkFilename: '[name].[hash].js',
    },

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/, // not sure about it
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-decorators-legacy',
            ],
            presets: [
              'react',
              'es2015',
              'stage-0',
            ],
          },
          include: [
            path.join(process.cwd(), 'Index.js'),
            path.join(process.cwd(), 'src'),
            path.join(process.cwd(), 'test'),
          ],
        }],
      },
      {
        test: /\.(scss)$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=2&sourceMap',
          'postcss-loader',
          'sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=2&sourceMap',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|ico|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader?name=[name]-[hash].[ext]',
          'image-webpack-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader?name=[name]-[hash].[ext]',
        ],
      },
      {
        test: /\.(svg)$/,
        use: [
          'svg-react-loader',
        ],
      }],
    },

    plugins: [
      new ExtractTextPlugin('[name]-[chunkhash].css'),
      new OptimizeCSSAssetsPlugin(),
      new webpack.LoaderOptionsPlugin({
        test: /\.(scss|css)$/,
        options: {
          // A temporary workaround for `scss-loader`
          // https://github.com/jtangelder/sass-loader/issues/298
          output: {
            path: outputPath,
          },

          postcss: [
            autoprefixer({ browsers: 'last 2 version' }),
            cssCustomProperties(),
            postcssCalc(),
          ],

          // A temporary workaround for `css-loader`.
          // Can also supply `query.context` parameter.
          context: appRoot,
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: `vendor${process.env.NODE_ENV === 'production' ? '-[hash]' : ''}.bundle.js`,
      }),
    ],
  };

  return configuration;
};
