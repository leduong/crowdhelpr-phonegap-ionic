'use strict';

angular.module('CrowdhelprApp').

controller('UserCtrl', [
  '$scope', '$localStorage', '$stateParams', 'User',
  function($scope, $localStorage, $stateParams, User) {
    document.getElementsByClassName('tab-nav')[0].style.display = 'none';
    var user = new User();
    user.userid = $stateParams.id;
    user.userProfile().then(function(data) {
      $scope.user = data;
      $scope.user.full_name = $scope.user.first_name + ' ' + $scope.user.last_name;
      $scope.userfeeds = $scope.divideFeeds();
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
      user.follow(userid).then(function(data) {
        $scope.user = data;
      });
    };

  }
]);