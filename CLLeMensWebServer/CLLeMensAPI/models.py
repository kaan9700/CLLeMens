# models.py
from django.db import models
import hashlib

class UploadedFile(models.Model):
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    md5_hash = models.CharField(max_length=32, blank=True, editable=True)
    file = models.FileField(upload_to='uploads/')

    def save(self, *args, **kwargs):
        # Here we calculate the MD5 hash of the file
        md5 = hashlib.md5()
        for chunk in self.file.chunks():
            md5.update(chunk)
        self.md5_hash = md5.hexdigest()
        super(UploadedFile, self).save(*args, **kwargs)
1