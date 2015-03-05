'use strict';

/**
 * @ngdoc function
 * @name nircApp.controller:ConnectCtrl
 * @description
 * # ConnectCtrl
 * Controller of the nircApp
 */
angular.module('nircApp')
  .controller('ConnectCtrl', function ($scope, $websocket, $location) {
  	var ws = $websocket.$get('ws://localhost:4001');
  	var connected = false;

  	$scope.connectBtn = {
  		title: 'Connect',
  		class: 'btn-primary'
  	};

  	$scope.connection = {
  		host: 'irc.freenode.net',
        port: '6665',
        nick: 'RolfTest',
        realname: 'nirc-user',
        ident: 'nirc-user'
  	};

  	$scope.connectAction = function() {
  		console.log('[Socket] connect to server: ', $scope.connection.host);
  		ws.$emit('message', {
            type: 'cmd',
            cmd: 'connect',
            connection: $scope.connection
        });
		connected = true;
		$location.path('chat');
  	};

  });
