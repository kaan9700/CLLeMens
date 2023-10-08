from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedFile
import os
from django.conf import settings
import json
class FileUploadView(APIView):
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



class ListAllFilesView(APIView):
    def get(self, request):
        # Fetch all UploadedFile instances from the database
        all_files_db = UploadedFile.objects.all()

        # Format the data for output
        all_files_output = [
            {
                'key': file_instance.id,
                'name': file_instance.filename,
                # Here, we take the second part of the MIME type to get the file type. For example, "application/pdf" becomes "pdf".
                'type': file_instance.file_type.split('/')[-1]
            } for file_instance in all_files_db
        ]

        return Response({'data': all_files_output}, status=status.HTTP_200_OK)



class DeleteFileView(APIView):
    def post(self, request):
        # The ID and name of the file to be deleted
        file_id = request.data.get('id')
        file_name = request.data.get('name')

        if not file_id or not file_name:
            return Response({'message': 'File ID and name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the file entry from the database
            file_instance = UploadedFile.objects.get(id=file_id, filename=file_name)

            # Construct the physical path to the file
            file_path = os.path.join(settings.MEDIA_ROOT, str(file_instance.file))

            # Delete the physical file if it exists
            if os.path.exists(file_path):
                os.remove(file_path)

            # Delete the file entry from the database
            file_instance.delete()

            return Response({'message': 'File successfully deleted.'}, status=status.HTTP_200_OK)

        except UploadedFile.DoesNotExist:
            return Response({'message': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateFileNamesView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            if not isinstance(data, list):
                return Response({'error': 'Invalid data structure.'}, status=400)

            for file_data in data:
                # Retrieve the file entry from the database
                file_instance = UploadedFile.objects.filter(id=file_data['id'],
                                                            filename=file_data['original_name']).first()

                if not file_instance:
                    return Response({
                                    'error': f"File with ID {file_data['id']} and name {file_data['original_name']} not found."},
                                    status=404)

                # Rename in the file system
                old_path = os.path.join(settings.MEDIA_ROOT, file_instance.file.name)
                new_path = os.path.join(settings.MEDIA_ROOT, 'uploads', file_data['new_name'])

                if os.path.exists(old_path):
                    os.rename(old_path, new_path)
                else:
                    return Response(
                        {'error': f"File {file_data['original_name']} doesn't exist in the file system."}, status=404)

                # Update the database entry
                file_instance.filename = file_data['new_name']
                file_instance.file.name = os.path.join('uploads', file_data['new_name'])
                file_instance.save()

            return Response({'message': 'File names successfully updated.'}, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
