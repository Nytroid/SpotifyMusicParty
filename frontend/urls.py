from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),     
    path('home', index, ),       
    path('join', index),      
    path('create', index),
    path('<str:roomCode>', index),
    ]