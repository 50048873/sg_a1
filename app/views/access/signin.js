'use strict';

app.controller('SigninController', ['$scope', '$http', '$state', function($scope, $http, $state) {
	
	$('#username').focus();
	$scope.login_num = 1;

	// Try to login
	$scope.login = function() {
		$scope.logining = !$scope.logining;
		
		$http.get('api/login', {username: $scope.username, password: $scope.password})
			.then(function(res) {
				var user = res.data.user;
				if ( $scope.username != user.username || $scope.password != user.password  ) {
					$scope.logining = !$scope.logining;
					swal("出错啦!", "用户名或密码错误，请确定后重试!", "error");
				} else {
					$state.go('app.action');
				}
			}, function(err) {
				$scope.logining = !$scope.logining;
				swal("服务器出错啦!", err.statusText + ': ' + err.status, "error");
			});
	};
}]);