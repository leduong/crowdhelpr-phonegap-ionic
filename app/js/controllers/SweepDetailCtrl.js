'use strict';

angular.module('CrowdhelprApp').

controller('SweepDetailCtrl', [
  '$rootScope', '$scope', '$state', 'Sweeps', 'User', '$localStorage', '$ionicPopup', '$cordovaSocialSharing', '$ionicActionSheet',
  function($rootScope, $scope, $state, Sweeps, User, $localStorage, $ionicPopup, $cordovaSocialSharing, $ionicActionSheet) {
    var sweepObject = new Sweeps();
    var userObject = new User();
    $scope.data = {};
    $scope.sweep = $localStorage.sweep;
    // console.log($scope.sweep);
    $scope.videoId = $scope.sweep.media_url ? $scope.sweep.media_url.replace('watch?v=', 'v/').split('/').pop() : null;
    $scope.user = $localStorage.current_user;

    $scope.share = function() {
      $rootScope.$broadcast('loading:show');
      var sweep = $scope.sweep;
      $cordovaSocialSharing
        .share(sweep.title + '\n' + sweep.sharing_url, sweep.image_url, sweep.media_url, sweep.sharing_url)
        .then(function() {
          // sweepObject.share(sweep.id);
          $rootScope.$broadcast('loading:hide');
        }, function(err) {
          console.log(err);
          // An error occurred. Show a message to the user
        });
    };

    $scope.showActionSheets = function() {
      $ionicActionSheet.show({
        buttons: [{
          text: '<i class="ion-trophy"></i> Leaderboard'
        }, {
          text: '<i class="ion-share"></i> Share'
        }, {
          text: '<i class="ion-ribbon-a"></i> Sweep Winners'
        }],
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) {
            $state.go('tab.sweep-leaderboard', {
              sweepId: $scope.sweep.id
            });
          }
          if (index === 1) {
            $scope.share();
          }
          return true;
        }
      });
    };

    $scope.openDonation = function(sweep) {
      var ref = window.open('https://www.crowdhelpr.com/app/donations/' + sweep.id + '?token=' + $localStorage.token, '_blank', 'location=no;hidden=yes');
      ref.addEventListener('loadstart', function(evt) {
        if (evt.url === 'http://crowdhelprapp2016://') {
          ref.close();
        }
      });
      ref.addEventListener('exit', function() {
        sweepObject.get(sweep.id).then(function(data) {
          $scope.sweep = data;
          for (var i = 0; i < $localStorage.sweeps.length; i++) {
            if (sweep.id === $localStorage.sweeps[i].id) {
              $localStorage.sweeps[i] = data;
              return;
            }
          }
        });
      });
    };

    $scope.useCoin = function(sweep) {
      if (sweep.my_campaign) {
        var coinPopup = $ionicPopup.show({
          template: '<input type="number" ng-model="data.coin">',
          title: 'Enter Using Coin',
          subTitle: 'How many Coins would you like to enter?',
          scope: $scope,
          buttons: [{
            text: 'Cancel'
          }, {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.coin) {
                e.preventDefault();
              } else {
                return $scope.data.coin;
              }
            }
          }]
        });
        coinPopup.then(function(res) {
          if (res !== undefined) {
            userObject.currentUser().then(function(data) {
              $localStorage.current_user = data;
              if (data.good_coins_available < res) {
                $ionicPopup.alert({
                  title: 'Alert',
                  template: 'You don\'t have enough good coins'
                });
              } else {
                sweepObject.useCoin(sweep.id, res).then(function() {
                  $ionicPopup.alert({
                    title: 'Success',
                    template: 'Check the Leaderboard to see your new Score!'
                  });
                });
              }
              $scope.data = {};
            });
          }
        });
      } else {
        $ionicPopup.alert({
          title: 'Contribution required',
          template: 'Please Contribute at least $1 before using Crowd Coins'
        });
      }
    };
  }
]);