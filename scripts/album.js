
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

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var $currentlyPlayingCell = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
            $currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== $songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = $songNumber;
            currentSongFromAlbum = currentAlbum.songs[$songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === $songNumber) {
            // Switch from Pause -> Play button to pause currently playing song
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }
    };
    
    var onHover = function(event) {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
        
        if ($songNumber !== currentlyPlayingSongNumber) {
            $songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
        
        if ($songNumber !== currentlyPlayingSongNumber) {
            $songNumberCell.html($songNumber);
        }
        console.log("songNumber type is " + typeof $songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
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
    var getLastSongNumber = function(index) {
        if (index >= currentAlbum.songs.length) {
            index = 0;
        }
        return index;
    };
    
    //Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    //Set a new current song to currentSongFromAlbum
    var currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //Update the player bar to show the new song
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    //Update the HTML of the previous song's .song-item-number element with a number
    //Update the HTML of the new song's .song-item-number element with a pause button
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $currentSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    
    $currentSongNumberCell.html(currentSongIndex);
    $nextSongNumberCell.html(pauseButtonTemplate);
};

var previousSong = function() {
    //Get current->previous song
    var getLastSongNumber = function(index) {
        if (index < 0) {
            index = currentAlbum.songs.length;
        }
        return index + 2;
    };
    
    //Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length-1;
    }
    //Set a new current song to currentSongFromAlbum
    var currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //Update the player bar to show the new song
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    //Update the HTML of the previous song's .song-item-number element with a number
    //Update the HTML of the new song's .song-item-number element with a pause button
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
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
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});



