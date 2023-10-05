let PlayButton = document.getElementById('PlayButton')
let AudioConnector = new Audio()
let totalTime = document.getElementById('totalTime')
let currentTime = document.getElementById('currentTime')
let ProcessMeter = document.getElementById('ProcessMeter')
let volumecontrol = document.getElementById('volumecontrol')
let LoadList = document.getElementById('LoadList')
let disabledBtns = document.querySelectorAll('.disabledBtns')
let playlistThumbnail = document.getElementById('playlistThumbnail')
let playlistTitle = document.getElementById('playlistTitle')
let playlisLenght = document.getElementById('playlisLenght')
let playlisView = document.getElementById('playlisView')
let insertPlaylistVideo = document.getElementById('insertPlaylistVideo')
let modalBackImg = document.getElementById('modalBackImg')
let backImag = document.getElementById('backImag')
let thumbnailBox = document.getElementById('thumbnailBox')
let NextBtn = document.getElementById('NextBtn')
let PreBtn = document.getElementById('PreBtn')
let SearchForurl = document.getElementById('SearchForurl')
let searchUrlsource = document.getElementById('searchUrlsource')
let searchError = document.getElementById('searchError')
let playlistTitlesaved = document.getElementById('playlistTitlesaved')
let playlisLenghtsaved = document.getElementById('playlisLenghtsaved')
let playlisViewsaved = document.getElementById('playlisViewsaved')
let modalBackImgsaved = document.getElementById('modalBackImgsaved')
let playlistThumbnailsaved = document.getElementById('playlistThumbnailsaved')
let insertPlaylistVideosaved = document.getElementById('insertPlaylistVideosaved')
let volumecontrolstatus = document.getElementById('volumecontrolstatus')
let issavedtolocal = document.getElementById('issavedtolocal')
let insertPlaylistVideosavedvideo = document.getElementById('insertPlaylistVideosavedvideo')
let playlisLenghtsavedvideo = document.getElementById('playlisLenghtsavedvideo')

console.log(AudioConnector)

PlayButton.style.border = 'none !important'
let RangeInterval = 0
let CurrentPlayingSongsList = {}
let CurrentPlayingSongsListIndex = -1

// volumecontrol.style.backgroundSize = `50% 100%`
// AudioConnector.volume = 0.5
// let volumecontrolbtn = document.getElementById('volumecontrolbtn')
// let volumecontrols = document.getElementById('volumecontrol')
// volumecontrols.style.backgroundSize = '50% 100%'

// volumecontrolbtn.addEventListener('click', (event) => {

//   if (volumecontrols.classList.contains('d-none')) {
//     volumecontrols.classList.remove('d-none')
//     console.log("remove")
//   }
//   else {
//     volumecontrols.classList.add('d-none')
//     console.log("add")

//   }

// })

// let volumecontrolrange = document.getElementById('volumecontrol')
// let volumecontrolbtns = document.getElementById('volumecontrolbtn')

// volumecontrolrange.addEventListener('focusout', CheckFocus)
// // < !--volumecontrolbtns.addEventListener('focusout', CheckFocus) -->

// function CheckFocus(event) {

//   volumecontrolrange.classList.add('d-none')
// }


NextBtn.addEventListener('click', Nextsong)
PreBtn.addEventListener('click', Presong)



AudioConnector.onplay = (event) => {
  PlayButton.innerHTML = '<i class="bi bi-pause-circle fs-3 text-primary"></i>'
  GetRange()
}

let convertIntoMinuts = (seconds) => {
  let hour = Math.floor(seconds / 3600)
  seconds = seconds % 3600;
  let minutes = Math.floor(seconds / 60);
  let extraSeconds = seconds % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  extraSeconds = extraSeconds < 10 ? "0" + extraSeconds.toFixed(0) : extraSeconds.toFixed(1);

  times = `${minutes}:${extraSeconds.split('.')[0]}`
  if (hour > 0) {
    times = `${hour}:${minutes}:${extraSeconds.split('.')[0]}`

  }

  return times
}

