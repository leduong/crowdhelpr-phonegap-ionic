'use strict';

// https://github.com/caiovaccaro/phonegap.facebook.inappbrowser
var FacebookInAppBrowser = {

  /**
   * Basic Configuration
   * @type {Object}
   */
  settings: {

    /**
     * Your Facebook App Id
     * @type {String}
     */
    appId: '',

    /**
     * Redirect URL for 'inside' script
     * identification. Can be your main URL
     * @type {String}
     */
    redirectUrl: '',

    /**
     * Which permissions you will request
     * from your user. Facebook default is 'email'.
     *
     * Reference: https://developers.facebook.com/docs/reference/login/
     *
     * Separate by comma and no spaces.
     * @example 'email,publish_actions'
     *
     * @type {String}
     */
    permissions: '',

    /**
     * Timeout duration, usually occurs when there is a bad internet connection
     */
    timeoutDuration: 7500
  },

  /**
   * Inner function
   * Tests if parameter exists and
   * if it is of the type given.
   * @param  {Variable} test    Variable you want to test
   * @param  {String}   type    @example 'function'
   * @return {Boolean}
   */
  exists: function(test, type) {
    if (typeof type !== 'undefined') {
      if ((typeof test !== 'undefined' && test !== '') && typeof test === type) {
        return true;
      }
    } else {
      if (typeof test !== 'undefined' && test !== '') {
        return true;
      }
    }
    return false;
  },

  /**
   * Inner AJAX handler.
   * @param  {String}   type     GET or POST
   * @param  {String}   url      Request URL
   * @param  {Function} callback Success/Error callback
   * @param  {Object}   data     Data to send
   */
  ajax: function(type, url, callback, data) {
    if (!FacebookInAppBrowser.exists(type) || !FacebookInAppBrowser.exists(url) || !FacebookInAppBrowser.exists(callback)) {
      // console.log('[FacebookInAppBrowser] type, url and callback parameters are necessary.');
      return false;
    }
    if (!FacebookInAppBrowser.exists(callback, 'function')) {
      // console.log('[FacebookInAppBrowser] callback must be a function.');
      return false;
    }

    var request = new XMLHttpRequest();
    request.open(type, url, true);
    if (data) {
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.setRequestHeader('Content-length', data.length);
      request.setRequestHeader('Connection', 'close');
    }
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 0) {
          var data = request.responseText;
          if (data) {
            callback(data);
          } else {
            callback(false);
          }
        } else {
          callback(false);
        }
      }
    };
    if (data) {
      request.send(data);
    } else {
      request.send();
    }
  },

  /**
   * Open and handle Facebook Login.
   *
   * Callbacks for:
   * # Send (open InAppBrowser)
   * # Success
   * # User denied
   * # Complete regardless of result
   * # When User Id is received
   *
   * @param  {Object}
   *          data {
   *              send: function() {},
   *              success: function() {},
   *              denied: function() {},
   *              complete: function() {},
   *              userInfo: function() {},
   *              error: functon() {}
   *          }
   */
  login: function(data) {

    if (!FacebookInAppBrowser.exists(this.settings.appId) || !FacebookInAppBrowser.exists(this.settings.redirectUrl)) {
      // console.log('[FacebookInAppBrowser] You need to set up your app id and redirect url.');
      return false;
    }

    var authorize_url = 'https://m.facebook.com/dialog/oauth?';
    authorize_url += 'client_id=' + this.settings.appId;
    authorize_url += '&redirect_uri=' + this.settings.redirectUrl;
    authorize_url += '&display=touch';
    authorize_url += '&response_type=token';
    authorize_url += '&type=user_agent';

    if (FacebookInAppBrowser.exists(this.settings.permissions)) {
      authorize_url += '&scope=' + this.settings.permissions;
    }

    if (FacebookInAppBrowser.exists(data.send, 'function')) {
      data.send();
    }

    var faceView, userDenied = false;

    // Open the url command
    faceView = window.open(authorize_url, '_blank', 'location=no,hidden=yes');

    // On timeout
    var timeoutOccurred = false;
    var timeout = setTimeout(function() {

      timeoutOccurred = true;

      if (FacebookInAppBrowser.exists(data.timeout, 'function')) {
        setTimeout(function() {
          data.timeout();
        }, 0);
      }

    }, this.settings.timeoutDuration);

    // On loadStart
    faceView.addEventListener('loadstart', function(location) {
      // console.log('[FacebookInAppBrowser] Event \'loadstart\': ' + JSON.stringify(location));

      // Success
      if (location.url.indexOf('access_token') !== -1) {
        var access_token = location.url.match(/access_token=(.*)$/)[1].split('&expires_in')[0];
        // console.log('[FacebookInAppBrowser] Logged in. Token: ' + access_token);
        window.localStorage.setItem('facebookAccessToken', access_token);
        faceView.close();

        if (FacebookInAppBrowser.exists(data.success, 'function')) {
          setTimeout(function() {
            data.success(access_token);
          }, 0);
        }

      }

      // User denied
      if (location.url.indexOf('error_reason=user_denied') !== -1) {
        userDenied = true;
        if (FacebookInAppBrowser.exists(data.denied, 'function')) {
          setTimeout(function() {
            data.denied();
          }, 0);
        }
        // console.log('[FacebookInAppBrowser] User denied Facebook Login.');
        faceView.close();
      }
    });

    // On finished loading
    faceView.addEventListener('loadstop', function() {
      if (timeoutOccurred === true) {
        return;
      }

      clearTimeout(timeout); // Clear the onTimeout function
      faceView.show();
    });

    // On exit
    faceView.addEventListener('exit', function() {

      if (window.localStorage.getItem('facebookAccessToken') === null && userDenied === false) {
        // InAppBrowser was closed and we don't have an app id
        if (FacebookInAppBrowser.exists(data.complete, 'function')) {
          setTimeout(function() {
            data.complete(false);
          }, 0);
        }

      } else if (userDenied === false) {
        if (FacebookInAppBrowser.exists(data.complete, 'function')) {
          setTimeout(function() {
            data.complete(window.localStorage.getItem('facebookAccessToken'));
          }, 0);
        }
      }

      if (window.localStorage.getItem('facebookAccessToken') !== null) {
        setTimeout(function() {
          var userInfoCallback = FacebookInAppBrowser.exists(data.userInfo, 'function') ? data.userInfo : undefined;
          FacebookInAppBrowser.getInfo(userInfoCallback);
        }, 0);
      }

      userDenied = false;
      clearTimeout(timeout); // Clear the onTimeout function
    });
  },

  /**
   * Get User Info
   * User needs to be logged in.
   *
   * @param  {Function} afterCallback Success/Error callback
   */
  getInfo: function(afterCallback) {
    if (window.localStorage.getItem('facebookAccessToken') === null) {
      // console.log('[FacebookInAppBrowser] No facebookAccessToken. Try login() first.');
      return false;
    }

    var get_url = 'https://graph.facebook.com/me?fields=email,name,gender&access_token=' + window.localStorage.getItem('facebookAccessToken');
    // console.log('[FacebookInAppBrowser] getInfo request url: ' + get_url);

    FacebookInAppBrowser.ajax('GET', get_url, function(data) {
      if (data) {
        var response = JSON.parse(data);
        // console.log('[FacebookInAppBrowser] User id: ' + response.id);
        if (FacebookInAppBrowser.exists(response.id)) {
          window.localStorage.setItem('uid', response.id);
        }
        if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
          setTimeout(function() {
            afterCallback(response);
          }, 0);
        }
      } else {
        if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
          setTimeout(function() {
            afterCallback(false);
          }, 0);
        }
      }
    });
  },

  /**
   * Get permissions that user has or not given
   * Needs to be logged in and have User Id
   *
   * @param  {Function} afterCallback Success/Error callback
   */
  getPermissions: function(afterCallback) {
    if (window.localStorage.getItem('uid') === null) {
      // console.log('[FacebookInAppBrowser] No user id. Try getInfo() first.');
      return false;
    }

    var get_url = 'https://graph.facebook.com/' + window.localStorage.getItem('uid') + '/permissions?access_token=' + window.localStorage.getItem('facebookAccessToken'),
      permissions = null;

    // console.log('[FacebookInAppBrowser] getPermissions request url: ' + get_url);

    FacebookInAppBrowser.ajax('GET', get_url, function(data) {
      if (data) {
        var response = JSON.parse(data);
        if (response.data[0]) {
          permissions = response.data[0];
        }
        // console.log('[FacebookInAppBrowser] Permissions: ' + JSON.stringify(permissions));
        if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
          afterCallback(permissions);
        }
      } else {
        if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
          afterCallback(false);
        }
      }
    });
  },

  /**
   * Post to User Wall
   * Needs to be logged in.
   *
   * @param  {Object} data              name, link, description, picture, message
   * @param  {Function} afterCallback   Success/Error callback
   */
  post: function(data, afterCallback) {
    if (!FacebookInAppBrowser.exists(data.name) ||
      !FacebookInAppBrowser.exists(data.link) ||
      !FacebookInAppBrowser.exists(data.description) ||
      !FacebookInAppBrowser.exists(data.picture) ||
      !FacebookInAppBrowser.exists(data.message)) {
      // console.log('[FacebookInAppBrowser] name, link, description, picture and message are necessary.');
      return false;
    }
    if (!FacebookInAppBrowser.exists(FacebookInAppBrowser.settings.appId) || !FacebookInAppBrowser.exists(window.localStorage.getItem('facebookAccessToken')) || window.localStorage.getItem('facebookAccessToken') === null) {
      // console.log('[FacebookInAppBrowser] You need to set your app id in FacebookInAppBrowser.settings.appId and have a facebookAccessToken (try login first)');
      return false;
    }

    var post_url = 'https://graph.facebook.com/' + window.localStorage.getItem('uid') + '/feed',
      post_data = 'app_id=' + encodeURIComponent(FacebookInAppBrowser.settings.appId) + '&access_token=' + encodeURIComponent(window.localStorage.getItem('facebookAccessToken')) + '&redirect_uri=' + encodeURIComponent(FacebookInAppBrowser.settings.redirectUrl) +
      '&name=' + encodeURIComponent(data.name) + '&link=' + encodeURIComponent(data.link) + '&description=' + encodeURIComponent(data.description) + '&picture=' + encodeURIComponent(data.picture) + '&message=' + encodeURIComponent(data.message);

    FacebookInAppBrowser.ajax('POST', post_url, function(data) {
      if (data) {
        var response = JSON.parse(data);
        if (response.id) {
          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            afterCallback(response.id);
          }
        } else {
          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            afterCallback(false);
          }
        }
      } else {
        if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
          afterCallback(false);
        }
      }
    }, post_data);
  },

  /**
   * Open Invitation Box
   * @param  {String} inviteText
   * @param  {Function} afterCallback Success/Error callback
   */
  invite: function(inviteText, afterCallback) {
    if (typeof inviteText === 'undefined') {
      // console.log('[FacebookInAppBrowser] inviteText is a required parameter.');
      return false;
    }

    var obj = this;

    var request_url = 'https://m.facebook.com/dialog/apprequests?';
    request_url += 'app_id=' + this.settings.appId;
    request_url += '&redirect_uri=' + this.settings.redirectUrl;
    request_url += '&display=touch';
    request_url += '&message=' + inviteText;

    request_url = encodeURI(request_url);

    // console.log('[FacebookInAppBrowser] Invite, URL: ' + request_url);

    var faceView,
      callback = function(location) {
        // console.log('[FacebookInAppBrowser] Event \'loadstart\': ' + JSON.stringify(location));

        if (location.url === request_url) {
          // Do nothing

        } else if (location.url.indexOf('?request=') !== -1) {
          // Success
          faceView.close();

          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback(true);
            }, 0);
          }

        } else if (location.url.indexOf('error_code=') !== -1) {
          // Error
          faceView.close();

          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback(false);
            }, 0);
          }

        } else if (location.url === obj.settings.redirectUrl + '#_=_') {
          // User clicked Cancel
          faceView.close();
        }

      };
    faceView = window.open(request_url, '_blank', 'location=no');
    faceView.addEventListener('loadstart', callback);
  },

  /**
   * Open Share dialog
   *
   * Let you use the Share Dialog https://developers.facebook.com/docs/sharing/reference/share-dialog
   *
   * @param  {Object}   data either with 'href' key or 'action_type', 'action_properties' keys
   * @param  {Function} afterCallback Success/Error callback, will receive false on error, true or the created object_id on success
   */
  share: function(data, afterCallback) {
    var obj = this;
    var i;

    var request_url = 'https://m.facebook.com/dialog/';
    if (FacebookInAppBrowser.exists(data.href)) {
      request_url += 'share?';
    } else {
      request_url += 'share_open_graph?';
    }
    request_url += 'app_id=' + this.settings.appId;
    request_url += '&redirect_uri=' + this.settings.redirectUrl;
    request_url += '&display=touch';

    var fields = ['href', 'action_type', 'action_properties'];
    for (i = 0; i < fields.length; i += 1) {
      if (FacebookInAppBrowser.exists(data[fields[i]])) {
        request_url += '&' + fields[i] + '=' + data[fields[i]];
      }
    }

    request_url = encodeURI(request_url);

    // console.log('[FacebookInAppBrowser] Share dialog, URL: ' + request_url);

    var faceView,
      seen_submit = false,
      callback = function(location) {
        // console.log('[FacebookInAppBrowser] Event \'loadstart\': ' + JSON.stringify(location));

        if (location.url === request_url) {
          // Do nothing

        } else if (location.url.indexOf('dialog/share/submit') !== -1) {
          seen_submit = true;

        } else if (location.url.indexOf('error_code=') !== -1) {
          // Error
          faceView.close();

          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback(false);
            }, 0);
          }

        } else if (location.url.indexOf('?post_id=') !== -1 || location.url.indexOf('?object_id=') !== -1) { // according to the docs, the parameter should be called object_id, however facebook uses post_id too
          // Success
          faceView.close();

          var object_id = location.url.match(/(post|object)_id=([^#]+)/)[2];

          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback(object_id);
            }, 0);
          }

        } else if (location.url === obj.settings.redirectUrl + '#_=_' || location.url === obj.settings.redirectUrl + '?#_=_') { // facebook sometimes adds ? even though no query params added

          faceView.close();

          // Probably success, object_id not always returned
          var success = seen_submit ? true : false;
          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback(success);
            }, 0);
          }
        }
      };

    faceView = window.open(request_url, '_blank', 'location=no');
    faceView.addEventListener('loadstart', callback);
    faceView.addEventListener('loadstop', function() {
      faceView.show();
    });
  },

  /**
   * Logout User
   * From Facebook and your app
   *
   * @param  {Function} afterCallback Success/Error callback
   */
  logout: function(afterCallback) {
    var logout_url = encodeURI('https://www.facebook.com/logout.php?next=' + this.settings.redirectUrl + '&access_token=' + window.localStorage.getItem('facebookAccessToken'));

    var faceView = window.open(logout_url, '_blank', 'hidden=yes,location=no'),
      callback = function(location) {
        // console.log('[FacebookInAppBrowser] Event \'loadstart\': ' + JSON.stringify(location));

        if (location.url === logout_url) {
          // Do nothing

        } else if (location.url === FacebookInAppBrowser.settings.redirectUrl + '#_=_' || location.url === FacebookInAppBrowser.settings.redirectUrl || location.url === FacebookInAppBrowser.settings.redirectUrl + '/') {
          faceView.close();

          if (FacebookInAppBrowser.exists(afterCallback, 'function')) {
            setTimeout(function() {
              afterCallback();
            }, 0);
          }
        }
      };
    faceView.addEventListener('loadstart', callback);
  }
};

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
  'mentio',
  'ngMap',
  'angularMoment',
  'youtube-embed'
])

