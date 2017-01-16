
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

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(currentVolume);
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
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    var $row = $(template);
    
    var clickHandler = function() {
        var $songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNum !== null) {
            // Revert to song number for currently playing song because user started playing new song
            var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNum);
            console.log(typeof currentlyPlayingSongNum);
            $currentlyPlayingCell.html(currentlyPlayingSongNum);
        }
        if (currentlyPlayingSongNum !== $songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong($songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        } else if (currentlyPlayingSongNum === $songNumber) {
            //Check if currentSoundFile is paused
            if (currentSoundFile.isPaused()) {
                //if it is paused: start playing song again - revert icon in song row + player bar to pause icon
                currentSoundFile.play();
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
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //Update the player bar to show the new song
    updatePlayerBarSong();
    //Update the HTML of the previous song's .song-item-number element with a number
    //Update the HTML of the new song's .song-item-number element with a pause button
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    console.log(currentSongIndex);
    console.log(lastSongNumber);
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

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});



