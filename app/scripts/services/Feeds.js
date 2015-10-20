'use strict';

angular.module('CrowdhelprApp').

factory('Feeds', function($http, $q, $localStorage, $ionicLoading, $state, User, FeedService) {
  var Feed = function() {
    this.busy = false;
    this.perpage = 3;
    this.following = 0; // 1 for all followers feeds, 0 for all user feeds
  };

  Feed.prototype.upload = function(imageUri, desc) {
    $ionicLoading.show({
      template: 'Uploading...'
    });

    function win(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + JSON.parse(r.response).result);
      console.log("Sent = " + r.bytesSent);
      $ionicLoading.hide();
      $state.go('tab.feeds');
    }

    function fail(error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
      $ionicLoading.hide();
    }

    var uri = encodeURI($localStorage.http + "/api/postevent");
    var options = new FileUploadOptions();
    options.fileKey = "media";
    options.fileName = imageUri.substr(imageUri.lastIndexOf('/') + 1);
    options.chunkedMode = false;
    options.mimeType = "image/jpeg";
    options.headers = {
      'Authorization': 'Token token=' + $localStorage.token
    };
    options.params = {
      description: desc
    };
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
      if (progressEvent.lengthComputable) {
        console.log(progressEvent.loaded);
        console.log(progressEvent.total);
      }
    };
    ft.upload(imageUri, uri, win, fail, options);
  };

  Feed.prototype.destroy = function(param) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return FeedService.destroyEvent(eventid).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.flagFeed = function(eventid) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return FeedService.flagEvent(eventid).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.paginate = function(page, following) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return FeedService.events({
      page: page,
      following: following,
      perpage: this.perpage
    }).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.like = function(feedId) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    $ionicLoading.show({
      template: 'Please Wait'
    });
    var _this = this;
    return FeedService.likeEvent(feedId).then(function(res) {
      _this.busy = false;
      $ionicLoading.hide();
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.postComment = function(comment, feed) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    $ionicLoading.show({
      template: 'Submit Comment'
    });
    var _this = this;
    return FeedService.postComment({
      eventid: feed.id,
      description: comment
    }).then(function(res) {
      _this.busy = false;
      $ionicLoading.hide();
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.deleteComment = function(commentId) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    $ionicLoading.show({
      template: 'Deleting Comment'
    });
    var _this = this;
    return FeedService.destroyComment(commentId).then(function(res) {
      _this.busy = false;
      $ionicLoading.hide();
      var result = res.data.result || {}
      return result;
    });
  };

  Feed.prototype.share = function(eventId) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return FeedService.share(eventId).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {}
      return result;
    });
  };

  return Feed;
});