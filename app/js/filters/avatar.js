'use strict';

angular.module('CrowdhelprApp').
filter('avatar', [
  'md5',
  function(md5) {
    return function(src, email, size) {
      // console.log(size);
      if (src === null || src === '' || src === 'http://placehold.it/300x300&text=Avatar') {
        return 'http://www.gravatar.com/avatar/' + md5(email) + '?d=mm&s=' + (size || 80);
      }
      return src;
    };
  }
]);