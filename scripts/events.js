var triggerEvent = function(gameState, eventID){
	var theEvents = events(gameState)
	for (var event in theEvents){
		if (theEvents[event].id === eventID)
		return [theEvents[event].getMessage()]
	}
}

var triggerRandomEvents = function(gameState){
	var newMessages = [];
	for (var index in events()){
		var roll = Math.floor((Math.random() * 10000) + 1)/100
		console.log("roll: " +  roll + " probability: " + events()[index].chanceToOccur(gameState))
		if (roll<= events()[index].chanceToOccur(gameState)){
			newMessages.push(events()[index].getMessage())
		}
	}
	console.log(newMessages)
	return newMessages
}

var Event = function(id, message, chanceToOccur){
	this.id = id;
	var message = message;
	this.getMessage = function(){
		return message;
	}
	this.chanceToOccur = chanceToOccur;
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

var events = function(gameState) {
	return [
	new Event(1,
	new Message("Found American Spies",
	"Your intelligence services have discovered CIA agents operating in your country.",
	false,
	[
	new MessageOption("Ignore Them", 
	[	{"diplomacy.usrelations" : 10},
		{"diplomacy.ussrrelations" : -10}
	],
	"You order your spies to ignore the Americans and hide their presence. The United States appreciates being allowed to operate unhindered, though the USSR disapproves your cozying up with the West."
	),
	new MessageOption("Demand Concessions", 
[	{"diplomacy.usrelations" : -5},
	{"diplomacy.ussrrelations" : -10},
	{"trait.russianaid" : 1}
	],
	"You threaten to expose and expel the spies unless the US meets your demands. The Americans begrudgingly agree, but are irritated by your grasping opportunism."
	),
	new MessageOption("Publicly Expel Them", 
	[	{"diplomacy.usrelations" : -10},
{"diplomacy.ussrrelations" : 10},
	{"politics.nationalists.support" : 20}
	],
	"You have the spies throw out of the country and loudly denounce imperialist meddling in the affairs of a sovereign nation." +
	"The US is angered by your throwing a wrench into their espionage activities, while the Soviets praise your resistance to capitalist interference and your own nationalists like your thumbing your nose at a superpower."
	),
	new MessageOption("Give Them to The Russians", 
[	{"diplomacy.usrelations" : -20},
	{"diplomacy.ussrrelations" : 20}
	],
	"You have the spies rounded up and turn them over to the KGB. The Russians are excited by this intelligence coup and the Americans are outraged."
	)
	],
	gameState),
	function(gameState){if (gameState.country.modifiers["hasUSSpies"] === true){return 0.5} else {return 0}}
	),
	
	new Event(2,
	new Message("Found Russian Spies",
	"Your intelligence services have discovered KGB agents operating in your country.",
	false,
	[
	new MessageOption("Ignore Them", 
	[	{"diplomacy.ussrrelations" : 10},
		{"diplomacy.usrelations" : -10}
	],
	"You order your spies to ignore the Russians and hide their presence. The Soviets appreciates being allowed to operate unhindered, though the US disapproves your cozying up with the Communists."
	),
	new MessageOption("Demand Concessions", 
	[	{"diplomacy.ussrrelations" : -5},
		{"diplomacy.usrelations" : -10},
		{"trait.americanaid" : 1}
	],
	"You threaten to expose and expel the spies unless the USSR meets your demands. The Russians begrudgingly agree, but are irritated by your grasping opportunism."
	),
	new MessageOption("Publicly Expel Them", 
	[	{"diplomacy.ussrrelations" : -10},
		{"diplomacy.usrelations" : 10},
		{"politics.nationalists.support" : 20}
	],
	"You have the spies throw out of the country and loudly denounce Communist attempts to subvert your lawful government." +
	"The USSR is angered by your throwing a wrench into their espionage activities, while the Americans praise your resistance against Communist attempts to spread chaos and tyranny."
	),
	new MessageOption("Give Them to The Russians", 
	[	{"diplomacy.ussrrelations" : -20},
		{"diplomacy.usrelations" : 20}
	],
	"You have the spies rounded up and turn them over to the CIA. The Americans are excited by this intelligence coup and the Russians are outraged."
	)
	],
	gameState),
	function(gameState){if (gameState.country.modifiers["hasUSSRSpies"] === true){return 0.5} else {return 0}}
	),
	
	new Event(3,
	new Message("American Spy Infiltration",
	"CIA agents have begun working in your country.",
	true,
	[
	new MessageOption("", [	{"modifiers.hasCIASpies" : true}],""),
	],
	function(gameState){if (gameState.country.modifiers["hasCIASpies"] === true){return 0} else {return 5}}
	)),
	
	new Event(4,
	new Message("Russian Spy Infiltration",
	"KGB agents have begun working in your country.",
	true,
	[
	new MessageOption("", [	{"modifiers.hasKGBSpies" : true}],"")
	],
	function(gameState){if (gameState.country.modifiers["hasKGBSpies"] === true){return 0} else {return 5}}
	)),
	
	new Event(5,
	new Message("Infrastructure Is Lacking",
	"The US is looking.",
	false,
	[
	new MessageOption("", [	{"modifiers.hasUSSpies" : true}],"")
	],
	function(gameState){if (gameState.country.modifiers["hasUSSpies"] === true){return 0} else {return 5}}
	))
	
	]
}