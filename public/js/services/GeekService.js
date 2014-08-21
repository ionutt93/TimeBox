'use strict'
angular.module('GeekService', []).factory('Geek', ['$http', function ($http) {
    return {
        get: function () {
            return $http.get('/api/geeks');
        },
        create: function (geekData) {
            return $http.post('/api/geeks', geekData);
        },
        delete: function (id) {
            return $http.delete('/api/geeks/' + id);
        }
    }
}]);
