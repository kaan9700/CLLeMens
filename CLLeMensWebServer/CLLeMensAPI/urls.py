from django.urls import path
from .views import *

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('list-all-files/', ListAllFilesView.as_view(), name='list-all-files'),
    path('delete-file/', DeleteFileView.as_view(), name='delete_file'),
    path('update-filenames/', UpdateFileNamesView.as_view(), name='update_filenames'),
    path('openai-token/', OpenAITokenView.as_view(), name='openai-token'),

]
