'use strict';

app.controller('Role_add_controller', function($scope, $state) {
	$scope.modal_title = '新增';
	$scope.info = { };

	$('#organizationModal').modal('show');

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.role');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.role');
		})
	};
})
.controller('Role_edit_controller', function($scope, $state) {
	$scope.modal_title = '编辑';
	$scope.info = { };

	$('#organizationModal').modal('show');

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.role');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.role');
		})
	};
});