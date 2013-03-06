var Help = {
	paras: [],
	para: function(h) {
		var p = $('<p></p>').html(h) 
		this.paras.push(p);
		return p;
	},
	display: function() {
		if (this.paras.length || $('div#agile_help_container').size()) {
			return;
		}
		var container = $('<div id="agile_help_container"></div>');
		this.para('<span class="agile_help_close">(close)</span>');
		this.para('<h1>Trello 3000 Help</h1>');
		this.para('<h3>Adding estimate units</h3>');
		this.para('Estimate units represent how many units resources (hours, days, etc.) will be needed to solve a card. Add this value in the title of the card, between paranthesis.');
		this.para('<img src="https://dl.dropbox.com/u/1618599/trello3000/s1.png"/>');
		this.para('<h3>Adding spent units</h3>');
		this.para('Spent units represent how many resource units were actually spent to solve this card.');
		this.para('<img src="https://dl.dropbox.com/u/1618599/trello3000/s2.png"/>');
		this.para('<h3>Legend</h3>');
		this.para('"S:" = Spent units');
		this.para('"E:" = Estimated units');
		this.para('"R:" = Remaining units untill all cards are done');
		this.para('<img src="https://dl.dropbox.com/u/1618599/trello3000/s4.png"/>');
		var body = $('body');
		$.each(this.paras, function(idx, obj) {
				container.append(obj);
			});
		container.click(function() {
				Help.close();
			});
		container.hide();
		body.append(container);
		container.fadeIn('fast');
	}, 
	close: function() {
		var container = $('div#agile_help_container');
		this.paras = [];
		container.fadeOut('fast', function() {
				container.remove();
			});
	}
}
