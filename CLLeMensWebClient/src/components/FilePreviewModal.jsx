import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { Document, Page } from 'pdfjs-dist/react-pdf';
import ReactPlayer from 'react-player';
// epub.js Import fehlt hier, da dessen Implementierung etwas komplexer sein kann.

const FilePreviewModal = ({ file, visible, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const renderContent = () => {
    if (!file) return null;

    switch (file.type) {
      case 'pdf':
        return (
          <Document
            file={file.name}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        );

      case 'word':
      case 'txt':
        // Für den einfachen Fall können Sie den Dateiinhalt als Text anzeigen.
        // TODO: Dateiinhalt einlesen und anzeigen.
        return <div>Word/TXT Vorschau (Inhalt hier einfügen)</div>;

      case 'video':
      case 'audio':
        return (
          <ReactPlayer url={file.name} controls={true} width="100%" height="100%" />
        );

      case 'ebook':
        // TODO: ePub Anzeige. Hier könnten Sie ePub.js verwenden, um den Inhalt zu rendern.
        return <div>EPUB Vorschau</div>;

      case 'link':
        return (
          <Button
            type="primary"
            onClick={() => window.open(file.name, '_blank')}
          >
            Zur Seite weiterleiten
          </Button>
        );

      default:
        return <div>Unbekannter Dateityp</div>;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width="80%"
      title="Dateivorschau"
      footer={null}
    >
      {renderContent()}
    </Modal>
  );
};

export default FilePreviewModal;
