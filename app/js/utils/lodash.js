'use strict';

/**
 * @ngdoc function
 * @name CrowdhelprApp.util:lodash
 * @description
 * # Lo-Dash
 * Expose Lo-Dash through injectable factory, so we don't pollute / rely on global namespace
 * just inject lodash as _
 */

angular.module('CrowdhelprApp')
  .factory('_', ['$window', function($window) {
    return $window._;
  }]);
