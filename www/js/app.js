// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
  'use strict';
  var app = angular.module('starter',
    ['ionic', 'tone-timer.services']);

  var defaults = {
    prepTime: 5,
    intervalOn: 30,
    intervalOff: 30
  }

  var states = [
    { name: "prep",
      duration: 5000,
      tick: 1000,
      audio: ["audio/tick.mp3"],
      finalAudio: "audio/start.mp3" },
    { name: "intervalOn",
      duration: 30000,
      tick: 5000,
      audio: ["audio/tone-in.mp3", "audio/tone-out.mp3"],
      finalAudio: "audio/tone-victory.mp3"},
    { name: "intervalOn",
      duration: 30000,
      tick: 5000,
      audio: ["audio/tick.mp3"]}
  ]

  var stateIndex = 0;

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

    /*
     * Update the current time
     */
    function updateTime(){
      var time1 = new Date();
      _this.totalTime += time1 - _this.time0;
      _this.time0 = time1;
    }

    /*
     * Sweep the time display
     */
    function sweep(){
      updateTime();
      var seconds = _this.totalTime / 1000
      _this.currentSeconds = Math.floor(seconds);
      _this.currentMilliSeconds = Math.floor((seconds - _this.currentSeconds) * 100);
    }


    /*
     * On Tick check and play sound state
     */
    function tick(){
    updateTime();
      // how long have we been in this loop? 
      var loopTime = Math.round((_this.totalTime % totalTime())/1000)*1000; // floor to 1000
      var stateIndex = calcStateIndex(loopTime);
      var currState = states[stateIndex];
      var stateTime = loopTime - stateStartTime(currState);
      console.log(loopTime, _this.totalTime % totalTime(), stateIndex);

      // if within a tenth of a second of tick time, play sound
      if(stateTime % currState.tick === 0){
        console.log(!!currState, stateTime - currState.duration, currState.tick);
        // play final audio?
        if(!!currState.finalAudio && 
             currState.duration - stateTime === currState.tick){
          console.log("play final audio");
          audio.playMedia(currState.finalAudio);

          // which file to play
        } else{
          var tickIndex = Math.round(stateTime / currState.tick) % currState.audio.length
          audio.playMedia(currState.audio[tickIndex]);
        }
      }
    }

    /*
     * Get the start time of the current
     */ 
    function stateStartTime(state){
      var startTime = 0;
      for(var i=0; states[i] !== state ; i++){
        startTime += states[i].duration;
      }  
      return startTime;
    }

    /*
     * Get the end time of the current state
     */ 
    function stateEndTime(){
      return stateStartTime() + states[stateIndex].duration;      
    }

    /*
     * Get current state from time index (in milliseconds)
     */
    function calcStateIndex(currTime){
      var startTime = 0;
      for(var i=0; i < states.length; i++){
        if(currTime < (startTime + states[i].duration)){
          return i;
        }
        startTime += states[i].duration;
      }

      throw new Error("Unable to find state for time :"+currTime);
    }

    /*
     * Get the total duration of all states
     */
    function totalTime(){
      var total = 0;
      for(var i=0; i < states.length ; i++){
        total += states[i].duration;
      }  
      return total;
    }
  }
  TimerController.$inject = ['$scope', '$element', '$interval', 'AudioService'];
  app.controller('TimerController', TimerController);

})();
