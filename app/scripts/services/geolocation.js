'use strict';

angular.module('CrowdhelprApp').

factory('geolocation', function($localStorage, $ionicLoading) {
  return function(done) {
    $localStorage.navi = navigator.geolocation.getCurrentPosition(function(position) {
      $localStorage.latitude = position.coords.latitude;
      $localStorage.longitude = position.coords.longitude;
      done($localStorage.latitude, $localStorage.longitude);
    }, function(error) {
      $localStorage.latitude = undefined;
      $localStorage.longitude = undefined;
      done(undefined, undefined);
    }, {
      enableHighAccuracy: true,
      timeout: 5000
    });
  };
});