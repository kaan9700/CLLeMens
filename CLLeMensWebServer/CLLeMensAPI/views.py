from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedFile
import os
from django.conf import settings

class FileUpload(APIView):
    def post(self, request):
        # Use `getlist` to support multiple files
        uploaded_files = request.FILES.getlist('files')

        if not uploaded_files:
            return Response({'message': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        already_exists = []
        successfully_uploaded = []

        for uploaded_file in uploaded_files:
            # Replace spaces with underscores in the file name
            modified_name = uploaded_file.name.replace(' ', '_')

            # Construct the path where the file would be saved
            file_path = os.path.join(os.path.join(settings.BASE_DIR, '..', 'media', 'uploads'), modified_name)

            # Check if a file with the same name already exists
            if os.path.exists(file_path):
                already_exists.append(modified_name)
            else:
                # Save the file using the modified name
                file_instance = UploadedFile(filename=modified_name, file_type=uploaded_file.content_type,
                                             file=uploaded_file)
                file_instance.save()
                successfully_uploaded.append(file_instance.id)

        # All files already exist
        if already_exists and not successfully_uploaded:
            if len(already_exists) > 1:
                return Response({'message': 'The files already exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'The file already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Some files already exist but others were uploaded successfully
        if already_exists:
            return Response({
                'message': f'The following files already exist: {", ".join(already_exists)}.',
                'uploaded_files_ids': successfully_uploaded,
                'message_type': 'warning'
            }, status=status.HTTP_201_CREATED)
        else:
            # All files were uploaded successfully
            return Response({
                'message': 'All files uploaded successfully.',
                'uploaded_files_ids': successfully_uploaded,
                'message_type': 'success'
            }, status=status.HTTP_201_CREATED)
