var everymote = require('./everymoteConnect');

var createThing = function(){
	return { 
		"name": 'Register Hue User',
		"id": 21345,
		"iconType": "Lock",
		"info":"Press link button on hub and pair",
		"actionControles": [
                {"type":"button", "name":"Pair", "id":"1"}
            ]
	};	
};


var createActionHandler = function(regFunction, thing){ 

	var handler = function(){
		regFunction(thing.successRegistration);
	};

	return handler;


};

module.exports.reg = function(regFunction, callback){

	  var thing = { settings:createThing()};
	  
	  
	  var connection =  everymote.connect(thing);

	
	  thing.successRegistration = function(){
	  			thing.socket.emit('updateInfo', "Paired to everymote");
	  			thing.socket.disconnect();
	  		};

	  thing.handleAction = createActionHandler(regFunction, thing);
	  return thing;
};	