AudioConnector.onpause = (event) => {
  PlayButton.innerHTML = '<i class="bi bi-play-circle fs-3 text-primary"></i>'
}

PlayButton.addEventListener('click', (event) => {
  if (AudioConnector.paused) {
    AudioConnector.play()
  }
  else {

    AudioConnector.pause()
  }
})

let GetRange = () => {


  RangeInterval = setInterval(() => {
    totalTime.innerHTML = convertIntoMinuts(AudioConnector.duration)
    let done = (AudioConnector.currentTime * 100) / AudioConnector.duration

    ProcessMeter.style.backgroundSize = `${done + 0.1}% 100%`
    ProcessMeter.value = done

    currentTime.innerHTML = convertIntoMinuts(AudioConnector.currentTime)

    if (AudioConnector.ended) {
      clearInterval(RangeInterval)
      Nextsong()

    }
  }, 1000);
}

ProcessMeter.addEventListener('input', (event) => {
  AudioConnector.currentTime = (AudioConnector.duration * ProcessMeter.value) / 100
  GetRange()
})


let SetVolumeStatus = () => {


}

volumecontrol.addEventListener('input', (event) => {

  volume = volumecontrol.value / 100
  volumecontrolstatus.innerHTML = " " + volumecontrol.value + "%"
  volumecontrol.style.backgroundSize = `${volume * 100}% 100%`
  AudioConnector.volume = volume

})

let GetUrlParams = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param)
}


let LoadPlaylistDataInPLaylistBox = (playlistUrls) => {
  playlisView.innerHTML = `Views: ${abbreviateNumber(playlistUrls['Views'])}`
  playlisLenght.innerHTML = `Length: ${playlistUrls['length']}`
  playlistTitle.innerHTML = playlistUrls['title']

  playlistThumbnail.src = `https://img.youtube.com/vi/${GetVideoId(playlistUrls['Urls'][0])}/maxresdefault.jpg`

  // Inserting playlist video into playlist box
  InsertPLaylistVideosFromList(playlistUrls['Urls'])

  for (let index = 0; index < disabledBtns.length; index++) {
    const element = disabledBtns[index];
    element.removeAttribute('disabled')

  }

  LoadList.classList.remove('d-none')
  LoadList.previousElementSibling.classList.add('d-none')
  CreateLocalEntry(GetUrlParams('list'), playlistUrls)

}

let GetVideoId = (url) => {
  if (url != undefined) {
    var videoURL = url;
    var splited = videoURL.split("v=");
    var splitedAgain = splited[1].split("&");
    var videoId = splitedAgain[0];
    return videoId
  }
  return none

}

