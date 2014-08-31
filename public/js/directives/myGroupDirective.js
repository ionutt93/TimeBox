'use strict'
angular.module('myGroupDirective', ['myTaskDirective']).directive('myGroup', function () {
	return {
		restrict: 'E',
		templateUrl: './views/group-partial.html',
		link: function (scope, element, attrs) {
			scope.groupName = attrs.name;
			scope.isCreateTaskVisible = false;

			scope.prepNewTask = function () {
				if (scope.isCreateTaskVisible == false)
					scope.isCreateTaskVisible = true;			
			}
		}
	}
});