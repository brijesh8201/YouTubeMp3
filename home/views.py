from typing import Any
from django.shortcuts import render,HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
import yt_dlp
import json
# Create your views here.
# from  import YouTube,Playlist
from pytube import YouTube,Playlist


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

@csrf_exempt
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

@csrf_exempt
def ExtractPlaylistVideos(request):
    dataUrls = {}
    PlaylistVideos = []
    print("request accepted")
    if request.method=="POST":

        playlistId = request.POST.get('videoid')
        PlaylistVideos = Playlist(url=f"https://www.youtube.com/playlist?list={playlistId}")
        
        VideoUrls =  PlaylistVideos.video_urls if len(PlaylistVideos)>0 else []
        print("the video urls are : ",VideoUrls)
        data = {}  
        for i,item in enumerate(VideoUrls):
            data[i] = item

        dataUrls['title'] = PlaylistVideos.title if len(PlaylistVideos)>0 else '' 
        dataUrls['length'] = PlaylistVideos.length if len(PlaylistVideos)>0 else '' 
        dataUrls['Views'] = PlaylistVideos.views if len(PlaylistVideos)>0 else '' 
        dataUrls['Urls'] = data
        
        return HttpResponse(json.dumps(dataUrls))

    return HttpResponse(json.dumps(dataUrls))
        