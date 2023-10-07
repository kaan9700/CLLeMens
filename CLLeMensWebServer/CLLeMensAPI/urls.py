from django.urls import path
from .views import FileUpload

urlpatterns = [
    path('upload/', FileUpload.as_view(), name='file_upload'),
]
