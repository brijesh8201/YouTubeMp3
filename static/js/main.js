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
let insertPlayingPlaylistVideo = document.getElementById('insertPlayingPlaylistVideo')
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
let PlaylistlastUpdated = document.getElementById('PlaylistlastUpdated')
let modalBackImgsaved = document.getElementById('modalBackImgsaved')
let playlistThumbnailsaved = document.getElementById('playlistThumbnailsaved')
let insertSavedPlaylistInBox = document.getElementById('insertSavedPlaylistInBox')
let volumecontrolstatus = document.getElementById('volumecontrolstatus')
let issavedtolocal = document.getElementById('issavedtolocal')
let insertFaveroitePlaylistVideo = document.getElementById('insertFaveroitePlaylistVideo')
let playlisLenghtsavedvideo = document.getElementById('playlisLenghtsavedvideo')
let shareTitle = document.getElementById('shareTitle')
let ShareImage = document.getElementById('ShareImage')

let shortHistory = document.getElementById('shortHistory')
let shortfaveroite = document.getElementById('shortfaveroite')
let shortShare = document.getElementById('shortShare')
let downloadNowbtn = document.getElementById('downloadNowbtn')
let VolumeControlBox = document.getElementById('VolumeControlBox')
let preSkipBtn = document.getElementById('preSkipBtn')
let nextSkipBtn = document.getElementById('nextSkipBtn')
let deleteOnePlatlist = document.getElementById('deleteOnePlatlist')
let deleteAllPlaylist = document.getElementById('deleteAllPlaylist')



PlayButton.style.border = 'none !important'
let RangeInterval = 0
let CurrentPlayingSongsList = {}
let CurrentPlayingSongsListIndex = -1

let volumecontrolbtn = document.getElementById('volumecontrolbtn')
let volumecontrols = document.getElementById('volumecontrol')

// AudioConnector.volume = 0.5
// volumecontrol.style.backgroundSize = `50% 100%`
// volumecontrols.style.backgroundSize = '50% 100%'

volumecontrolbtn.addEventListener('click', (event) => {

  if (VolumeControlBox.classList.contains('d-none')) {
    VolumeControlBox.classList.remove('d-none')
    volumecontrol.focus()

  }
  else {
    VolumeControlBox.classList.add('d-none')

  }

})

volumecontrol.addEventListener('focusout', () => {
  VolumeControlBox.classList.add('d-none')
})



NextBtn.addEventListener('click', Nextsong)
PreBtn.addEventListener('click', Presong)
preSkipBtn.addEventListener('click', SkipeNext)
nextSkipBtn.addEventListener('click', SkiptPre)




AudioConnector.onplay = (event) => {
  PlayButton.innerHTML = '<i class="bi bi-pause-circle fs-2 text-primary"></i>'
  GetRange()
}

let convertIntoMinuts = (seconds) => {
  if (seconds == NaN || seconds == 0) {
    return '00:00'
  }

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
  PlayButton.innerHTML = '<i class="bi bi-play-circle fs-2 text-primary"></i>'
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

  if (AudioConnector.readyState) {


    RangeInterval = setInterval(() => {
      totalTime.innerHTML = convertIntoMinuts(AudioConnector.duration)
      let done = (AudioConnector.currentTime * 100) / AudioConnector.duration

      ProcessMeter.style.backgroundSize = `${done + 0.1}% 100%`
      ProcessMeter.value = done

      currentTime.innerHTML = convertIntoMinuts(AudioConnector.currentTime)

      if (AudioConnector.ended) {
        clearInterval(RangeInterval)
        if (GetUrlParams('list') != undefined || GetUrlParams('list') != null || GetUrlParams('list') != none) {
          Nextsong()
        }

      }
    }, 1000);
  }
}

ProcessMeter.addEventListener('input', (event) => {
  AudioConnector.currentTime = (AudioConnector.duration * ProcessMeter.value) / 100

})



volumecontrol.addEventListener('input', (event) => {
  // 
  volume = volumecontrol.value / 100

  volumecontrolstatus.innerHTML = `${volumecontrol.value}%`
  volumecontrol.style.backgroundSize = `${volume * 100}% 100%`
  AudioConnector.volume = volume
})


