'use strict'
angular.module("MainCtrl", []).controller("MainController", ['$scope', "$window", '$location', function ($scope, $window, $location) {
    $scope.tagline = 'To the moon and back!';
    $scope.isLoggedIn = false;
    $scope.isLoginScreen = false;

    if (window.location.pathname.indexOf("login") != -1) {
    	$scope.backgroundImage = {
    		background: 'url("/img/background copy.png")',
    		backgroundSize: 'cover',
            width: '100%',
            height: '100%'
    	};
    } else {
    	$scope.backgroundImage = {};
    }

    $scope.logout = function () {
        delete $window.sessionStorage.token;
        $window.location.href = '/login';
    }

    if ($window.sessionStorage.token) {
        $scope.isLoggedIn = true;
    } else {
        $scope.isLoggedIn = false;
    }

    if ($location.path() == '/login') {
        $scope.isLoginScreen = true;
    } else {
        $scope.isLoginScreen = false;
    }
}]);
