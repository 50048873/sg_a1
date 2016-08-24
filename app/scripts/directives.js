'use strict';

//views/treemenu/treemune.html里的指令
app.directive('treeOperate', function() {
	return {
		restrict: 'A',
		link: function(scope, ele, attr) {
        	ele.mouseenter(function(event) {
        		ele.$current = $(this).find('.treeOperate');
				ele.$current.css('display', 'inline-block');
			}).mouseleave(function(event) {
				ele.$current.css('display', 'none');
			});
		}
	};
});