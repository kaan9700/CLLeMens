import React, {useState, useEffect} from 'react';
import {Button, Input, Table, Modal, Checkbox, Typography} from 'antd';
import {EditOutlined, SaveOutlined, DeleteOutlined, FilterOutlined, EyeOutlined} from '@ant-design/icons';
import {makeRequest} from "../api/api.js";
import {GET_FILES, DELETE_FILE, CHANGE_FILE_NAMES} from "../api/endpoints.js";
import FilePreviewModal from "./FilePreviewModal.jsx";


const {Title} = Typography;

const FileManagementView = () => {

    // Defining state variables
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [allFiles, setAllFiles] = useState([]);
    const [originalFileNames, setOriginalFileNames] = useState({});
    const [changedFiles, setChangedFiles] = useState([]);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [filter, setFilter] = useState({
        ebooks: false,
        pdf: false,
        word: false,
        videos: false,
        links: false,
    });
    const [tempFilter, setTempFilter] = useState({...filter});

    // Fetching files on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace this with the exact endpoint and the makeRequest signature
                const response = await makeRequest('GET', GET_FILES);
                if (response && response.data) {
                    setAllFiles(response.data);
                }
            } catch (error) {
                console.error("Error fetching the file list:", error);
            }
        };
        // Call the function immediately when the component mounts
        fetchData();
        // Set up an interval to fetch data every 2 minutes (120,000 milliseconds)
        const intervalId = setInterval(() => {
            fetchData();
        }, 120000);

        // Cleanup function: clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []);

    // Filtering the files based on search and file types
    const filteredFiles = allFiles.filter(file => {
        // Check if the file name contains the search term
        const searchTermMatches = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Check if the file type is selected in the filter
        if (Object.keys(filter).some(key => filter[key] === true)) {
            return filter[file.type] && searchTermMatches;
        }
        return searchTermMatches;
    });

    // Handlers for different actions
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handler to enable/disable edit mode
    const handleEditClick = () => {
        if (!editMode) {
            // If the edit mode is enabled, store the original file names
            const originalNames = allFiles.reduce((acc, file) => {
                acc[file.key] = file.name;
                return acc;
            }, {});
            setOriginalFileNames(originalNames);
        }
        setEditMode(!editMode);
    };

    // Handler to save the changes
    const handleSaveClick = async () => {
        if (editMode) {
            console.log('Changes saved.');
            // Prepare the data to be sent to the backend
            let changedFilesData = [];
            changedFiles.forEach(fileKey => {
                changedFilesData.push({
                    id: fileKey,
                    original_name: originalFileNames[fileKey],
                    new_name: allFiles.find(file => file.key === fileKey).name
                });
            });

            try {
                const response = await makeRequest('POST', CHANGE_FILE_NAMES, changedFilesData);
                if (response && response.message) {
                    console.log(response.message);  // Display the message from backend
                }
            } catch (error) {
                console.error("Fehler beim Aktualisieren der Dateinamen:", error);
            }

            // Resetting the states
            setEditMode(false);
            setOriginalFileNames({});
            setChangedFiles([]);
        }
    };

    // Handler to show delete confirmation modal
    const handleDeleteClick = (file) => {
        setCurrentFile(file);
        setDeleteModalVisible(true);
    };

    // Handler to delete the file
    const handleDeleteConfirm = async () => {
        try {
            const response = await makeRequest('POST', DELETE_FILE, {
                id: currentFile.key,
                name: currentFile.name
            });

            if (response && response.message === 'File successfully deleted.') {
                console.log("File erfolgreich gelöscht!");
                // Remove the deleted file from allFiles based on the id
                const updatedFiles = allFiles.filter(file => file.key !== currentFile.key);
                setAllFiles(updatedFiles);
            }
        } catch (error) {
            console.error("Fehler beim Löschen der Datei:", error);
        }
        setDeleteModalVisible(false);
    };

    // Handler to show filter modal
    const handleFilterClick = () => {
        setTempFilter({...filter});
        setModalVisible(true);
    };


    // Handler to update the filter state
    const handleTempFilterChange = (e) => {
        setTempFilter({...tempFilter, [e.target.name]: e.target.checked});
    };

    // Handler to confirm the filter
    const handleFilterConfirm = () => {
        setFilter(tempFilter);
        setModalVisible(false);
    };

    // Handler to update the file name
    const handleFileNameChange = (key, newNameWithoutExtension) => {
        const fileIndex = allFiles.findIndex(file => file.key === key);
        if (fileIndex !== -1) {

            // Add the file extension back to the filename
            const fileExtension = allFiles[fileIndex].name.split('.').pop();
            const newName = `${newNameWithoutExtension}.${fileExtension}`;

            // Update the file name
            allFiles[fileIndex].name = newName;

            // Track the change if it's not already being tracked
            if (!changedFiles.includes(key)) {
                setChangedFiles(prev => [...prev, key]);
            }
        }
    };

    // Helper function to remove the file extension from the file name
    const removeFileExtension = (filename) => {
        return filename.split('.').slice(0, -1).join('.');
    };

    // Defining the columns for the table
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'name',
            key: 'name',

            render: (text, file) => (
                editMode ? (
                    <Input.TextArea
                        defaultValue={removeFileExtension(text)}
                        onChange={(e) => handleFileNameChange(file.key, e.target.value)}
                        className={'file-edit-searchbar file-edit-textarea'} // Neue Klasse hinzufügen
                        autoSize={{minRows: 1, maxRows: 3}}
                    />
                ) : removeFileExtension(text)
            ),

        },
        {
            title: 'File Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                return type;
            },
        },
        {
            title: 'Action',
            align: 'center',
            key: 'action',
            render: (_, file) => (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Button
                        icon={<EyeOutlined/>}
                        onClick={() => {
                            setSelectedFile(file);
                            setPreviewModalVisible(true);
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDeleteClick(file)}
                        style={{color: 'red'}}
                    />
                </div>
            ),
        },

    ];

    return (
        <div className={'files-wrapper'}>
            <Title style={{color: '#fff', padding: '2rem'}}>File Management</Title>
            <div className={'file-search-form'}>
                <Input placeholder="Search files..." value={searchTerm} onChange={handleSearchChange}
                       style={{width: '50%', float: 'left', marginBottom: '20px'}} className={'file-upload-searchbar'}/>
                <div className={'file-search-buttons'}>
                    {editMode ? (
                        <>
                            <Button icon={<SaveOutlined/>} onClick={handleSaveClick}>
                                Save
                            </Button>
                            <Button onClick={handleEditClick}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button icon={<EditOutlined/>} onClick={handleEditClick}>
                                Edit
                            </Button>
                        </>
                    )}
                    <Button icon={<FilterOutlined/>} onClick={handleFilterClick}>
                        Filter
                    </Button>
                </div>

            </div>


            <Table
                dataSource={filteredFiles}
                columns={columns}
                pagination={{
                    pageSize: 10,
                    itemRender: (current, type, originalElement) => {
                        if (type === '<') {
                            return <a style={{color: '#fff'}}>Previous</a>;
                        }
                        if (type === '>') {
                            return <a style={{color: '#fff'}}>Next</a>;
                        }
                        if (type === 'page') {
                            return <a style={{color: '#40a9ff'}}>{current}</a>; // Setzt den Inline-Stil für die Seitenzahlen
                        }
                        return originalElement;
                    }
                }}
            />


            <Modal title="Confirm Deletion" open={deleteModalVisible} onOk={handleDeleteConfirm}
                   onCancel={() => setDeleteModalVisible(false)}>
                Are you sure you want to delete this file?
            </Modal>

            <Modal title="Filter Files" open={modalVisible} onOk={handleFilterConfirm}
                   onCancel={() => setModalVisible(false)}>
                <Checkbox name="ebooks" checked={tempFilter.ebooks} onChange={handleTempFilterChange}>Ebooks</Checkbox>
                <Checkbox name="pdf" checked={tempFilter.pdf} onChange={handleTempFilterChange}>PDF</Checkbox>
                <Checkbox name="word" checked={tempFilter.word} onChange={handleTempFilterChange}>Word</Checkbox>
                <Checkbox name="videos" checked={tempFilter.videos} onChange={handleTempFilterChange}>Videos</Checkbox>
                <Checkbox name="links" checked={tempFilter.links} onChange={handleTempFilterChange}>Links</Checkbox>
            </Modal>

            <FilePreviewModal
                file={selectedFile}
                visible={previewModalVisible}
                onClose={() => setPreviewModalVisible(false)}
            />

        </div>
    );
};

export default FileManagementView;
