import { app } from '../app';
import { Server } from 'http';
import { SERVER } from '../config';
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(SERVER.PORT || '3000');
app.instance.set('port', port);


/**
 * Create HTTP server.
 */

 const server: Server = new Server(app.instance);
 /**
  * Listen on provided port, on all network intṅerfaces.
  */
 app.init().then(() => {
     server.listen(port,'0.0.0.0');
 });
 
 server.on('error', onError);
 server.on('listening', onListening);
 server.setTimeout(3600 * 1000);

/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val: any) {
	const portNumber = parseInt(val, 10);

	if (isNaN(portNumber)) {
		// named pipe
		return val;
	}

	if (portNumber >= 0) {
		// port number
		return portNumber;
	}

	return false;
}


/**
 * Event listener for HTTP server 'error' event.
 */

 function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind: any = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
	const addr = server.address() || '';
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.info('Listening on ' + bind);
}