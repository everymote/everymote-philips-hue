var everymote = require('./everymoteConnect'),
lightState = require("node-hue-api").lightState;

var getHSLColor = function(lightState){
	var hue = (lightState.hue / 65535) ;
	var sat = (lightState.sat / 255) ;
	var bri = (lightState.bri / 255) ;

	return {hue:hue, sat:sat, bri:bri};

};

var createThingSettings = function(light, lightSettings){
	var color = getHSLColor(lightSettings.state);
	return { 
		"name": light.name,
		"id": light.id,
		"iconType": "Lamp",
		//"info":"Press link button on hub and pair"
		"actionControles": [
                {"type":"button", "name":"On", "id":"on"},
                {"type":"button", "name":"Off", "id":"off"},
                {"type":"hsl", "name":"color picker", "id":"color",
                	 "curentState":												
                	 				{"hue":color.hue,"bri":color.bri,"sat":color.sat}}
            ]
	};	
};

var onState = lightState.create().on().white(500, 100);
var offState = lightState.create().off();
var displayResult = function(result){
	console.log("result");
	console.log(result);
};

var createActonHandler = function(hueApi, light){
	var actions = {};
	var processAcction = false;
		actions.on = function(value){
			hueApi.setLightState(light.id, onState).done();
		};
		actions.off = function(value){
			hueApi.setLightState(light.id, offState).done();
		};
		actions.color = function(value, socket){
			if(processAcction) return;
			processAcction = true;
			//hueApi.setLightState(light.id, offState).done();
			socket.emit('updateActionControlerState', {"id":"color", 
				"curentState":{"hue":value.hue,"bri":value.bri,"sat":value.sat}});
		var data = {
			"hue":  Math.round(value.hue * 65535),
			"sat":  Math.round(value.sat * 255),
			"bri": Math.round(value.bri * 255)
			};
			console.log(value);
			console.log(data);
			hueApi.setLightState(light.id, data)
					.then(function(result){processAcction = false; displayResult(result);})
    				.fail(function(result){processAcction = false; displayResult(result);})
    				.done();
		};

	var actionHandler = function(action, socket){
		actions[action.id](action.value, socket);
	};

	return actionHandler;
};

var registerToEverymote = function(light, hueApi){
	
	var reg = function(lightSettings){
		var thing = {};
		thing.settings = createThingSettings(light, lightSettings);
		thing.handleAction = createActonHandler(hueApi, light);
		everymote.connect(thing);
	};

	return reg;
};

module.exports.create = function(light, hueApi){
	hueApi.lightStatus(light.id)
    .then(registerToEverymote(light, hueApi))
    .done();
};