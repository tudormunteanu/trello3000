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
