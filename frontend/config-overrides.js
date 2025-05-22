const path = require('path');

module.exports = function override(config) {
	config.resolve.alias = {
		...config.resolve.alias,
		'@api': path.resolve(__dirname, 'src/api'),
		'@assets': path.resolve(__dirname, 'src/assets'),
		'@fonts': path.resolve(__dirname, 'src/fonts'),
		'@components': path.resolve(__dirname, 'src/components'),
		'@globalStyles': path.resolve(__dirname, 'src/globalStyles'),
		'@helpers': path.resolve(__dirname, 'src/helpers'),
		'@pages': path.resolve(__dirname, 'src/pages'),
		'@store': path.resolve(__dirname, 'src/store'),
		'@theme': path.resolve(__dirname, 'src/theme')
	};

	return config;
};
