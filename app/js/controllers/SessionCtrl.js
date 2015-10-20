'use strict';

angular.module('CrowdhelprApp').

controller('SessionCtrl', ['$rootScope', '$ionicPush', '$scope', 'User', 'countryCode', '$ionicPopup', '$localStorage', '$state', '$ionicLoading', '$ionicHistory',
  function($rootScope, $ionicPush, $scope, User, countryCode, $ionicPopup, $localStorage, $state, $ionicLoading, $ionicHistory) {
    $scope.data = {};
    var user = new User();

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
      alert('Successfully registered token ' + data.token);
    });

    $scope.signUp = function() {
      user.signUp($scope.data);
    };

    $scope.signIn = function() {
      $ionicHistory.clearCache();
      user.signIn($scope.data);
    };

    $scope.fbLogin = function() {
      $ionicHistory.clearCache();
      user.fbLogin();
    };

    $scope.resetPassword = function(data) {
      user.resetPassword(data);
    };

    $scope.sendCode = function(data) {
      user.sendPhoneCode(data).then(function() {
        user.fetch_current_user().then(function(data) {
          $localStorage.current_user = data;
          $state.go('session.verify');
        });
      });
    };

    $scope.verify = function(data) {
      user.verify(data).then(function(res) {
        if (res.status_code === 1) {
          user.fetch_current_user().then(function(data) {
            $localStorage.current_user = data;
            $state.go('tab.sweep', {}, {
              'reload': true
            });
          });
        } else {
          $ionicPopup.alert({
            title: 'Alert',
            template: res.message
          });
        }
      });
    };

    $scope.log_out = function() {
      $localStorage.$reset();
      $state.go('session.new', {}, {
        reload: true
      });
    };

    if ($localStorage.token !== undefined) {
      $ionicLoading.show({
        message: 'Fetching...'
      });
      user.fetch_current_user().then(function(data) {
        if (data === undefined) {
          $localStorage.token = undefined;
        } else {
          console.log(data);
          $state.go('tab.sweep');
        }
        $ionicLoading.hide();
      });
    }

    /* ask for phone no
    if($state.current.name === 'session.ask-phone-no'){
      window.plugins.sim.getSimInfo(function(data){
        countryCode(data.countryCode, function(cc){
          $scope.data.country_code = parseInt(cc);
        });
      });
      if($localStorage.token === undefined){
        $state.go('session.new');
      }
    }

    if($localStorage.token !== undefined && $state.current.name !== 'session.ask-phone-no' && $state.current.name !== 'session.verify'){
      $ionicPush.register({
        canShowAlert: true, //Can pushes show an alert on your screen?
        canSetBadge: true, //Can pushes update app icon badges?
        canPlaySound: true, //Can notifications play a sound?
        canRunActionsOnWake: true, //Can run actions outside the app,
        onNotification: function(notification) {
          // Handle new push notifications here
          // $log.info(notification);
          return true;
        }
      });
      $state.go('tab.sweep');
    }
    */

  }
]);