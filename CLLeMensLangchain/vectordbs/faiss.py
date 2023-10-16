import os

import pandas as pd
from IPython.display import display
from dotenv import load_dotenv, find_dotenv
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.faiss import FAISS


class faissDB():
    """Class for accessing the FAISS database via Langchain.
    Also imports the OpenAIEmbeddings class from Langchain to embed the documents."""
    def __init__(self, base_dir):
        load_dotenv(find_dotenv())
        self.dbPath = os.path.join(base_dir, '', 'vectordbs/faiss/')
        print(base_dir.parent)
        # Check if the FAISS database exists and if its contains the index.faiss file
        if not os.path.exists(self.dbPath) and not os.path.exists(self.dbPath + "index.faiss"):

            initial_doc_path = os.path.join(base_dir.parent, '', "CLLeMensLangchain/vectordbs/CLLeMens.txt")
            # Create FAISS DB with initial Document
            loader = TextLoader(initial_doc_path)
            pages = loader.load()
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=0,
            )

            docs = text_splitter.split_documents(pages)

            # Create FAISS DB
            db = FAISS.from_documents(docs, embedding=OpenAIEmbeddings(disallowed_special=()))

            # need to be saved
            db.save_local(self.dbPath)

        self.db = FAISS.load_local(self.dbPath, OpenAIEmbeddings(disallowed_special=()))
        self.model = None


    # Convert the FAISS DB to a Pandas Dataframe
    def store_to_df(self, store):
        v_dict = store.docstore._dict
        data_rows = []
        for k in v_dict.keys():
            doc_name = v_dict[k].metadata['source'].split('/')[-1]
            content = v_dict[k].page_content
            data_rows.append({'chunk_id': k, 'document': doc_name, 'content': content})
        vector_df = pd.DataFrame(data_rows)
        return vector_df


    # Lookup the document in the FAISS DB
    def show_vstore(self, store):
        vector_df = self.store_to_df(store)
        display(vector_df)

    # Add a document to the FAISS DB
    def append_to_db(self, document):
        """Add a document to the database. (preferably a chunked document)
        :param document: The document to be added to the database."""

        # Create a FAISS DB with the new document
        extension = FAISS.from_documents(document, OpenAIEmbeddings(disallowed_special=()))

        # Merge the new document with the existing FAISS DB
        self.db.merge_from(extension)

        # Save the new FAISS DB
        self.db.save_local(self.dbPath)

    def delete_from_db(self, document):
        """
        Delete a document from the database.
        :param document: The name of the document to be deleted from the database"""

        # Convert the FAISS DB to a Pandas Dataframe
        vector_df = self.store_to_df(self.db)

        # Get the chunk IDs of the document
        chunks_list = vector_df[vector_df['document'] == document]['chunk_id'].tolist()

        # Delete the document from the FAISS DB
        self.db.delete(chunks_list)

        # Save the new FAISS DB
        self.db.save_local(self.dbPath)



    def prompt(self, prompt="", temperature=0.9):  # todo: make the temperature configurable
        """Prompt the database with a given prompt.
        :param prompt: The prompt to be used.
        :param max_tokens: The maximum number of tokens to generate.
        :param temperature: The sampling temperature.

        :return: The response from the database."""

        self.model = ChatOpenAI(model="gpt-4", temperature=temperature)

        print("Configuring retriever...")
        retriever = self.db.as_retriever()
        retriever.search_kwargs['score_threshold'] = 0.8
        retriever.search_kwargs['fetch_k'] = 50
        retriever.search_kwargs['search_type'] = 'mmr'  # todo: make the search_kwargs configurable
        retriever.search_kwargs['lambda_mult'] = '0.7'
        retriever.search_kwargs['k'] = 8
        print("loaded retriever")

        qa = ConversationalRetrievalChain.from_llm(
            llm=self.model, retriever=retriever, verbose=True)

        answer = qa.run({"question": prompt, "chat_history": []})

        return answer
