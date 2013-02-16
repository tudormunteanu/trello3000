/*
 TODO:
v 0.1
x show exact name for each of the indicators on the top right. E.g. Estimated hours: xx, Spent hours: YY
x add option to copy card id into clipboard
x make the plugin use the (x/y) synthax, like the old plugin
- finish tests
- when card is open, add buttons for estimates under the title input field
- add time left for development: estimated time - spent time
- think of a way to calculate cards that are done (maybe just archive it)
- priorities: can be a number from 0 to 10. 0 highes priority, 10 lowest >> Is this really needed?
- move the Copy To Clipboard button to the bottom of the list, otherwise buttons jump

v 0.2
- generate a list of all the open tasks, organized by lists, cards with URLs and estimates
BUG:
- 

*/

var mainUpdate;
var mainUpdateStep = 2000;
var ESTIMATION = 'estimation';
var SPENT = 'spent';
var spentTotal;
var estimationTotal;

$(function(){
		//
		// Board level total values
		//
		spentTotal = InfoBoxFactory.makeTotalInfoBox(SPENT);
		estimationTotal = InfoBoxFactory.makeTotalInfoBox(ESTIMATION);

		//
		// Main Loop
		//
		mainUpdate = setInterval(update, mainUpdateStep);	
});


function update() {
	console.log('update');

	InfoBoxManager.update();

	var globalTotalSpent = 0;
	var globalTotalEstimation = 0;

	List.all().each(function(i, el){
			var h2 = $(el).children('h2'); 

			//
			// Estimation box
			//
			var estimationBox = InfoBoxFactory.makeInfoBox(ESTIMATION); 
			var brTag = $("<br /> ");
			var h2SiblingsEstimationBox = h2.siblings('div.agile_estimation_box');
			if (h2SiblingsEstimationBox.size() < 1) {
				h2.after(estimationBox);
			} else {
				estimationBox = h2SiblingsEstimationBox.eq(0);
			}

			//
			// Spent box
			//
			var spentBox = InfoBoxFactory.makeInfoBox(SPENT);
			var h2SiblinsSpentBox = h2.siblings('div.agile_spent_box');
			if (h2SiblinsSpentBox.size() == 0) {
				h2.after(spentBox);
				h2.after(brTag);
			} else {
				spentBox = h2SiblinsSpentBox.eq(0);
			}

			var cards = List.cards(el);
			var totalEstimation = 0;
			var totalSpent = 0;
			cards.each(function(k, card){
					var originalTitleTag = Card.titleTag(card);

					LabelsManager.update($(card));

					//
					// Get the estimated scrum units
					//
					var tmpTitleTag = originalTitleTag.clone();
					tmpTitleTag.children('span').remove();
					var title = tmpTitleTag.text();
					var estimation = Card.estimationFromTitle(title);
					totalEstimation += estimation;

					//
					// Get the spent scrum units
					//
					var spent = Card.spentFromTitle(title);
					totalSpent += spent;

					//
					// Show a title w/o the markup
					//
					var originalTitleSiblings = originalTitleTag.siblings('a.agile_clone_title');
					if (originalTitleSiblings.size() == 0) {
						var cloneTitleTag = originalTitleTag.clone();
						originalTitleTag.addClass('agile_hidden');
						cloneTitleTag.addClass('agile_clone_title');
						originalTitleTag.after(cloneTitleTag);
						var cleanTitle = Card.cleanTitle(title);
						cloneTitleTag.contents().last()[0].textContent = cleanTitle;
					} else {
						var cloneTitleTag = originalTitleSiblings.eq(0);
						var cleanTitle = Card.cleanTitle(title);
						cloneTitleTag.contents().last()[0].textContent = cleanTitle;
					}

					//
					// Badges
					//
					var badges = $(card).children('div.badges');
					// Spent
					var spentBadge = badges.children('div.' + BadgeFactory.spentBadgeClass());	
					if (spentBadge.size() == 0) {
						spentBadge = BadgeFactory.makeSpentBadge();
						badges.append(spentBadge);
					} 
					spentBadge.contents().last()[0].textContent = spent;
					// Estimate
					var estimateBadge = badges.children('div.' + BadgeFactory.estimateBadgeClass());
					if (estimateBadge.size() == 0) {
						estimateBadge = BadgeFactory.makeEstimateBadge();
						badges.append(estimateBadge);
					}
					estimateBadge.contents().last()[0].textContent = estimation;
				});
			estimationBox.html(Card.estimationLabelText(totalEstimation));
			spentBox.html(Card.spentLabelText(totalSpent));
			globalTotalEstimation += totalEstimation;
			globalTotalSpent += totalSpent;
		});
	estimationTotal.html(Card.estimationLabelText(globalTotalEstimation));
	spentTotal.html(Card.spentLabelText(globalTotalSpent));

	CopyToClipboardButton.update();

}

function stopUpdate() {
	window.clearInterval(mainUpdateStep);
}

function stringStartsWith(string, input) {
	return string.substring(0, input.length) === input;
}


var List = {
	all : function() {
		return $('div.list-title');
	},
	cards : function(list) {
		var cardsContainer = $(list).parent().siblings('div.list-card-area').children('div.list-cards').eq(0);
		var cards = $(cardsContainer).children('div.list-card');
		return cards;
	}
}


