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

			el.addEventListener('dragover', function (e) {
				e.dataTransfer.dropEffect = 'move';
				if (e.preventDefault)
					e.preventDefault();
				
				this.querySelector('.task-shadow').classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragenter', function (e) {
				this.querySelector('.task-shadow').classList.add('over');
				console.log('add');
				return false;
			}, false);

			el.querySelector('.task-shadow').addEventListener('dragleave', function (e) {
				this.classList.remove('over');
				console.log('remove');
				return false;
			}, false);

			el.querySelector('.task-shadow').addEventListener('drop', function (e) {
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