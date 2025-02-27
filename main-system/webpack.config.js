const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            babelrc: false,
            configFile: false,
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader', // Injeta CSS no DOM
          'css-loader', // Interpreta @import e url()
          'sass-loader', // Compila Sass para CSS
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'main',
      remotes: {
        mfe: 'mfe@http://localhost:3001/remoteEntry.js',
      },
      // shared: {
      //   react: {
      //     singleton: true,
      //     requiredVersion: '18.2.0',
      //     strictVersion: true,
      //   },
      //   'react-dom': {
      //     singleton: true,
      //     requiredVersion: '18.2.0',
      //     strictVersion: true,
      //   },
      //   'react-router-dom': {
      //     singleton: true,
      //     requiredVersion: '6.0.0',
      //     strictVersion: true,
      //   },
      // },
    }),
    new HtmlWebpackPlugin({
      title: 'Mercado Livre',
      templateContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Mercado Livre</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `,
    }),
  ],
};
