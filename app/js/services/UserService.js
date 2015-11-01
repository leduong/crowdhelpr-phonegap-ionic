'use strict';
angular.module('CrowdhelprApp').
factory('UserService', [
  '$http', 'API',
  function($http, API) {
    var exports;
    exports = {
      register: function(params) {
        return $http.post(API.user.register, params);
      },

      myCarts: function() {
        return $http.get(API.user.myCarts);
      },
      profileUpdate: function(params) {
        return $http.post(API.user.profileUpdate, params);
      },
      verifyPhone: function(params) {
        return $http.post(API.user.verifyPhone, params);
      },
      sendCode: function(params) {
        return $http.post(API.user.verifyPhone, params);
      },
      forgotPassword: function(params) {
        return $http.post(API.user.forgotPassword, params);
      },
      signIn: function(params) {
        return $http.post(API.user.signIn, params);
      },
      userLists: function() {
        return $http.get(API.user.userLists);
      },
      getUser: function(userid, params) {
        if (userid) {
          return $http.get(API.user.getUser + '?userid=' + userid, {
            params: params
          });
        } else {
          return $http.get(API.user.getUser);
        }
      },
      follow: function(userid) {
        return $http.post(API.user.follow + '?userid=' + userid);
      },
      search: function(keyword) {
        return $http.post(API.user.search + '?keyword=' + keyword);
      }
    };
    return exports;
  }
]);