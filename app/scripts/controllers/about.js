'use strict';

/**
 * @ngdoc function
 * @name nircApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the nircApp
 */
angular.module('nircApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
