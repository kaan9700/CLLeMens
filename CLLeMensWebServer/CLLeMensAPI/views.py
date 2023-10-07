from django.views import View
from .models import UploadedFile
from rest_framework.response import Response

# Create your views here.
class FileUpload(View):
    def post(self, request):
        uploaded_file = request.FILES.get('file')  # 'file' ist der Schlüssel des hochgeladenen Dateiobjekts

        if not uploaded_file:
            return Response({'message': 'No file uploaded'}, status=400)

        # Erstelle eine Instanz von UploadedFile und speichere sie
        file_instance = UploadedFile(filename=uploaded_file.name, file_type=uploaded_file.content_type, file=uploaded_file)
        file_instance.save()

        return Response({'message': 'File uploaded successfully', 'id': file_instance.id})