let InsertPLaylistVideosFromList = (urls) => {
  playlistId = GetUrlParams('list')
  let strVideotheme = ``
  // modalBackImg.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(urls[0])}/maxresdefault.jpg$')`
  CurrentPlayingSongsList = {}
  for (let index = 0; index < Object.keys(urls).length; index++) {
    const element = urls[index];
    CurrentPlayingSongsList[index] = `https://www.youtube.com/watch?v=${GetVideoId(element)}`

    if (index == 0) {
      modalBackImg.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(element)}/maxresdefault.jpg')`

    }

    strVideotheme += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${GetVideoId(element)}&list=${playlistId}" class="card m-auto my-1" style="width:18rem;">
     <img  src="https://img.youtube.com/vi/${GetVideoId(element)}/maxresdefault.jpg" class="card-img-top" alt="...">
      
    </a></div>`
  }
  insertPlaylistVideo.innerHTML = strVideotheme
}

function Nextsong() {
  CurrentPlayingSongsListIndex = (CurrentPlayingSongsListIndex + 1) % Object.keys(CurrentPlayingSongsList).length
  VideoId = CurrentPlayingSongsList[CurrentPlayingSongsListIndex]
  SendLoadRequest(VideoId)

}

function Presong() {
  CurrentPlayingSongsListIndex = (CurrentPlayingSongsListIndex - 1 + Object.keys(CurrentPlayingSongsList).length) % Object.keys(CurrentPlayingSongsList).length
  videoID = CurrentPlayingSongsList[CurrentPlayingSongsListIndex]
  SendLoadRequest(videoID)
}

function SendLoadRequest(videoID) {
  var url = '/newsong/';

  PlayButton.innerHTML = `<div class="spinner-grow text-primary" role="status"><span class="visually-hidden"></span></div>`

  PlayButton.setAttribute('disabled', 'true')
  $.ajax({
    type: "POST",
    url: url,
    data: { 'url': videoID },

    success: function (data) {
      let playlistUrls = JSON.parse(data)
      LoadNewSong(playlistUrls['url'], playlistUrls['videoid'], playlistUrls['title'], playlistUrls['filename'])
      PlayButton.removeAttribute('disabled')


    },
    error: function (data) {

      PlayButton.innerHTML = '<i class="bi fs-3 ">😫</i>'
      // Some error in ajax call
    }
  });



}


let LoadNewSong = (url, videoId, title, filename) => {

  backImag.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(videoId)}/maxresdefault.jpg')`
  thumbnailBox.src = `https://img.youtube.com/vi/${GetVideoId(videoId)}/maxresdefault.jpg`
  AudioConnector.src = url
  searchUrlsource.placeholder = `www.youtube.com | ${title}`
  downloadNowbtn.href = url
  downloadNowbtn.download = url + '&filename=' + filename
  AudioConnector.play()

}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "K", "M", "B", "T"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

async function SharePage() {

  const shareData = {
    title: document.title,
    text: "Learn web development on MDN!",
    url: window.location.href,
    image: `https://img.youtube.com/vi/${GetUrlParams('v')}/maxresdefault.jpg')`
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
  }


}

function ShowList() {
  LoadList.click()
}

// _+_______________________________________________________________Creating history______________________________________________________________

let CreateLocalEntry = (name, data) => {

  if (localStorage.getItem('playlist') == null) {

    localStorage.setItem('playlist', JSON.stringify({}))
  }

  let playlistData = JSON.parse(localStorage.getItem('playlist'))
  playlistData[name] = data
  localStorage.setItem('playlist', JSON.stringify(playlistData))

}

let ClearPlaylist = () => {
  localStorage.removeItem('playlist')
  localStorage.setItem('playlist', JSON.stringify({}))

}

let GetPlaylit = (name) => {

  playlist = JSON.parse(localStorage.getItem('playlist'))

  if (playlist == undefined) {
    return playlist
  }
  return playlist[name]


}

// _+_______________________________________________________________Creating history______________________________________________________________

let CreateLocalSaved = (name, data) => {

  if (localStorage.getItem('saved') == null) {
    localStorage.setItem('saved', JSON.stringify({}))
  }

  let playlistData = JSON.parse(localStorage.getItem('saved'))

  playlistData[name] = data
  localStorage.setItem('saved', JSON.stringify(playlistData))

}

let DeleteSaved = (savedId) => {
  let playlistData = JSON.parse(localStorage.getItem('saved'))
  delete playlistData[savedId]
  localStorage.setItem('saved', JSON.stringify(playlistData))

}

let ClearSaved = () => {
  localStorage.removeItem('saved')
  localStorage.setItem('saved', JSON.stringify({}))

}

let GetSaved = () => {

  playlist = JSON.parse(localStorage.getItem('saved'))
  if (playlist != undefined) {
    return playlist
  }

  return {}


}

