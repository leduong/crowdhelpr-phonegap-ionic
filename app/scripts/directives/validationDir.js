'use strict';

angular.module('CrowdhelprApp').

directive('validationDir', function() {
  return {
    restrict: 'E',
    scope: {
      field: '=field'
    },
    template: '<div ng-show="field" class="bar bar-assertive require-field">{{field}}</div>'
  };
});