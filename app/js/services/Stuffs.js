'use strict';

angular.module('CrowdhelprApp').

factory('Stuffs', [
  '$rootScope', '$localStorage', 'StuffService',
  function($rootScope, $localStorage, StuffService) {
    var Stuff = function() {
      this.busy = false;
    };

    Stuff.prototype.paginate = function(page) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      var params = {
        page: page,
        centerlat: $localStorage.latitude,
        centerlng: $localStorage.longitude
      };
      return StuffService.stuffs(params).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      }, function() {
        $rootScope.$broadcast('$cordovaToast:notification', 'Oops, something went wrong! Please swipe down to refresh');
      });
    };

    Stuff.prototype.get = function(factual_id, store_id) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      var params = {
        factual_id: factual_id,
        product_store_id: store_id,
        centerlat: $localStorage.latitude,
        centerlng: $localStorage.longitude
      };
      return StuffService.getStuff(params).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };

    Stuff.prototype.scan = function(barcode) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      var params = {
        barcode: barcode,
        centerlat: $localStorage.latitude,
        centerlng: $localStorage.longitude
      };
      return StuffService.enterCampaign(params).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };
    return Stuff;
  }
]);