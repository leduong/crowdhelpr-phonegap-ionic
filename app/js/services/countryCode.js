'use strict';

angular.module('CrowdhelprApp').

factory('countryCode', ['$http', function($http) {
  return function(q, done) {
    $http.get(cordova.file.applicationDirectory + 'country_code.json')
      .success(function(data) {
        for (var i = 0; i < data.countries.length; i++) {
          if (data.countries[i].code === q) {
            done(data.countries[i].phoneCode);
            return;
          }
        }
      });
  };
}]);