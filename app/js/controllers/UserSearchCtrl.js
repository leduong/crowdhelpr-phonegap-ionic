'use strict';

angular.module('CrowdhelprApp').

controller('UserSearchCtrl', ['$scope', '$stateParams', '$ionicLoading', 'User', function($scope, $stateParams, $ionicLoading, User) {
  $scope.userObj = new User();
  $scope.userObj.search($stateParams.keyword).then(function(data) {
    $scope.users = data;
  });

  $scope.follow = function(userid) {
    var idx;
    for (var i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].id === userid) {
        idx = i;
      }
    }
    $ionicLoading.show({
      template: 'Send request'
    });
    $scope.userObj.follow(userid).then(function(data) {
      $ionicLoading.hide();
      $scope.users[idx] = data.result;
    });
  };
}]);