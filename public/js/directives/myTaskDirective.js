'use strict'
angular.module("myTaskDirective", []).directive('myTask', function () {
	return {
		restrict: "A",
		replace: "true",
		link: function (scope, element, attrs) {
			if (element.hasClass('new-task')) {
				var e = document.createElement('INPUT');
				e.setAttribute("type", "text");
				element.append(e);
				
				element.bind("keypress", function (event) {
					if (event.which == 13) {
						addNewTask(e.value, attrs.groupIndex);
						e.value = "";
					}
				});
			} else if (element.hasClass('task')) {
				var description = document.createElement('div');
				var p = document.createElement('p');

				description.setAttribute('class', 'task-description');
				p.innerHTML = attrs.description;

				description.appendChild(p);
				element.append(description);
			}

			// Adds the new task and hides the create task box
			function addNewTask (value, groupIndex) {
				console.log(groupIndex);

				var task = {
					description: value,
					completed: false,
					order: scope.groups[groupIndex].groupTasks.length
				};


				scope.groups[groupIndex].groupTasks.push(task);
				scope.insertTask(groupIndex, task);
				scope.newDescription = "";
				scope.groups[groupIndex].inputVisible = false;
				scope.$digest();
			}
		}
	};
});