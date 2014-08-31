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
						scope.newDescription = e.value;
						e.value = "";
						addNewTask();
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
			function addNewTask () {
				scope.tasks.push({ id: 4, description: scope.newDescription });
				scope.newDescription = "";
				scope.isCreateTaskVisible = false;
				scope.$digest();
			}
		}
	};
});