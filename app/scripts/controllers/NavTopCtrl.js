'use strict';

angular.module('CrowdhelprApp').

controller('NavTopCtrl', function($scope, $ionicHistory) {
  $scope.goBack = function() {
    if (document.getElementsByClassName('tab-nav')[0] !== undefined) {
      document.getElementsByClassName('tab-nav')[0].style.display = 'flex';
    }
    $ionicHistory.goBack();
  };
});