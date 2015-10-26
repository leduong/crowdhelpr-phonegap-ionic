'use strict';

/**
 * @ngdoc function
 * @name CrowdhelprApp.util:lodash
 * @description
 * # Lo-Dash
 * Expose Lo-Dash through injectable factory, so we don't pollute / rely on global namespace
 * just inject lodash as _
 */

angular.module('CrowdhelprApp').
directive('flipclock', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var expired = new Date(scope.$eval(attrs.flipclock));
      $(element).FlipClock(expired, {
        clockFace: 'DailyCounter',
        showSeconds: false,
        countdown: true
      });
    }
  };
});