'use strict'
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // user login page
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    });

    // home page
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        // controller: 'TimerController'
    });

    // nerds page
    $routeProvider.when('/nerds', {
        templateUrl: 'views/nerd.html',
        // controller: 'NerdController'
    });

    // geeks page
    $routeProvider.when('/geeks', {
        templateUrl: 'views/geek.html',
        // controller: 'GeekController'
    });

    $locationProvider.html5Mode(true);
}]);
