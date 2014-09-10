'use strict'
angular.module('ProjectCtrl', ['GroupService', 'TaskService']).controller('ProjectController', 
	['$scope', 'Group', 'Task', function ($scope, Group, Task) {

	$scope.newTaskText = "task";
	$scope.groupInputVisible = false;
	$scope.groups = [];
	$scope.wrapperWidth = 0;

	$scope.$watch('groups.length', function (newValue) {
		$scope.wrapperWidth = (newValue + 1) * 295;
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
					inputVisible: false
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
