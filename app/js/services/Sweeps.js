'use strict';

angular.module('CrowdhelprApp').

factory('Sweeps', ['$http', '$q', '$localStorage', '$ionicLoading', '$state', 'SweepService', function($http, $q, $localStorage, $ionicLoading, $state, SweepService) {
  var Sweep = function() {
    this.storage = $localStorage;
    this.busy = false;
  };

  Sweep.prototype.leaderboard = function(sweepId) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    var params = {
      campaignid: sweepId
    };
    return SweepService.getCampaign(params).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {};
      return result;
    });
  };

  Sweep.prototype.paginate = function(page, status, state) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;

    var params;
    if (state === 'tab.more-leaderboard') {
      params = {
        status: status
      };
      return SweepService.getMyCampaign(params).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    } else {
      params = {
        page: page,
        status: status
      };
      return SweepService.campaigns(params).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    }
  };

  Sweep.prototype.get = function(sweepId) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    var params = {
      campaignid: sweepId
    };
    return SweepService.getCampaign(params).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {};
      return result;
    });
  };

  Sweep.prototype.useCoin = function(sweepId, coin) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    var params = {
      campaignid: sweepId,
      coins: coin
    };
    return SweepService.enterCampaign(params).then(function(res) {
      _this.busy = false;
      var result = res.data.result || {};
      return result;
    });
  };

  return Sweep;
}]);