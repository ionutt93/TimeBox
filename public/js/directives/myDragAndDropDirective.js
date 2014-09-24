angular.module('myDragAndDropDirective', [])
.directive('myDraggable', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var el = element[0];
			
			el.draggable = true;
			el.addEventListener('dragstart', function (e) {
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('gIndex', attrs.groupIndex);
				e.dataTransfer.setData('tIndex', attrs.taskIndex);

				this.classList.add('drag');
				return false;
			}, false);

			el.addEventListener('dragend', function (e) {
				this.classList.remove('drag');
				return false;
			}, false);
		}
	};
})
.directive('myDroppable', function () {
	return {
		restrict: 'A',
		scope: { 
			drop: '&',
			bin: '='
		},
		link: function (scope, element, attrs) {
			var el = element[0];
			var shadow = el.querySelector('.task-shadow');
			var task = el.querySelector('.task');

			shadow.addEventListener('dragover', function (e) {
				e.dataTransfer.dropEffect = 'move';
				if (e.preventDefault)
					e.preventDefault();
				if(!shadow.classList.contains('over'))
					shadow.classList.add('over');
				console.log("dragOver");
				return false;
			}, false);

			if(task) {
				task.addEventListener('dragenter', function (e) {
					shadow.classList.toggle('over');
					console.log('dragenter task');
					return false;
				}, false);
			} else {
				el.querySelector('.empty-space').addEventListener('dragenter', function (e) {
					shadow.classList.toggle('over');
					console.log('dragenter task');
					return false;
				}, false);
			}

			shadow.addEventListener('dragleave', function (e) {
				shadow.classList.remove('over');
				console.log('dragleave');
				return false;
			}, false);

			shadow.addEventListener('drop', function (e) {
				console.log('drop');
				if (e.stopPropagation)
					e.stopPropagation();
				this.classList.remove('over');
				
				var gIndex = attrs.groupIndex;
				var taskInfo = {
					gIndex: e.dataTransfer.getData('gIndex'),
					tIndex: e.dataTransfer.getData('tIndex'),
					tOrder: attrs.taskOrder
				};

				scope.$apply(function (scope) {
					var fn = scope.drop();
					if ('undefined' !== typeof fn) {
						fn(taskInfo, gIndex);
					}
				});
				
				return false;
			}, false);
		}
	};
});