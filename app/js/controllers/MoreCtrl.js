'use strict';

angular.module('CrowdhelprApp').

controller('MoreCtrl', ['$scope', 'User', '$localStorage', '$state', function($scope, User, $localStorage, $state) {
  $scope.user = $localStorage.current_user;

  $scope.logOut = function() {
    $localStorage.$reset({
      current_user: undefined,
      token: undefined,
      http: 'https://www.crowdhelpr.com'
    });
    $state.go('session.new');
  };
}]);