'use strict';

angular.module('CrowdhelprApp').

controller('OtherCtrl', ['$scope', '$ionicLoading', '$localStorage', '$ionicHistory', '$state', '$sce', 'User', 'Other', function($scope, $ionicLoading, $localStorage, $ionicHistory, $state, $sce, User, Other) {
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
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/terms').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.terms);
          $ionicLoading.hide();
        });
        break;
      case 'tab.more-terms':
        $scope.title = 'Terms & Conditions';
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/terms').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.terms);
          $ionicLoading.hide();
        });
        break;
      case 'tab.more-rules':
        $scope.title = 'Official Rules';
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/rules').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.rules);
          $ionicLoading.hide();
        });
        break;
      case 'session.privacy':
        $scope.title = 'Privacy Policy';
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/privacy_setting').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.privacy_setting);
          $ionicLoading.hide();
        });
        break;
      case 'tab.more-privacy':
        $scope.title = 'Privacy Policy';
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/privacy_setting').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.privacy_setting);
          $ionicLoading.hide();
        });
        break;
      case 'tab.more-method':
        $scope.title = 'Free Entry Methods';
        $ionicLoading.show({
          template: 'fetching'
        });
        other.static_text('/free_entry_method').then(function(data) {
          $scope.text = $sce.trustAsHtml(data.free_entry_method);
          $ionicLoading.hide();
        });
        break;
    }
  }

  $scope.loadMore = function() {
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.save = function(usr) {
    var privacy = usr.privacy === true ? 1 : 0;
    $ionicLoading.show({
      template: 'Saving...'
    });
    user.save({
      street: usr.street,
      city: usr.city,
      state: usr.state,
      zipcode: usr.zipcode,
      phone_no: usr.phone_no,
      privacy: privacy
    }).then(function(data) {
      $ionicLoading.hide();
      $localStorage.user = data;
      $ionicHistory.goBack();
    });
  };

}]);