'use strict'
angular.module('AuthService', []).factory('AuthInterceptor', ['$q', '$location', '$window', function ($q, $location, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorisation = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        response: function (response) {
            if (response.status == 401 && $location.path() != '/login') {
                $location.path('/login');
            }
            return response;
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
