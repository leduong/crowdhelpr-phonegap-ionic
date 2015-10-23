'use strict';

angular.module('CrowdhelprApp').

controller('StuffCtrl', ['$scope', '$ionicLoading', 'Stuffs', '$localStorage', 'geolocation', '$ionicPopup', function($scope, $ionicLoading, Stuffs, $localStorage, geolocation, $ionicPopup) {
  $scope.stuffs = [];
  $scope.page = 0;
  $scope.stuffDone = false;
  $scope.refresh = false;
  $scope.dontScan = false;
  var stuff = new Stuffs();

  geolocation(function() {
    $scope.stuffDone = false;
    $scope.page = 0;
    $scope.refresh = true;
    $scope.error = undefined;
  });

  $scope.loadMore = function() {
    if ($scope.stuffDone === false) {
      $scope.page += 1;
      stuff.paginate($scope.page, 1, $scope.latitude, $scope.longitude).then(function(data) {
        if (data.length < 5) {
          $scope.stuffDone = true;
        } else {
          $scope.stuffDone = false;
        }
        if ($scope.refresh && data) {
          $scope.stuffs = data;
        } else {
          $scope.stuffs = $scope.stuffs.concat(data);
        }
        $scope.refresh = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(error) {
        $scope.error = error;
        $scope.stuffDone = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    } else {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.noLocation = function() {
    return $localStorage.latitude === undefined && $localStorage.longitude === undefined && $scope.stuffDone;
  };

  $scope.hasError = function() {
    return $scope.error !== undefined;
  };

  $scope.doRefresh = function() {
    geolocation(function() {
      $scope.stuffDone = false;
      $scope.page = 0;
      $scope.refresh = true;
      $scope.error = undefined;
      $scope.loadMore();
    });
  };

  $scope.saveStuff = function(stuff) {
    $scope.dontScan = true;
    $localStorage.stuff = stuff;
  };

  $scope.locationText = function(stuff) {
    if (stuff.location && stuff.location.length > 1) {
      return '@Multi Locations';
    } else {
      // return stuff.location[0].store_name || '';
      // console.log(JSON.stringify(stuff));
      return '';
    }
  };

  $scope.scanStuff = function(stuff) {
    if ($scope.dontScan === true) {
      $scope.dontScan = false;
    } else {
      $ionicLoading.show({
        template: 'Getting your location'
      });
      geolocation(function(lat, lng) {
        $ionicLoading.hide();
        if (lat === undefined && lng === undefined) {
          $ionicPopup.alert({
            title: 'Alert',
            template: 'Whoops we can\'t get your location. Please turn on GPS in your phones settings.'
          });
        } else {
          cordova.plugins.barcodeScanner.scan(
            function(result) {
              if (result.cancelled) {} else if (result.text !== stuff.barcode) {
                $ionicPopup.alert({
                  title: 'Scan Result',
                  template: 'You have scan different product'
                });
              } else {
                stuff.scan(result.text, $localStorage.latitude, $localStorage.longitude).then(function(data) {
                  $ionicPopup.alert({
                    title: 'Scan Result',
                    template: data.message
                  }).then(function() {
                    if (data.product_url !== null) {
                      window.open(data.product_url, '_blank', 'location=no');
                    }
                  });
                });
              }
            },
            function(error) {
              $ionicPopup.alert({
                title: 'Scan Result',
                template: 'Scanning failed ' + error
              });
            }
          );
        }

      });
    }
  };
}]);