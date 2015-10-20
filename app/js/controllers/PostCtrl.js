'use strict';

angular.module('CrowdhelprApp').

controller('PostCtrl', ['$scope', '$cordovaCamera', '$cordovaImagePicker', '$ionicLoading', '$localStorage', '$ionicHistory', '$ionicActionSheet', 'Feeds', '$ionicPopup', function($scope, $cordovaCamera, $cordovaImagePicker, $ionicLoading, $localStorage, $ionicHistory, $ionicActionSheet, Feeds, $ionicPopup) {
  var feed_object = new Feeds();
  $ionicActionSheet.show({
    titleText: 'Post',
    buttons: [{
      text: '<i class="icon ion-android-camera"></i> Camera'
    }, {
      text: '<i class="icon ion-android-folder"></i> Existing'
    }],
    cancelText: 'Cancel',
    cancel: function() {
      $ionicHistory.goBack();
    },
    buttonClicked: function(index) {
      if (index === 1) {
        $cordovaImagePicker.getPictures({
            maximumImagesCount: 1
          })
          .then(function(result) {
            if (result.length > 0) {
              $scope.newFeedDesc(result[0]);
            }
          }, function(error) {
            console.log(error);
          });
      } else if (index === 0) {
        var options = {
          quality: 50,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          destinationType: Camera.DestinationType.FILE_URI,
          correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function(imageUri) {
          $scope.newFeedDesc(imageUri);
        });
      }
      return true;
    }
  });

  $scope.newFeedDesc = function(imageUri) {
    $scope.data = {};
    var feedDesc = $ionicPopup.show({
      template: '<input type="text" ng-model="data.description"><br/><img class="full-image" src="' + imageUri + '"/>',
      title: 'Feed',
      subTitle: 'Feed Description',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Add</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.description) {
            e.preventDefault();
          } else {
            return $scope.data.description;
          }
        }
      }]
    });

    feedDesc.then(function(res) {
      if (res !== undefined) {
        feed_object.upload(imageUri, res);
        $scope.data = {};
      }
    });
  };

}]);