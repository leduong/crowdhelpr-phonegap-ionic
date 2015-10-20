'use strict';
angular.module('CrowdhelprApp').
factory('FeedService', ['$http', 'API', function($http, API) {
    var exports;
    exports = {
      postComment: function(params) {
        return $http.post(API.feed.postComment, params);
      },
      events: function(params) {
        return $http.get(API.feed.events, {
          params: params
        });
      },
      destroyComment: function(commentid) {
        return $http.post(API.feed.destroyComment + '?commentid=' + commentid);
      },
      destroyEvent: function(eventid) {
        return $http.post(API.feed.destroyEvent + '?eventid=' + eventid);
      },
      flagEvent: function(eventid) {
        return $http.post(API.feed.flagEvent + '?eventid=' + eventid);
      },
      likeEvent: function(eventid) {
        return $http.post(API.feed.likeEvent + '?eventid=' + eventid);
      },
      share: function(eventid) {
        return $http.post(API.feed.share + '?eventid=' + eventid);
      }
    };
    return exports;
  }
]);