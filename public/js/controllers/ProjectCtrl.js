'use strict'
angular.module('ProjectCtrl', []).controller('ProjectController', function ($scope) {
	$scope.newTaskText = "task";
	$scope.tasks = [{id: 1, description: 'Lorem ipsum dolor.'},
					{id: 2, description: 'Lorem ipsum dolor sit.'},
					{id: 3, description: 'Lorem ipsum dolor sit amet.'}]
});
