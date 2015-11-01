'use strict';

angular.module('CrowdhelprApp').

filter('words', function() {
  return function(input, words) {
    if (isNaN(words)) {
      return input;
    }
    if (words <= 0) {
      return '';
    }
    if (input) {
      var inputWords = input.split(/\s+/);
      if (inputWords.length > words) {
        input = inputWords.slice(0, words).join(' ') + '\u2026';
      }
    }
    return input;
  };
});