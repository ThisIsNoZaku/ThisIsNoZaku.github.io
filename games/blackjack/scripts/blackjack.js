var playerHand;
var dealerHand;
var cardDeck;
var playerFunds;
var bet;
var deckNumber;

//Initialization when the game page loads
$().ready(function(){
	init()
	//Start a new game
	$("#start").click(function(){
		bet = 10;
		playerFunds -= bet;
		$("#funds").val('$' + playerFunds)
		$("#dealerhand").empty()
		$("#playerhand").empty()
		$("#total").val('')
		playerHand = new Hand();
		dealerHand = new Hand();
		cardDeck = new Deck();
		cardDeck.shuffle();
		$("#hit").prop('disabled', false);
		$("#stand").prop('disabled', false);
		$("#double").prop('disabled', false);
		
		var card = cardDeck.draw();
		
		dealerHand.cards.push(card);
		$("#dealerhand").append("<img class='card' src=resources/images/back.png/>");
		card = cardDeck.draw();
		dealerHand.cards.push(card);
		$("#dealerhand").append("<img class='card' id=" + card.value + card.suit +" src=resources/images/" + card.value + card.suit +".png/>");
		
		card = cardDeck.draw();
		playerHand.cards.push(card);
		$("#playerhand").append("<img class='card' id=" + card.value + card.suit +" src=resources/images/" + card.value + card.suit +".png/>");
		card = cardDeck.draw();
		playerHand.cards.push(card);
		$("#playerhand").append("<img class='card' id=" + card.value + card.suit +" src=resources/images/" + card.value + card.suit +".png/>");
		playerturn(playerHand, dealerHand)
	})
	//Hit
	$("#hit").click(function(){
		var card = cardDeck.draw();
		playerHand.cards.push(card);
		$("#playerhand").append("<img class='card' id=" + card.value + card.suit +" src=resources/images/" + card.value + card.suit +".png/>");
		playerturn(playerHand, dealerHand)
	})
	//Stand
	$("#stand").click(function(){
		playerHand.finished = true;
		playerturn(playerHand, dealerHand)
	})
	//Double down
	$("#double").click(function(){
		playerFunds -= bet;
		bet  = 2 * bet;
		playerHand.finished = true;
		var card = cardDeck.draw();
		playerHand.cards.push(card);
		$("#playerhand").append("<img class='card' id=" + card.value + card.suit +" src=resources/images/" + card.value + card.suit +".png/>");
		playerturn(playerHand, dealerHand)
	})
	//Reset the game
	$("#reset").click(function(){
		document.cookie = "";
		init()
	})
	
	//Tooltips
	$("#funds").attr('title', 'Your winnings.');
	$("#start").attr('title', 'Start a new game.');
	$("#hit").attr('title', 'Receive another card.');
	$("#stand").attr('title', 'Take no more cards.');
	$("#double").attr('title', 'Double your bet and take exactly one more card');
})

var init = function(){
	//If there's a cookie for the player's money, set money to it's value. Otherwise, player starts with no money.
	if (typeof playerFunds == 'undefined'){
		var cookie = document.cookie.split(';')
		for (var key in cookie){
			if (cookie[key].split(':')[0] === 'funds'){
				playerFunds =  cookie[key].split(':')[1]
			}
		}
		if (cookie == "")
		playerFunds = 0;
	}
	
	playerHand = new Hand();
	dealerHand = new Hand();
	cardDeck = new Deck();
	cardDeck.shuffle();
	
	$("#playerhand").empty()
	$("#dealerhand").empty()
	$("#total").val("")
	$("#funds").val("")
	
	//Disable play buttons before the game hasn't started
	$("#hit").prop('disabled', true);
	$("#stand").prop('disabled', true);
	$("#double").prop('disabled', true);
	$("#split").prop('disabled', true);
	$("#funds").val('$' + playerFunds)
}

