var togglePlayFromPlayerBar = function() {
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNum);
    //If a song is paused and the play button is clicked in the player bar, it will
    if (currentSoundFile.isPaused()) {
        //Change the song number cell from a play button to a pause button
        $currentlyPlayingCell.html(pauseButtonTemplate);
        //Change the HTML of the player bar's play button to a pause button
        $playerBarPlayPauseButton.html(playerBarPauseButton);
        //Play the song
        currentSoundFile.play();
    } else {
    //If song is playing and pause button is clicked
        //Change the song number cell from a pause button to a play button
        $currentlyPlayingCell.html(playButtonTemplate);
        //Change the HTML of the player bar's pause button to a play button
        $playerBarPlayPauseButton.html(playerBarPlayButton);
        //Pause the song
        currentSoundFile.pause();
    }
};

var setSong = function(songNumber) {
    //conditional that stops currentSoundFile from playing if it is defined
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNum = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(songNumber) {
    return $('[data-song-number="' + songNumber + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
     + '</tr>'
     ;

    var $row = $(template);
    
    var clickHandler = function() {
        var $songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNum !== null) {
            // Revert to song number for currently playing song because user started playing new song
            var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNum);
            $currentlyPlayingCell.html(currentlyPlayingSongNum);
        }
        if (currentlyPlayingSongNum !== $songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong($songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
            //update volume seek-bar
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
        } else if (currentlyPlayingSongNum === $songNumber) {
            //Check if currentSoundFile is paused
            if (currentSoundFile.isPaused()) {
                //if it is paused: start playing song again - revert icon in song row + player bar to pause icon
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                //if it is not paused: pause song - change icon in song row + player bar to play icon
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        }
    };
    
    var onHover = function(event) {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
        
        if ($songNumber !== currentlyPlayingSongNum) {
            $songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
        
        if ($songNumber !== currentlyPlayingSongNum) {
            $songNumberCell.html($songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var filterTimeCode = function(timeInSeconds) {
    timeInSeconds = parseFloat(timeInSeconds);
    var seconds = Math.floor(timeInSeconds % 60);
    var minutes = Math.floor(timeInSeconds / 60);
    //prevent single digit seconds
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var encodedTime = minutes + ':' + seconds;
    return encodedTime;
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    var $currentTimeElement = $('.currently-playing .current-time');
    $currentTimeElement.text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
    var $totalTimeElement = $('.currently-playing .total-time');
    $totalTimeElement.text(totalTime);
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function() {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        //determines which seek-bar to update and how
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            //determines which seek-bar to update and how
            if ($seekBar.parent().attr('class') == 'seek-control') {
            
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    //Get current->previous song
    //My attempt to create this function (doesn't correctly change the html of first/last songs when pressing next button)
    /*
    var getLastSongNumber = function(index) {
        if (index > currentAlbum.songs.length) {
            index = 0;
        }
        return index;
    };
    */
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    //Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    //Set a new current song to currentSongFromAlbum
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //Update the player bar to show the new song
    updatePlayerBarSong();
    //Update the HTML of the previous song's .song-item-number element with a number
    //Update the HTML of the new song's .song-item-number element with a pause button
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $currentSongNumberCell = getSongNumberCell(lastSongNumber);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNum);
    
    $currentSongNumberCell.html(lastSongNumber);
    $nextSongNumberCell.html(pauseButtonTemplate);
};

var previousSong = function() {
    //My attempt to create this function (doesn't correctly change the html of first/last songs when pressing prev button)
    /*
    var getLastSongNumber = function(index) {
        if (index < 0) {
            index = currentAlbum.songs.length-1;
        }
        return index + 2;
    };
    */
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    //Use trackIndex() helper function to get the index of the current song and then increment the value of the index.
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length-1;
    }
    //Set a new current song to currentSongFromAlbum
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    //Update the player bar to show the new song
    updatePlayerBarSong();
    //Update HTML of previous song's .song-item-number element with a number
    //Update HTML of new song's .song-item-number element with a pause button
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNum);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

//play/pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $playerBarPlayPauseButton = $('.main-controls .play-pause');

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});



