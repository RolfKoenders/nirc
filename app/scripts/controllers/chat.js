'use strict';

/**
 * @ngdoc function
 * @name nircApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the nircApp
 */
angular.module('nircApp')
  .controller('ChatCtrl', function ($scope, $websocket) {
  	var ws = $websocket.$get('ws://localhost:4001');

  });
