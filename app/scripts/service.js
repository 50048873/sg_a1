'use strict';

app.factory('GetTreeNextLevel', function() { 
	return function(arr, id) { 
		//根据传入的id获取树型菜单中下一级数据
		var res = [];
		var dg = (function f(arr, id) { 
			for (var i = 0; i < arr.length; i++) { 
				if (id == arr[i].id) { 
					if (arr[i].children.length) { 
						res = arr[i].children;
					} else { 
						res.length = 0;
						res.push(arr[i]);
					}
					break;
				} else if (arr[i].children.length) { 
					f(arr[i].children, id);
				}
			}
			return res;
		});
	};
});