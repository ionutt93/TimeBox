'use strict'
angular.module('ProjectCtrl', []).controller('ProjectController', function ($scope) {
	$scope.newTaskText = "task";
	
	$scope.addNewTask = function () {
		console.log($scope.newTaskText);
	}
});
