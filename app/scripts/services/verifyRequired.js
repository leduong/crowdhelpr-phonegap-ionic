'use strict';

angular.module('CrowdhelprApp').

factory('verifyRequired', function($rootScope, $localStorage, $state, $ionicHistory, $ionicPush) {
  return function(done) {
    if ($localStorage.current_user !== undefined && $localStorage.current_user.phone_verified === null) {
      $state.go('session.ask-phone-no');
      done();
    } else {
      done();
    }
  };
});