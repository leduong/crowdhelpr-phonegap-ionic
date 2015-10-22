'use strict';

angular.module('CrowdhelprApp').

controller('OtherCtrl', [
  '$scope', '$ionicLoading', '$localStorage', '$ionicHistory', '$state', '$sce', 'User', 'Other',
  function($scope, $ionicLoading, $localStorage, $ionicHistory, $state, $sce, User, Other) {
    var user = new User();
    var other = new Other();
    $scope.cartDone = false;
    $scope.carts = [];
    $scope.user = $localStorage.current_user;
    if ($scope.user !== undefined) {
      $scope.data = {
        street: $scope.user.street,
        city: $scope.user.city,
        state: $scope.user.state,
        zipcode: $scope.user.zipcode,
        phone_no: $scope.user.phone_no,
        privacy: $scope.user.privacy
      };
    }
    document.getElementsByClassName('tab-nav')[0].style.display = 'none';

    if ($state.current) {
      switch ($state.current.name) {
        case 'session.terms':
          $scope.title = 'Terms & Conditions';
          other.staticText('/terms').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.terms);
          });
          break;
        case 'tab.more-terms':
          $scope.title = 'Terms & Conditions';
          other.staticText('/terms').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.terms);

          });
          break;
        case 'tab.more-rules':
          $scope.title = 'Official Rules';
          other.staticText('/rules').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.rules);
          });
          break;
        case 'session.privacy':
          $scope.title = 'Privacy Policy';
          other.staticText('/privacy_setting').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.privacy_setting);
          });
          break;
        case 'tab.more-privacy':
          $scope.title = 'Privacy Policy';
          other.staticText('/privacy_setting').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.privacy_setting);
          });
          break;
        case 'tab.more-method':
          $scope.title = 'Free Entry Methods';
          other.staticText('/free_entry_method').then(function(data) {
            $scope.text = $sce.trustAsHtml(data.free_entry_method);
          });
          break;
      }
    }

    $scope.loadMore = function() {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.save = function(usr) {
      var privacy = usr.privacy === true ? 1 : 0;
      user.save({
        street: usr.street,
        city: usr.city,
        state: usr.state,
        zipcode: usr.zipcode,
        phone_no: usr.phone_no,
        privacy: privacy
      }).then(function(data) {
        $localStorage.user = data;
        $ionicHistory.goBack();
      });
    };
  }
]);