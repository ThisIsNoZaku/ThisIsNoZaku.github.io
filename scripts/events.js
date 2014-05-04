var triggerEvent = function(gameState, eventID){
	for (var event in events(gameState)){
		if (events[event].id === eventID)
		return events[event].getMessage()
	}
}

var triggerRandomEvents = function(gameState){
	var newMessages = [];
	for (var index in events()){
		var chance = Math.floor((Math.random() * 100) + 1)
		console.log("roll: " +chance)
		console.log("chance: " + events()[index].chanceToOccur(gameState))
		if (chance <= events()[index].chanceToOccur(gameState))
		newMessages.push(events()[index].getMessage())
	}
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

var events = function(gameState){ return [
	new Event(1, new Message(
		"Located American Spies",
		"Your intelligence services have discovered CIA agents operating in your country.",
		false,
		[
			new MessageOption("Ignore Them", {"usrelations": 0.5}, "The US appreciates being allowed to operate unhindered."),
			new MessageOption("Publicly Expel Them", {"usrelations": -0.5}, "You loudly complain of imperialists meddling in your internal affairs and have the offenders expelled."),
			new MessageOption("Execute Them", {"usrelations": -1, "ussrrelations": 1}, "You publicly execute the spies, outraging the US.")
		],
		gameState
		),
	function(gameState){if (typeof game["country"]["modifiers"]["hasCIASpies"] !== 'undefined' && game["country"]["modifiers"]["hasUSSpies"] == true) 
		return 10 + game["country"]["intelligence_service_quality"] * 5;
	else return 0}
	),
	new Event(2, new Message(
		"Located Russian Spies",
		"Your intelligence services have discovered KGB agents operating in your country.",
		false,
		[
			new MessageOption("Ignore Them", {"ussrrelations": 0.5}, "The USSR appreciates being allowed to operate unhindered."),
			new MessageOption("Publicly Expel Them", {"ussrrelations": -0.5}, "You loudly complain of imperialists meddling in your internal affairs and have the offenders expelled."),
			new MessageOption("Execute Them", {"ussrrelations": -1, "usrelations": 1}, "You publicly execute the spies, outraging the USSR.")
		],
		gameState
		),
	function(gameState){if (typeof game["country"]["modifiers"]["hasKGBSpies"] !== 'undefined' && game["country"]["modifiers"]["hasUSSpies"] == true) 
		return 10 + game["country"]["intelligence_service_quality"] * 5;
	else return 0}
	),
	new Event(3, new Message(
		"CIA Infiltration",
		"CIA agents have infiltrated your country without your government's knowledge.",
		true,
		[
			new MessageOption("", {"hasCIASpies": true}, ""),
		],
		gameState
		),
	function(gameState){if (typeof game["country"]["modifiers"]["hasCIASpies"] !== 'undefined' && game["country"]["modifiers"]["hasUSSpies"] == true) 
		return 10 + game["country"]["intelligence_service_quality"] * 5;
	else return 100}
	),
	]
}