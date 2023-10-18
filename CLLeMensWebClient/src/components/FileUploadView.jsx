import React, {useEffect, useState} from 'react';
import {Upload, Button, message, Typography, Descriptions} from 'antd';
import {UploadOutlined, InboxOutlined} from '@ant-design/icons';
import {makeRequest} from "../api/api.js";
import {UPLOAD, FILE_TYPES} from "../api/endpoints.js";
import Notifications from "./Notifications.jsx";


const {Dragger} = Upload;
const {Title, Paragraph} = Typography;

const FileUploadView = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileTypes, setFileTypes] = useState([]);

    const fileSizeLimit = 25; // 25MB
    const acceptedFileTypesString = fileTypes.join(',');
    const fileSizeLimitBytes = fileSizeLimit * 1024 * 1024; // Convert MB to Bytes


    // UseEffect to get all file types from backend
    useEffect(() => {
        (async () => {
            // Use the makeRequest function to get all file types
            let response = await makeRequest('GET', FILE_TYPES);
            response = response.map(str => str.startsWith('.') ? str : '.' + str);
            // Set the file types
            setFileTypes(response);
        })();
    }, []);


    // Custom request to handle file uploads
    const customRequest = ({onSuccess}) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    // Handle the file upload to the backend
    const handleUpload = async () => {
        // Set loading to true
        setLoading(true);

        // Create FormData to transfer files
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file.originFileObj);
        });

        try {
            // backend endpoint is '/upload'
            const response = await makeRequest('POST', UPLOAD, formData);
            // Use the message from the server response
            Notifications(response.message_type, {'message': 'Success', 'description': response.message});
            // Clear the fileList after successful upload
            setFileList([]);
        } catch (error) {
            Notifications('error', {'message': 'Error', 'description': error.message});
        } finally {
            // Set loading to false
            setLoading(false);
        }
    };


    const enabledButtonStyle = {
        marginTop: '2em',
        width: '50%',
        maxWidth: '150px',
    };

    const disabledButtonStyle = {
        ...enabledButtonStyle,
        backgroundColor: '#ccc',
        color: 'white',
        cursor: 'not-allowed',
    };
    return (
        <div style={{color: 'white'}} className={'file-upload-wrapper'}>
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
                    {fileTypes.map((fileType, index) => {
                        return <span key={index}>{fileType}, </span>;
                    })}
                </Descriptions.Item>
                <Descriptions.Item
                    className="custom-descriptions-item"
                    label="File Size Limit"
                    style={{border: '1px solid #64646b', color: '#fff', backgroundColor: '#242424'}}
                >
                    {fileSizeLimit} MB per file.
                </Descriptions.Item>
            </Descriptions>
            <Dragger
                accept={acceptedFileTypesString}

                customRequest={customRequest}

                fileList={fileList}
                onChange={({fileList: newFileList}) => {
                    setFileList(newFileList);
                }}
                style={{color: 'white', borderColor: '#64646b', padding: '20px', maxHeight: '250px'}}
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
                disabled={fileList.length === 0}
                style={fileList.length === 0 ? disabledButtonStyle : enabledButtonStyle}
                loading={loading}
            >
                {loading ? 'Loading' : 'Upload'}

            </Button>

        </div>
    );
};

export default FileUploadView;
