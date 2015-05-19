'use strict'
angular.module("UserService", []).factory("User", ["$http", '$window', function ($http, $window) {
    return {
        login: function (user) {
            return $http.post('/auth/users/login', user);
        },

        signup: function (user) {
            return $http.post('/auth/users', user);
        },

        logout: function (user) {
            if ($window.sessionStorage.token)
                delete $window.sessionStorage.token;
            else
                console.log("Error: no token found!");
        }
    };
}]);
