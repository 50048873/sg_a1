'use strict';

app.controller('Action_Add_Controller', function($scope, $state) {
	$scope.modal_title = '新增';
	$scope.info = { };

	$('#actionModal').modal('show');

	/*if ($state.params.label) { 
		$scope.info.preLevel = $state.params.label;
	} else if ($scope.selected_row.label) { 
		$scope.info.preLevel = $scope.selected_row.label;
	}*/

	$scope.close = function() { 
		$('#actionModal').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
	};

	$scope.save = function(info) { 
		$('#actionModal').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
		console.log(info);
		console.log($scope.tree_data);
	};
})
.controller('Action_Del_Controller', function($scope, $state) {
	$scope.modal_title = '删除';
	$scope.info = { };

	$('#orgModalDelete').modal('show');

	$scope.close = function() { 
		$('#orgModalDelete').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
	};

	$scope.save = function(info) { 
		alert('您点了确定');
		$('#orgModalDelete').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
		console.log(info);
		console.log($scope.tree_data);
	};
})
.controller('Action_Edit_Controller', function($scope, $state) {
	$scope.modal_title = '编辑';
	$scope.info = { };

	$('#actionModal').modal('show');

	if ($state.params.label) { 
		$scope.info.preLevel = $state.params.label;
	} else if ($scope.selected_row.label) { 
		$scope.info.preLevel = $scope.selected_row.label;
	}

	$scope.close = function() { 
		$('#actionModal').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
	};

	$scope.save = function(info) { 
		$('#actionModal').on('hidden.bs.modal', function (e) {
			$state.go('app.action');
		})
		console.log(info);
		console.log($scope.tree_data);
	};
});