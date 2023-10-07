from django.shortcuts import render,HttpResponse
from urllib.parse import urlparse, parse_qs
from contextlib import suppress

import yt_dlp
import json,re
from pytube import YouTube, Playlist
# Create your views here.


def HomePage(request):
    
    context = {}
    PlayingVideoUrl = None
    PlaylistUrls = []
    
    
    if request.method=="GET":
        videoId = request.GET.get('v')
        playlistId = request.GET.get('list')
        
        
        context['playlist'] = PlaylistUrls
        context['VideoId'] = videoId
        context['isPlaylist'] = False if playlistId is None else True
            
        return render(request=request,template_name='index.html',context=context)
   
    return render(request,'index.html',context)

def LogIn(request):
    return render(request,'login.html')

def Signup(request):
    return render(request,'signup.html')

# @csrf_exempt
def GetNewSong(request):
    if request.method=='POST':
        videoUrl = request.POST.get('url')
        print('hello')
        url,title = ExtractOneVideo(videoUrl)
        print('hi')
        return HttpResponse(json.dumps({'url':url,'title':title,'videoid':videoUrl,'filename':title+'.mp3'}))

    return HttpResponse(json.dumps({}))
     
def ExtractOneVideo(url):
    """Gets the YouTube video MP3 download URL using yt-dlp.

    Args:
        youtube_video_url: The URL of the YouTube video.

    Returns:
        The MP3 download URL, or None if the video cannot be downloaded.
    """
    ydl = yt_dlp.YoutubeDL({'format': 'bestaudio'})
    info = ydl.extract_info(url, download=False)

    # If the video cannot be downloaded, return None.
    if not info:
        return None

    # Get the MP3 download URL.
    title = info.get('title')
    mp3_download_url = info.get('formats')
    DownloadUrl = None
    for videos in mp3_download_url:
        if videos.get("audio_ext")== "m4a":
            DownloadUrl = videos.get('url')
            break

    return DownloadUrl,title


def get_yt_id(url, ignore_playlist=False):
    # Examples:
    # - http://youtu.be/SA2iWivDJiE
    # - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    # - http://www.youtube.com/embed/SA2iWivDJiE
    # - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US

    query = urlparse(url)
    if query.hostname == 'youtu.be': return query.path[1:]
    if query.hostname in {'www.youtube.com', 'youtube.com', 'music.youtube.com'}:
        if not ignore_playlist:
        # use case: get playlist id not current video in playlist
            with suppress(KeyError):
                return parse_qs(query.query)['list'][0]
            
        if query.path == '/watch': return parse_qs(query.query)['v'][0]
        if query.path[:7] == '/watch/': return query.path.split('/')[1]
        if query.path[:7] == '/embed/': return query.path.split('/')[2]
        if query.path[:3] == '/v/': return query.path.split('/')[2]
   # returns None for invalid YouTube url

# @csrf_exempt
def ExtractPlaylistVideos(request):
    dataUrls = {}
    PlaylistVideos = []
    
    if request.method=="POST":

        playlistId = request.POST.get('videoid')
        print("Video id  ",playlistId) #https://www.youtube.com/playlist?list=PL9bw4S5ePsEEqCMJSiYZ-KTtEjzVy0YvK
        PlaylistVideos = Playlist(url=f"https://www.youtube.com/watch?list={playlistId}")
        PlaylistVideos._video_regex = re.compile(r"\"url\":\"(/watch\?v=[\w-]*)")
        print("Video id  ",PlaylistVideos)
        
        VideoUrls =  PlaylistVideos.video_urls if len(PlaylistVideos)>0 else []

        data = {}  
        for i,item in enumerate(VideoUrls):
            data[i] = item

        dataUrls['title'] = PlaylistVideos.title if len(PlaylistVideos)>0 else '' 
        dataUrls['length'] = PlaylistVideos.length if len(PlaylistVideos)>0 else '' 
        dataUrls['Views'] = PlaylistVideos.views if len(PlaylistVideos)>0 else '' 
        dataUrls['Urls'] = data
        return HttpResponse(json.dumps(dataUrls))

    return HttpResponse(json.dumps(dataUrls))
        