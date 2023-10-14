import os

from CLLeMensLangchain.loaders.pdf_loader import PdfLoader
from CLLeMensLangchain.loaders.docx_loader import DocxLoader
from CLLeMensLangchain.loaders.text_loader import TxtLoader
from CLLeMensLangchain.loaders.audio_loader import AudioLoader
from CLLeMensLangchain.loaders.video_loader import VideoLoader


class FileTypeHandler:
    def __init__(self):
        self.file_type_handlers = {
            '.docx': self.process_docx_file,
            '.txt': self.process_text_file,
            '.md': self.process_text_file,
            '.jpg': self.process_image_file,
            '.mp3': self.process_audio_file,
            '.wav': self.process_audio_file,
            'application/pdf': self.process_pdf_file,
            '.pdf': self.process_pdf_file,
            '.mp4': self.process_video_file,
            '.mov': self.process_video_file,
            '.wmv': self.process_video_file,
        }

    def process_docx_file(self, file_path):
        print("Processing docx file:", file_path)
        docxLoader = DocxLoader(file_path)
        pages = docxLoader.load()
        chunks = docxLoader.chunkDocument(pages, chunkSize=700)
        return chunks

    def process_text_file(self, file_path):
        # Handle text file processing logic here
        print("Processing text file:", file_path)
        textLoader = TxtLoader(file_path)
        pages = textLoader.load()
        chunks = textLoader.chunkDocument(pages, chunkSize=700)
        return chunks

    def process_pdf_file(self, file_path):
        print("Processing pdf file:", file_path)
        pdfLoader = PdfLoader(file_path)
        pages = pdfLoader.load()
        chunks = pdfLoader.chunkDocument(pages, chunkSize=700)
        return chunks

    def process_image_file(self, file_path):
        # Handle image file processing logic here
        print("Processing image file:", file_path)

    def process_audio_file(self, file_path):
        # Handle audio file processing logic here
        print("Processing audio file:", file_path)
        audioLoader = AudioLoader(file_path)
        pages = audioLoader.load()
        chunks = audioLoader.chunkDocument(pages, chunkSize=700)
        return chunks

    def process_video_file(self, file_path):
        # Handle audio file processing logic here
        print("Processing video file:", file_path)
        videoLoader = VideoLoader(file_path)
        pages = videoLoader.load()
        # chunks = videoLoader.chunkDocument(pages, chunkSize=700)
        return 1


    def process_unknown_file(self, file_path):
        # Handle unknown file type logic here
        print("Unknown file type:", file_path)

    def get_file_extension(self, file_path):
        # Use os.path.splitext() to split the path into the base and extension
        base_name, extension = os.path.splitext(file_path)
        # Return the extension (including the dot)
        return extension

    def process_file(self, file_path):
        """
        Process a file based on its extension.
        :param file_path: path to the file to be processed
        :return:
        """
        processed_files = []
        extension = self.get_file_extension(file_path)

        if extension in self.file_type_handlers:
            processed_files = self.file_type_handlers[extension](file_path)
        else:
            self.process_unknown_file(file_path)
        return processed_files
