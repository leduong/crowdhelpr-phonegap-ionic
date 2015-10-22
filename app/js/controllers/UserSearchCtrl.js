'use strict';

angular.module('CrowdhelprApp').

controller('UserSearchCtrl', [
  '$scope', '$stateParams', 'User',
  function($scope, $stateParams, User) {
    var user = new User();
    user.search($stateParams.keyword).then(function(data) {
      $scope.users = data;
    });

    $scope.follow = function(userid) {
      var idx;
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].id === userid) {
          idx = i;
        }
      }
      user.follow(userid).then(function(data) {
        $scope.users[idx] = data;
      });
    };
  }
]);