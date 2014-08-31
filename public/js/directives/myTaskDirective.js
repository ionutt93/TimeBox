'use strict'
angular.module("myTaskDirective", []).directive('myTask', function () {
	return {
		restrict: "A",
		replace: "true",
		link: function (scope, element, attrs) {
			console.log(scope.newTaskText);
			if (element.hasClass('new-task')) {
				var e = document.createElement('INPUT');
				e.setAttribute("type", "text");
				
				element.append(e);
				element.bind("keypress", function (event) {
					if (event.which == 13) {
						scope.newTaskText = e.value;
						addNewTask(e);
					}
				});
			}

			function addNewTask (e) {
				e.remove()

				element.removeClass('new-task');
				element.addClass('task');
				element.append('<div class="task-description"> <p> ' + scope.newTaskText + ' </p> </div>');
			}
		}
	};
});