volumecontrol.addEventListener('input', (event) => {
  // 
  volume = volumecontrol.value / 100

  volumecontrolstatus.innerHTML = `${volumecontrol.value}%`
  volumecontrol.style.backgroundSize = `${volume * 100}% 100%`
  AudioConnector.volume = volume

})

volumecontrol.addEventListener('change',()=>{
  SetLocalVolume(AudioConnector.volume)
  currentVolume = JSON.parse(localStorage.getItem('volume'))['volume']
})

// |||||||||||||||||||||| Creating Curreint volume settings |||||||||||||||||||||||||||||||||
let SetLocalVolume = (volume)=>{
  if(localStorage.getItem('volume')==undefined){
    localStorage.setItem('volume',JSON.stringify({}))
  }
  localStorage.setItem('volume',JSON.stringify({'volume':volume}))
  GetLocalVolume()
}

let GetLocalVolume = async ()=>{
  if(localStorage.getItem('volume')==undefined){
    SetLocalVolume(0.5)
  }
  currentVolume = JSON.parse(localStorage.getItem('volume'))['volume']
  volumecontrol.value = currentVolume*100
  
  volume = volumecontrol.value / 100
  volumecontrolstatus.innerHTML = `${volumecontrol.value}%`
  volumecontrol.style.backgroundSize = `${volume * 100}% 100%`
  AudioConnector.volume = volume

}
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

let GetUrlParams = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param)
}



let LoadPlaylistDataInPLaylistBox = (playlistUrls) => {

  playlisView.innerHTML = `Views: ${playlistUrls['Views']}`
  playlisLenght.innerHTML = `Length: ${playlistUrls['length']}`
  playlistTitle.innerHTML = playlistUrls['title']
  PlaylistlastUpdated.innerHTML = `Last Update: ` + playlistUrls['lastUpdated']

  playlistThumbnail.src = `https://img.youtube.com/vi/${GetVideoId(playlistUrls['Urls'][0]['url'])}/maxresdefault.jpg`

  // // Inserting playlist video into playlist box
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
  var videoURL = url;
  var splited = videoURL.split("v=");
  var splitedAgain = splited[1].split("&");
  var videoId = splitedAgain[0];
  return videoId

}

