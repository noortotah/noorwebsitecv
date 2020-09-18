const path = require('path');
const webpack = require('webpack');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');

const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
    main: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
	plugins: [
		
		new webpack.ProgressPlugin(),
		new MiniCssExtractPlugin({ filename: 'css/index.css' }),
		new HtmlWebpackPlugin({
			filename: './index.html',
			template: './src/index.html',
			excludeChunks: [ 'server' ]
		}),
		new HtmlWebpackPlugin({
			filename: './contact.html',
			template: './src/contact.html',
			excludeChunks: [ 'server' ]
		}),
		new CopyPlugin({
	      patterns: [
	        { from: './src/images', to: './images' },
	        { from: './src/docs', to: './docs' }
	      ]
	    })
	],

	module: {
		rules: [
			{
		      test: /\.scss$/,
		      use: [
		          MiniCssExtractPlugin.loader,
		          {
		            loader: 'css-loader'
		          },
		          {
		            loader: 'sass-loader',
		            options: {
		              sourceMap: true,
		              // options...
		            }
		          }
		        ]
		    },
			{
		        test: /\.html$/,
		        loader: 'html-loader'  
		    },
		    {
		         
			    test: /\.(woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
			    loader: 'url-loader?limit=100000',
			    options: {
		            limit: 1000, // if less than 10 kb, add base64 encoded image to css
		            name: "fonts/[name].[ext]" // if more than 10 kb move to this folder in build using file-loader
		        }
			},
			{
		         
			    test: /\.(jpe?g|png|gif|svg)(\?[a-z0-9=.]+)?$/,
			    loader: 'url-loader',
			    options: {
		            limit: 1000, // if less than 10 kb, add base64 encoded image to css
		            name: "images/[hash].[ext]" // if more than 10 kb move to this folder in build using file-loader
		        }
			},
			{
				test: /.js$/,
				include: [],
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presents: ['es2015']
				}
			},
            {
                test: /\.css$/,
                 exclude: '/node_modules/',
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
		]
	},

	optimization: {
		minimizer: [new TerserPlugin()],

		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	}
};
