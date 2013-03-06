QUnit.config.autostart = false;
$(function(){

		var TEST_DELAY = 4000;
		setTimeout(function(){
				var testScaffold = $('<div id="qunit-container"><h1 id="qunit-header">Trello 3000 Test Suite</h1> <div id="qunit-testresult"></div><h2 id="qunit-banner"></h2> <ol id="qunit-tests"></ol> <div id="qunit-fixture"></div></div>');
				$('body').append(testScaffold);
				runTests();
			}, TEST_DELAY);
});

function makeHeaderToggle() {
	$('h1#qunit-header').click(function(){
			$(this).siblings().toggle();
		});
}

function runTests() {
	makeHeaderToggle();
	QUnit.start();

	test("Number of lists", function() {
			var numberOfLists = List.all().size();
			ok(numberOfLists == 3, "we should have 3 lists");
		});

	test("Number of cards", function() {
			var numberOfCards = 0;
			var targetNumberOfCards = 7;
			List.all().each(function(i, list){
					List.cards(list).each(function(j, card){
							numberOfCards += 1;
						});
				});	
			ok(numberOfCards == targetNumberOfCards, "Error counting cards");
		});

	test("Valid title", function() {
			var finalTitle = "";
			var targetTitle = "haha";
			var titleFound = false;
			List.all().each(function(i, list){
					List.cards(list).each(function(j, card){
							var titleTag = Card.titleTag(card);
							var title = titleTag.text();
							var cleanTitle = Card.cleanTitle(title);
							if (cleanTitle.search(targetTitle) != -1) {
								titleFound = true;
							}
						});
				});
			ok(titleFound, "at least one card should have the title 'haha'");
		});

	test("Correct estimated hours for 1 card", function() {
			var listIndex = 0;
			var cardIndex = 0;
			var estimation = 0;
			var neededEstimation = 3;
			List.all().each(function(i, list) {
					List.cards(list).each(function(j, card) {
							if (i == listIndex && j == cardIndex) {
								var titleTag = Card.titleTag(card);
								var tmpTitleTag = titleTag.clone();
								tmpTitleTag.children('span').remove();
								var title = tmpTitleTag.text();
								estimation = Card.estimationFromTitle(title);
							}
						});
				});
			ok(neededEstimation == estimation, "Error reading estimation.");
		});

	test("Correct spent hours for 1 card", function() {
			var listIndex = 0;
			var cardIndex = 1;
			var spent = 0;
			var targetSpent = 1; 
			List.all().each(function(i, list) {
					List.cards(list).each(function(j, card) {
							if (i == listIndex && j == cardIndex) {
								var titleTag = Card.titleTag(card);
								var tmpTitleTag = titleTag.clone();
								tmpTitleTag.children('span').remove();
								var title = tmpTitleTag.text();
								spent = Card.spentFromTitle(title);
							}
						});
				});
			ok(targetSpent == spent, "Error reading spent units.");
		});

	test("Correct total estimated", function() {
			var totalEstimation = 0;
			var targetTotalEstimation = 20;
			List.all().each(function(i, list) {
					List.cards(list).each(function(j, card) {
							var titleTag = Card.titleTag(card);
							var tmpTitleTag = titleTag.clone();
							tmpTitleTag.children('span').remove();
							var title = tmpTitleTag.text();
							totalEstimation += Card.estimationFromTitle(title);
						});
				});
			ok(totalEstimation == targetTotalEstimation, "Error reading total estimated units.");
		});

	test("Correct total spent", function() {
			var totalSpent = 0;
			var targetTotalSpent = 4;
			List.all().each(function(i, list) {
					List.cards(list).each(function(j, card) {
							var titleTag = Card.titleTag(card);
							var tmpTitleTag = titleTag.clone();
							tmpTitleTag.children('span').remove();
							var title = tmpTitleTag.text();
							totalSpent += Card.spentFromTitle(title);
						});
				});
			ok(totalSpent == targetTotalSpent, "Error reading total spent units.");
		});

	test("Trim card title", function(){
			var targetEstimated = 3;
			var title = "(3) Funky title";
			var estimated = Card.estimationFromTitle(title);
			ok(estimated == targetEstimated, "Error in calculating estimated units.");

			title = " (3) Funky title";
			estimated = Card.estimationFromTitle(title);
			ok(estimated == targetEstimated, "Error in calculating estimated units with 1 space in front.");

			title = "  (3) Funky title";
			estimated = Card.estimationFromTitle(title);
			ok(estimated == targetEstimated, "Error in calculating estimated units with 2 spaces in front.");


			title = " (2/3) Why deadmau5?";
			var spent = Card.spentFromTitle(title);
			var targetSpent = 2;
			ok(spent == targetSpent, "Error calculating spent units.");
		});

	test("Clean title for double paranthesis", function() {
			var title = '(1) Spielphasen/Spielstati: Bezeichnungen wie "(n. V)"';
			var estimate = Card.estimationFromTitle(title);
			var targetEstimate = 1;
			ok(estimate == targetEstimate, "Error reading spent time");
		});

	test("Help Button", function() {
			ok($('.' + HelpButton.class).size() == 1, 'Error adding the Help Button');
		});
}
