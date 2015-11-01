'use strict';

angular.module('CrowdhelprApp').

controller('StuffCtrl', [
  '$rootScope', '$scope', '$ionicLoading', 'Stuffs', '$localStorage', 'geolocation',
  function($rootScope, $scope, $ionicLoading, Stuffs, $localStorage, geolocation) {
    $scope.stuffs = [];
    $scope.page = 1;
    $scope.stuffDone = false;
    $scope.refresh = false;
    $scope.dontScan = false;
    var stuff = new Stuffs();

    var getLatLng = function() {
      return geolocation(function(lat, lng) {
        $ionicLoading.hide();
        $localStorage.latitude = lat;
        $localStorage.longitude = lng;
        $scope.stuffDone = false;
        $scope.page = 1;
        $scope.refresh = true;
        $scope.error = undefined;
        console.log(lat, lng);
      });
    };
    getLatLng();

    $scope.loadMore = function() {
      if ($localStorage.latitude && $localStorage.longitude) {
        if ($scope.stuffDone === false) {
          stuff.paginate($scope.page).then(function(result) {
            if (result.length < 5) {
              $scope.stuffDone = true;
            } else {
              $scope.stuffDone = false;
            }
            if ($scope.refresh && result && result.length > 1) {
              $scope.stuffs = result;
              $scope.page += 1;
            } else {
              $scope.stuffs = $scope.stuffs.concat(result);
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
      } else {
        $ionicLoading.hide();
        $rootScope.$broadcast('ionicPopup', ['Alert', 'Whoops we can\'t get your location. Please turn on GPS in your phones settings.']);
      }
    };

    $scope.noLocation = function() {
      return $localStorage.latitude === undefined && $localStorage.longitude === undefined && $scope.stuffDone;
    };

    $scope.hasError = function() {
      return $scope.error !== undefined;
    };

    $scope.doRefresh = function() {
      getLatLng();
      $scope.loadMore();
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
            $rootScope.$broadcast('ionicPopup', [
              'Alert',
              'Whoops we can\'t get your location. Please turn on GPS in your phones settings.'
            ]);
          } else {
            $localStorage.latitude = lat;
            $localStorage.longitude = lng;
            cordova.plugins.barcodeScanner.scan(
              function(result) {
                if (result.cancelled) {} else if (result.text !== stuff.barcode) {
                  $rootScope.$broadcast('ionicPopup', [
                    'Alert',
                    'You have scan different product'
                  ]);
                } else {
                  stuff.scan(result.text).then(function(data) {
                    $rootScope.$broadcast('ionicPopup', [
                      'Scan Result',
                      data.message
                    ]);
                    if (data.product_url !== null) {
                      window.open(data.product_url, '_blank', 'location=no');
                    }
                  });
                }
              },
              function(error) {
                $rootScope.$broadcast('ionicPopup', [
                  'Alert',
                  'Scanning failed ' + error
                ]);
              }
            );
          }
        });
      }
    };
  }
]);