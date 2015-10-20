'use strict';

angular.module('CrowdhelprApp').

controller('SweepLeaderboardCtrl', function($scope, $localStorage, $stateParams, Sweeps) {
  $scope.users = [];
  var sweep = new Sweeps();
  sweep.leaderboard($stateParams.sweepId).then(function(data) {
    $scope.users = data;
  });
});