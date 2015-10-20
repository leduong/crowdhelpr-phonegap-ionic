'use strict';

angular.module('CrowdhelprApp').

filter('trustAsResourceUrl', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsResourceUrl(val);
  };
}]);