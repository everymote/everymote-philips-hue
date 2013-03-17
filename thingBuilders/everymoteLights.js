var io = require('socket.io-client'),
lightState = require("node-hue-api").lightState;
var port = '80',
        server =  'thing.everymote.com';

var connectThing = function(thing){
        console.log(thing);
        var socket = io.connect('http://' + server + ':' + port + '/thing',
                {"force new connection":true 
                        ,'reconnect': true
                        ,'reconnection delay': 5000
                        ,'max reconnection attempts': 100000000000000000});
        
        thing.socket = socket;
        socket.on('connect', function () {
                console.log('connected');
                socket.emit('setup', thing.settings);
        }).on('doAction', function (action) {
                console.log(action);
                thing.handleAction(action);
        }).on('connect_failed', function () {
                console.log('error:' + socket );
        }).on('disconnect', function () {
                console.log('disconnected');
        }).on('reconnect', function () {
               console.log('reconnect');
             
        });
};



var createThingSettings = function(light, lightSettings){
	return { 
		"name": light.name,
		"id": light.id,
		"iconType": "Lamp",
		//"info":"Press link button on hub and pair"
		"actionControles": [
                {"type":"button", "name":"On", "id":"on"},
                {"type":"button", "name":"Off", "id":"off"}
            ]
	};	
};

var onState = lightState.create().on().white(500, 100);
var offState = lightState.create().off();

var createActonHandler = function(hueApi, light){
	var actions = {};
		actions.on = function(){
			hueApi.setLightState(light.id, onState).done();
		};
		actions.off = function(){
			hueApi.setLightState(light.id, offState).done();
		};

	var actionHandler = function(action){
		actions[action.id]();
	};

	return actionHandler;
};

var registerToEverymote = function(light, hueApi){
	
	var reg = function(lightSettings){
		var thing = {};
		thing.settings = createThingSettings(light, lightSettings);
		thing.handleAction = createActonHandler(hueApi, light);
		connectThing(thing);
	};

	return reg;
};

module.exports.create = function(light, hueApi){
	hueApi.lightStatus(light.id)
    .then(registerToEverymote(light, hueApi))
    .done();
};