var Card = {
	//
	// Separator used to split the custom values 
	// from the rest of the title
	//
	mainSeparator : ")",
	secondarySeparator: "/",
	startSeparator: "(",
	//
	// Parses the title to obtain the estimated number of units
	// E.g. "2--This is a string" will output the number 2.
	//
	estimationFromTitle : function(title) {
		if (!stringStartsWith(title, this.startSeparator)){
			return 0;
		} 
		title = title.substring(1, title.length);
		var splits = title.split(this.mainSeparator);
		if (splits.length == 2) {
			var splits2 = splits[0].split(this.secondarySeparator);
			if (splits2.length == 2) {
				var value = parseInt(splits2[1]);
				if (isNaN(value)) {
					return 0;
				}
				return value;
			} else {
				var value = parseInt(splits[0]);
				if (isNaN(value)) {
					return 0;
				}
				return value; 
			}
		}
		return 0;
	},
	spentFromTitle : function(title) {
		if (!stringStartsWith(title, this.startSeparator)){
			return 0;
		} 
		title = title.substring(1, title.length);
		var splits = title.split(this.mainSeparator);
		if (splits.length == 2) {
			var splits2 = splits[0].split(this.secondarySeparator);
			if (splits2.length == 2) {
				var value = parseInt(splits2[0]);
				if (isNaN(value)) {
					return 0;
				}
				return value;
			}
		}
		return 0;
	},
	//
	// Return the clean version of the title, w/o the
	// prefixes.
	// E.g. For "(2) This task rocks" this will give "This task rocks"
	// E.g. For "(1/2) This task rocks" this will give "This task rocks"
	//
	cleanTitle : function(title) {
		if (!stringStartsWith(title, this.startSeparator)){
			return title;
		} 
		var splits = title.split(this.mainSeparator);
		if (splits.length == 2) {
			return splits[1];
		}
		return title;
	},
	estimationLabelText : function(estimationNumber) {
		return "E: " + String(estimationNumber);
	},
	spentLabelText : function(spentNumber) {
		return "S: " + String(spentNumber);
	},
	randomNumber: function () {
		return Math.floor(Math.random()*11);
	},
	titleTag: function (card) {
		return $(card).children('a.list-card-title').eq(0);
	}
}

var InfoBoxManager = {
	update: function(){
		var boardHeader = $('div#board-header');
		var boardHeaderChildren = boardHeader.children();
		boardHeader.append(estimationTotal);
		boardHeader.append(spentTotal);
	}
}

var InfoBoxFactory = {
	makeInfoBox: function(type) {
		var box = $('<div></div>').addClass('agile_box');
		if (type == ESTIMATION) {
			return box.addClass('agile_estimation_box').html('E: 0');
		} else if (type == SPENT) {
			return box.addClass('agile_spent_box').html('S: 0');
		}
	},
	makeTotalInfoBox: function(type) {
		var box = $('<div></div>').addClass('agile_box').addClass('agile_total_box');
		if (type == ESTIMATION) {
			return box.addClass('agile_estimation_box').html('E: 0');
		} else if (type == SPENT) {
			return box.addClass('agile_spent_box').html('S: 0');
		}
	}
}

var BadgeFactory = {
	baseBadge: function() {
		return $('<div></div>').addClass('badge');
	},
	makeEstimateBadge: function() {
		var b = this.baseBadge().addClass('agile_badge').addClass(this.estimateBadgeClass());
		b.append('0');
		return b;
	},
	makeSpentBadge: function() {
		var b = this.baseBadge().addClass('agile_badge').addClass(this.spentBadgeClass());
		b.append('0');
		return b;
	},
	estimateBadgeClass: function() {
		return "agile_badge_estimate";
	},
	spentBadgeClass: function() {
		return "agile_badge_spent";
	}
}

var CopyToClipboardButton = {
	create : function(text) {
		var b = $("<a href=\"#\">"+ Language.copy_to_clipboard +"</a>").addClass('button-link').addClass('agile_close_button');
		b.click(function(){
				window.prompt ("Card ID", text);
			});
		return b;
	},
	update: function() {
		var windowOverlay = $('div.window-overlay div.window-sidebar');
		var cardId = windowOverlay.find('p.quiet.bottom span span').html();
		var copyButtonContainer = windowOverlay.find('div.window-module.other-actions div:first');
		var copyButton = copyButtonContainer.children('a.agile_close_button');	
		if (copyButton.size() == 0) {
			copyButton = CopyToClipboardButton.create(cardId);
			copyButtonContainer.prepend(copyButton);
		} else {
			copyButton = copyButton.eq(0);
		}
	}
}

var LabelsManager = {
	update: function(card) {
		card
		.removeClass('agile_green_card')
		.removeClass('agile_yellow_card')
		.removeClass('agile_orange_card')
		.removeClass('agile_red_card')
		.removeClass('agile_purple_card')
		.removeClass('agile_blue_card');
		var firstLabel = card.find('div.card-labels').children(':first');
		if (firstLabel.size()) {
			var classString = firstLabel.attr('class');
			if (classString.search('green') != -1) {
				card.addClass('agile_green_card');

			} else if (classString.search('yellow') != -1) {
				card.addClass('agile_yellow_card');

			} else if (classString.search('orange') != -1) {
				card.addClass('agile_orange_card');

			} else if (classString.search('red') != -1) {
				card.addClass('agile_red_card');

			} else if (classString.search('purple') != -1) {
				card.addClass('agile_purple_card');

			} else if (classString.search('blue') != -1) {
				card.addClass('agile_blue_card');
			}
		}
	}
}

var Language = {
	copy_to_clipboard : "Copy to clipboard"	
}

/*
 * Abandoned idea because
 * instantiating a new object on each update() might 
 * be increasing the memory usage.
 //
 // Card
 // 
 function Card() {};

 Card.prototype = {
 estimationFromTitle: function(title) {
 this.title = title;
 return 10;
	}
}
*/
