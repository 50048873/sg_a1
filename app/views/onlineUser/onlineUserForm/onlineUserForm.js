'use strict';

app.controller('OnlineUser_add_controller', function($scope, $state) {
	$scope.modal_title = '新增';
	$scope.info = { };

	$('#organizationModal').modal('show');

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.onlineUser');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.onlineUser');
		})
	};
})
.controller('OnlineUser_edit_controller', function($scope, $state) {
	$scope.modal_title = '编辑';
	$scope.info = { };

	$('#organizationModal').modal('show');

	$scope.close = function() { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.onlineUser');
		})
	};

	$scope.save = function(info) { 
		$('#organizationModal').on('hidden.bs.modal', function (e) {
			$state.go('app.onlineUser');
		})
	};
});