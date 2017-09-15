const path = require('path');

// Project paths
const root = path.resolve(__dirname, '../');
const dist = path.resolve(root, 'dist');

// Project server configuration
const localhost = 'app.test';
const defaultLocalHost = '127.0.0.1';
const port = '8000';
const testServer = 'app.test' // api server, see webpack.config.js and setup proxy

module.exports = {
	paths: {
		root,
		dist
	},
	server: {
		localhost,
		defaultLocalHost,
		port,
		testServer
	}
}
