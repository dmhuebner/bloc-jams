var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};


var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumExample3 = {
    title: 'Awesome Title',
    artist: 'Awesome Artist',
    label: 'THE Label',
    year: '2016',
    albumArtUrl: 'assets/images/album_covers/06.png',
    songs: [
        { title: 'Smash Hit', duration: '3:01' },
        { title: 'Sweet Feel Good Follow up', duration: '4:23' },
        { title: 'The Ballad', duration: '6:21'},
        { title: 'That Song Everyone Loves', duration: '3:44' },
        { title: 'Classic Jam', duration: '4:15'}
    ]
};

//Created a myAlbums array to contain all of the album objects.
var myAlbums = [albumPicasso, albumMarconi, albumExample3];


var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};

var setCurrentAlbum = function(album) {
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    albumSongList.innerHTML = '';

    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function() {
    setCurrentAlbum(albumPicasso);
};


//Album 'onclick' Event Listener

var albumCover = document.getElementsByClassName('album-cover-link')[0];

albumCover.addEventListener('click', function() {
    if (albumCover.firstChild.getAttribute('src') === myAlbums[0].albumArtUrl) {
        setCurrentAlbum(myAlbums[1]);
    } else if (albumCover.firstChild.getAttribute('src') === myAlbums[1].albumArtUrl) {
        setCurrentAlbum(myAlbums[2]);
    } else if (albumCover.firstChild.getAttribute('src') === myAlbums[2].albumArtUrl) {
        setCurrentAlbum(myAlbums[0]);
    }
})

//My original solution is below. I rewrote it to make the 'if' statements more flexible in case I need to make a function that handles changing the albums in case there are a lot of them.

/*
albumCover.addEventListener('click', function() {
    if (albumCover.firstChild.getAttribute('src') === 'assets/images/album_covers/01.png') {
        setCurrentAlbum(albumMarconi);
    } else if (albumCover.firstChild.getAttribute('src') === 'assets/images/album_covers/20.png') {
        setCurrentAlbum(albumExample3);
    } else if (albumCover.firstChild.getAttribute('src') === 'assets/images/album_covers/06.png') {
        setCurrentAlbum(albumPicasso);
    }
})
*/



