'use strict';

app.controller('Organization_Addlist_Controller', function($scope, $state) {
	$scope.modal_title = '新增';
	$scope.info = { };

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
.controller('Organization_Editlist_Controller', function($scope, $state) {
	$scope.modal_title = '编辑';
	$scope.info = { };

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
});