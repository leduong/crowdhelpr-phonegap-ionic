'use strict';

angular.module('CrowdhelprApp').

factory('User', function($http, $q, $localStorage, $ionicLoading, $state, UserService) {

  var User = function() {
    this.busy = false;
    this.userid = null;
    this.fields = [{
      key: 'first_name',
      value: 'First name'
    }, {
      key: 'last_name',
      value: 'Last name'
    }, {
      key: 'email',
      value: 'Email'
    }, {
      key: 'password',
      value: "Password can't"
    }, {
      key: 'user_name',
      value: 'User name'
    }, {
      key: 'password_confirmation',
      value: "Password doesn't"
    }];
  };

  User.prototype.full_name = function(obj) {
    return obj.first_name + " " + obj.last_name;
  };

  User.prototype.save = function(usr) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var saving = this;
    var deffered = $q.defer();
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/profileupdate',
        data: usr
      })
      .success(function(data) {
        deffered.resolve(data.result);
        saving.busy = false;
      });
    return deffered.promise;
  };

  User.prototype.sendPhoneCode = function(info) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var phonecode = this;
    var deffered = $q.defer();
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/sendcode',
        data: info
      })
      .success(function(data) {
        deffered.resolve(data);
        phonecode.busy = false;
      });
    return deffered.promise;
  };

  User.prototype.verify = function(info) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var phonecode = this;
    var deffered = $q.defer();
    $http.defaults.headers.common.Authorization = "Token token=" + $localStorage.token;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/verifyphone',
        data: info
      })
      .success(function(data) {
        if (data.status_code === 3) {
          $localStorage.$reset({
            current_user: undefined,
            token: undefined,
            http: 'https://www.crowdhelpr.com'
          });
          $state.go('session.new');
        }
        deffered.resolve(data);
        phonecode.busy = false;
      });
    return deffered.promise;
  };

  User.prototype.fbSignIn = function(fb_id, info, callback) {
    info.fb_id = fb_id;
    info.image_url = 'https://graph.facebook.id/' + fb_id + '/picture';
    $ionicLoading.show({
      template: "Processing..."
    });
    $http({
      method: 'post',
      url: $localStorage.http + '/api/login',
      data: info
    }).success(function(data) {
      $ionicLoading.hide();
      callback(data);
    }).error(function() {
      $ionicLoading.hide();
    });
  };

  User.prototype.signUp = function(info) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var signup = this;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/register',
        data: info
      })
      .success(function(data) {
        if (data.status_code === 1) {
          $localStorage.token = data.token;
          $localStorage.current_user = data.user;
          $state.go('tab.sweep');
        } else {
          signup.validate(data.message, info);
        }
        signup.busy = false;
      }).error(function(data) {
        signup.busy = false;
      });
  };

  User.prototype.resetPassword = function(info) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var resetPassword = this;
    $http({
        method: 'post',
        url: $localStorage.http + '/api/forgot_password',
        data: info
      })
      .success(function(data) {
        if (data.status_code === 1) {
          $state.go('tab.sweep');
        } else {
          info.error = data.message === "parameters not set" ? "Wrong email address" : data.message;
        }
        resetPassword.busy = false;
      }).error(function(data) {
        info.error = "Failed to send instruction, please check your internet connection";
        resetPassword.busy = false;
      });
  };

  User.prototype.validate = function(message, info) {
    var field = {};
    var signup = this;
    for (var i = 0; i < message.length; i++) {
      for (var a = 0; a < signup.fields.length; a++) {
        var msg = message[i];
        if (msg.indexOf(signup.fields[a].value) > -1) {
          field[signup.fields[a].key] = msg;
          info.error = field;
        }
      }
    }
  };

  User.prototype.signOut = function() {
    $localStorage.$reset({
      current_user: undefined,
      token: undefined,
      http: 'https://www.crowdhelpr.com'
    });
    $state.go('session.new');
  }
  User.prototype.signIn = function(params) {
    var _this = this;
    if (_this.busy) {
      return;
    }
    _this.busy = true;
    $ionicLoading.show({
      template: "Processing..."
    });

    UserService.signIn(params).then(function(res) {
      var data = res.data || {};
      _this.busy = false;
      $ionicLoading.hide();
      console.log(data);
      if (data.status_code === 1) {
        $ionicLoading.hide();
        $localStorage.token = data.token;
        $localStorage.current_user = data.user;
        $state.go('tab.sweep');
      } else {
        $ionicLoading.hide();
        params.error = data.message;
      }
      // return data || null;
    });
    //
    // $http({
    //     method: 'post',
    //     url: $localStorage.http + '/api/sign_in',
    //     data: info
    //   })
    //   .success(function(data) {
    //     if (data.status_code === 1) {
    //       $ionicLoading.hide();
    //       $localStorage.token = data.token;
    //       $localStorage.current_user = data.user;
    //       $state.go('tab.sweep');
    //     } else {
    //       $ionicLoading.hide();
    //       info.error = data.message;
    //     }
    //     signin.busy = false;
    //   })
    //   .error(function() {
    //     $ionicLoading.hide();
    //     info.error = "Authentication failed";
    //     signin.busy = false;
    //   });
  };

  User.prototype.fbLogin = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var usr = this;

    // Settings
    FacebookInAppBrowser.settings.appId = '341918775984223';
    // FacebookInAppBrowser.settings.appId = '296864270520544';
    FacebookInAppBrowser.settings.redirectUrl = 'https://www.crowdhelpr.com/';
    // FacebookInAppBrowser.settings.redirectUrl = 'http://192.168.1.104:3000/';
    FacebookInAppBrowser.settings.permissions = 'email';
    // Optional
    FacebookInAppBrowser.settings.timeoutDuration = 7500;
    // Login(accessToken will be stored trough localStorage in 'accessToken');
    FacebookInAppBrowser.login({
      denied: function() {
        console.log('user denied');
        $ionicLoading.hide();
        usr.busy = false;
      },
      timeout: function() {
        $ionicLoading.hide();
        console.log('a timeout has occurred, probably a bad internet connection');
        usr.busy = false;
      },
      userInfo: function(userInfo) {
        if (userInfo) {
          console.log(userInfo);
          usr.fbSignIn(userInfo.id, userInfo, function(response) {
            $localStorage.token = response.token;
            $localStorage.current_user = response.user;
            usr.busy = false;
            $ionicLoading.hide();
            if ($localStorage.current_user !== undefined && $localStorage.current_user.phone_verified === null) {
              $state.go('session.ask-phone-no');
            } else {
              $state.go('tab.sweep');
            }
          });
        } else {
          usr.busy = false;
          console.log('no user info');
        }
      }
    });
  };

  User.prototype.fetch_user_profile = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return UserService.getUser(this.userid).then(function(data) {
      _this.busy = false;
      return data || null;
    });
  };

  User.prototype.fetch_current_user = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return UserService.getUser().then(function(res) {
      _this.busy = false;
      var result = res.data.result || {};
      $localStorage.current_user = result;
      return result;
    });
  };

  User.prototype.user_carts = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return UserService.myCarts().then(function(data) {
      _this.busy = false;
      return data || null;
    });
  };

  User.prototype.follow = function(userid) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return UserService.follow(userid).then(function(data) {
      _this.busy = false;
      return data || null;
    });
  };

  User.prototype.search = function(keyword) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var _this = this;
    return UserService.search(keyword).then(function(data) {
      _this.busy = false;
      return data || null;
    });
  };

  return User;
});