.config(['$ionicConfigProvider', '$ionicAppProvider', function($ionicConfigProvider, $ionicAppProvider) {

  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '17ccd99e',
    // The public API key all services will use for this app
    api_key: '5cd8779729b603b6dfc99de279a5a582887da916f6580648',
    // Set the app to use development pushes
    dev_push: true
  });

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');

}])

.run([
  '$ionicPlatform', '$cordovaPush', '$localStorage',
  function($ionicPlatform, $cordovaPush, $localStorage) {
    $ionicPlatform.ready(function() {
      var config = null;
      if (ionic.Platform.isAndroid()) {
        config = {
          'senderID': '644395022072'
        };
      } else if (ionic.Platform.isIOS()) {
        config = {
          'badge': 'true',
          'sound': 'true',
          'alert': 'true'
        };
      }

      $cordovaPush.register(config).then(function(result) {
        // // console.log('Register success ' + result);
        if (ionic.Platform.isIOS()) {
          $localStorage.push_token = result;
        }
      }, function(err) {
        console.log('Register error ' + err);
      });

    });

    // add possible global event handlers here

  }
])

.run([
  '$rootScope', '$ionicLoading',
  function($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
        template: 'Processing...'
      });
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });
  }
])


.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push([
    '$rootScope', '$location', '$q', '$localStorage', 'API_ENDPOINT',
    function($rootScope, $location, $q, $localStorage, API_ENDPOINT) {
      function resetToken() {
        $localStorage.token = undefined;
        $localStorage.current_user = {};
        $localStorage.http = API_ENDPOINT.host;
      }
      if ($localStorage.token === undefined) {
        resetToken();
      }

      return {
        request: function(config) {
          // console.log(config);
          config.headers = config.headers || {};
          var token = $localStorage.token || null;
          if (token) {
            config.headers.Authorization = 'Token token=' + $localStorage.token;
          }
          if (!config.url.search('api/events')) {
            $rootScope.$broadcast('loading:show');
          }
          // if (config.url.search('api') > -1) {
          //   console.log(JSON.stringify(config));
          // }
          return config;
        },

        response: function(res) {
          if (res.headers()['content-type'] === 'application/json' || res.headers()['content-type'] === 'application/json; charset=utf-8') {

            if (res.data.status_code === 0) {
              $rootScope.$broadcast('$cordovaToast:notification', res.data.message || 'Bad request!');
            }
            if (res.data.status_code === 3) {
              resetToken();
              $rootScope.$broadcast('$cordovaToast:notification', res.data.message || 'Unauthorize');
            }

            if (res.data.status_code !== 1 && res.data.status_code !== 'parameters not set') {
              resetToken();
              // $location.path('/session/new');
            }
            // console.log(JSON.stringify(res));
          }
          //   // console.log(res);
          $rootScope.$broadcast('loading:hide');

          return res;
        },

        responseError: function(rejection) {
          console.log(JSON.stringify(rejection));

          if (rejection.status === 400) {
            if (rejection.headers()['content-type'] === 'application/json' || rejection.headers()['content-type'] === 'application/json; charset=utf-8') {
              $rootScope.$broadcast('$cordovaToast:notification', rejection.data.message || 'Bad request!');
              return $q.resolve(rejection);
            }
          }

          if (rejection.status === 401) {
            resetToken();
            $rootScope.$broadcast('$cordovaToast:notification', rejection.data.message || 'Unauthorized!');
            $location.path('/');
          }

          if (rejection.status === 403) {
            $rootScope.$broadcast('$cordovaToast:notification', rejection.data.message || 'Forbidden!');
          }

          if (rejection.status === 500) {
            var errorMessage = 'Error 500: ' + rejection.data.message;
            $rootScope.$broadcast('$cordovaToast:notification', errorMessage);
            return $q.reject(rejection);
          }
          $rootScope.$broadcast('loading:hide');
          return $q.reject(rejection);
        }
      };
    }
  ]);
}]).

