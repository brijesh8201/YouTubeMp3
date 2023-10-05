from django.urls import path
from home.views import HomePage,ExtractPlaylistVideos,GetNewSong,LogIn,Signup
urlpatterns = [
    path('',HomePage,name='Homeplay'),
    path('watch/',HomePage,name='Homeplay'),
    path('playlist/',ExtractPlaylistVideos,name='Playlist'),
    path('newsong/',GetNewSong,name='Playlist'),
    path('login/',LogIn,name='login'),
    path('signup/',Signup,name='login'),
]