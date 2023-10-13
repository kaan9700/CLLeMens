import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from CLLeMensLangchain.schema.loaders import Loaders
from typing import Union, List
from langchain.document_loaders import Docx2txtLoader
from langchain.docstore.document import Document

class DocxLoader(Loaders):
    def __init__(self, file_path: str):
        """
        Initialize DocxLoader

        :param file_path: The path to the file to be loaded
        """
        self.file_path = file_path
        if "~" in self.file_path:
            self.file_path = os.path.expanduser(self.file_path)

    def load(self) -> Union[str, List[str], List[Document]]:
        """Load content from a DOCX and return it
            :return: The content of the DOCX as a pagewise list of Langchain Documents
        """
        try:
            content = Docx2txtLoader(self.file_path)
            pages = content.load()

        except Exception as e:
            return f"Error loading DOCX: {str(e)}"

        return pages

    def chunkDocument(self, document: List[Document], chunkSize=750) -> List[Document]:
        """Chunk a document into smaller parts for processing via embeddings
        :param document: The document to be chunked (generated by load())
        :param chunkSize: The size of the chunks (default 750), greatly affects the result of the embeddings & prompts
        :return: The chunked document as a list of Langchain Documents with metadata [page, source, start_index]
        """
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunkSize,
            chunk_overlap=20,
            add_start_index=True,
        )
        chunked_content = text_splitter.split_documents(document)
        return chunked_content