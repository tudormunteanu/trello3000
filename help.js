var Help = {
	display: function() {
		var container = $('<div id="agile_help_container"></div>');
		var h = $('<h1>Trello 3000 Help</h1>');
		var p1 = $('<p>Adding spent/estimates</p>');
		var p2 = $('<p>Legend</p>');
		var p3 = $('<p></p>');
		var p4 = $('<p>Additional Card Buttons</p>');
		var p5 = $('<p></p>');
		var body = $('body');
		container.append(h).append(p1);
		container.click(function() {
				Help.close();
			});
		body.append(container);
	}, 
	close: function() {
		$('div#agile_help_container').remove();
	}
}
