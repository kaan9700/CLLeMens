from CLLeMensWebServer.CLLeMensLangchain.loaders.pdf_loader import PdfLoader

pdfLoader=PdfLoader(file_path="~\\LLM_generated_Code_Documentation_Tool.pdf", extract_images=True)
contentlist = pdfLoader.load()
for content in contentlist:
    print(content.page_content)
    print("----")
chunks = pdfLoader.chunkDocument(contentlist,1000)
for chunk in chunks:
    print("page= "+str(chunk.metadata["page"]))
    print(chunk.page_content)
    print("----")
