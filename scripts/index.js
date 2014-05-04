$().ready(function(){
	game = initialize()
	var country = game["country"]
	
	$("#messages").on('messages_changed', function(){
		populateMessages(game["messages"])
	})
	$().on('stats_changed', function(){
		populateStats(country);
	})
	
	$("#endturn").click(function(){
		var newMessages = triggerRandomEvents();
		for (var message in newMessages){
			game["messages"].push(newMessages[message]);
		}
		$("#messages").trigger('messages_changed');
	})
	populateMessages(game["messages"])
	populateStats(country)
})

var statToDescription = function(number){
	if (number <= -2)
	return "Terrible"
	else if  (number <=-1 && number > -2)
	return "Poor"
	else if (number > -1 && number < 1)
	return "Adequate"
	else if (number < 2 && number >= 1)
	return "Good"
	else if (number >= 2)
	return "Excellent"
}

var relationsToDescription = function(number){
	if (number <= -2)
	return "Hostile"
	else if  (number <=-1 && number > -2)
	return "Cold"
	else if (number > -1 && number < 1)
	return "Cordial"
	else if (number < 2 && number >= 1)
	return "Friendly"
	else if (number >= 2)
	return "Close"
}

var populateMessages = function(messages){
	$("#messages").empty()
	for (var index in messages){
		if (messages[index].isSecret == true){
			messages[index]["options"][0].apply(game["country"])
			} else {
			(function(){
				var message = messages[index];
				$("#messages").append(messages[index]["title"])
				var button = $("<button>Open</button>").click(function(){
					displayMessage(message)
				});
				$("#messages").append(button).append("<br/>")
			}())
		}
	}
};

var populateStats = function(country){
	for (var trait in country){
		var element = $("#" + trait)
		if (trait === "usopinion" || trait === "ussropinion"){
			element.html(relationsToDescription(country[trait]))
			element.addClass(statToDescription(country[trait]))	
			continue
		}
		else {
			element.html(statToDescription(country[trait]))
			element.addClass(statToDescription(country[trait]))
		}
	}
}

var displayMessage = function(message){
	var display = $("#messagedisplay")
	display.empty()
	display.append("<h1>" + message["title"] + "</h1>")
	display.append(message["body"]).append("<br/>")
	for (var option in message["options"]){
		display.append(message["options"][option].description)
		var button = $("<button>Select</button>").click(function(){
			var selection = message["options"][option];
			selection.apply(game["country"])
			display.empty()
			display.append(selection.acceptMessage)
			message.delete()
		})
		display.append(button).append("<br/>")
		}
	}	