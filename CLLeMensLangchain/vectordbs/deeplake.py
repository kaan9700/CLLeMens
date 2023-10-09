import os

from dotenv import load_dotenv, find_dotenv
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.deeplake import DeepLake



class deeplakeDB():
    """Class for accessing the deeplake database via Langchain.
    Also imports the OpenAIEmbeddings class from Langchain to embed the documents."""
    def __init__(self, base_dir, name="deeplake_default"):
        load_dotenv(find_dotenv())
        self.name = name
        self.dbPath = os.path.join(base_dir, '', 'vectordbs/deeplake/' + name)
        self.db=DeepLake(dataset_path=self.dbPath, embedding=OpenAIEmbeddings(disallowed_special=()))

    def append_to_db(self, document):
        """Add a document to the database. (preferably a chunked document)
        :param document: The document to be added to the database."""
        self.db.add_documents(document)

