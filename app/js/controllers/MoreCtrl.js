'use strict';

angular.module('CrowdhelprApp').

controller('MoreCtrl', [
  '$scope', '$localStorage', '$state',
  function($scope, $localStorage, $state) {
    $scope.user = $localStorage.current_user || {};

    $scope.logOut = function() {
      $localStorage.token = undefined;
      $localStorage.current_user = {};
      $state.go('session.new');
    };
  }
]);