from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from CLLeMensLangchain.utils.FileTypeHandler import FileTypeHandler
from CLLeMensLangchain.vectordbs.deeplake import deeplakeDB
from .models import UploadedFile, OpenAIToken
import os
from django.conf import settings
import json
import hashlib
from pathlib import Path
import openai

load_dotenv()



class FileUploadView(APIView):
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        self.db = deeplakeDB(base_dir=BASE_DIR)
        self.fileHandler = FileTypeHandler()

    def post(self, request):
        # Use `getlist` to support multiple files
        uploaded_files = request.FILES.getlist('files')
        if not uploaded_files:
            return Response({'message': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        already_exists = []
        successfully_uploaded = []

        for uploaded_file in uploaded_files:
            # MD5-Hash berechnen
            md5 = hashlib.md5()
            for chunk in uploaded_file.chunks():
                md5.update(chunk)
            md5_hash = md5.hexdigest()

            # Prüfen, ob eine Datei mit dem gleichen MD5-Hash bereits in der Datenbank existiert
            if UploadedFile.objects.filter(md5_hash=md5_hash).exists():
                already_exists.append(uploaded_file.name)
                print("The md5 hash already exists in the database")
                continue



            # Check if the file has .rtf extension
            if uploaded_file.name.endswith('.rtf'):
                # Change the extension to .txt
                name_without_ext = os.path.splitext(uploaded_file.name)[0]
                uploaded_file.name = name_without_ext + '.txt'
                uploaded_file.content_type = 'text'

            #check if the file has .txt extension
            if uploaded_file.name.endswith('.txt'):
                # Change the content type to text
                uploaded_file.content_type = 'text'

            # Replace spaces with underscores in the file name
            modified_name = uploaded_file.name.replace(' ', '_')

            # Construct the path where the file would be saved
            file_path = os.path.join(os.path.join(settings.BASE_DIR, '..', 'media', 'uploads'), modified_name)

            # Check if a file with the same name already exists
            if os.path.exists(file_path):
                already_exists.append(modified_name)
            else:
                if modified_name.endswith('.docx') or modified_name.endswith('.doc'):
                    uploaded_file.content_type = 'application/docx'
                # Save the file using the modified name and add md5_hash to the instance
                file_instance = UploadedFile(
                    filename=modified_name,
                    file_type=uploaded_file.content_type,
                    file=uploaded_file,
                    md5_hash=md5_hash
                )
                file_instance.save()
                successfully_uploaded.append(file_instance.id)
                docs = self.fileHandler.process_file(file_path)
                self.db.append_to_db(docs)

        # Handle response logic based on files that were uploaded or already existed
        if already_exists and not successfully_uploaded:
            if len(already_exists) > 1:
                return Response({'message': 'The files already exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'The file already exists'}, status=status.HTTP_400_BAD_REQUEST)

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
                'type': file_instance.file_type.split('/')[-1],
                'file_url': file_instance.file.url   # Hier fügen wir die vollständige URL zu der Datei hinzu
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


class OpenAITokenView(APIView):
    def get(self, request):
        try:
            # Try to retrieve the first (and hopefully only) token from the database
            token = OpenAIToken.objects.first()
            if token:
                return Response({'token': token.filename}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No token found.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        submitted_token = request.data.get('token')
        print(submitted_token)
        if not submitted_token:
            return Response({'message': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the token is valid
        openai.api_key = submitted_token
        try:
            openai.Completion.create(model="text-davinci-003", prompt="test", max_tokens=5)
        except:
            return Response({'message': 'Token is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        # If the above step was successful, you can save or update the token
        token, created = OpenAIToken.objects.update_or_create(id=1, defaults={'filename': submitted_token})

        return Response({'message': 'Token was accepted'}, status=status.HTTP_200_OK)


class ChatView(APIView):
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent.parent
        self.db = deeplakeDB(base_dir=BASE_DIR)
    def get(self, request):
        try:
            print("GET")
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        sent_message = request.data.get('message')
        token = OpenAIToken.objects.first()
        answer = self.db.prompt(sent_message)
        if not answer:
            return Response({'message': 'Is the token present and correct?.'}, status=status.HTTP_401_UNAUTHORIZED)


        # If the above step was successful, you can save or update the token
        return Response({'reply': answer}, status=status.HTTP_200_OK)