issavedtolocal.addEventListener('click', () => {
  let playlistData = JSON.parse(localStorage.getItem('saved'))
  let saveToVideoId = GetUrlParams('v')

  if (saveToVideoId in playlistData) {
    DeleteSaved(saveToVideoId)
    issavedtolocal.innerHTML = '<i class="bi bi-heart"></i>'

  }
  else {
    let youtubemp3Saveurl = `https://www.youtube.com/watch?v=${saveToVideoId}`
    CreateLocalSaved(saveToVideoId, youtubemp3Saveurl)
    issavedtolocal.innerHTML = '<i class="bi bi-heart-fill text-danger"></i>'
  }
  inserSavedVideoInPlaylist()

})


function checckIsSaved() {
  let saveToVideoId = GetUrlParams('v')
  let playlistData = JSON.parse(localStorage.getItem('saved'))

  if (saveToVideoId in playlistData) {
    issavedtolocal.innerHTML = '<i class="bi bi-heart-fill text-danger"></i>'
  }
}

let inserSavedVideoInPlaylist = () => {
  let savedVideodata = GetSaved()
  let strVideotheme = ``
  playlisLenghtsavedvideo.innerHTML = 'Length : ' + Object.keys(savedVideodata).length + " videos"

  for (let index = 0; index < Object.keys(savedVideodata).length; index++) {
    const element = savedVideodata[Object.keys(savedVideodata)[index]];
    console.log(element)
    CurrentPlayingSongsList[index] = `https://www.youtube.com/watch?v=${GetVideoId(element)}`

    if (index == 0) {
      modalBackImg.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(element)}/maxresdefault.jpg')`

    }

    strVideotheme += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${GetVideoId(element)}" class="card m-auto my-1" style="width:18rem;">
     <img  src="https://img.youtube.com/vi/${GetVideoId(element)}/maxresdefault.jpg" class="card-img-top" alt="...">
      
    </a></div>`
  }
  insertPlaylistVideosavedvideo.innerHTML = strVideotheme

}

// _+_______________________________________________________________Creating history______________________________________________________________


function getIDfromURL(url) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }


  return null;
}

function youtube_validate(url) {

  var regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
  return url.match(regExp) && url.match(regExp).length > 0;

}
//get playlist id from url
function youtube_playlist_parser(url) {

  var reg = new RegExp("[&?]list=([a-z0-9_]+)", "i");
  var match = reg.exec(url);

  if (match && match[1].length > 0 && youtube_validate(url)) {
    return match[1];
  } else {
    return null;
  }

}

SearchForurl.addEventListener('click', (event) => {
  let OrUrl = searchUrlsource.value
  let YoutubeUrl = '/watch?'
  let Is_valid = false

  if (String(OrUrl).includes('list=')) {
    let playlistId = youtube_playlist_parser(OrUrl)

    YoutubeUrl = YoutubeUrl + 'list=' + playlistId

    if (String(OrUrl).includes('v=')) {
      let videoId = getIDfromURL(OrUrl)
      YoutubeUrl = YoutubeUrl + '&v=' + videoId

    }
    Is_valid = true
  }

  else if (String(OrUrl).includes('v=')) {  // checking for long videos and gathering their id's
    let videoId = getIDfromURL(OrUrl)
    YoutubeUrl = YoutubeUrl + 'v=' + videoId
    Is_valid = true

  }
  else if (String(OrUrl).includes('shorts')) {  /// Checking for short video and getting their id's
    let videoId = String(OrUrl).split("/")
    YoutubeUrl = YoutubeUrl + 'v=' + videoId[videoId.length - 1]
    Is_valid = true

  }
  else {
    searchUrlsource.style.border = '1px solid crimson'
    searchError.innerHTML = 'Invailid URL | Enter a valid YouTube video or playlist url'
    searchError.style.color = 'crimson'
    searchError.style.display = 'block'
    setTimeout(() => {
      searchUrlsource.style.border = 'none'
      searchError.style.display = 'none'
    }, 4000);
  }
  // This is the main url for video and playlist 
  if (Is_valid) {

    window.location.href = YoutubeUrl  //Redirecting current url into new converted url 
  }



})


function ShowSavedPlaylist() {
  let savedplaylistStr = ``
  savedplaylist = JSON.parse(localStorage.getItem('playlist'))
  let TotalVideos = 0
  if (savedplaylist != undefined) {
    for (let index = 0; index < Object.keys(savedplaylist).length; index++) {
      savedKeys = Object.keys(savedplaylist)
      const element = savedplaylist[savedKeys[index]];

      let title = element['title']
      let videoId = element['Urls'][0]
      if (videoId != undefined) {
        countvideos = Object.keys(element['Urls']).length
        playlisLenghtsaved.innerHTML = `Lenght : ${savedKeys.length} playlists`
        videoId = GetVideoId(videoId)
        TotalVideos = TotalVideos + countvideos

        savedplaylistStr += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${videoId}&list=${savedKeys[index]}" class="card m-auto my-1 text-truncate" style="width:18rem;text-decoration:none;background-image:url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')">
      <img  src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" class="card-img-top" alt="...">
       <span class="playlistTitle text-truncate px-1" style="color: #00ffe5 !important;background: #0000006e;">${title}<P class="text-white my-0 py-0">Length : ${countvideos} Videos</P></span>
     </a></div>`
        //  #00f3ff #00ff90 00fff8
      }

    }
    playlisViewsaved.innerHTML = `Count : ${TotalVideos} videos`
    insertPlaylistVideosaved.innerHTML = savedplaylistStr;
  }


}

