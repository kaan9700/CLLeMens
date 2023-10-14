import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { Document, Page } from 'react-pdf';
import ReactPlayer from 'react-player';
import mammoth from 'mammoth';


const FilePreviewModal = ({ file, visible, onClose }) => {
    // State to hold number of pages for PDF files
    const [numPages, setNumPages] = useState(null);
    // State to hold content of text files
    const [textFileContent, setTextFileContent] = useState("");

    // Check if the device is mobile based on screen width
    const isMobile = window.innerWidth <= 768;
    const scaleValue = isMobile ? 0.5 : 1.5;

    // Callback function when a PDF document is successfully loaded
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Function to render and display content of txt files
    const renderTxtFile = async (url) => {
        try {
            const response = await fetch(url);
            const text = await response.text();
            setTextFileContent(text);
        } catch (error) {
            console.error("Failed to load txt file:", error);
        }
    };

    // Function to render and display content of docx files using mammoth
    const renderDocxFile = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() })
                .then(displayResult)
                .done();
        } catch (error) {
            console.error("Failed to load or convert docx:", error);
        }
    };

    // Function to display the converted HTML content of docx files
    const displayResult = (result) => {
        const outputDiv = document.getElementById('docx-output');
        outputDiv.innerHTML = result.value;
    };

    // Function to decide which content to render based on the file type
    const renderContent = () => {
        if (!file) return null;
        const BASE_URL = 'http://localhost:8000';
        const fileUrl = `${BASE_URL}${file.file_url}`;

        switch (file.type) {
            case 'pdf':
                return (
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index} scale={scaleValue} />
                        ))}
                    </Document>
                );

            case 'docx':
                renderDocxFile(fileUrl);
                return <div id="docx-output">Loading...</div>;

            case 'txt':
            case 'rtf':
            case 'markdown':
                renderTxtFile(fileUrl);
                return <pre style={{ whiteSpace: "pre-wrap" }}>{textFileContent}</pre>;

            case 'video':
            case 'audio':
            case 'mpeg':
            case 'mp4':
                return (
                    <ReactPlayer url={fileUrl} controls={true} width="100%" height="100%" />
                );

            case 'ebook':
                // TODO: Handle ePub display. Could use ePub.js for rendering.
                return <div>EPUB Preview</div>;

            case 'link':
                return (
                    <Button
                        type="primary"
                        onClick={() => window.open(fileUrl, '_blank')}
                    >
                        Redirect to the page
                    </Button>
                );

            default:
                return <div>Unknown file type</div>;
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            width="80%"
            title="File preview"
            className={'file-preview-modal'}
            footer={null}
            bodyStyle={{
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: 'calc(100vh - 200px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div>
                {renderContent()}
            </div>
        </Modal>
    );
};

export default FilePreviewModal;
