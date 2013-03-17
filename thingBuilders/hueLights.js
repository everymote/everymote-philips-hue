var everymoteLights = require("./everymoteLights");

var _hueApi;

var setupThing = function(light){
	console.log(light);
	everymoteLights.create(light, _hueApi);
};

var registerToEverymote = function(result){
	result.lights.forEach(setupThing);
};

var getLights = function(){

	_hueApi.lights()
    .then(registerToEverymote)
    .done();
};

var registerLights = function(hueApi){
	_hueApi = hueApi;

	getLights()
};


module.exports = {registerLights:registerLights};