let LoadFirstSong = () => {
  let Videoid = GetUrlParams('v')
  if (Videoid != null || Videoid != undefined) {
    let firstUrl = `https://www.youtube.com/watch?v=${Videoid}`
    SendLoadRequest(firstUrl)

  }

}

let LoadLocalPlaylist = async () => {

  if (GetUrlParams('list') != null) {


    if (GetPlaylit(GetUrlParams('list')) == undefined) {

      $(() => {

        var url = '/playlist/';
        $.ajax({
          type: "POST",
          url: url,
          data: { 'videoid': GetUrlParams('list') },

          success: function (data) {
            let playlistUrls = JSON.parse(data)

            LoadPlaylistDataInPLaylistBox(playlistUrls)


          },
          error: function (data) {

            // Some error in ajax call
            alert("some Error");
          }
        });

      })();
    }
    else {
      let CurrentPlaylistData = GetPlaylit(GetUrlParams('list'))
      LoadPlaylistDataInPLaylistBox(CurrentPlaylistData)

    }

  }

}



window.onload = async () => {
  await checckIsSaved()
  await LoadFirstSong()
  await LoadLocalPlaylist()
  await ShowSavedPlaylist()
  await inserSavedVideoInPlaylist()

}

let slowInternetTimeout = null;


AudioConnector.addEventListener('waiting', () => {
  slowInternetTimeout = setTimeout(() => {
      //show buffering
      console.log('Buffering --1');
      PlayButton.innerHTML = `<div class="spinner-grow text-danger" role="status"><span class="sr-only"></span></div>`

      let done = (AudioConnector.currentTime * 100) / AudioConnector.duration
      ProcessMeter.style.backgroundSize = `${done + 0.1}% 100%`
      ProcessMeter.value = done

      });
  });

  AudioConnector.addEventListener('playing', () => {
  if(slowInternetTimeout != null){
      clearTimeout(slowInternetTimeout);
      slowInternetTimeout = null;
      //continue playing
      console.log('Play continues');
      PlayButton.innerHTML = '<i class="bi bi-pause-circle fs-3 text-primary"></i>'
      }
  });


  AudioConnector.addEventListener('loadstart', function () {
    //show buffering
    console.log('Buffering --2');
    PlayButton.innerHTML = `<div class="spinner-grow text-sucess" role="status"><span class="sr-only"></span></div>`
    
    let done = (AudioConnector.currentTime * 100) / AudioConnector.duration
    ProcessMeter.style.backgroundSize = `${done + 0.1}% 100%`
    ProcessMeter.value = done

});