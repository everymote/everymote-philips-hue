var io = require('socket.io-client'),
   hue = require('./hue');

var port = '80',
	server =  'thing.everymote.com';



hue.start();


process.on('uncaughtException', function(err){
	console.log('Something bad happened: ' + err);
	process.exit(0);
});