'use strict';

angular.module('CrowdhelprApp').

controller('CommentsCtrl', function($scope, $stateParams, Feeds, $localStorage) {
  var feed = new Feeds();
  $scope.feed = $localStorage.feed;
  $scope.current_user = $localStorage.current_user;

  $scope.sendComment = function(comment) {
    feed.postComment(comment, $scope.feed).then(function(data) {
      $scope.usercomment = "";
      $scope.feed.comments.push(data);
      $scope.feed.cmts = $scope.feed.comments.length;
      for (var a = 0; a < $localStorage.feeds.length; a++) {
        if ($localStorage.feeds[a].id === $scope.feed.id) {
          $localStorage.feeds[a] = $scope.feed;
          return;
        }
      }
    });
  };

  $scope.removeComment = function(commentId) {
    feed.deleteComment(commentId).then(function(data) {
      for (var i = 0; i < $scope.feed.comments.length; i++) {
        if ($scope.feed.comments[i].id === commentId) {
          $scope.feed.comments.splice(i, 1);
          $scope.feed.cmts = $scope.feed.comments.length;
          for (var a = 0; a < $localStorage.feeds.length; a++) {
            if ($localStorage.feeds[a].id === $scope.feed.id) {
              $localStorage.feeds[a] = $scope.feed;
              return;
            }
          }
        }
      }
    });
  };
});