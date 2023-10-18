from django.contrib import admin
from .models import UploadedFile, OpenAIToken, ApprovedFileTyps
# Register your models here.

admin.site.register(UploadedFile)
admin.site.register(OpenAIToken)
admin.site.register(ApprovedFileTyps)