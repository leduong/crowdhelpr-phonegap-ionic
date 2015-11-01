'use strict';

angular.module('CrowdhelprApp').

controller('CommentsCtrl', [
  '$scope', '$q', '$stateParams', 'Feeds', '$localStorage', 'UserService',
  function($scope, $q, $stateParams, Feeds, $localStorage, UserService) {
    var feed = new Feeds();
    $scope.feed = $localStorage.feed;
    $scope.current_user = $localStorage.current_user;

    $scope.userLists = [];
    $scope.searchPeople = function(keyword) {
      var peopleList = [];
      return UserService.search(keyword).then(function(res) {
        var result = res.data.result || {};
        angular.forEach(result, function(obj) {
          peopleList.push({
            name: obj.first_name + ' ' + obj.last_name,
            bio: obj.username,
            imageUrl: obj.image_url
          });
        });
        $scope.userLists = peopleList;
        return $q.when(peopleList);
      });
    };

    $scope.getPeopleTextRaw = function(item) {
      return '@' + item.name;
    };

    $scope.sendComment = function(comment) {
      feed.postComment(comment, $scope.feed).then(function(data) {
        $scope.usercomment = '';
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
      feed.deleteComment(commentId).then(function() {
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
  }
]);