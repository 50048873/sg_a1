'use strict';

app.controller('ActionController', function($scope, $http, $confirm) {
	$scope.tree_data = [];
	//$scope.my_tree = {};
	$scope.listData = [];

	$http({ 
		method: 'get',
		url: 'api/treemenu2.json'
	}).then(function(res) { 
		angular.forEach(res.data, function(val, index) { 
			if (val.rootMenu == '功能模块管理') { 
				$scope.tree_data = val.rootContent;
			}
		});
		
		angular.forEach($scope.tree_data, function(val, index) { 
			if (val.pid == null) { 
				$scope.listData.push(val);
			}
		});
		
	}, function(err) { 
		swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
	});

	//根据传入的id获取树型菜单中下一级数据
	var res = [];
	var getTreeNextLevel = (function f(arr, id) { 
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

	//点击树型菜单显示相应下一级菜单内容到列表
	$scope.my_tree_handler = function(branch) {
		$scope.output = "label: " + branch.label + ', id: ' + branch.id;
		$scope.listData = getTreeNextLevel($scope.tree_data, branch.id);
    };

    //点击列表新增获取此行数据，给add.js用
    $scope.add = function(data) {
		$scope.selected_row = data;
    };

    /*
    //在菜单树里删除（注意：此方需在指令中添加{controller: 'OrganizationController'}）
    $scope.delFromTree = this.delFromTree = function(id) { 
    	$confirm({text: '您确定要删除吗?', title: '删除确认', ok: '确定', cancel: '取消'})
			.then(function() {
				alert('您点了确定');
			});
    };
    */

    //在表格里删除一行
    $scope.delRowFromTable = function(id) { 
    	$confirm({text: '您确定要删除吗?', title: '删除确认', ok: '确定', cancel: '取消'})
			.then(function() {
				alert('您点了确定...');
			});
    };

    //获取用户选择的复选框id
    var checkedId = [];
    $scope.check = function(data) { 
    	/*var index = checkedId.indexOf(data.id);
    	if (index == -1) { 
    		checkedId.push(data.id);
    	} else { 
    		checkedId.splice(index, 1);
    	}
    		
    	console.log(checkedId);*/
    	for (var i = 0; i < $scope.listData.length; i++) { 
    		if ($scope.listData[i].isChecked) { 
    			$scope.isAllChecked = true;
    		} else { 
    			$scope.isAllChecked = false;
    			break;
    		}
    	}

    };

    //选择当前所有复选框
    $scope.checkAll = function(data) { 
    	for (var i = 0; i < data.length; i++) { 
    		if ($scope.isAllChecked) { 
    			data[i].isChecked = true;
    		} else { 
    			data[i].isChecked = false;
    		}
    	}
    };

    //批量删除
    $scope.batchDelete = function() { 
    	var checkedId = [];
    	for (var i = 0; i < $scope.listData.length; i++) { 
    		if ($scope.listData[i].isChecked) { 
    			checkedId.push($scope.listData[i].id);
    		}
    	}
    	console.log(checkedId);
    	$confirm({text: '确定要删除选中的行吗?', title: '批量删除确认', ok: '确定', cancel: '取消'})
			.then(function() {
				alert('您点了确定');
				console.log(checkedId);
			});
    };

});