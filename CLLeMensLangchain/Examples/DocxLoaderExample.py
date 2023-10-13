from CLLeMensLangchain.loaders.docx_loader import DocxLoader

docx_loader=DocxLoader(file_path="../../media/uploads/1_Introduction.docx")
contentlist = docx_loader.load()
for content in contentlist:
    print(content.page_content)
    print("----")
chunks = docx_loader.chunkDocument(contentlist,1000)
for chunk in chunks:
    print("page= "+str(chunk.metadata["page"]))
    print(chunk.page_content)
    print("----")
