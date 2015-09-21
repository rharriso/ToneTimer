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


  function TimerController($scope, $element, audio){
    this.interval;
    this.time0;
    this.totalTime = 0;
    this.playing = false;
    var _this = this;
      
    this.start = function(){
      console.log("start");
      this.time0 = this.time0 || new Date();
      this.interval = setInterval(tick, 1000);
      this.playing = true;
    };
    
    this.stop = function(){
      console.log("stop"); 
      clearInterval(this.interval);
      this.time0 = null;
      this.playing = false;
    };
    
    this.reset = function(){
      console.log("reset"); 
      this.stop();
      this.interval = null;
      this.totalTime = 0;
    };

    function tick(){
      var time1 = new Date();
      _this.totalTime += time1 - _this.time0;
      _this.time0 = time1;
      console.log("now", _this.totalTime); 

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
  TimerController.$inject = ['$scope', '$element', 'AudioService'];
  app.controller('TimerController', TimerController);

})();
