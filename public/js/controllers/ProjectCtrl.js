'use strict'
angular.module('ProjectCtrl', ['GroupService', 'TaskService']).controller('ProjectController', 
	['$scope', 'Group', 'Task', function ($scope, Group, Task) {

	$scope.newTaskText = "task";
	$scope.groupInputVisible = false;
	$scope.groups = [];
	$scope.wrapperWidth = 0;
	$scope.timedTask = {
		gIndex: 0,
		tIndex: 0
	};

	$scope.$watch('groups.length', function (newValue) {
		$scope.wrapperWidth = (newValue + 1) * 295;
	});

	$scope.$parent.$on('pomodoroFinished', function () {
		console.log("Cycle finished");
		$scope.addPomodoroToCompleted($scope.timedTask);		
	});

	// Gets all groups from database
	Group.get()
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

				i++;
				$scope.groups.push(group);
				addTasksToGroups(groupData, i);
				
			})
			.error(function (error, status, headers, config) {
				console.log(status);
				console.log(error);
			});
	};

	// Show uncompleted|completed tasks based on group settings
	$scope.showTask = function (a, b) {
		return (a && b) || (!a && !b);
	};

	// Update completed value
	$scope.markAsCompleteOrRevert = function (gIndex, tIndex) {
		Task.update($scope.groups[gIndex].groupTasks[tIndex]._id, {
			completed: !$scope.groups[gIndex].groupTasks[tIndex].completed
		}).success(function () {
			$scope.groups[gIndex].groupTasks[tIndex].completed = !$scope.groups[gIndex].groupTasks[tIndex].completed;
			console.log('Task succesfully updated');
		}).error(function (error) {
			console.log(error);
		});
	};

	// Adds new task to database
	$scope.insertTask = function (groupIndex, task) {
		Task.create($scope.groups[groupIndex].groupID, task)
			.success(function (taskn, status, headers, config) {
				$scope.groups[groupIndex].groupTasks.push(taskn);
			})
			.error(function (error, status, headers, config) {
				console.log(error);
			});
	};

	// Removes task
	$scope.removeTask = function (groupIndex, taskIndex) {
		var id = $scope.groups[groupIndex].groupTasks[taskIndex]._id;
		
		console.log("Group Index:" + groupIndex + "Task Index:" + taskIndex);
		console.log(id);

		Task.delete(id)
			.success(function () {
				$scope.groups[groupIndex].groupTasks.splice(taskIndex, 1);
				console.log("Succesfully removed task!");
			})
			.error(function (error, status, headers, config) {
				console.log("Error in removing task")
				console.log(error);
			});
	};

	// Adds 1 pomodoro to task's completed pomodoros
	$scope.addPomodoroToCompleted = function (timedTask) {
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
		Group.create({
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
