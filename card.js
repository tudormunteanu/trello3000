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
		var trimmedTitle = $.trim(title);
		if (!stringStartsWith(trimmedTitle, this.startSeparator)){
			return 0;
		} 
		trimmedTitle = trimmedTitle.substring(1, trimmedTitle.length);
		var splits = trimmedTitle.split(this.mainSeparator);
		if (splits.length >= 2) {
			var splits2 = splits[0].split(this.secondarySeparator);
			if (splits2.length == 2) {
				var value = parseFloat(splits2[1]);
				if (isNaN(value)) {
					return 0;
				}
				return value;
			} else {
				var value = parseFloat(splits[0]);
                if (isNaN(value)) {
					return 0;
				}
				return value; 
			}
		}
		return 0;
	},
	spentFromTitle : function(title) {
		var trimmedTitle = $.trim(title);
		if (!stringStartsWith(trimmedTitle, this.startSeparator)){
			return 0;
		}

		trimmedTitle = trimmedTitle.substring(1, trimmedTitle.length);
		var splits = trimmedTitle.split(this.mainSeparator);
		if (splits.length == 2) {
			var splits2 = splits[0].split(this.secondarySeparator);
			if (splits2.length == 2) {

				var value = parseFloat(splits2[0]);

				if (isNaN(value)) {
					return 0;
				}
				return value;
			}
		}
		return 0;
	},
	//
	// Return the clean version of the title, w/o the prefixes.
	// E.g. For "(2) This task rocks" this will give "This task rocks"
	// E.g. For "(1/2) This task rocks" this will give "This task rocks"
	//
	cleanTitle : function(title) {
		var trimmedTitle = $.trim(title);
		if (!stringStartsWith(trimmedTitle, this.startSeparator)){
			return title;
		} 
		var splits = trimmedTitle.split(this.mainSeparator);
		if (splits.length == 2) {
			return splits[1];
		}
		return trimmedTitle;
	},
	estimationLabelText : function(estimationNumber) {
		return "E: " + String(estimationNumber);
	},
	spentLabelText : function(spentNumber) {
		return "S: " + String(spentNumber);
	},
	remainingLabelText: function(number) {
		return "R: " + String(number);
	},
	randomNumber: function () {
		return Math.floor(Math.random()*11);
	},
	titleTag: function (card) {
		return $(card).children('a.list-card-title').eq(0);
	}
}
