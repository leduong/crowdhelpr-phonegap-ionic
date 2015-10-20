'use strict';
angular.module('CrowdhelprApp').

factory('StuffService', ['$http', 'API', function($http, API) {
  var exports;
  exports = {
    stuffs: function(params) {
      return $http.get(API.stuff.stuffs, {
        params: params
      });
    },
    scanStuff: function(params) {
      return $http.post(API.stuff.scanStuff, params);
    },
    getStuff: function(params) {
      return $http.get(API.stuff.getStuff, {
        params: params
      });
    }
  };
  return exports;
}]);