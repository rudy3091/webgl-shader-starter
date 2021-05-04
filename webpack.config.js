const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = true;

module.exports = {
	entry: "./src/index.ts",
	resolve: {
		extensions: [".ts", ".js", ".css", ".scss"],
		alias: {
			"@type": path.resolve(__dirname, "src/types"),
		},
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 500,
		poll: 1000,
		ignored: /node_modules/,
	},
	devServer: {
		contentBase: "./dist",
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.s(a|c)ss$/i,
				exclude: [
					/\.module.(s(a|c)ss)$/,
					/node_modules/,
				],
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.module\.s(a|c)ss$/,
				exclude: [
					/node_modules/,
				],
				use: [
					isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: true,
							sourceMap: isDevelopment,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
			{
        test: /\.glsl$|\.vert$|\.frag$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'raw-loader'
          },
          {
            loader: 'glslify-loader'
          }
        ]
			}
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: isDevelopment ? "[name].css" : "[name].[hash].css",
			chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css"
		}),
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.bundle.js"
	},
	mode: isDevelopment ? "development" : "production",
}
