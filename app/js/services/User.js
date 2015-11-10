'use strict';

angular.module('CrowdhelprApp').

factory('User', [
  '$localStorage', '$ionicLoading', '$state', 'UserService',
  function($localStorage, $ionicLoading, $state, UserService) {

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
        value: 'Password can\'t '
      }, {
        key: 'user_name',
        value: 'User name'
      }, {
        key: 'password_confirmation',
        value: 'Password doesn\'t '
      }];
    };

    User.prototype.full_name = function(obj) {
      return obj.first_name + ' ' + obj.last_name;
    };

    User.prototype.save = function(params) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.profileUpdate(params).then(function(data) {
        _this.busy = false;
        return data.result || null;
      });
    };

    User.prototype.sendPhoneCode = function(params) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.sendCode(params).then(function(data) {
        _this.busy = false;
        return data || null;
      });
    };

    User.prototype.verify = function(params) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.verifyPhone(params).then(function(data) {
        _this.busy = false;
        return data || null;
      });
    };


    User.prototype.signUp = function(params) {
      angular.extend(params, {
        push_token: $localStorage.push_token,
        app: 'android'
      });
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.register(params).then(function(res) {
        _this.busy = false;
        if (res.data.status_code === 1) {
          $localStorage.token = res.data.token;
          $localStorage.current_user = res.data.user;
          $state.go('tab.sweep');
        } else {
          _this.validate(res.data.message, params);
        }
        var result = res.data.result || {};
        return result;
      });
    };

    User.prototype.resetPassword = function(params) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.forgotPassword(params).then(function(data) {
        _this.busy = false;
        if (data.status_code === 1) {
          $state.go('tab.sweep');
        } else {
          params.error = data.message === 'parameters not set' ? 'Wrong email address' : data.message;
        }
        return data || null;
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
      $localStorage.token = undefined;
      $localStorage.current_user = {};
      $state.go('session.new');
    };

    User.prototype.signIn = function(params) {
      angular.extend(params, {
        push_token: $localStorage.push_token,
        app: 'android'
      });

      var _this = this;
      if (_this.busy) {
        return;
      }
      _this.busy = true;
      console.log(JSON.stringify(params));
      UserService.signIn(params).then(function(res) {
        var data = res.data || {};
        _this.busy = false;
        if (data.status_code === 1) {
          $localStorage.token = data.token;
          $localStorage.current_user = data.user;
          $state.go('tab.sweep');
        } else {
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
      //     info.error = 'Authentication failed';
      //     signin.busy = false;
      //   });
    };

    User.prototype.fbLogin = function() {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;

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
          _this.busy = false;
        },
        timeout: function() {
          $ionicLoading.hide();
          console.log('a timeout has occurred, probably a bad internet connection');
          _this.busy = false;
        },
        userInfo: function(userInfo) {
          if (userInfo) {
            var params = userInfo;
            params.fb_id = userInfo.id;
            params.image_url = 'https://graph.facebook.id/' + userInfo.id + '/picture';

            UserService.login(params).then(function(res) {
              // console.log(JSON.stringify(res.data));
              $localStorage.token = res.data.token;
              $localStorage.current_user = res.data.user;
              if ($localStorage.current_user !== undefined && $localStorage.current_user.phone_verified === null) {
                $state.go('session.ask-phone-no');
              } else {
                $state.go('tab.sweep');
              }
            });
          } else {
            _this.busy = false;
            console.log('no user info');
          }
        }
      });
    };

    User.prototype.userProfile = function() {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.getUser(this.userid).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };

    User.prototype.currentUser = function() {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.getUser().then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        $localStorage.current_user = result;
        // console.log(JSON.stringify(result));
        return result;
      });
    };

    User.prototype.myCarts = function() {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.myCarts().then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };

    User.prototype.follow = function(userid) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.follow(userid).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };

    User.prototype.search = function(keyword) {
      if (this.busy) {
        return;
      }
      this.busy = true;
      var _this = this;
      return UserService.search(keyword).then(function(res) {
        _this.busy = false;
        var result = res.data.result || {};
        return result;
      });
    };

    return User;
  }
]);