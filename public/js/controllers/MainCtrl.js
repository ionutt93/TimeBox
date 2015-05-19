'use strict'
angular.module("MainCtrl", []).controller("MainController", ['$scope', "$window", function ($scope, $window) {
    $scope.tagline = 'To the moon and back!';

    if (window.location.pathname.indexOf("login") != -1) {
    	$scope.backgroundImage = {
    		background: 'url("/img/background.jpg")',
    		backgroundSize: 'cover'
    	};
    } else {
    	$scope.backgroundImage = {};
    }

    $scope.logout = function () {
        delete $window.sessionStorage.token;
        $window.location.href = '/login';
    }
}]);
