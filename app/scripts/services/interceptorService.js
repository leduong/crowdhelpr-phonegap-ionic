'use strict';
angular.module('CrowdhelprApp').

factory('interceptorService', [
  '$rootScope', '$q', '$injector', '$location', 'API_ENDPOINT', '$localStorage',
  function($rootScope, $q, $injector, $location, API_ENDPOINT, $localStorage) {

    function resetToken() {
      $localStorage.$reset({
        current_user: undefined,
        token: undefined,
        http: API_ENDPOINT.host
      });
    }
    var forEach = angular.forEach;
    var exports;
    exports = {
      request: function(config) {
        config.headers = config.headers || {};
        var token = $localStorage.token || null;
        if (token) {
          config.headers.Authorization = 'Token token=' + $localStorage.token;
        }
        return config;
      },

      response: function(res) {
        if (res.headers()['content-type'] === 'application/json' || res.headers()['content-type'] === 'application/json; charset=utf-8') {
          if (res.data.status_code !== 1) {
            resetToken();
            $location.path('/session/new');
          }
        }
        //   console.log(res);
        return res;
      },

      responseError: function(rejection) {
        if (rejection.status === 400) {
          if (rejection.headers()['content-type'] === 'application/json' || rejection.headers()['content-type'] === 'application/json; charset=utf-8') {
            $rootScope.$broadcast('warning', rejection.data.message || 'Bad request!');
            return $q.resolve(rejection);
          }
        }

        if (rejection.status === 401) {
          resetToken();
          $rootScope.$broadcast('warning', rejection.data.message || 'Unauthorized!');
          $location.path('/');
        }

        if (rejection.status === 403) {
          $rootScope.$broadcast('warning', rejection.data.message || 'Forbidden!');
        }

        if (rejection.status === 500) {
          var errorMessage = 'Error 500: ' + rejection.data.message;
          $rootScope.$broadcast('error', errorMessage);
          return $q.reject(rejection);
        }

        return $q.reject(rejection);
      }
    };

    return exports;
  }
]);