var GameOver = function(playerhand, dealerhand){
	if (playerhand.value() > 21){
		$("#total").val(playerhand.value() +"! You busted!")
		return;
	}
	else if (playerhand.value() == dealerHand.value()  && dealerhand.value() <= 21){
		$("#total").val(playerhand.value() +" vs " + dealerhand.value() + "! You pushed!")
		playerFunds += bet;
		$("#funds").val("$" + playerFunds)
		document.cookie = "funds:" + playerFunds
		return;
	}
	else if (playerhand.value() > dealerhand.value() || dealerhand.value() > 21){
		$("#total").val(playerhand.value() +" vs " + dealerhand.value() + "! You won!")
		playerFunds += (2 *bet);
		$("#funds").val("$" + playerFunds)
		document.cookie = "funds:" + playerFunds
		return;
	}
	else if (playerhand.value() < dealerHand.value() && dealerhand.value() <= 21){
		$("#total").val(playerhand.value() +" vs " + dealerhand.value() + "! You lost!")
		return;
	}
	
}

var playerturn = function(playerhand, dealerhand){
	$("#total").val(playerhand.value())
	if (playerhand.value() >= 21 || playerhand.finished)
	dealerturn(playerhand, dealerhand)
}

var dealerturn = function(playerhand, dealerhand){
	$("#dealerhand > .card").detach()
	
	$("#hit").prop('disabled', true);
	$("#stand").prop('disabled', true);
	
	for (var card in dealerhand.cards){	
		$("#dealerhand").append("<img class='cards' id="+ dealerhand.cards[card].value + dealerhand.cards[card].suit + " src=resources/images/" + dealerhand.cards[card].value + dealerhand.cards[card].suit +".png/>");
	}
	
	while(!dealerhand.finished){
		if (dealerhand.value() >= 17){
			dealerhand.finished = true;
			break;
		}
		var card = cardDeck.draw();
		dealerHand.cards.push(card);
		$("#dealerhand").append("<img src=resources/images/" + card.value + card.suit +".png/>");
	}
	GameOver(playerhand, dealerhand);
}

var displayhands = function(){
	var $showncards = $("#playerhand > .card")
	for (var card in playerhand){
		var found = false;
		for (var displayedcard in $showncards){
			if (card.value + "" + card.suit == displayedcards.attr('id')){
				found = true;
			}
		}
		if (!found){
			
			}
	}
}

var Hand = function(){
	this.cards = [];
	this.finished = false;
	this.value = function(){
		var value = 0;
		var aces = 0;
		for (var card in this.cards){
			if (this.cards[card].value == 'k' || this.cards[card].value == 'q' || this.cards[card].value == 'j')
			value += 10;
			else if (this.cards[card].value == 'a'){
				value += 11;
				aces++;
			}
			else{
				value += this.cards[card].value;
			}
		}
		if (value > 21){
			value -= (aces * 10);
		}
		return value;
	};
}

var Deck = function(){
	var deck;
	this.shuffle = function(decknumber){
		deck = []
		for (var i = 0; i < (decknumber > 1 ? decknumber : 1); i++){
			for (var suit in Suits){
				for (var value in Values){
					deck.push(new Card(Suits[suit], Values[value]));
				}
			}
		}
		
		for (var i = deck.length; i > 0; i--){
			var rand = Math.floor(Math.random() * i)
			var temp = deck[rand]
			deck[rand] = deck[i]
			deck[i] = temp
		}
	}
	
	this.draw = function(){
		var card = deck[0]
		deck.splice(card, 1)
		return card;
	}
}

var Card = function(suit, value){
	this.suit = suit;
	this.value = value;
}

//Card suit and value enums
var Suits = Object.freeze({"Hearts":'h', "Diamonds":'d', "Spades":'s', "Clubs":'c'})
var Values = Object.freeze({"Ace":'a', "Two":2, "Three":3, "Four":4, "Five":5, "Six":6, "Seven":7, "Eight":8, "Nine":9, "Ten":10, "Jack":'j', "Queen":'q', "King":'k'})