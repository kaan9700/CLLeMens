from django.contrib import admin
from .models import UploadedFile, OpenAIToken
# Register your models here.

admin.site.register(UploadedFile)
admin.site.register(OpenAIToken)