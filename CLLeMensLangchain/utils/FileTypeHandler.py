import os

from CLLeMensLangchain.loaders.pdf_loader import PdfLoader


class FileTypeHandler:
    def __init__(self):
        self.file_type_handlers = {
            '.txt': self.process_text_file,
            '.jpg': self.process_image_file,
            '.mp3': self.process_audio_file,
            'application/pdf': self.process_pdf_file,
            '.pdf': self.process_pdf_file,
        }

    def process_text_file(self, file_path):
        # Handle text file processing logic here
        print("Processing text file:", file_path)

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
