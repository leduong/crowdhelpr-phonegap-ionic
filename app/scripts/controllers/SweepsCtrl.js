'use strict';

angular.module('CrowdhelprApp').

controller('SweepsCtrl', function($scope, Sweeps, $localStorage, $state, $ionicActionSheet) {
  var sweep_object = new Sweeps();
  $scope.sweeps = [];
  $scope.page = 0;
  $scope.sweepDone = false;
  $scope.refresh = false;
  $scope.currentSweep = 'Active';
  $scope.sweepStatus = 1;
  $scope.hideBtn = true;
  $scope.arrText = ['Expired', 'Active', 'Coming Soon'];

  $scope.switchSweep = function() {
    $ionicActionSheet.show({
      buttons: [{
        text: "<div class='text-center'>Expired</div>"
      }, {
        text: "<div class='text-center'>Active</div>"
      }, {
        text: "<div class='text-center'>Coming Soon</div>"
      }],
      buttonClicked: function(index) {
        return $scope.changeType(index);
      }
    });
  };

  $scope.changeType = function(index) {
    $scope.currentSweep = $scope.arrText[index];
    $scope.sweepStatus = index;
    $scope.page = 0;
    $scope.sweepDone = false;
    $scope.refresh = true;
    $scope.loadMore();
    $scope.hideBtn = false;
    return true;
  };

  $scope.saveSweep = function(sweep) {
    $localStorage.sweep = sweep;
    $localStorage.sweeps = $scope.sweeps;
  };

  $scope.loadMore = function() {
    if ($scope.sweepDone === false) {
      $scope.page += 1;
      var returnValue = sweep_object.paginate($scope.page, $scope.sweepStatus, $state.current.name);
      if (returnValue !== undefined) {
        returnValue.then(function(data) {
          if (data.length < 20) {
            $scope.sweepDone = true;
          }
          if ($scope.refresh) {
            $scope.sweeps = data;
          } else {
            $scope.sweeps = $scope.sweeps.concat(data);
          }
          $scope.refresh = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if ($scope.sweeps.length === 0 && $scope.sweepStatus !== 1) {
            $scope.hideBtn = true;
            $scope.changeType(2);
          } else {
            $scope.hideBtn = false;
          }
        }, function(data) {
          $scope.error = data;
          $scope.sweepDone = true;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
    } else {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.hasError = function() {
    return $scope.error !== undefined;
  };

  $scope.doRefresh = function() {
    $scope.sweepDone = false;
    $scope.page = 0;
    $scope.refresh = true;
    $scope.error = undefined;
    $scope.loadMore();
  };
});