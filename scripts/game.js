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
	this.modifiers = {}
}

var Faction = function(power, support){
	this.power= power,
	this.support= support
}

var Message = function(title, body, isSecret, options, game){
	if (typeof Message.prototype.counter === 'undefined')
		Message.prototype.counter = 0;
	else
		Message.prototype.counter++;
	this.id = Message.prototype.counter
	this.isSecret = isSecret;
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
			if (typeof country[stat] !== 'undefined'){
				country[stat] += effects[stat]
				$().trigger("stats changed")
			} else {
				country["modifiers"][stat] = effects[stat]
			}
		}
	}
}

var SecurityService = function(quality, reliability){
	this.quality = quality,
	this.reliability = reliability
}

var initialize = (function(){
	var game = new Game()
	var variance = 2;
	var mod = 0;
	var stat = generateRandomStats(mod, variance)
	game.country["growth"] = stat;
	mod += stat;
	stat = generateRandomStats(mod, variance)
	game.country["infrastructure"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["food"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["medicalcare"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["education"] = stat
	
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["militarists_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["militarists_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["industrialists_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["industrialists_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["religious_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["religious_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["socialists_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["socialists_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["intellectuals_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["intellectuals_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["capitalists_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["capitalists_support"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["communists_power"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["communists_support"] = stat
	
	mod += stat
	stat = 0
	game.country["usopinion"] = stat
	mod += stat
	stat = 0
	game.country["ussropinion"] = stat
	
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["military_quality"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["military_reliability"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["police_quality"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["police_reliability"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["intelligence_service_quality"] = stat
	mod += stat
	stat = generateRandomStats(mod, variance)
	game.country["intelligence_service_reliability"] = stat
	
	game.messages = [new Message("Americans", "This is a Test Message about Americans", [new MessageOption("Click this to increase your US Opinion", {"usopinion": 1}, "The US appreciates your aid in the fight against Communism")], game),
	new Message("Russians", "This is a Test Message about Russians", [new MessageOption("Click this to increase your USSR Opinion", {"ussropinion": 1}, "The USSR appreciates your help in the fight against Imperialism")], game)
	]
	
	return game;
})

var generateRandomStats = function(modifier, variance){
	var result = Math.floor((Math.random() * ((2 * variance) + 1)) - variance ) - modifier
	if (result < -variance){
		return -variance;
	} 
	else if (result > variance){
		return variance;
	}
	else{
		return result;
	}
}