'use strict';

app.controller('Organization_Addtree_Controller', function($scope, $state) {
	//$scope.modal_title = '新增';
	$scope.info = { };
	$scope.pDepartment = $state.params.label;

	$('#organizationModal').modal('show');

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};
})
.controller('Organization_Deltree_Controller', function($scope, $state) {
	//$scope.modal_title = '删除';
	$scope.info = { };

	$('#orgModalDelete').modal('show');

	$scope.close = function() { 
		$('#orgModalDelete').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};

	$scope.save = function(info) { 
		alert('您点了确定');
		$('#orgModalDelete').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};
})
.controller('Organization_Edittree_Controller', function($scope, $state) {
	//$scope.modal_title = '编辑';
	$scope.info = { };

	$('#organizationModal').modal('show');

	if ($state.params.label) { 
		$scope.info.preLevel = $state.params.label;
	} else if ($scope.selected_row.label) { 
		$scope.info.preLevel = $scope.selected_row.label;
	}

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.organization');
		})
	};
});