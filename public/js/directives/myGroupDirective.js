'use strict'
angular.module('myGroupDirective', ['myTaskDirective']).directive('myGroup', function () {
	return {
		restrict: 'E',
		templateUrl: './views/group-partial.html',
		link: function (scope, element, attrs) {
			scope.groupName = attrs.name;
			scope.addingTask = false;

			scope.prepNewTask = function () {
				scope.addingTask = true;
			}
		}
	}
});