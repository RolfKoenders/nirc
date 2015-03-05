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
    'ngTouch',
    'ngWebsocket'
  ])
  .run(function($websocket) {
    var ws = $websocket.$new('ws://localhost:4001');
    
    ws.$on('$open', function() {
      console.log('[Socket] Connected');
    })
    .$on('$message', function(message) {
      console.log('[Socket] Received message: ', message);
      console.log(message);
    });

  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/connect.html',
        controller: 'ConnectCtrl'
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
