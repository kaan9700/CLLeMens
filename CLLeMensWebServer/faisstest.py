# how to load FAISS DB
import os
import pandas as pd
from IPython.display import display
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.faiss import FAISS

os.environ["OPENAI_API_KEY"] = "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"
embeddings = OpenAIEmbeddings(disallowed_special=())
save_directory = "vectordbs/faiss/"

db = FAISS.load_local(save_directory, embeddings)

def show_vstore(store):
    vector_df = store_to_df(store)
    display(vector_df)

def store_to_df(store):
    v_dict = store.docstore._dict
    data_rows = []
    for k in v_dict.keys():
        doc_name = v_dict[k].metadata['source'].split('/')[-1]
        content = v_dict[k].page_content
        data_rows.append({'chunk_id': k, 'document': doc_name, 'content': content})
    vector_df = pd.DataFrame(data_rows)
    return vector_df

import sys
sys.displayhook = sys.stdout.write
show_vstore(db)