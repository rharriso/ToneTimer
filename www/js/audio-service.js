/*
 * audio-service.js
 * Copyright (C) 2015 rharriso <rharriso@lappy>
 *
 * Distributed under terms of the MIT license.
 */
(function(){
  'use strict';
  var app = angular.module('tone-timer.services', []);
  
   app.service('AudioService', [function() {
   
    var AudioService = {
      my_media: null,
      mediaTimer: null,
      playAudio: function(src, cb) {
        if (!window.Media) return this.playHTML(src, cb);

        var self = this;
   
        // stop playing, if playing
        self.stopAudio();
   
        self.my_media = new window.Media(src, onSuccess, onError);
        self.my_media.play();
   
        if (self.mediaTimer == null) {
          self.mediaTimer = setInterval(function() {
            self.my_media.getCurrentPosition(
              function(position) {
                cb(position, self.my_media.getDuration());
              },
              function(e) {
                console.log("Error getting pos=" + e);
              }
            );
          }, 1000);
        }
   
        function onSuccess() {
          console.log("playAudio():Audio Success");
        }
   
        // onError Callback
        //
        function onError(error) {
          // alert('code: ' + error.code + '\n' +
          //     'message: ' + error.message + '\n');
   
          // we forcefully stop
   
        }
   
      },
   
      resumeAudio: function() {
        var self = this;
        if (self.my_media) {
          self.my_media.play();
        }
      },
      pauseAudio: function() {
        var self = this;
        if (self.my_media) {
          self.my_media.pause();
        }
      },
      stopAudio: function() {
        var self = this;
        if (self.my_media) {
          self.my_media.stop();
        }
        if (self.mediaTimer) {
          clearInterval(self.mediaTimer);
          self.mediaTimer = null;
        }
      },
      
      playHTML: function(src, cb){
        console.log("Play HTML");
        this.my_media = this.my_media ||
          document.createElement("audio"); 

        this.my_media.src = "http://localhost:8100/"+src;
        this.my_media.play();
      },
    };
   
    return AudioService;
  }]);
})();
