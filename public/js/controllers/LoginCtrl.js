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
				.success(function (data) {
					$window.sessionStorage.token = data.token;
					$location.path('/');
				})
				.error(function (data) {
					console.log("Failed to login");
					console.log(data);
				});
		} else {
			User.signup($scope.user)
				.success(function (data) {
					$window.sessionStorage.token = data.token;
					$location.path('/');
				})
				.error(function (data) {
					console.log("Failed to signup");
					console.log(data);
				});
		}
	};
}]);
