'use strict'
angular.module('GroupService', []).factory('Group', ['$http', function ($http) {
    return {
        get: function (user_id) {
            return $http.get('/api/users/' + user_id + '/groups');
        },
        create: function (user_id, groupData) {
            return $http.post('/api/users/' + user_id + '/groups', groupData);
        },
        delete: function (id) {
            return $http.delete('/api/groups/' + id);
        }
    }
}]);
