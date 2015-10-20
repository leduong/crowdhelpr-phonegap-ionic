'use strict';

/**
 * @ngdoc service
 * @name CrowdhelprApp.API
 * @description
 * # API
 * Retrieves correct api to make requests against.
 * Uses settings from API_ENDPOINT defined in /config/apiEndpoint.js
 */
angular.module('CrowdhelprApp').
factory('API', ['API_ENDPOINT', function(API_ENDPOINT) {
  var endpoint = API_ENDPOINT.port ? (API_ENDPOINT.host + ':' + API_ENDPOINT.port + API_ENDPOINT.path) : (API_ENDPOINT.host + API_ENDPOINT.path);
  var exports;
  exports = {
    user: {
      profileUpdate: endpoint + 'profileupdate',
      sendCode: endpoint + 'sendcode',
      verifyPhone: endpoint + 'verifyphone',
      login: endpoint + 'login',
      register: endpoint + 'register',
      forgotPassword: endpoint + 'forgot_password',
      signIn: endpoint + 'sign_in',
      getUser: endpoint + 'getuser',
      myCarts: endpoint + 'mycarts',
      follow: endpoint + 'follow',
      search: endpoint + 'search'
    },
    feed: {
      share: endpoint + 'share',
      events: endpoint + 'events',
      postEvent: endpoint + 'postevent',
      likeEvent: endpoint + 'likeevent',
      flagEvent: endpoint + 'flagevent',
      destroyEvent: endpoint + 'destroyevent',
      postComment: endpoint + 'postcomment',
      destroyComment: endpoint + 'destroycomment'
    },
    sweep: {
      campaigns: endpoint + 'campaigns',
      getCampaign: endpoint + 'getcampaign',
      enterCampaign: endpoint + 'entercampaign',
      getMyCampaign: endpoint + 'getmycampaign',
      getLeaders: endpoint + 'getleaders'
    },
    other: endpoint
  };
  return exports;
}]);