'use strict';

angular.module('CrowdhelprApp').

controller('StuffDetailCtrl', [
  '$scope', '$stateParams', 'Stuffs', '$localStorage',
  function($scope, $stateParams, Stuffs, $localStorage) {
    $scope.stuff = $localStorage.stuff;
    $scope.my_lat = $localStorage.latitude;
    $scope.my_lng = $localStorage.longitude;
    $scope.location = $scope.stuff.location[0];

    $scope.navigate = function(lat, lng) {
      launchnavigator.navigate(
        [lat, lng], [$localStorage.latitude, $localStorage.longitude],
        function() {},
        function() {}
      );
    };
  }
]);