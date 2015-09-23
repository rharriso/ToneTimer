// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
  'use strict';
  var app = angular.module('starter',
    ['ionic', 'tone-timer.services']);

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  // formats a number to show up to 1 leading zero
  app.filter('tensplace', function(){
    return function(input){
      var out = Math.floor(input);
      
      if(input < 10){
        out = "0"+input;
      }

      return out;
    } 
  });


  function TimerController($scope, $element, $interval, audio){
    this.tickInterval;
    this.sweepInterval;
    this.time0;
    this.totalTime = 0;
    this.currentSeconds = 0;
    this.currentMilliSeconds = 0;
    this.playing = false;
    var _this = this;
      
    this.start = function(){
      console.log("start");
      this.time0 = this.time0 || new Date();
      this.tickInterval = $interval(tick, 1000);
      this.sweepInterval = $interval(sweep, 10);
      this.playing = true;
    };
    
    this.pause = function(){
      console.log("pause"); 
      $interval.cancel(this.tickInterval);
      $interval.cancel(this.sweepInterval);
      this.time0 = null;
      this.playing = false;
    };
    
    this.reset = function(){
      console.log("reset"); 
      this.pause();
      this.tickInterval = null;
      this.sweepInterval = null;
      this.totalTime = 0;
      this.currentSeconds = 0;
      this.currentMilliSeconds = 0;
    };

    function updateTime(){
      var time1 = new Date();
      _this.totalTime += time1 - _this.time0;
      _this.time0 = time1;
    }

    function sweep(){
      updateTime();
      var seconds = _this.totalTime / 1000
      _this.currentSeconds = Math.floor(seconds);
      _this.currentMilliSeconds = Math.floor((seconds - _this.currentSeconds) * 100);
    }

    function tick(){
      updateTime();

      var round = Math.floor(_this.totalTime / 1000);
      console.log(round);

      if(round % 30 == 0){
        audio.playMedia("audio/tone-victory.mp3");
      } else if(round % 10 == 0){
        audio.playMedia("audio/tone-out.mp3");
      } else if(round % 5 == 0){
        audio.playMedia("audio/tone-in.mp3");
      }
    }
  }
  TimerController.$inject = ['$scope', '$element', '$interval', 'AudioService'];
  app.controller('TimerController', TimerController);

})();
