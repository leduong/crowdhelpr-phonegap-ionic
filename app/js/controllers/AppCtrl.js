'use strict';

angular.module('CrowdhelprApp').
controller('AppCtrl', [
  '$scope', '$cordovaPush', '$cordovaDialogs', '$cordovaMedia', '$cordovaToast', '$ionicPopup', '$localStorage',
  function($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPopup, $localStorage) {
    $scope.notifications = [];

    // Notification Received
    $scope.$on('$cordovaToast:notification', function(event, notification) {
      var message = angular.isArray(notification) ? notification[0] : notification;
      console.log(JSON.stringify(notification));
      $cordovaToast.showLongTop(message);
    }); // Notification Received
    $scope.$on('ionicPopup', function(event, arr) {
      $ionicPopup.alert({
        title: arr[0],
        template: arr[1]
      });
    });

    $scope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      // console.log(JSON.stringify([notification]));
      if (ionic.Platform.isAndroid()) {
        handleAndroid(notification);
      } else if (ionic.Platform.isIOS()) {
        handleIOS(notification);
        $scope.$apply(function() {
          $scope.notifications.push(JSON.stringify(notification.alert));
        });
      }
    });

    // Android Notification Received Handler
    function handleAndroid(notification) {
      // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
      //             via the console fields as shown.
      // console.log('In foreground ' + notification.foreground + ' Coldstart ' + notification.coldstart);
      if (notification.event === 'registered') {
        $localStorage.push_token = notification.regid;
      } else if (notification.event === 'message') {
        $cordovaDialogs.alert(notification.message, 'Push Notification Received');
        $scope.$apply(function() {
          $scope.notifications.push(JSON.stringify(notification.message));
        });
      } else if (notification.event === 'error') {
        $cordovaDialogs.alert(notification.msg, 'Push notification error event');
      } else {
        $cordovaDialogs.alert(notification.event, 'Push notification handler - Unprocessed Event');
      }
    }

    // IOS Notification Received Handler
    function handleIOS(notification) {
      // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
      // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
      // the notification when this code runs (weird).
      if (notification.foreground === '1') {
        // Play custom audio if a sound specified.
        if (notification.sound) {
          var mediaSrc = $cordovaMedia.newMedia(notification.sound);
          mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
        }

        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, notification.messageFrom);
        } else {
          $cordovaDialogs.alert(notification.alert, 'Push Notification Received');
        }

        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
            console.log('Set badge success ' + result);
          }, function(err) {
            console.log('Set badge error ' + err);
          });
        }
      }
      // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
      // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
      // the data in this situation.
      else {
        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, '(RECEIVED WHEN APP IN BACKGROUND) ' + notification.messageFrom);
        } else {
          $cordovaDialogs.alert(notification.alert, '(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received');
        }
      }
    }

  }
]);