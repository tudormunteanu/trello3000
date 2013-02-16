$(function(){
		var testScaffold = '<div id="qunit-container"><h1 id="qunit-header">Trello Scrum Test Suite</h1> <h2 id="qunit-banner"></h2> <div id="qunit-testrunner-toolbar"></div>  <ol id="qunit-tests"></ol> <div id="qunit-fixture"></div></div>';
		$('body').append(testScaffold);
		setTimeout(function(){
				runTests();
			}, 5000);
	});

function makeHeaderToggle() {
	$('h1#qunit-header').click(function(){
			$(this).siblings().toggle();
		});
}

function runTests() {
	console.log('run test');
	makeHeaderToggle();

	test("Number of lists", function() {
			var numberOfLists = List.all().size();
			ok(numberOfLists == 3, "we should have 3 lists");
		});

	test("Number of cards", function() {
			var numberOfCards = 0;
			List.all().each(function(i, list){
					List.cards(list).each(function(j, card){
							numberOfCards += 1;
						});
				});	
			ok(numberOfCards == 6, "we should have 6 cards");
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
		});

	test("Correct spent hours for 1 card", function() {
		});

	test("Correct total estimated", function() {
		});

	test("Correct total spent", function() {
		});
}
