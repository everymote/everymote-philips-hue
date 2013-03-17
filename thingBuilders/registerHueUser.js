var createThing = function(){
	return { 
		"name": 'Register Hue User',
		"id": 21345,
		"iconType": "candy",
		"info":"Press link button on hub and pair",
		"actionControles": [
                {"type":"button", "name":"Pair", "id":"1"}
            ]
	};	
};


var createActionHandler = function(regFunction){ 

	var handler = function(){
		regFunction();
	};

	return handler;


};

module.exports.getThing = function(regFunction, callback){

	  var thing = { settings:createThing(),
	  	onAction:createActionHandler(regFunction)
	  }

	  callback(thing);
};	