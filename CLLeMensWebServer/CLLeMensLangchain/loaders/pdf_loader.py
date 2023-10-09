from CLLeMensWebServer.CLLeMensLangchain.schema.loaders import Loaders
from typing import Union, List


class PdfLoader(Loaders):

    def load(self, path: str) -> Union[str, List[str]]:
        """Load content from a PDF and return it."""

        return self.load_file(path)

    def chunkDocument(self, document, chunkSize):
        """Chunk a document into smaller parts."""
        pass