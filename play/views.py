from django.shortcuts import render

# Create your views here.
from django.shortcuts import render,HttpResponse
from urllib.parse import urlparse, parse_qs
from contextlib import suppress

import yt_dlp,requests
import json
# from pytube import YouTube, Playlist
# Create your views here.


def HomePage(request):
    
    context = {}
    PlaylistUrls = []
    
    
    if request.method=="GET":
        videoId = request.GET.get('v')
        playlistId = request.GET.get('list')
        
        
        context['playlist'] = PlaylistUrls
        context['VideoId'] = videoId
        context['isPlaylist'] = False if playlistId is None else True
        context['cards'] = range(20)
            
        return render(request=request,template_name='index2.html',context=context)
   
    return render(request,'index2.html',context)

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
contentUrls = []
def ExtractPlaylistVideos(request):
    global contentUrls
    contentUrls = []
    # _-------------------------------------------- Methos First ----------------------------------------------
    # dataUrls = {}
    # PlaylistVideos = []
    
    # if request.method=="POST":

    #     playlistId = request.POST.get('videoid')
    #     print("Video id  ",playlistId) #https://www.youtube.com/playlist?list=PL9bw4S5ePsEEqCMJSiYZ-KTtEjzVy0YvK
    #     PlaylistVideos = Playlist(url=f"https://www.youtube.com/watch?list={playlistId}")
    #     PlaylistVideos._video_regex = re.compile(r"\"url\":\"(/watch\?v=[\w-]*)")
    #     print("Video id  ",PlaylistVideos)
        
    #     VideoUrls =  PlaylistVideos.video_urls if len(PlaylistVideos)>0 else []

    #     data = {}  
    #     for i,item in enumerate(VideoUrls):
    #         data[i] = item

    #     dataUrls['title'] = PlaylistVideos.title if len(PlaylistVideos)>0 else '' 
    #     dataUrls['length'] = PlaylistVideos.length if len(PlaylistVideos)>0 else '' 
    #     dataUrls['Views'] = PlaylistVideos.views if len(PlaylistVideos)>0 else '' 
    #     dataUrls['Urls'] = data
    #     return HttpResponse(json.dumps(dataUrls))

    # return HttpResponse(json.dumps(dataUrls))
    
    # _-------------------------------------------- Methos Second ----------------------------------------------
    def GetNext(playlistid,next=None):
        global contentUrls
        
        if next is None:
            querystring = {"id":playlistid}
        else:
            querystring = {"id":playlistid,'next':next}

        url = "https://youtube-search-and-download.p.rapidapi.com/playlist"

        

        headers = {
            "X-RapidAPI-Key": "8cacaff4e4msh4fee6493b9185f4p1fec8cjsna481c4a0f8b0",
            "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)


        urlData = response.json()
        contentUrls = contentUrls+urlData.get('contents')

        if urlData.get('next')!=None:
            GetNext(playlistid=playlistid,next=urlData.get('next'))
            

        urlData['contents'] = contentUrls
        return urlData
    
    
    mainContentData = {}
    
    if request.method=="POST":
        
        playlistid = request.POST.get('videoid')
        print("playlist id : ",playlistid)

        if playlistid!=None:

            
            urlData = GetNext(playlistid=playlistid)

            content = urlData.get('contents')
            print("The len of content : ",len(content))
            
            if len(content)>0:
                    mainContentData['title'] = urlData.get('title')
                    mainContentData['length'] = urlData.get('videosCount')
                    mainContentData['Views'] = urlData.get('views')
                    mainContentData['lastUpdated'] = urlData.get('lastUpdated')

                    urlsDict = {}
                    for i,item in enumerate(content):
                        newVideo ={}
                        Oldvideo = item.get('video')
                        newVideo['title'] = Oldvideo.get('title')
                        newVideo['url'] = 'https://www.youtube.com/watch?v='+Oldvideo.get('videoId')
                        urlsDict[i] = newVideo
                        
                    mainContentData['Urls'] = urlsDict
            # print(mainContentData)
                    
            return HttpResponse(json.dumps(mainContentData))          
                    
                
    return HttpResponse(json.dumps(mainContentData))

def SearchNewItem(request):
    if request.method=="POST":
        NewdataItem = {}
        query = request.POST.get("query")

        # import requests

        # url = "https://yt-api.p.rapidapi.com/search"

        # querystring = {"query":query}

        # headers = {
        #     "X-RapidAPI-Key": "8cacaff4e4msh4fee6493b9185f4p1fec8cjsna481c4a0f8b0",
        #     "X-RapidAPI-Host": "yt-api.p.rapidapi.com"
        # }

        # response = requests.get(url, headers=headers, params=querystring)

        # newdata = response.json()
        with open('searchdata.json','rb') as r:
            newdata = json.loads(r.read())

        NewdataItem['videos'] = [item for item in newdata['data']['data'] if item['type']=='video']

        return HttpResponse(json.dumps(NewdataItem))

    return HttpResponse(json.dumps({}))