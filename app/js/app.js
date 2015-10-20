'use strict';

/**
 * @ngdoc overview
 * @name CrowdhelprApp
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('CrowdhelprApp', [
  'ionic',
  'ionic.service.core',
  'ionic.service.push',
  'ngCordova',
  'ngStorage',
  'ngMap',
  'angularMoment',
  'youtube-embed'
])

.run(['$ionicPlatform', function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // save to use plugins here
  });

  // add possible global event handlers here

}])

.run(['$rootScope', '$ionicLoading', function($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: 'Processing...'
    });
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });
}])

.config(['$ionicConfigProvider', '$ionicAppProvider', function($ionicConfigProvider, $ionicAppProvider) {

  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: 'a93055ca',
    // The public API key all services will use for this app
    api_key: 'a11d353dbf27232cde4c1b60adf3638b25965b82fc1187dc',
    // Set the app to use development pushes
    dev_push: true
  });

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');

}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(['$rootScope', '$location', '$q', '$localStorage', 'API_ENDPOINT', function($rootScope, $location, $q, $localStorage, API_ENDPOINT) {
    function resetToken() {
      $localStorage.$reset({
        current_user: undefined,
        token: undefined,
        http: API_ENDPOINT.host
      });
    }
    return {
      request: function(config) {
        config.headers = config.headers || {};
        var token = $localStorage.token || null;
        if (token) {
          config.headers.Authorization = 'Token token=' + $localStorage.token;
        }
        $rootScope.$broadcast('loading:show');
        return config;
      },

      response: function(res) {
        if (res.headers()['content-type'] === 'application/json' || res.headers()['content-type'] === 'application/json; charset=utf-8') {
          if (res.data.status_code !== 1) {
            resetToken();
            $location.path('/session/new');
          }

        }
        //   console.log(res);
        $rootScope.$broadcast('loading:hide');
        return res;
      },

      responseError: function(rejection) {
        if (rejection.status === 400) {
          if (rejection.headers()['content-type'] === 'application/json' || rejection.headers()['content-type'] === 'application/json; charset=utf-8') {
            $rootScope.$broadcast('warning', rejection.data.message || 'Bad request!');
            return $q.resolve(rejection);
          }
        }

        if (rejection.status === 401) {
          resetToken();
          $rootScope.$broadcast('warning', rejection.data.message || 'Unauthorized!');
          $location.path('/');
        }

        if (rejection.status === 403) {
          $rootScope.$broadcast('warning', rejection.data.message || 'Forbidden!');
        }

        if (rejection.status === 500) {
          var errorMessage = 'Error 500: ' + rejection.data.message;
          $rootScope.$broadcast('error', errorMessage);
          return $q.reject(rejection);
        }

        return $q.reject(rejection);
      }
    };
  }]);
}]).

config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.
  state('session', {
    url: '/session',
    abstract: true,
    templateUrl: 'templates/session/index.html'
  }).

  state('session.new', {
    url: '/new',
    views: {
      'session-new': {
        templateUrl: 'templates/session/new.html',
        controller: 'SessionCtrl'
      }
    }
  }).

  state('session.reset-password', {
    url: '/reset',
    views: {
      'session-new': {
        templateUrl: 'templates/session/reset.html',
        controller: 'SessionCtrl'
      }
    }
  }).

  state('session.register', {
    url: '/register',
    views: {
      'session-new': {
        templateUrl: 'templates/session/register.html',
        controller: 'SessionCtrl'
      }
    }
  }).

  state('session.ask-phone-no', {
    url: '/ask-phone',
    views: {
      'session-new': {
        templateUrl: 'templates/session/ask-phone.html',
        controller: 'SessionCtrl'
      }
    }
  }).

  state('session.verify', {
    url: '/verify-phone',
    views: {
      'session-new': {
        templateUrl: 'templates/session/verify.html',
        controller: 'SessionCtrl'
      }
    }
  }).

  state('session.terms', {
    url: '/terms',
    views: {
      'session-new': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('session.privacy', {
    url: '/privacy',
    views: {
      'session-new': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  // setup an abstract state for the tabs directive
  state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tab/index.html'
  }).

  // Each tab has its own nav history stack:

  state('tab.post', {
    url: '/post',
    views: {
      'tab-scan': {
        templateUrl: 'templates/tab/post.html',
        controller: 'PostCtrl'
      }
    }
  }).

  state('tab.sweep', {
    url: '/sweep',
    views: {
      'tab-sweep': {
        templateUrl: 'templates/tab/sweeps.html',
        controller: 'SweepsCtrl'
      }
    }
  }).

  state('tab.sweep-detail', {
    url: '/sweep/:sweepId',
    views: {
      'tab-sweep': {
        templateUrl: 'templates/sweep-detail.html',
        controller: 'SweepDetailCtrl'
      }
    }
  }).

  state('tab.sweep-leaderboard', {
    url: '/sweep/:sweepId/leaderboard',
    views: {
      'tab-sweep': {
        templateUrl: 'templates/sweep-leaderboard.html',
        controller: 'SweepLeaderboardCtrl'
      }
    }
  }).

  state('tab.sweep-donation', {
    url: '/sweep/:sweepId/donation',
    views: {
      'tab-sweep': {
        templateUrl: 'templates/sweep-donation.html',
        controller: 'SweepDonationCtrl'
      }
    }
  }).


  state('tab.stuff', {
    url: '/stuff',
    views: {
      'tab-stuff': {
        templateUrl: 'templates/tab/stuffs.html',
        controller: 'StuffCtrl'
      }
    }
  }).

  state('tab.stuff-detail', {
    url: '/stuff/:factualId/:storeId',
    views: {
      'tab-stuff': {
        templateUrl: 'templates/stuff-detail.html',
        controller: 'StuffDetailCtrl'
      }
    }
  }).

  state('tab.feeds', {
    url: '/feeds',
    views: {
      'tab-feeds': {
        templateUrl: 'templates/tab/feeds.html',
        controller: 'FeedsCtrl'
      }
    }
  }).

  state('tab.feeds-comments', {
    url: '/feeds/:feedId/comments',
    views: {
      'tab-feeds': {
        templateUrl: 'templates/feed-comments.html',
        controller: 'CommentsCtrl'
      }
    }
  }).

  state('tab.search', {
    url: '/search/:keyword',
    views: {
      'tab-feeds': {
        templateUrl: 'templates/user/search.html',
        controller: 'UserSearchCtrl'
      }
    }
  }).

  state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'templates/tab/more.html',
        controller: 'MoreCtrl'
      }
    }
  }).

  state('tab.more-coupon-cart', {
    url: '/coupon',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/couponcart.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.more-leaderboard', {
    url: '/leaderboard',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/leaderboard.html',
        controller: 'SweepsCtrl'
      }
    }
  }).

  state('tab.more-leaderboard-detail', {
    url: '/leaderboard/:sweepId',
    views: {
      'tab-more': {
        templateUrl: 'templates/sweep-leaderboard.html',
        controller: 'SweepLeaderboardCtrl'
      }
    }
  }).

  state('tab.more-edit-profile', {
    url: '/edit/profile',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/edit-profile.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.more-terms', {
    url: '/terms',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.more-rules', {
    url: '/rules',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.more-privacy', {
    url: '/privacy',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.more-method', {
    url: '/free-entry',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/text.html',
        controller: 'OtherCtrl'
      }
    }
  }).

  state('tab.user-profile', {
    url: '/user/profile/:id',
    views: {
      'tab-feeds': {
        templateUrl: 'templates/user/profile.html',
        controller: 'UserCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/session/new');
}]);