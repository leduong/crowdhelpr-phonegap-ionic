'use strict';

angular.module('CrowdhelprApp').

filter('percentage', ['$filter', function($filter) {
  return function(input, total) {
    input = angular.isNumber(input) ? input : 1;
    total = angular.isNumber(total) ? total : input;
    return $filter('number')((input * 100) / total, 0);
  };
}]);