let InsertPLaylistVideosFromList = (urls) => {

  playlistId = GetUrlParams('list')
  let strVideotheme = ``
  modalBackImg.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(urls[0]['url'])}/maxresdefault.jpg')`

  CurrentPlayingSongsList = {}


  for (let index = 0; index < Object.keys(urls).length; index++) {
    const element = urls[index];
    CurrentPlayingSongsList[index] = `https://www.youtube.com/watch?v=${GetVideoId(element['url'])}`


    //  `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${GetVideoId(element['url'])}&list=${playlistId}" class="card m-auto my-1" style="width:18rem;">
    //                   <img  src="https://img.youtube.com/vi/${GetVideoId(element['url'])}/maxresdefault.jpg" class="card-img-top" alt="...">

    //                   </a></div>`

    strVideotheme += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${GetVideoId(element['url'])}&list=${playlistId}&index=${index}" class="card m-auto my-1 text-truncate" style="width:18rem;text-decoration:none;background-image:url('https://img.youtube.com/vi/${GetVideoId(element['url'])}/maxresdefault.jpg')">
                              <img  src="https://img.youtube.com/vi/${GetVideoId(element['url'])}/maxresdefault.jpg" class="card-img-top" alt="...">
                              <span class="playlistTitle text-truncate px-1" style="color: #00ffe5 !important;background: #0000006e;">${element['title']}</span>
                          </a></div>`


  }
  insertPlayingPlaylistVideo.innerHTML = strVideotheme
}

function replaceUrlParam(index,id) {
  let Currenturl = window.location.href
  let newUrl = String(Currenturl).split('?')[1].split('&')

  let URL = {}
  for (i = 0; i <= newUrl.length; i++) {
    url = String(newUrl[i]).split('=')
    URL[url[0]] = url[1]
  }

  URL['index'] =index 
  URL['v'] = id

  let keys = Object.keys(URL)

  let odlUrl = Currenturl.split('?')[0]

  for (i = 0; i <= keys.length; i++) {

    if (URL[keys[i]] == undefined) {
      continue
    }

    if (i == 0) {
      odlUrl += `?${keys[i]}=${URL[keys[i]]}`
    }
    else{

      odlUrl += '&' + keys[i] + '=' + URL[keys[i]]
    }

  }
  window.location.href = odlUrl
}

function Nextsong() {
  let index = GetUrlParams('index')
  if (index == null || index == undefined) {
    index = 0
  }
  index = (Number.parseInt(index) + 1) % Object.keys(CurrentPlayingSongsList).length
  VideoId = CurrentPlayingSongsList[index]

  let NewUrl = replaceUrlParam(index,GetVideoId(VideoId))
}

function Presong() {
  let index = GetUrlParams('index')
  if (index == null || index == undefined) {
    index = 0
  }

  index = (index - 1 + Object.keys(CurrentPlayingSongsList).length) % Object.keys(CurrentPlayingSongsList).length
  videoID = CurrentPlayingSongsList[index]
  // SendLoadRequest(videoID)
  let NewUrl = replaceUrlParam(index,GetVideoId(videoID))

}

function SkiptPre() {
  AudioConnector.currentTime = ((AudioConnector.duration * ProcessMeter.value) / 100) + 10


}

function SkipeNext() {
  AudioConnector.currentTime = ((AudioConnector.duration * ProcessMeter.value) / 100) - 10
}

function SendLoadRequest(videoID) {
  var url = '/newsong/';

  PlayButton.innerHTML = `<div class="spinner-grow text-primary" role="status"><span class="visually-hidden"></span></div>`

  PlayButton.setAttribute('disabled', 'true')
  let TokenCsrf = document.querySelector('input[name="csrfmiddlewaretoken"]')
  let dataurls = { 'url': videoID, 'csrfmiddlewaretoken': TokenCsrf.value }
  
  $.ajax({
    type: "POST",
    url: url,
    data: dataurls,

    success: function (data) {
      let playlistUrls = JSON.parse(data)
      LoadNewSong(playlistUrls['url'], playlistUrls['videoid'], playlistUrls['title'], playlistUrls['filename'])
      PlayButton.removeAttribute('disabled')


    },
    error: function (data) {

      PlayButton.innerHTML = '<i class="bi fs-2 ">😫</i>'
      // Some error in ajax call
    }
  });



}


let LoadNewSong = (url, videoId, title, filename) => {

  backImag.style.backgroundImage = `url('https://img.youtube.com/vi/${GetVideoId(videoId)}/maxresdefault.jpg')`
  thumbnailBox.src = `https://img.youtube.com/vi/${GetVideoId(videoId)}/maxresdefault.jpg`
  AudioConnector.src = url
  searchUrlsource.placeholder = `${title}`
  downloadNowbtn.href = url
  downloadNowbtn.download = url + '&filename=' + filename
  AudioConnector.play()
  shareTitle.setAttribute('content', title)
  ShareImage.setAttribute('content', `https://img.youtube.com/vi/${GetVideoId(videoId)}/maxresdefault.jpg`)

  nextSkipBtn.removeAttribute('disabled')
  preSkipBtn.removeAttribute('disabled')

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
    text: shareTitle.getAttribute('content'),
    url: window.location.href,
    file: ShareImage.getAttribute('content')
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log("Have an error while sharing this apge : ",err)
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
  ShowSavedPlaylist()
}

let GetPlaylit = (name=null) => {

  playlist = JSON.parse(localStorage.getItem('playlist'))

  if (playlist == undefined) {
    return {}
  }
  else if(name==null){
    return playlist
  }
  return playlist[name]


}


let DeletePlaylist = (savedId) => {
  let playlistData = JSON.parse(localStorage.getItem('playlist'))
  delete playlistData[savedId]
  localStorage.setItem('playlist', JSON.stringify(playlistData))

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

  if (Object.keys(playlistData).includes(saveToVideoId)) {

    DeleteSaved(saveToVideoId)
    issavedtolocal.innerHTML = '<i class="bi bi-heart"></i> <span>Save</span>'
  }
  else {
    let youtubemp3Saveurl = `https://www.youtube.com/watch?v=${saveToVideoId}`
    CreateLocalSaved(saveToVideoId, youtubemp3Saveurl)
    issavedtolocal.innerHTML = '<i class="bi bi-heart-fill text-danger"></i><span>Saved</span>'
  }

  insetFaveroiteVideoInBox()


})


