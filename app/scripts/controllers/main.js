'use strict';

/**
 * @ngdoc function
 * @name nircApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nircApp
 */
angular.module('nircApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
