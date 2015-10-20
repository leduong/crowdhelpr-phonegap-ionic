'use strict';

angular.module('CrowdhelprApp').

controller('FeedsCtrl', function($cordovaSocialSharing, $state, $ionicPopup, $scope, Feeds, $localStorage, $ionicActionSheet, $cordovaImagePicker, $cordovaCamera) {
  $scope.feeds = [];
  $scope.data = {};
  $scope.page = 0;
  $scope.feedDone = false;
  $scope.refresh = false;
  $scope.feedStatus = [0, 'All'];
  var feed_object = new Feeds();

  $scope.flag = function(feeds, feed) {
    var confirmFlag = $ionicPopup.confirm({
      title: 'Flag Inappropriate',
      template: 'Are you sure to flag this feed as inappropiate?'
    });
    confirmFlag.then(function(res) {
      if (res) {
        feed_object.flagFeed(feed.id).then(function(data) {
          var idx = feeds.indexOf(feed);
          feeds[idx] = data;
        });
      }
    });
  };

  $scope.removeFeed = function(feeds, feed) {
    feed_object.destroy(feed.id).then(function(data) {
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
      .then(function(result) {
        feed_object.share(feed.id);
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
      template: "<input type='text' ng-model='data.keyword'>",
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
    $scope.error !== undefined;
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
      feed_object.paginate($scope.page, $scope.feedStatus[0]).then(function(data) {
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

  $scope.likeThis = function(feeds, feed) {
    feed_object.like(feed.id).then(function(data) {
      for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].id === feed.id) {
          feeds[i] = data;
          return;
        }
      }
    });
  };
});