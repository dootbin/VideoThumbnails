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


  playPauseButton = document.querySelector('#playPause');
  stopButton =  document.querySelector('#stopButton');
  progressBar = document.querySelector('#progressBar');
  playProgress = document.querySelector('#played');
  muteButton = document.querySelector('#mute');
  volumeSlider = document.querySelector('#volumeSlider');
  fullScreenButton = document.querySelector('#fullScreen');
  thumbnail = document.querySelector('span.thumb');

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

    thumbnail.css({ span.thumb: block  })


  });

  progressBar.addEventListener('mouseleave', function(e) {

    thumbnail.css({ span.thumb: none; })

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
