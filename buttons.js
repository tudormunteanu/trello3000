var CopyToClipboardButton = {
	create : function(text) {
		var b = $("<a href=\"#\">"+ Language.copy_to_clipboard +"</a>").addClass('button-link agile_close_button');
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
			copyButtonContainer.append(copyButton);
		} else {
			copyButton = copyButton.eq(0);
		}
	}
}


var HelpButton = {
	class: 'agile_help_button',
	create: function() {
		var b = $('<a href="#"></a>').addClass('header-btn header-notifications ' + this.class);
		var span = $('<span></span>').addClass('header-btn-text').html(Language.help_text);
		b.append(span);
		b.click(function(){
				Help.display();
			});
		return b;
	},
	display: function() {
		var header = $('div#header div.header-user');
		if (header.find('.' + this.class).size() == 0) {
			header.prepend(this.create());
		}
	}
}	
