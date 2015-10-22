'use strict';

angular.module('CrowdhelprApp').

controller('MoreCtrl', [
  '$scope', '$localStorage', '$state',
  function($scope, $localStorage, $state) {
    $scope.user = $localStorage.current_user || {};

    $scope.logOut = function() {
      $localStorage.$reset();
      $state.go('session.new');
    };
  }
]);