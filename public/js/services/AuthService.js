'use strict'
angular.module('AuthService', []).factory('AuthInterceptor', ['$q', '$location', '$window', 'jwtHelper', function ($q, $location, $window, jwtHelper) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                if (jwtHelper.isTokenExpired($window.sessionStorage.token)) {
                    delete $window.sessionStorage.token;
                } else {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
            }
            return config;
        },

        response: function (response) {
            if (response.status == 401) {
                $window.location.href = '/login';
            }
            return response;
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
