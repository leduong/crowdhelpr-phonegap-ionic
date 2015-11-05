'use strict';
angular.module('CrowdhelprApp').
factory('SweepService', [
  '$http', 'API',
  function($http, API) {
    var exports;
    exports = {
      enterCampaign: function(params) {
        return $http.post(API.sweep.enterCampaign, params);
      },
      getCampaign: function(params) {
        return $http.get(API.sweep.getCampaign, {
          params: params
        });
      },
      campaigns: function(params) {
        return $http.get(API.sweep.campaigns, {
          params: params
        });
      },
      getMyCampaign: function(params) {
        return $http.get(API.sweep.getMyCampaign, {
          params: params
        });
      },
      getLeaders: function(params) {
        return $http.get(API.sweep.getLeaders, {
          params: params
        });
      }
    };
    return exports;
  }
]);