from django.urls import path
from play.views import HomePage,ExtractPlaylistVideos,GetNewSong,LogIn,Signup,SearchNewItem
urlpatterns = [
    path('',HomePage,name='Homeplay'),
    path('watch/',HomePage,name='Homeplay'),
    path('playlist/',ExtractPlaylistVideos,name='Playlist'),
    path('newsong/',GetNewSong,name='Playlist'),
    path('login/',LogIn,name='login'),
    path('signup/',Signup,name='login'),
    path('createqr/',Signup,name='login'),
    path('search/',SearchNewItem,name='search'),
]