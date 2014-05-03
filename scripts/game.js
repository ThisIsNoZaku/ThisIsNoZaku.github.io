var Game = function(){
	this.messages = {},
	this.country = new Country()
}

var Country = function(){
	this.stats = {
		growth : 0,
		infrastructure: 0,
		food: 0,
		medicalcare: 0,
		education: 0,
		militarists: 0
	}
	this.modifiers = []
}

var Faction = function(power, support){
	this.power= power,
	this.support= support
}

var Message = function(title, body, options, game){
	if (typeof Message.prototype.counter === 'undefined')
		Message.prototype.counter = 0;
	else
		Message.prototype.counter++;
	this.id = Message.prototype.counter
	this.title = title,
	this.body = body
	this.options = options
	this.delete = function(){
		for (var message in game["messages"]){
			if (game["messages"][message].id === this.id){
				game["messages"].splice(message, 1)
				$("#messages").trigger('messages_changed')
			}
		}
	}
}

var MessageOption = function(description, effects, acceptMessage){
	this.description = description;
	this.effects= effects
	this.acceptMessage = acceptMessage;
	
	this.apply = function(country){
		for (var stat in effects){
			country[stat] += effects[stat]
			$("#sidebar").trigger("stats_changed")
		}
	}
}

var SecurityService = function(quality, reliability){
	this.quality = quality,
	this.reliability = reliability
}

var initialize = (function(){
	var game = new Game()

	var mod = generateRandomStats(0);
	game.country["growth"] = mod;
	mod = generateRandomStats(mod);
	game.country["infrastructure"] = mod
	mod = generateRandomStats(mod);
	game.country["food"] = mod
	mod = generateRandomStats(mod);
	game.country["medicalcare"] = mod
	mod = generateRandomStats(mod);
	game.country["education"] = mod
	
	mod = generateRandomStats(mod);
	game.country["miltiarists_power"] = mod
	mod = generateRandomStats(mod);
	game.country["miltiarists_support"] = mod
	mod = generateRandomStats(mod);
	game.country["industrialists_power"] = mod
	mod = generateRandomStats(mod);
	game.country["industrialists_support"] = mod
	mod = generateRandomStats(mod);
	game.country["religious_power"] = mod
	mod = generateRandomStats(mod);
	game.country["religious_support"] = mod
	mod = generateRandomStats(mod);
	game.country["socialists_power"] = mod
	mod = generateRandomStats(mod);
	game.country["socialists_support"] = mod
	mod = generateRandomStats(mod);
	game.country["intellectuals_power"] = mod
	mod = generateRandomStats(mod);
	game.country["intellectuals_support"] = mod
	mod = generateRandomStats(mod);
	game.country["capitalists_power"] = mod
	mod = generateRandomStats(mod);
	game.country["capitalists_support"] = mod
	mod = generateRandomStats(mod);
	game.country["communists_power"] = mod
	mod = generateRandomStats(mod);
	game.country["communists_support"] = mod
	
	mod = generateRandomStats(mod);
	game.country["usopinion"] = mod
	mod = generateRandomStats(mod);
	game.country["ussropinion"] = mod
	
	mod = generateRandomStats(mod);
	game.country["military_quality"] = mod
	mod = generateRandomStats(mod);
	game.country["military_reliability"] = mod
	mod = generateRandomStats(mod);
	game.country["police_quality"] = mod
	mod = generateRandomStats(mod);
	game.country["police_reliability"] = mod
	mod = generateRandomStats(mod);
	game.country["intelligence_service_quality"] = mod
	mod = generateRandomStats(mod);
	game.country["intelligence_service_reliability"] = mod
	
	game.messages = [new Message("Americans", "This is a Test Message about Americans", [new MessageOption("Click this to increase your US Opinion", {"usopinion": 1}, "The US appreciates your aid in the fight against Communism")], game),
					 new Message("Russians", "This is a Test Message about Russians", [new MessageOption("Click this to increase your USSR Opinion", {"ussropinion": 1}, "The USSR appreciates your help in the fight against Imperialism")], game)
	]
	
	return game;
})

var generateRandomStats = function(mod){
	var result = Math.floor((Math.random() * 5) -2) - mod
	if (result < -2)
		return -2;
	else if (result > 2)
		return 2;
	else
		return result;
}