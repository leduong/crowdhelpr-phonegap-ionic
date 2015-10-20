'use strict';

angular.module('CrowdhelprApp').

factory('Stuffs', function($http, $q, $localStorage, $ionicLoading, $state) {
  var Stuff = function() {
    this.busy = false;
  };

  Stuff.prototype.paginate = function(page, status) {
    if (this.busy) {
      return;
    }
    var deffered = $q.defer();
    this.busy = true;
    var stuff = this;
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'get',
        url: $localStorage.http + '/api/stuffs?page=' + page + '&centerlat=' + $localStorage.latitude + '&centerlng=' + $localStorage.longitude
      })
      .success(function(data) {
        deffered.resolve(data.result);
        stuff.busy = false;
        if (data.status_code !== 1) {
          $localStorage.$reset({
            current_user: undefined,
            token: undefined,
            http: 'https://www.crowdhelpr.com'
          });
          $state.go('session.new');
        }
      }).error(function() {
        deffered.reject("Oops, something went wrong! Please swipe down to refresh.");
        stuff.busy = false;
      });
    return deffered.promise;
  };

  Stuff.prototype.get = function(factual_id, store_id) {
    if (this.busy) {
      return;
    }
    var deffered = $q.defer();
    this.busy = true;
    var getStuff = this;
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'get',
        url: $localStorage.http + '/api/getstuff?factual_id=' + factual_id + '&product_store_id=' + store_id + '&centerlat=' + $localStorage.latitude + '&centerlng=' + $localStorage.longitude
      })
      .success(function(data) {
        deffered.resolve(data.result);
        getStuff.busy = false;
        if (data.status_code !== 1) {
          $localStorage.$reset({
            current_user: undefined,
            token: undefined,
            http: 'https://www.crowdhelpr.com'
          });
          $state.go('session.new');
        }
      });
    return deffered.promise;
  };

  Stuff.prototype.scan = function(barcode, lat, lng) {
    if (this.busy) {
      return;
    }
    var deffered = $q.defer();
    this.busy = true;
    var scanStuff = this;
    $ionicLoading.show({
      template: "Submiting"
    });
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/scanstuff',
        data: {
          barcode: barcode,
          centerlat: lat,
          centerlng: lng
        }
      })
      .success(function(data) {
        deffered.resolve(data);
        scanStuff.busy = false;
        $ionicLoading.hide();
      });
    return deffered.promise;
  };

  return Stuff;
});