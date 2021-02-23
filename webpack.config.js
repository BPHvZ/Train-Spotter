const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = {
	plugins: [
		new ImageminPlugin({
			test: "./src/assets/**",
			jpegtran: { progressive: true },
			pngquant: { quality: [0.5, 0.85] },
		}),
	],
};
