'use strict'; 

app.controller('OrganizationController', function($scope, $http, $confirm) {
	$scope.tree_data = [];
	//$scope.my_tree = {};

	//获取树型菜单数据
	$http({ 
		method: 'get',
		url: 'api/treemenu2.json'
	}).then(function(res) { 
		angular.forEach(res.data, function(val, index) { 
			if (val.rootMenu == '组织机构管理') { 
				$scope.tree_data = val.rootContent;
			}
		});
	}, function(err) { 
		swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
	});

	//获取员工数据
	$http({ 
		method: 'get',
		url: 'api/employee.json'
	})
	.then(function(res) { 
		$scope.employees = res.data;
	}, function(err) { 
		swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
	})
	.then(function() { 
		//模拟分页
		$scope.limit = 5;
		$scope.totalItems = $scope.employees.length;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
		    $scope.currentPage = pageNo;
		    //console.log(pageNo);
		};
	});

	//点击树型菜单显示相应员工内容到列表
	$scope.my_tree_handler = function(branch) {
		var currentDepartmentEmployee = [];
		$http({ 
			method: 'get',
			url: 'api/employee.json'
		}).then(function(res) { 
			if (branch.label != '武汉市第八医院') { 
				angular.forEach(res.data, function(val, index) { 
					if (branch.label == val.department) { 
						currentDepartmentEmployee.push(val);
					}
				});
				$scope.employees = currentDepartmentEmployee;
			} else { 
				$scope.employees = res.data;
			}
		}, function(err) { 
			swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
		});
		};

		//在表格里删除一行
		$scope.delRowFromTable = function(id) { 
			$confirm({text: '您确定要删除吗?', title: '删除确认', ok: '确定', cancel: '取消'})
			.then(function() {
				alert('您点了确定...');
			});
		};

		//单选：根据单选情况联动全选按钮
		$scope.check = function(data) { 
			for (var i = 0; i < $scope.employees.length; i++) { 
				if ($scope.employees[i].isChecked) { 
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
			for (var i = 0; i < $scope.employees.length; i++) { 
				if ($scope.employees[i].isChecked) { 
					checkedId.push($scope.employees[i].id);
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