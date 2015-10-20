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

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // save to use plugins here
  });

  // add possible global event handlers here

})

.config(function($httpProvider, $ionicConfigProvider, $ionicAppProvider) {
  // register $http interceptors, if any. e.g.
  $httpProvider.interceptors.push('interceptorService');
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

});