'use strict'
angular.module("myTaskDirective", [])
	.directive('myTask', function () {
		return {
			restrict: "E",
			replace: "true",
			templateUrl: "./views/task-partial.html",
			link: function (scope, element, attrs) {
				
			}
		};
	})
	.directive('myNewTask', function() {
		return {
			restrict: "E",
			templateUrl: "./views/new-task-partial.html",
			link: function (scope, element, attrs) {
				// Adds new task when the user presses enter
				element.bind("keypress", function (event) {
					if (event.which == 13) {
						addNewTask(element[0].children[0].children[0].value, attrs.groupIndex);
						element[0].children[0].children[0].value = "";
					}
				});

				// Adds the new task and hides the create task box
				function addNewTask (value, groupIndex) {
					console.log(groupIndex);

					var task = {
						description: value,
						completed: false,
						order: scope.groups[groupIndex].groupTasks.length
					};

					scope.insertTask(groupIndex, task);
					scope.newDescription = "";
					scope.groups[groupIndex].inputVisible = false;
					scope.$digest();
				}
			}
		};
	});