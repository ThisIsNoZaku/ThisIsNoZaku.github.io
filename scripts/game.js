var Game = function(){
	this.messages = [],
	this.country = new Country()
	
	for (var stat in this.country.economy){
		$("#economy").append("<ul id="+ stat +"><h3>" + stat.charAt(0).toUpperCase() + stat.substr(1) +"<h3></ul>")
		$("#economy > #" + stat).append("<li id=v'value'>" + this.country.economy[stat].getDescriptiveStat("value") + "</li>").attr('title', this.country.economy[stat].description)
	}
	
	for (var faction in this.country.factions){
		$("#politics").append("<ul id="+ this.country.factions[faction].name +"><h3>" + this.country.factions[faction].name +"<h3></ul>").attr("title", "These are the powerful, influential groups in your country.")
		var description = this.country.factions[faction].description;
		
		$("#politics > #" + this.country.factions[faction].name).append("<ul id='influence'><b>Influence</b><ul/>")
		$("#politics > #" + this.country.factions[faction].name +" > #influence").append("<li>"+ this.country.factions[faction].getDescriptiveStat("power") +"</li>").attr("title", "Influence is the relative power this faction has in your country. "+
		"The higher Influence is, the more power the faction has to help or hinder your governance of the country.")
		
		$("#politics > #" + this.country.factions[faction].name).append("<ul id='support'><b>Support</b><ul/>")
		$("#politics > #" + this.country.factions[faction].name +" > #support").append("<li>"+ this.country.factions[faction].getDescriptiveStat("support")+"</li>").attr("title", "Support is how").attr("title", "Support is how much the faction supports you government. "+
		"High support means the faction will help you while low means they will try to weaken you.")
	}
	
	for (var relations in this.country.diplomacy){
		$("#diplomacy").append("<ul id=" + relations + "><h3>" + relations + "</h3></ul>")
		$("#diplomacy > #" + relations).append("<li id='relations'>" + this.country.diplomacy[relations].getDescriptiveRelations("relations") + "</li>").attr('title',(this.country.diplomacy[relations].description))
		}
		
	for (var security in this.country.security){
		$("#security").append("<ul id=" + security + "><h3>" + security.charAt(0).toUpperCase() + security.replace('_', ' ').substr(1) + "</h3></ul>")
		$("#security > #" + security).attr('title', this.country.security[security].description)
			.append("<ul id='quality'><b>Quality</b></ul>")
			.append("<ul id='reliability'><b>Reliability</b></ul>")
		$("#security > #" + security + " > #quality").append("<li>" + this.country.security[security].getDescriptiveStat("quality") + "</li>").attr("How effective your security apparatus is at keeping your country safe.")
		$("#security > #" + security + " > #reliability").append("<li>" + this.country.security[security].getDescriptiveStat("reliability") + "</li>").attr("How politically reliable and loyal your security apparatus is.")
		}
	
	return this;
}
//Country constructor
var Country = function(){
	//Converts the numeric value of a stat to a descriptive form.
	var getDescriptiveStat = function(statName){
		var value = this[statName]
		if (value >= 0 && value < 20)
		return "Terrible"
		if (value >= 20 && value < 40)
		return "Poor"
		if (value >= 40 && value < 60)
		return "Adequate"
		if (value >= 60 && value < 80)
		return "Good"
		if (value >= 80 && value < 100)
		return "Excellent"
	}
	
	this.economy = {
		growth : {value: 50, description : "How much your economy is growing. Pretty much everyone likes it when the economy is growing.", getDescriptiveStat: getDescriptiveStat},
		infrastructure : {value : 50, description : "The quality of the infrastructure (roads, water and elecrical utilities, irrigation, etc.) in your country. Sufficient infrastructure is very important for a good ecnomy.", getDescriptiveStat: getDescriptiveStat},
		food : {value: 50, description: "Your country's access to sufficient food to feed it's population. A lack of food causes enormous social disruption.", getDescriptiveStat: getDescriptiveStat},
		medicalcare : {value: 50, description: "The citizen's access to sufficient, high quality medical care. Good medical care keeps the population happy and healthy.", getDescriptiveStat: getDescriptiveStat},
		education : {value: 50, description : "Your people's access to education and training. A highly educated population is the most important part of a strong economy, but the educated often agitate for various reforms.", getDescriptiveStat: getDescriptiveStat}
	}
	
	this.factions = 
	[
	new Faction('Militarists', "Represents the military and 'hawkish' elements of civil society. Favors strengthening the military and flexing your muscles.", 50, 50),
	new Faction('Nationalists', "Represents the fervent patriots in your country. They like anything that makes their country look impressive and powerful, and hate it when you let yourself get pushed around by foreigners.", 50, 50),
	new Faction('Industrialists', "Represents the business and entrepreneurial parts of the nation. Favors anything that makes them richer, whether it's good economic conditions conductive to growth or blatant bribery.", 50, 50),
	new Faction('Religious', "Represents the most fervent religious believers in your nation. They are socially conservative and strongly prefer preferential treatment.", 50, 50),
	new Faction('Socialists', "Represents those who seek economic equality through government control of economic activities. Supports strong government and wealth distribution.", 50, 50),
	new Faction('Communists', "Represents those supporters of international revolution.  Their biggest concern is friendship with the Soviet Union and opposition to the US and capitalism.", 50, 50),
	new Faction('Capitalists', "Represents those supporters of free markets and free elections. They want good relations with the United States and opposition to the USSR and international communism", 50, 50)
	]
	
	var getDescriptiveRelations = function(statName){
		var value = this[statName]
		if (value >= 0 && value < 20)
		return "Hostile"
		if (value >= 20 && value < 40)
		return "Cold"
		if (value >= 40 && value < 60)
		return "Cordial"
		if (value >= 60 && value < 80)
		return "Warm"
		if (value >= 80 && value < 100)
		return "Close"
	}
	
	this.diplomacy = {
		US : {relations: 0, description: "Your relations with the United States. The US likes to support democratic, capitalist regimes but cares most about anti-Communism.", getDescriptiveRelations: getDescriptiveRelations},
		USSR : {relations: 0, description: "Your relations with the Soviet Union. The USSR likes to support non-capitalist regimes who don't get along with the west but cares most about spreading Revolution.", getDescriptiveRelations: getDescriptiveRelations}
	}
	
	this.security = {
		military : {quality:0, reliability:0, description: "Your military protects your country from foreign attack.", getDescriptiveStat : getDescriptiveStat},
		police : {quality:0, reliability:0, description: "Your national police are your primary tool to combat insurgency within your country.", getDescriptiveStat : getDescriptiveStat},
		intelligence_services : {quality: 0, reliability: 0, description : "Your intelligence services are your primary defense against infiltration by foreign spies.", getDescriptiveStat : getDescriptiveStat}
	}
	
	this.modifiers = []
}
//Faction constructor
var Faction = function(name, description, power, support){
	this.name = name;
	this.description = description;
	this.power= power,
	this.support= support
	this.getDescriptiveStat = function(statName){
		var value = this[statName];
		if (value >= 0 && value < 20)
		return "Pathetic"
		if (value >= 20 && value < 40)
		return "Weak"
		if (value >= 40 && value < 60)
		return "Mediocre"
		if (value >= 60 && value < 80)
		return "Adequate"
		if (value >= 0 && value < 20)
		return "Strong"
	}
}

var SecurityService = function(quality, reliability){
	this.quality = quality,
	this.reliability = reliability
}