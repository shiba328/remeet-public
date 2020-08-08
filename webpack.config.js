
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const markdownIt = require('markdown-it');
const prism = require('markdown-it-prism');
const attrs = require('markdown-it-attrs');
const mermaid = require('markdown-it-mermaid');

const fs = require('fs');
const path = require('path');

module.exports = (env, argv) => {

  const MyPageLoad = (inputDir, outputDir, layouts, mode) => {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, inputDir));

    console.log(templateFiles)

    return templateFiles.map(item => {
      const parts = item.split('.');
      const name = parts[0];
      const ext = parts[1];
      
      let path = `${outputDir}${name}`;
      let template = `${inputDir}/${name}.${ext}`;
      let filename = `${path}/index.html`;
      let url =  `/${path}/`;
      let templateName = "";
      const srcDir = inputDir.split('/').slice(-1)[0];
      
      if(layouts) {
        template = layouts;
      }
      
      console.log(template, filename, path)
      return new HtmlWebPackPlugin({
        template: template,
        filename: filename,
        env: {
          srcDir: srcDir,
          path: path, 
          item: inputDir,
          name: name,
          root: `/${outputDir}`, 
          url: url,
          mode: argv.mode
        },
        minify: {
          collapseWhitespace: argv.mode === 'development',
          removeComments: argv.mode === 'development',
          removeRedundantAttributes: argv.mode === 'development',
          removeScriptTypeAttributes: argv.mode === 'development',
          removeStyleLinkTypeAttributes: argv.mode === 'development',
          useShortDoctype: argv.mode === 'development'
        },
        inject: argv.mode == 'development' ? true : false
      });
    });
  }

  const postcssPlugins = () => {
    return [
      require('stylelint'),
      require('precss'),
      require('autoprefixer'),
      require('postcss-nested'),
      require('postcss-custom-media'),
      require('postcss-each')
    ];
  }

  return {
    entry: `./src/${argv.mode}.index.js`,
    output: {
      filename: '[name].js',
      path: __dirname + '/dist'
    },
    resolve: {
      alias: {
        '~': path.join(__dirname, '/src'),
        '@': path.join(__dirname, '/'),
      }
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.join(__dirname, 'src/index.pug'),
        minify: {
          collapseWhitespace: argv.mode === 'development',
          removeComments: argv.mode === 'development',
          removeRedundantAttributes: argv.mode === 'development',
          removeScriptTypeAttributes: argv.mode === 'development',
          removeStyleLinkTypeAttributes: argv.mode === 'development',
          useShortDoctype: argv.mode === 'development'
        }
      }),
      // new GenerateSW(),
      new MiniCssExtractPlugin({
        // filename: "assets/css/style.css"
      }),
      new CopyPlugin([
        {
          from: path.resolve(__dirname, 'src/assets/public'),
          to: path.resolve(__dirname, 'dist/')
        }
      ]),
      // new CopyPlugin([
      //   {
      //     from: path.resolve(__dirname, 'src/ads.txt'),
      //     to: path.resolve(__dirname, 'dist/ads.txt')
      //   }
      // ])
    ]
      .concat(MyPageLoad('./src/support', 'support/', './src/layouts/support.pug'))
      // .concat(MyPageLoad('./src/support/svg', 'svg/', './src/layouts/support.pug'))
      // .concat(MyPageLoad('./src/support/webpack-media', 'webpack-media/', './src/layouts/support.pug'))
      // .concat(DemoPageLoad('./src/page'))

      .concat(new HtmlWebPackPlugin({
        template: path.join(__dirname, 'src/support.pug'),
        filename: 'support/index.html',
        minify: {
          collapseWhitespace: argv.mode === 'development',
          removeComments: argv.mode === 'development',
          removeRedundantAttributes: argv.mode === 'development',
          removeScriptTypeAttributes: argv.mode === 'development',
          removeStyleLinkTypeAttributes: argv.mode === 'development',
          useShortDoctype: argv.mode === 'development'
        }
      }))
      .concat(new HTMLInlineCSSWebpackPlugin()),
    module: {
      rules: [
        // html
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: argv.mode !== 'development'
              }
            }
          ]
        },
        // css
        {
          test: /\.?(p|)css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: argv.mode === 'development'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: postcssPlugins
              }
            }
          ]
        },
        // md
        {
          test: /\.md$/,
          use: [
            {
              loader: 'frontmatter-markdown-loader',
              options: {
                markdownIt: markdownIt()
                .use(mermaid.default)
                .use(prism, { defaultLanguage: 'shell' })
                .use(attrs, {})
              }
            }
          ]
        },
        // pug
        {
          test: /\.pug$/,
          use: {
            loader: 'pug-loader',
            options: {
              root: path.resolve(__dirname, 'src')
            }
          }
        },
        //svg
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader?classPrefix'
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin()
      ]
    }
  }
}
