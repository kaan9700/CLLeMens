# models.py
from django.db import models
import hashlib


class UploadedFile(models.Model):
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    md5_hash = models.CharField(max_length=32, blank=True, editable=True)
    file = models.FileField(upload_to='uploads/')


class OpenAIToken(models.Model):
    filename = models.CharField(max_length=55)


class ApprovedFileTyps(models.Model):
    filetype = models.CharField(max_length=55)