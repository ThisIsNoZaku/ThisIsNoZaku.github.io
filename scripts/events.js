var triggerEvent = function(gameState, eventID){
	for (var event in events(gameState)){
		if (events[event].id === eventID)
		return events[event].getMessage()
	}
}

var triggerRandomEvents = function(gameState){
	var newMessages = [];
	for (var index in events()){
		var roll = Math.floor((Math.random() * 100) + 1)
		console.log("roll: " +  roll + " probability: " + events()[index].chanceToOccur(gameState))
		if (roll<= events()[index].chanceToOccur(gameState)){
			newMessages.push(events()[index].getMessage())
		}
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

var events;

var loadEvents = function(){
	console.log(jQuery.getJSON("C:\Users\Damien\Desktop\Web Page\scripts\events.json"))
	events = function(gameState){
		return parsedEvents;
		}
}