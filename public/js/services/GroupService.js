'use strict'
angular.module('GroupService', []).factory('Group', ['$http', function ($http) {
    return {
        get: function () {
            return $http.get('/api/groups');
        },
        create: function (groupData) {
            return $http.post('/api/groups', groupData);
        },
        delete: function (id) {
            return $http.delete('/api/groups/' + id);
        }
    }
}]);
