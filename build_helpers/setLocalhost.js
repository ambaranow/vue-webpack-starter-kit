const hostile = require('hostile');
const deasync = require('deasync');
const portscanner = require('portscanner');
const log = require('gutil-color-log');

const NODE_ENV = require('./nodeEnv');
const serverConfig = require('./config').server;

module.exports = function () {
	let freePort = null;
	let isTrySetHost = false;
	if(NODE_ENV === 'development') {
		portscanner.findAPortNotInUse(
			serverConfig.port,
			9000,
			serverConfig.localhost,
			(error, port) => {
				serverConfig.port = freePort = error ? 5555 : port
			});
		deasync.loopWhile(function() { return !freePort; });

		try {
			hostile.set(serverConfig.defaultLocalHost, serverConfig.localhost, function(err) {
				if (err) {
					log('red', `Can\'t set hosts file change. Please, try run this as Administrator. ${err.toString()}`);
					serverConfig.localhost = 'localhost';
				} else {
					log('blue', `Set \'/etc/hosts\' successfully! Project running at ${serverConfig.localhost}:${serverConfig.port}`);
				}
				isTrySetHost = true;
			});
		} catch (e) {
			log('yellow', e);
			isTrySetHost = true;
			serverConfig.localhost = 'localhost';
		}
		deasync.loopWhile(function() { return !isTrySetHost; });
	}
}
