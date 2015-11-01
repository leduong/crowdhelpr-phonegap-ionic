'use strict';

angular.module('CrowdhelprApp').

controller('FeedsCtrl', [
  '$cordovaSocialSharing', '$state', '$ionicPopup', '$scope', 'Feeds', '$localStorage', '$ionicActionSheet',
  function($cordovaSocialSharing, $state, $ionicPopup, $scope, Feeds, $localStorage, $ionicActionSheet) {
    $scope.feeds = [];
    $scope.data = {};
    $scope.page = 0;
    $scope.feedDone = false;
    $scope.refresh = false;
    $scope.feedStatus = [0, 'All'];
    var feedObject = new Feeds();

    $scope.flag = function(feeds, feed) {
      var confirmFlag = $ionicPopup.confirm({
        title: 'Flag Inappropriate',
        template: 'Are you sure to flag this feed as inappropiate?'
      });
      confirmFlag.then(function(res) {
        if (res) {
          feedObject.flagFeed(feed.id).then(function(data) {
            var idx = feeds.indexOf(feed);
            feeds[idx] = data;
          });
        }
      });
    };

    $scope.removeFeed = function(feeds, feed) {
      feedObject.destroy(feed.id).then(function() {
        var idx = feeds.indexOf(feed);
        if (idx > -1) {
          feeds.splice(idx, 1);
        }
      });
    };

    $scope.ownedByCurrentUser = function(feed) {
      return feed.user_id === $localStorage.current_user.id;
    };

    $scope.share = function(feed) {
      $cordovaSocialSharing
        .share(feed.description, null, feed.media, feed.sharing_url)
        .then(function() {
          feedObject.share(feed.id);
        }, function(err) {
          console.log(err);
          // An error occurred. Show a message to the user
        });
    };

    $scope.switchFeed = function() {
      if ($scope.feedStatus[0] === 0) {
        $scope.feedStatus = [1, 'Following'];
      } else {
        $scope.feedStatus = [0, 'All'];
      }
      $scope.page = 0;
      $scope.feedDone = false;
      $scope.refresh = true;
      $scope.loadMore();
    };

    $scope.showActionSheets = function() {
      $ionicActionSheet.show({
        buttons: [{
          text: '<i class="icon ion-android-search"></i> Search User'
        }, ],
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) {
            $scope.searchUser();
          }
          return true;
        }
      });
    };

    $scope.searchUser = function() {
      var feedDesc = $ionicPopup.show({
        template: '<input type="text" ng-model="data.keyword">',
        title: 'Search User',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Search</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.keyword) {
              e.preventDefault();
            } else {
              return $scope.data.keyword;
            }
          }
        }]
      });

      feedDesc.then(function(res) {
        $state.go('tab.search', {
          keyword: res
        });
      });
    };


    $scope.storeFeed = function(feed) {
      $localStorage.feeds = $scope.feeds;
      $localStorage.feed = feed;
    };

    $scope.hasError = function() {
      return $scope.error !== undefined;
    };

    $scope.doRefresh = function() {
      $scope.feedDone = false;
      $scope.page = 0;
      $scope.refresh = true;
      $scope.error = undefined;
      $scope.loadMore();
    };

    $scope.loadMore = function() {
      if (!$scope.feedDone) {
        $scope.page += 1;
        feedObject.paginate($scope.page, $scope.feedStatus[0]).then(function(data) {
          if (data.length < 3) {
            $scope.feedDone = true;
          }
          if ($scope.refresh) {
            $scope.feeds = data;
          } else {
            $scope.feeds = $scope.feeds.concat(data);
          }
          $scope.refresh = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function(data) {
          $scope.error = data;
          $scope.feedDone = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
    };

    $scope.likeThis = function(id, feeds) {
      var result = feedObject.like(id);
      if (result) {
        for (var i = 0; i < feeds.length; i++) {
          if (feeds[i].id === id) {
            feeds[i] = result;
            return;
          }
        }
      }
    };
  }
]);