function checckIsSaved() {
  if (localStorage.getItem('saved') == null) {
    localStorage.setItem('saved', JSON.stringify({}))
  }

  let saveToVideoId = GetUrlParams('v')
  let playlistData = JSON.parse(localStorage.getItem('saved'))
  savedKeys = Object.keys(playlistData)

  if (savedKeys.includes(saveToVideoId)) {
    issavedtolocal.innerHTML = '<i class="bi bi-heart-fill text-danger"></i> <span>Saved</span>'
  }
}

let insetFaveroiteVideoInBox = () => {
  let savedVideodata = GetSaved()
  let strVideotheme = ``
  playlisLenghtsavedvideo.innerHTML = 'Length : ' + Object.keys(savedVideodata).length + " videos"

  for (let index = 0; index < Object.keys(savedVideodata).length; index++) {
    const element = savedVideodata[Object.keys(savedVideodata)[index]];

    strVideotheme += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${GetVideoId(element)}" class="card m-auto my-1" style="width:18rem;">
   <img  src="https://img.youtube.com/vi/${GetVideoId(element)}/maxresdefault.jpg" class="card-img-top" alt="...">
    
  </a></div>`
  }
  insertFaveroitePlaylistVideo.innerHTML = strVideotheme

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

let GetPlaylistId = (url) => {
  playlistId = String(url).split('list=')
  return playlistId[1]
}

SearchForurl.addEventListener('click', (event) => {
  let OrUrl = searchUrlsource.value
  let YoutubeUrl = '/watch?'
  let Is_valid = false


  if (String(OrUrl).includes('list=')) {
    // let playlistId = youtube_playlist_parser(OrUrl)
    playlistId = GetPlaylistId(OrUrl)
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
    searchError.innerHTML = 'Invailid URL | YouTube video or playlist'
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
  console.log("this is the saved playlist ",savedplaylist)
  let TotalVideos = 0

  if (savedplaylist != undefined) {
    for (let index = 0; index < Object.keys(savedplaylist).length; index++) {
      savedKeys = Object.keys(savedplaylist)
      const element = savedplaylist[savedKeys[index]];

      let title = element['title']
      let videoId = element['Urls'][0]['url']

      if (videoId != undefined) {
        countvideos = Object.keys(element['Urls']).length
        playlisLenghtsaved.innerHTML = `Lenght : ${savedKeys.length} playlists`
        videoId = GetVideoId(videoId)
        TotalVideos = TotalVideos + countvideos

        savedplaylistStr += `<div class='d-flex justify-content-center m-auto playlistBox' ><span class='text-white'>${index + 1}. </span><a href="/watch?v=${videoId}&list=${savedKeys[index]}" class="card m-auto my-1 text-truncate position-relative" style="width:18rem;text-decoration:none;background-image:url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')">
          <input type="checkbox" onclick="DeleteSelectedPlaylists()" data-playlistid="${savedKeys[index]}"  class="selectedPlaylist position-absolute top-0 start-0" style="width:15px;height:15px;">

                              <img  src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" class="card-img-top" alt="...">
                              <span class="playlistTitle text-truncate px-1" style="color: #00ffe5 !important;background: #0000006e;">${title}<P class="text-white my-0 py-0">Length : ${countvideos} Videos</P></span>
                            </a></div>`
        //  #00f3ff #00ff90 00fff8
      }

    }
    playlisViewsaved.innerHTML = `Count : ${TotalVideos} videos`
    insertSavedPlaylistInBox.innerHTML = savedplaylistStr;
    deleteAllPlaylist.removeAttribute('disabled')

  }
  
  if(Object.keys(savedplaylist).length<1){
    deleteAllPlaylist.setAttribute('disabled','true')
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

      var url = '/playlist/';
      let TokenCsrf = document.querySelector('input[name="csrfmiddlewaretoken"]')
      let dataurls = { 'videoid': GetUrlParams('list'), 'csrfmiddlewaretoken': TokenCsrf.value }

      $(() => {
        // function will get executed  
        // on click of submit button 
        $.ajax({
          type: "POST",
          url: url,
          data: dataurls,
          success: function (data) {
            let playlistUrls = JSON.parse(data)
            LoadPlaylistDataInPLaylistBox(playlistUrls)
          },
          error: function (data) {
            LoadList.innerHTML = '<i class="bi fs-3 ">😫</i>'
          }
        });

      });

    }
    else {
      let CurrentPlaylistData = GetPlaylit(GetUrlParams('list'))

      LoadPlaylistDataInPLaylistBox(CurrentPlaylistData)

    }

  }

}

let slowInternetTimeout = null;


AudioConnector.addEventListener('waiting', () => {
  slowInternetTimeout = setTimeout(() => {
    //show buffering
    PlayButton.innerHTML = `<div class="spinner-grow text-danger" role="status"><span class="sr-only"></span></div>`



  });
});

AudioConnector.addEventListener('playing', () => {
  if (slowInternetTimeout != null) {
    clearTimeout(slowInternetTimeout);
    slowInternetTimeout = null;
    PlayButton.innerHTML = '<i class="bi bi-pause-circle fs-2 text-primary"></i>'
    GetRange()

  }
});


AudioConnector.addEventListener('loadstart', function () {
  //show buffering
  PlayButton.innerHTML = `<div class="spinner-grow text-warning" role="status"><span class="sr-only"></span></div>`
  AudioConnector.play()


  ProcessMeter.value = 0

});


let DeleteSelectedPlaylists = ()=>{
  let selecteplaylist = document.querySelectorAll('.selectedPlaylist')
  
  let checkBox=  false;
  for (let index = 0; index < selecteplaylist.length; index++) {
    const element = selecteplaylist[index];
    if(element.checked){
      checkBox = true
      deleteOnePlatlist.removeAttribute('disabled')
      break
    }
    
  }
  if (!checkBox) {
    deleteOnePlatlist.setAttribute('disabled','true')
    
  }
}

deleteOnePlatlist.addEventListener('click',(event)=>{
  let selecteplaylist = document.querySelectorAll('.selectedPlaylist')
  for (let index = 0; index < selecteplaylist.length; index++) {
    const element = selecteplaylist[index];
    if(element.checked){
      console.log("This element is checked ",element)
      DeletePlaylist(element.dataset.playlistid)
    }

  }
  ShowSavedPlaylist()

  deleteOnePlatlist.setAttribute('disabled','true')
  let playlistdataLength = Object.keys(GetPlaylit()).length
  console.log(playlistdataLength)
  if(playlistdataLength<1){
    deleteAllPlaylist.setAttribute('disabled','true')
  }

})

deleteAllPlaylist.addEventListener('click',(event)=>{
  ClearPlaylist()
  ShowSavedPlaylist()
  deleteAllPlaylist.setAttribute('disabled','true')
  deleteOnePlatlist.setAttribute('disabled','true')
  


})


window.onload = async () => {
  await checckIsSaved()
  await GetLocalVolume()
  await LoadFirstSong()  
  await LoadLocalPlaylist()
  await ShowSavedPlaylist()
  await insetFaveroiteVideoInBox()


}

// ________________________________ Adding Keyboard Shortcuts __________________________________________//
document.onkeyup = function (e) {

  if (e.which == 32) {
    PlayButton.click()
  }
  if (e.which == 78) {
    NextBtn.click()
  }
  if (e.which == 66) {
    PreBtn.click()
  }
  if (e.which == 13) {
    SearchForurl.click()
  }
  if (e.shiftKey && e.which == 70) {
    shortfaveroite.click()
  }
  if (e.shiftKey && e.which == 72) {
    shortHistory.click()
  }
  if (e.shiftKey && e.which == 68) {
    downloadNowbtn.click()
  }
  if (e.shiftKey && e.which == 76) {
    issavedtolocal.click()
  }
  if (e.shiftKey && e.which == 86) {
    shortShare.click()
  }
  if (e.shiftKey && e.which == 65) {
    LoadList.click()
  }
};



// shortHistory
// shortfaveroite
// shortShare
// downloadNowbtn
// issavedtolocal