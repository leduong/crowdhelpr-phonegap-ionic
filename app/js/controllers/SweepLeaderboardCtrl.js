'use strict';

angular.module('CrowdhelprApp').

controller('SweepLeaderboardCtrl', [
  '$scope', '$localStorage', '$stateParams', 'Sweeps',
  function($scope, $localStorage, $stateParams, Sweeps) {
    $scope.users = [];
    var sweep = new Sweeps();
    // console.log($stateParams.sweepId);
    sweep.leaderboard($stateParams.sweepId).then(function(data) {
      $scope.users = data;
      $scope.topCoin = data[0].coins || 1;
    });
  }
]);