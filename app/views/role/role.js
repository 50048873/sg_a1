'use strict';

app.controller('RoleController', function($scope, $http, $confirm) {

	//获取角色数据
	$http({ 
		method: 'get',
		url: 'api/role.json'
	})
	.then(function(res) { 
		$scope.roles = res.data;
	}, function(err) { 
		swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
	})
	.then(function() { 
		//模拟分页
		$scope.limit = 5;
		$scope.totalItems = $scope.roles.length;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
		    $scope.currentPage = pageNo;
		    //console.log(pageNo);
		};
	});


	//在表格里删除一行
	$scope.delRowFromTable = function(id) { 
		$confirm({text: '您确定要删除吗?', title: '删除确认', ok: '确定', cancel: '取消'})
		.then(function() {
			alert('您点了确定...');
		});
	};

	//单选：根据单选情况联动全选按钮
	$scope.check = function(data) { 
		for (var i = 0; i < $scope.roles.length; i++) { 
			if ($scope.roles[i].isChecked) { 
				$scope.isAllChecked = true;
			} else { 
				$scope.isAllChecked = false;
				break;
			}
		}
	};

	//全选：选择或取消当前所有复选框
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
		for (var i = 0; i < $scope.roles.length; i++) { 
			if ($scope.roles[i].isChecked) { 
				checkedId.push($scope.roles[i].id);
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