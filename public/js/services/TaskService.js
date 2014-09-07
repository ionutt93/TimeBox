'use strict'
angular.module('TaskService', []).factory('Task', ['$http', function ($http) {
    return {
        // call to get all nerds
        get: function (group_id) {
            return $http.get('/api/groups/' + group_id + '/tasks');
        },

        // call to create new task within specific group
        create: function (group_id, taskData) {
            return $http.post('/api/groups/' + group_id + '/tasks', taskData);
        },

        // call to delete a nerd
        delete: function (id) {
            return $http.delete('/api/nerds/' + id);
        }

    }
}]);
