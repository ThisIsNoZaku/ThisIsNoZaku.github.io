$().ready(function(){
	game = initialize()
	var country = game["country"]
	
	$("#messages").on('messages_changed', function(){
		populateMessages(game["messages"])
		})
	
	$("#sidebar").on('stats_changed', function(){
		populateStats(country);
		})
	
	populateMessages(game["messages"])
	populateStats(country)
})

var numberToDescriptive = function(number){
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

var populateMessages = function(messages){
	$("#messages").empty()
	for (var index in messages){
		(function(){
			var message = messages[index];
			$("#messages").append(messages[index]["title"])
			var button = $("<button>Open</button>").click(function(){
				displayMessage(message)
			});
			$("#messages").append(button).append("<br/>")
		}())
	}
};

var populateStats = function(country){
	for (var trait in country){
		var element = $("#" + trait)
		element.html(numberToDescriptive(country[trait]))
		element.addClass(numberToDescriptive(country[trait]))
	}
}

var displayMessage = function(message){
	var display = $("#messagedisplay")
	display.empty()
	display.append("<h1>" + message["title"] + "</h1>")
	display.append(message["body"]).append("<br/>")
	for (var option in message["options"]){
		display.append(message["options"])
		var button = $("<button>Select</button>").click(function(){
			var selection = message["options"][option];
			selection.apply(game["country"])
			display.empty()
			display.append(selection.acceptMessage)
			message.delete()
		})
		display.append(button)
	}
}