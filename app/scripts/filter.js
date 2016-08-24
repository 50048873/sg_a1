'use strict';

app.filter('pageBy', function() {
	return function(input, currentPage, limit) { 
		if (input) { 
			var startindex = (currentPage - 1) * limit;
			limit *= currentPage;
			return input.slice(startindex, limit);
		}
	};
});