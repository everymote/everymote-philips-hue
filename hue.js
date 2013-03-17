var hue = require("node-hue-api").hue,
md5 = require("MD5"), 
hueUserHandler = require("./thingBuilders/registerHueUser"),
hueLightHandler = require("./thingBuilders/hueLights");

var api;
var hostname, 
    username = "everymotehue",
    userDescription = "everymote user";

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var registerLights = function(result){
	hueLightHandler.registerLights(api);
	
}

var registerUser = function() {
    console.log("reggar usern");
    
    hue.registerUser(hostname, username, userDescription)
    .then(displayResult)
    .fail(displayResult)
    .done();

};

var prepForRegisterUser = function(result) {
	if(result.type === 1 || result.type === 101){
    	console.log("tryck på knappen");
    	//regga action på everymote
		//registerUser();
	}

	displayResult(result);
};

var login = function() {
	api = new hue.HueApi(hostname, md5(username));
	api.connect().then(registerLights).fail(prepForRegisterUser).done();
};

var bridgeFund = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
    //at the moment only one bridge is suported
    hostname = bridge[0].host;
	login();
};

module.exports.start = function(){ hue.locateBridges().then(bridgeFund).done(); };
