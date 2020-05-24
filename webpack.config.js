var webpack = require('webpack');
var path = require('path');
var libraryName = 'postress';
var outputFile = libraryName + '.js';

module.exports = {
	entry: __dirname + '/src/index.ts',
	mode: 'production',
	devtool: 'source-map',
	output: {
		path: __dirname + '/lib',
		filename: "index.js",
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},

		]
	},
	resolve: {
		extensions: ['.js', '.ts']
	}
};
