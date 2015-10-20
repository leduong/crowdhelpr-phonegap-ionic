'use strict';

angular.module('CrowdhelprApp').

factory('Other', [
  '$http', '$localStorage', 'API',
  function($http, $localStorage, API) {
    var Other = function() {
      this.busy = false;
    };

    Other.prototype.static_text = function(url) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return $http.get(API.other + url).then(function(res) {
        _this.busy = false;
        return res.data || {};
      });
    };

    return Other;
  }
]);