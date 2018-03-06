function initializePlayer() {

  /* get a reference to our video */
  video = document.querySelector('video.shadowEffect');

  // Turn off default controlls on the video

  video.controls = false;

  //select the video cover image and wrap it in a jquery object. 
  $videoCover = $('#videoCover');
  var seconds;

  /* Grab handles (nicknames or references) to our various
   * controll elements (tags)
   *
   */

  $thumbnail = $('span.thumb');

  playPauseButton = document.querySelector('#playPause');
  stopButton =  document.querySelector('#stopButton');
  progressBar = document.querySelector('#progressBar');
  playProgress = document.querySelector('#played');
  muteButton = document.querySelector('#mute');
  volumeSlider = document.querySelector('#volumeSlider');
  fullScreenButton = document.querySelector('#fullScreen');

  lastVolumeSetting = volumeSlider.value;

  // Time values

  currentTimeText = document.querySelector('#currentTime');
  durationTimeText = document.querySelector('#durationTime');

  // Determine and display the video's duration time
  
  durationMinutes = Math.floor(video.duration / 60)

  durationSeconds = Math.floor(video.duration % 60)

  
  if (durationSeconds < 10 ) {

    seconds = "0" + durationSeconds;

  } else {

    seconds = durationSeconds; 

  }

  durationTimeText.innerHTML = durationMinutes + ":" + seconds;

  /* Add event listeners to detect when a control has been
   * activated by the user.
   */

  playPauseButton.addEventListener('click', togglePlay, false);
  stopButton.addEventListener('click', stopVideo, false);
  muteButton.addEventListener('click', toggleMute, false);
  fullScreenButton.addEventListener('click', toggleFullScreen, false);
  volumeSlider.addEventListener('input', setVolume, false);
  
  progressBar.addEventListener('mouseenter', function(e) {
    $thumbnail.css('display', 'block');
    $thumbnail.addClass('showThumbs');
    $thumbnail.addClass('thumb');

  });

  progressBar.addEventListener('mouseleave', function(e) {
    $thumbnail.css('display', 'none');
    $thumbnail.removeClass('showThumbs');
  });

  progressBar.addEventListener('mousemove', function(e) {

   /*
    * q list variable
    * textTracks is a TextTrackList object which represents the 
    * avalible text tracks for the video. 
    * This data comes from our .vtt file each avalible textTracks
    * is represented by a textTracks object
    *
    * A TextTrack object is an interface - part of an API for handling 
    * WebVTT (text tracks on media presentations) - which describes and
    * controls the text track associated with a particular <track> element
    * one of its properties is cues. 
    *
    * cues (readonly property) is a TextTrackCueList object which contains
    * all of the tracks cues. 
    *
    * TextTrackCueList objects are a list of TextTrackCue objects which have
    * properties like:
    *
    * startTime: The text track cue startTime in seconds 
    * endTime: The text track endTme in seconds
    *
    * text: the text of the object in un-parsed format
*/
    // first we convert from mouse to time position ..
  var mousePos = Math.floor((e.offsetX * video.duration) / progressBar.offsetWidth);
  
  var cuesList = video.textTracks[0].cues;
  var urlString;
  // ..then we find the matching cue..
 
  var cuesList = video.textTracks[0].cues;
  for (var i=0; i<cuesList.length; i++) {
      if(cuesList[i].startTime <= mousePos && cuesList[i].endTime > mousePos) {
          break;
      };
  }
  urlString = "thumbnails" + (i + 1) + ".png";
  
  // ..next we unravel the JPG url and fragment query..
  var url = cuesList[mousePos].text;
  var urlString = "url(" + url + ")";
 
  $thumbnail.css('background', url);
  $thumbnail.css('left', e.offsetX);
 
  // ..and last we style the thumbnail overlay
  
  
//

  

  });
  video.addEventListener('timeupdate', updateProgress, false);
  progressBar.addEventListener('mouseup', function(e) {
    //if user clicks on progress bar before video has begun playing, simply fade out coverimage. 
    if (!video.currentTime) {

      togglePlay();
      playPauseButton.className = 'pauseBtn';

    }

    // e recieves the passed in event object always
    var playPosition = e.offsetX.toFixed(2);

    video.currentTime = ((video.duration / progressBar.offsetWidth) * playPosition).toFixed(2);

  }, false);
  // Fade the image cover image back in when the video ends naturally.
   video.addEventListener('ended', function() {
     if (playPauseButton.className == 'pauseBtn') {
       playPauseButton.className = 'playBtn';
     }
     $videoCover.fadeIn(3000);
   }, false);
  } // end initializePlayer

function togglePlay() {

  /* if video is paused or ended
   *  if videocover is showing 
   *    remove it
   *  end if 
   *  then play
   *  change icon to pause
   * else video is playing 
   *  so pause
   *  change icon to play
   * end if
   *
   */
   
  if (video.paused || video.ended) {
    
    if ($videoCover) {

      $videoCover.stop(true).fadeOut(500);

    }
    video.play();
    this.className = 'pauseBtn';
  } else {

    video.pause();
    this.className = 'playBtn';
  }
}

function stopVideo() {

  video.pause();

  video.currentTime = 0;
  
  if (playPauseButton.className == 'pauseBtn') {
    playPauseButton.className = 'playBtn';
  }

}

function toggleMute() {

  if (video.muted) {

    volumeSlider.value = lastVolumeSetting;

    video.muted = false; 
    muteButton.className = 'mute';

  } else {
    lastVolumeSetting = volumeSlider.value;
    volumeSlider.value = 0;
    video.muted = true;
    muteButton.className = 'unmute';
  }

}

function toggleFullScreen() {

  //Use feature detection to determine if the user's browser
  //suports requestFullScreen().

  if (video.requestFullScreen) {

    video.requestFullScreen();

  } else if (video.webkitRequestFullScreen) {

    video.webkitRequestFullScreen();

  } else if (video.mozRequestFullScreen) {

    video.webKitRequestFullScreen();

  } else if (video.msRequestFullScreen) {
    video.allowFullScreen = true;
    video.msKitRequestFullScreen();

  }

}

function setVolume() {

  lastVolumeSetting = this.value;
  video.volume = lastVolumeSetting;
  if (video.muted || !video.volume) {
    toggleMute();
  } 
}

function updateProgress() {


  var value = 0;

  if (video.currentTime > 0 ) {

    // get the percentage that reflects the current playback progress of the video

    value = (100/ video.duration) * video.currentTime;



  }

  // fill the progress bbar (its span child) to the point
  // where the video playback is at based on our % (value)
  playProgress.style.width = value + "%";
  // Determine and display the updated time. 

  currentMinutes = Math.floor(video.currentTime / 60);
  currentSeconds = Math.floor(video.currentTime % 60);

  if (currentSeconds < 10 ) {
    seconds = "0" + currentSeconds;
  } else {

    seconds = currentSeconds;

  }

  currentTimeText.innerHTML = currentMinutes + ":" + seconds;
 
}
