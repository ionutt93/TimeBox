'use strict'

angular.module('LoginCtrl', []).controller("LoginController",
	["$scope", "User", "$window", '$location', function ($scope, User, $window, $location) {

	var isSigningIn = false;

	$scope.isLoggingIn = function () {
		isSigningIn = false;
	}

	$scope.isSigningIn = function () {
		isSigningIn = true;
	}

	$scope.submit = function () {
		if (!isSigningIn) {
			User.login($scope.user)
				.success(function (data, status, headers, config) {
					$window.sessionStorage.token = data.token;
					console.log(data.token);
					$window.location.href = '/';
				})
				.error(function (data, status, headers, config) {
					console.log(data);
				});
		} else {
			User.signup($scope.user)
				.success(function (data, status, headers, config) {
					$window.sessionStorage.token = data.token;
					$window.location.href = '/';
				})
				.error(function (data, status, headers, config) {
					console.log(data);
				});
		}
	};
}]);