config([
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.
    state('intro', {
      url: '/',
      templateUrl: 'templates/intro.html'
    }).

    state('session', {
      url: '/session',
      abstract: true,
      templateUrl: 'templates/session/index.html',
      controller: 'SessionCtrl'
    }).

    state('session.new', {
      url: '/new',
      views: {
        'session-new': {
          templateUrl: 'templates/session/new.html'
        }
      }
    }).

    state('session.reset-password', {
      url: '/reset',
      views: {
        'session-new': {
          templateUrl: 'templates/session/reset.html'
        }
      }
    }).

    state('session.register', {
      url: '/register',
      views: {
        'session-new': {
          templateUrl: 'templates/session/register.html'
        }
      }
    }).

    state('session.ask-phone-no', {
      url: '/ask-phone',
      views: {
        'session-new': {
          templateUrl: 'templates/session/ask-phone.html'
        }
      }
    }).

    state('session.verify', {
      url: '/verify-phone',
      views: {
        'session-new': {
          templateUrl: 'templates/session/verify.html'
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
      templateUrl: 'templates/tab/index.html',
      controller: 'TabCtrl',
      resolve: {
        currentUser: ['$localStorage', '$state',
          function($localStorage, $state) {
            if (!$localStorage.current_user) {
              $state.go('session.new');
            }
            return $localStorage.current_user;
          }
        ]
      }
    }).

    // Each tab has its own nav history stack:

    state('tab.post', {
      url: '/post',
      views: {
        'tab-scan': {
          templateUrl: 'templates/tab/post.html'
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
          templateUrl: 'templates/tab/sweep-detail.html',
          controller: 'SweepDetailCtrl'
        }
      }
    }).

    state('tab.sweep-leaderboard', {
      url: '/sweep/:sweepId/leaderboard',
      views: {
        'tab-sweep': {
          templateUrl: 'templates/tab/sweep-leaderboard.html',
          controller: 'SweepLeaderboardCtrl'
        }
      }
    }).

    state('tab.sweep-donation', {
      url: '/sweep/:sweepId/donation',
      views: {
        'tab-sweep': {
          templateUrl: 'templates/tab/sweep-donation.html',
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
          templateUrl: 'templates/tab/stuff-detail.html',
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

    state('tab.feed', {
      url: '/feed/:feedId',
      views: {
        'tab-feeds': {
          templateUrl: 'templates/tab/feed.html',
          controller: 'CommentsCtrl'
        }
      }
    }).

    state('tab.feeds-comments', {
      url: '/feeds/:feedId/comments',
      views: {
        'tab-feeds': {
          templateUrl: 'templates/tab/feed-comments.html',
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
          templateUrl: 'templates/tab/sweep-leaderboard.html',
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
    $urlRouterProvider.otherwise('/');
  }
]);