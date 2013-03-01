/*
 TODO:
v 0.1
x show exact name for each of the indicators on the top right. E.g. Estimated hours: xx, Spent hours: YY
x add option to copy card id into clipboard
x make the plugin use the (x/y) synthax, like the old plugin
x finish tests
x trim empty spaces when calculating values from titles
x move the Copy To Clipboard button to the bottom of the list, otherwise buttons jump
x add time left for development: estimated time - spent time
- add help button
- find a cool color scheme (and maybe one alternative)
- when card is open, add buttons for estimates under the title input field
- think of a way to calculate cards that are done (maybe just archive it)
- priorities: can be a number from 0 to 10. 0 highes priority, 10 lowest >> Is this really needed?

v 0.2
- option to calculate estimates only for visible cards (after filter)
- generate a list of all the open tasks, organized by lists, cards with URLs and estimates

BUGS:

*/

var mainUpdateInterval;
var mainUpdateStep = 2000;
var ESTIMATION = 'estimation';
var SPENT = 'spent';
var REMAINING = 'remaining';
var spentTotal;
var estimationTotal;
var remainingTotal;

$(function(){
		//
		// Board level total values
		//
		spentTotal = InfoBoxFactory.makeTotalInfoBox(SPENT);
		estimationTotal = InfoBoxFactory.makeTotalInfoBox(ESTIMATION);
		remainingTotal = InfoBoxFactory.makeTotalInfoBox(REMAINING);


		HelpButton.display();

		//
		// Main Loop
		//
		mainUpdateInterval = setInterval(update, mainUpdateStep);	
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
	var difference = globalTotalEstimation - globalTotalSpent;
	remainingTotal.html(Card.remainingLabelText(difference));

	CopyToClipboardButton.update();
}

function stopUpdate() {
	window.clearInterval(mainUpdateInterval);
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

var InfoBoxManager = {
	//
	// TODO: Fix this weirdness. The elements are created from outside, 
	// but used inside here. Weird dependency.
	//
	update: function(){
		var boardHeader = $('div#board-header');
		//var boardHeaderChildren = boardHeader.children();
		boardHeader.append(estimationTotal);
		boardHeader.append(spentTotal);
		boardHeader.append(remainingTotal);
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
		} else if (type == REMAINING) {
			return box.addClass('agile_remaining_box').html('R: 0');
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
