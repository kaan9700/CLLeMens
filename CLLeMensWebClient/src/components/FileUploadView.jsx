// FileUploadView.js
import React, {useState} from 'react';
import {Upload, Button, message, Typography, Descriptions} from 'antd';
import {UploadOutlined, InboxOutlined} from '@ant-design/icons';

const {Dragger} = Upload;
const {Title, Paragraph} = Typography;

const FileUploadView = () => {
    const [fileList, setFileList] = useState([]);

    const customRequest = ({onSuccess}) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    const handleUpload = () => {
        console.log('Uploading files:', fileList);
    };

    return (
        <div style={{color: 'white'}}>
            <Title style={{paddingBottom: '2rem', color: '#fff'}}>Upload Files</Title>

            <Paragraph style={{color: '#fff', marginBottom: '2em'}}>Enhance the capabilities of your personal assistant
                by uploading your documents, PDFs, or media files.</Paragraph>

            <Descriptions
                className="separate"
                title=""
                bordered
                column={1}
                style={{marginBottom: '2em', backgroundColor: '#242424'}}
            >
                <Descriptions.Item
                    className="custom-descriptions-item"
                    label="Supported File Types"
                    style={{border: '1px solid #64646b', color: '#fff', backgroundColor: '#242424'}}
                >
                    PDF, DOC, DOCX, MP4, MP3, etc.
                </Descriptions.Item>
                <Descriptions.Item
                    className="custom-descriptions-item"
                    label="File Size Limit"
                    style={{border: '1px solid #64646b', color: '#fff', backgroundColor: '#242424'}}
                >
                    10MB per file.
                </Descriptions.Item>
            </Descriptions>
            <Dragger
                customRequest={customRequest}
                fileList={fileList}
                onChange={({fileList: newFileList}) => {
                    setFileList(newFileList);
                }}
                style={{color: 'white', borderColor: '#64646b', padding: '20px'}}
                className="custom-dragger"
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text" style={{color: '#fff'}}>Click or drag file to this area to upload</p>
                <p className="ant-upload-hint" style={{color: '#fff'}}>
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                    files.
                </p>
            </Dragger>
            <Button
                type="primary"
                onClick={handleUpload}
                style={{marginTop: '2em', width: '50%', maxWidth: '150px'}}
            >
                Upload
            </Button>

        </div>
    );
};

export default FileUploadView;
