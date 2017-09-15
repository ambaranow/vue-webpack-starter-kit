const log = require('gutil-color-log')
const NODE_ENV = require('./build_helpers/nodeEnv')
log('blue', NODE_ENV);

const config = require('./build_helpers/config');

const testServer = config.server.testServer;
const buildFolder = config.paths.dist;

const package = require('./package.json');
const version = package.version;
const banner = package.name + ' v' + version;
// const version = require('./build_helpers/version.js')();

const HTMLCompressionPlugin = require("html-compression-webpack-plugin");
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const writeFileWebpackPlugin = require('write-file-webpack-plugin');
const LocalePlugin = require('./build_helpers/WebpackLocalePlugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const path = require('path');
// const srcPath = path.join(__dirname, '/src');

const isDevMode = NODE_ENV === 'development';
const isProdMode = NODE_ENV === 'production';

const extractLocale = new ExtractTextPlugin({
	filename: '[name].i18n.json',
	allChunks: true
});

const localePlugin = new LocalePlugin({
	paths: [path.resolve(__dirname, '**/*.i18n.json')],
	outputFileName: '[lang].json'
});

const extractCSS = new ExtractTextPlugin({
	filename: 'css/[name].min.css',
	allChunks: true
});

const setLocalhost = require('./build_helpers/setLocalhost');
setLocalhost();

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		'app': './js/app.js',
	},
	output: {
		path: path.resolve(__dirname, buildFolder),
		filename: 'js/[name].min.js'
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
			Components: path.resolve(__dirname, 'src/js/components/'),
			Plugins: path.resolve(__dirname, 'src/js/plugins/'),
			Services: path.resolve(__dirname, 'src/js/services/'),
			Config: path.resolve(__dirname, 'src/js/config/'),
			Store: path.resolve(__dirname, 'src/js/store/'),
			Root: path.resolve(__dirname, 'src/js/'),
			Assets: path.resolve(__dirname, 'src/assets/'),
			jquery: 'jquery/src/jquery',
			'@': 'node_modules',
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'string-replace-loader',
						query: {
							search: 'appVersionControlFlag',
							replace: `${version}`,
							flags: 'g'
						}
					}
				]
			},
			{
				test: /\.(pug|jade)$/,
				use: [
					{
						loader: 'pug-loader'
					},
					{
						loader: 'string-replace-loader',
						query: {
							search: 'appVersionControlFlag',
							replace: `${version}`,
							flags: 'g'
						}
					}
				]
			},
			{
				test: /\.(scss|css)$/,
				loader: extractCSS.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								minimize: isProdMode,
							}
						},
						{
							loader: 'autoprefixer-loader'
						},
						{
							loader: 'postcss-loader',
							options: {}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						},
					],
				})
			},
			{
				test: /\.yaml/,
				loader: extractLocale.extract({
					use: LocalePlugin.loader()
				})
			},
			{
					test: /\.(png|jpg|jpeg|gif|ico|svg|ttf|woff|eot|woff2)$/,
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						publicPath: '/'
					}
			},
			{
				test: require.resolve("jquery"),
				use: 'imports-loader?jQuery=jquery,this=>window'
			}
		]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new CleanWebpackPlugin(['dist']),
		extractCSS,
		new webpack.BannerPlugin(`${banner}`),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: 2,
			async: true
		}),
		new HtmlWebpackPlugin({
			template: 'index.pug',
			// filename: 'index.html',
			inject: false,
			minify: {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				html5: true,
				minifyCSS: true,
				removeComments: true,
				removeEmptyAttributes: true,
			},
			NODE_ENV: NODE_ENV
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/assets'),
				to: path.resolve(__dirname, buildFolder + '/assets')
			}
		]),
		new webpack.NoEmitOnErrorsPlugin(),
		new writeFileWebpackPlugin(),
		localePlugin,
		new UnminifiedWebpackPlugin(),
		new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru|en/),
		new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery', "window.jQuery": "jquery" }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
		}),
	],

	// webpack dev server configuration
	devServer: {
		host: config.server.localhost,
		contentBase: path.join(__dirname, buildFolder),
		port: config.server.port,
		historyApiFallback: {
			index: '/'
		},
		// hot: true,
		noInfo: false,
		// proxy: [
		// 	{
		// 		path: '/api',
		// 		target: testServer,
		// 		secure: false,
		// 		changeOrigin: true
		// 	},
		// 	{
		// 		path: '/upload',
		// 		target: testServer,
		// 		secure: false,
		// 		changeOrigin: true
		// 	},
		// 	{
		// 		path: '/static',
		// 		target: testServer,
		// 		secure: false,
		// 		changeOrigin: true
		// 	},
		// 	{
		// 		path: '/app',
		// 		target: `${config.server.localhost}:${config.server.port}`,
		// 		pathRewrite: {"^/app": ""},
		// 		secure: false,
		// 		changeOrigin: true
		// 	}
		// ],

		stats: {
			color: true
		}
	},

	// support source maps
	devtool: isDevMode ? "source-map" : 'false',
	watch: isDevMode,
	watchOptions: {
		aggregateTimeout: 100
	}
}

// if (isDevMode) {
// 	module.exports.plugins.push(
// DEV only plugins
// 	)
// }
if (isProdMode) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			compress: {
				drop_console: true,
				drop_debugger: true,
				unsafe: true
			},
			sourceMap: isDevMode
		})
	);
	module.exports.plugins.push(
		new HTMLCompressionPlugin()
	);
}
