'use strict'
angular.module('ProjectCtrl', ['GroupService', 'TaskService']).controller('ProjectController',
	['$scope', 'Group', 'Task', "$window", "jwtHelper", function ($scope, Group, Task, $window, jwtHelper) {

	$scope.newTaskText = "task";
	$scope.groupInputVisible = false;
	$scope.groups = [];
	$scope.wrapperWidth = 0;
	$scope.timedTask = {
		gIndex: undefined,
		tIndex: undefined
	};

	console.log("TOKEN");
	console.log($window.sessionStorage.token);

	if (!$window.sessionStorage.token)
		$window.location.href = '/login';

	var decodedToken = jwtHelper.decodeToken($window.sessionStorage.token);
	console.log(decodedToken);


	$scope.$watch('groups.length', function (newValue) {
		$scope.wrapperWidth = (newValue + 1) * 335;
	});

	$scope.$parent.$on('pomodoroFinished', function () {
		console.log("Cycle finished");
		$scope.addPomodoroToCompleted($scope.timedTask);
	});

	// Gets all groups from database
	Group.get(decodedToken.user)
		.success(function (data, status, headers, config) {
			addTasksToGroups(data, 0);
		})
		.error(function (error, status, headers, config) {
			console.log(status);
			console.log(error);
		});

	// Gets the tasks from the db for each group
	function addTasksToGroups (groupData, i) {
		var group = {};

		if (i == groupData.length) {
			console.log($scope.groups);
			return;
		}

		Task.get(groupData[i]._id)
			.success(function (tasks, status, headers, config) {
				group = {
					groupID: groupData[i]._id,
					groupName: groupData[i].name,
					groupOrder: groupData[i].order,
					groupTasks: tasks,
					inputVisible: false,
					showCompleted: false
				};

				group.groupTasks.sort(compare);

				i++;
				$scope.groups.push(group);
				addTasksToGroups(groupData, i);

			})
			.error(function (error, status, headers, config) {
				console.log(status);
				console.log(error);
			});
	};

	// Comparison function for tasks
	function compare (a, b) {
		if (a.order < b.order)
			return -1;
		if (a.order > b.order)
			return 1;
		return 0;
	};

	// Substract one from the order of tasks after it (from previous group)
	function repositionTasks (direction, tOrder, gIndex) {
		for (var i=0; i < $scope.groups[gIndex].groupTasks.length; i++) {
			if ($scope.groups[gIndex].groupTasks[i].order >= tOrder)
				$scope.groups[gIndex].groupTasks[i].order += direction;
		}
	};

	// Updates database when task is moved
	function updateMovedTask (id, oldOrder, oldGroupId, newOrder, newGroupId) {
		var taskData = {
			oldOrder: oldOrder,
			oldGroupId: oldGroupId,
			newOrder: newOrder,
			newGroupId: newGroupId
		};

		Task.updateOrder(id, taskData)
			.success(function () {
				console.log('Tasks in db succesfully updated!');
			})
			.error(function (error) {
				console.log('Error');
			});
	};

	// Show uncompleted|completed tasks based on group settings
	$scope.showTask = function (a, b) {
		return (a && b) || (!a && !b);
	};

	// Changes the timed task
	$scope.setTimedTask = function (gIndex, tIndex) {
		// TODO check if timer is running, change values only if it's stopped

		if ($scope.$parent.timerActiveState !== "Stopped")
			return;

		if (gIndex == $scope.timedTask.gIndex && tIndex == $scope.timedTask.tIndex) {
			$scope.groups[gIndex].groupTasks[tIndex].isTimed = false;
			$scope.timedTask.gIndex = undefined;
			$scope.timedTask.tIndex = undefined;

			return;
		}

		if ($scope.timedTask.gIndex !== undefined)
			$scope.groups[$scope.timedTask.gIndex].groupTasks[$scope.timedTask.tIndex].isTimed = false;

		$scope.groups[gIndex].groupTasks[tIndex].isTimed = true;
		$scope.timedTask.gIndex = gIndex;
		$scope.timedTask.tIndex = tIndex;
	};

	// Update completed value
	$scope.markAsCompleteOrRevert = function (gIndex, tIndex) {
		Task.update($scope.groups[gIndex].groupTasks[tIndex]._id, {
			completed: !$scope.groups[gIndex].groupTasks[tIndex].completed
		}).success(function () {
			$scope.groups[gIndex].groupTasks[tIndex].completed = !$scope.groups[gIndex].groupTasks[tIndex].completed;

			if ($scope.timedTask.gIndex == gIndex && $scope.timedTask.tIndex == tIndex) {
				$scope.groups[gIndex].groupTasks[tIndex].isTimed = false;
				$scope.timedTask.gIndex = undefined;
				$scope.timedTask.tIndex = undefined;
			}

			console.log('Task succesfully updated');
		}).error(function (error) {
			console.log(error);
		});
	};

	// Adds new task to database
	$scope.insertTask = function (groupIndex, task) {
		Task.create($scope.groups[groupIndex].groupID, task)
			.success(function (taskn, status, headers, config) {
				taskn.active = true;
				$scope.groups[groupIndex].groupTasks.push(taskn);
			})
			.error(function (error, status, headers, config) {
				console.log(error);
			});
	};


	// Moves task to different group
	$scope.moveTaskTo = function (tInfo, gIndex) {
		var task = $scope.groups[tInfo.gIndex].groupTasks[tInfo.tIndex];
		var oldOrder = task.order;
		var newOrder = tInfo.tOrder;

		var oldGroupId = $scope.groups[tInfo.gIndex].groupID;
		var newGroupId = $scope.groups[gIndex].groupID;

		if (task.order == tInfo.tOrder && oldGroupId == newGroupId)
			return;

		$scope.groups[tInfo.gIndex].groupTasks.splice(tInfo.tIndex, 1);
		// Reposition tasks from first group
		repositionTasks(-1, task.order, tInfo.gIndex);
		// Reposition tasks from second group
		if (oldGroupId === newGroupId)
			tInfo.tOrder -= 1;
		repositionTasks(1, tInfo.tOrder, gIndex);

		task.order = tInfo.tOrder;
		$scope.groups[gIndex].groupTasks.push(task);
		$scope.groups[gIndex].groupTasks.sort(compare);
		updateMovedTask(task._id, oldOrder, oldGroupId, newOrder, newGroupId);
	};

	// Removes task
	$scope.removeTask = function (groupIndex, taskIndex) {
		var id = $scope.groups[groupIndex].groupTasks[taskIndex]._id;

		Task.delete(id)
			.success(function () {
				repositionTasks(-1, $scope.groups[groupIndex].groupTasks[taskIndex].order, groupIndex);
				$scope.groups[groupIndex].groupTasks.splice(taskIndex, 1);

				if ($scope.timedTask.gIndex == groupIndex && $scope.timedTask.tIndex == taskIndex) {
					$scope.timedTask.gIndex = undefined;
					$scope.timedTask.tIndex = undefined;
				}

				console.log("Succesfully removed task!");
			})
			.error(function (error, status, headers, config) {
				console.log("Error in removing task")
				console.log(error);
			});
	};

	$scope.updateTaskDescription = function (gIndex, tIndex, updates) {
		var id = $scope.groups[gIndex].groupTasks[tIndex]._id;
		var oldValue = $scope.groups[gIndex].groupTasks[tIndex].description;
		$scope.groups[gIndex].groupTasks[tIndex].description = updates.description;

		Task.update(id, updates)
			.success(function () {
				console.log("Task succesfully updated");
			}).error(function (error) {
				$scope.groups[gIndex].groupTasks[tIndex].description = oldValue;
				console.log(error);
			});
	};

	// Adds 1 pomodoro to task's completed pomodoros
	$scope.addPomodoroToCompleted = function (timedTask) {
		if (timedTask.gIndex == undefined || timedTask.tIndex == undefined)
			return;

		var task = $scope.groups[timedTask.gIndex].groupTasks[timedTask.tIndex];
		if (task.completedPomodoros < task.totalPomodoros) {
			Task.update(task._id, {
				completedPomodoros: task.completedPomodoros + 1
			}).success(function () {
				$scope.groups[timedTask.gIndex].groupTasks[timedTask.tIndex].completedPomodoros += 1;
				console.log("Task succesfully updated");

				if ($scope.groups[timedTask.gIndex].groupTasks[timedTask.tIndex].completedPomodoros == task.totalPomodoros)
					$scope.markAsCompleteOrRevert(timedTask.gIndex, timedTask.tIndex);
			}).error(function (error) {
				console.log(error);
			});
		}
	}

	// Adds 1 pomodoro to task's total pomodoros
	$scope.addPomodoroToTotal = function (gIndex, tIndex) {
		if ($scope.groups[gIndex].groupTasks[tIndex].totalPomodoros < 8) {
			Task.update($scope.groups[gIndex].groupTasks[tIndex]._id, {
				totalPomodoros: $scope.groups[gIndex].groupTasks[tIndex].totalPomodoros + 1
			}).success(function () {
				$scope.groups[gIndex].groupTasks[tIndex].totalPomodoros += 1;
				console.log("Task succesfully updated");
			}).error(function (error) {
				console.log(error);
			});
		}
	};

	// Substracts 1 pomodoro from task's total pomodoros
	$scope.substractPomodoroFromTotal = function (gIndex, tIndex) {
		var task = $scope.groups[gIndex].groupTasks[tIndex];
		if (task.totalPomodoros > task.completedPomodoros && task.totalPomodoros > 1) {
			Task.update(task._id, {
				totalPomodoros: $scope.groups[gIndex].groupTasks[tIndex].totalPomodoros - 1
			}).success(function () {
				$scope.groups[gIndex].groupTasks[tIndex].totalPomodoros -= 1;
				console.log("Task succesfully updated");
			}).error(function (error) {
				console.log(error);
			});
		}
	}

	// Adds new group to database
	$scope.insertGroup = function (groupName) {
		Group.create(decodedToken.user, {
			name: groupName,
			order: $scope.groups.length
		}).success(function (group, status, headers, config) {
			var newGroup = {
				groupID: group._id,
				groupName: group.name,
				groupOrder: group.order,
				groupTasks: [],
				inputVisible: false
			};

			$scope.groups.push(newGroup);
		}).error(function (error, status, headers, config) {
			console.log(error);
		});
	};

	// Removes group from database (along with all tasks belonging to it)
	$scope.removeGroup = function (gIndex) {
		var id = $scope.groups[gIndex].groupID;

		Group.delete(id)
			.success(function () {
				$scope.groups.splice(gIndex, 1);
				console.log('Group succesfully removed!');
			})
			.error(function (error, status, headers, config) {
				console.log("Error in removing group")
				console.log(error);
			});
	}
}]);
