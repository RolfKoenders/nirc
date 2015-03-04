'use strict';

/**
 * @ngdoc overview
 * @name nircApp
 * @description
 * # nircApp
 *
 * Main module of the application.
 */
angular
  .module('nircApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/connect', {
        templateUrl: 'views/connect.html',
        controller: 'ConnectCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
