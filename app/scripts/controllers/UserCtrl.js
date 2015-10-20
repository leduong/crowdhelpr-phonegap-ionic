'use strict';

angular.module('CrowdhelprApp').

controller('UserCtrl', function($scope, $ionicLoading, $localStorage, $stateParams, User) {
  document.getElementsByClassName('tab-nav')[0].style.display = 'none';
  $scope.userObj = new User();
  $scope.userObj.userid = $stateParams.id;
  $ionicLoading.show({
    template: 'Fetching'
  });
  $scope.userObj.fetch_user_profile().then(function(data) {
    $scope.user = data;
    $scope.user.full_name = $scope.user.first_name + " " + $scope.user.last_name;
    $scope.userfeeds = $scope.divideFeeds();
    $ionicLoading.hide();
  });

  $scope.divideFeeds = function() {
    var ret = [];
    var temp = [];
    for (var i = 0; i < $scope.user.feeds.length; i++) {
      temp.push($scope.user.feeds[i]);
      if (temp.length === 3) {
        ret.push(temp);
        temp = [];
      }
    }
    if (temp.length > 0) {
      ret.push(temp);
    }
    return ret;
  };

  $scope.follow = function(userid) {
    $ionicLoading.show({
      template: 'Send request'
    });
    $scope.userObj.follow(userid).then(function(data) {
      $scope.user = data.result;
      $ionicLoading.hide();
    });
  };

});