from abc import ABC, abstractmethod


class Loaders(ABC):
    """Interface for all loaders."""

    @abstractmethod
    def load(self, path: str) -> str:
        """
        Load content from a file and return it.

        :param path: The path to the file to be loaded.
        :return: The content of the file.
        """
        pass

    def load_file(self, path: str) -> str:
        """Default implementation using 'with' for file handling."""
        with open(path, 'r') as file:
            content = file.read()
        return content

    @abstractmethod
    def chunkDocument(self, document, chunkSize):
        """Chunk a document into smaller parts."""
        pass

