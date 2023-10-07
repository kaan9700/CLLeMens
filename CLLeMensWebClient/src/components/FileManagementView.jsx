import React, {useState} from 'react';
import {Button, Input, Table, Modal, Checkbox, Typography} from 'antd';
import {EditOutlined, SaveOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';

const {Title} = Typography;

const FileManagementView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);

    const [originalFileNames, setOriginalFileNames] = useState({});
    const [changedFiles, setChangedFiles] = useState([]);


    const [filter, setFilter] = useState({
        ebooks: false,
        pdf: false,
        word: false,
        videos: false,
        links: false,
    });
    const [tempFilter, setTempFilter] = useState({...filter});

    const allFiles = [
        {key: 1, name: 'Document1.pdf', type: 'pdf'},
        {key: 2, name: 'Ebook2.epub', type: 'ebooks'},
        {key: 3, name: 'Video1.mp4', type: 'videos'},
        {key: 4, name: 'Link1.url', type: 'links'},
        {key: 5, name: 'Document2.docx', type: 'word'},
        {key: 6, name: 'Document1.pdf', type: 'pdf'},
        {key: 7, name: 'Ebook2.epub', type: 'ebooks'},
        {key: 8, name: 'Video1.mp4', type: 'videos'},
        {key: 9, name: 'Link1.url', type: 'links'},
        {key: 10, name: 'Document2.docx', type: 'word'},
    ];

    const filteredFiles = allFiles.filter(file => {
        const searchTermMatches = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (Object.keys(filter).some(key => filter[key] === true)) {
            return filter[file.type] && searchTermMatches;
        }
        return searchTermMatches;
    });


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditClick = () => {
        if (!editMode) {
            // Wenn der Bearbeitungsmodus aktiviert ist, speichern Sie die ursprünglichen Dateinamen
            const originalNames = allFiles.reduce((acc, file) => {
                acc[file.key] = file.name;
                return acc;
            }, {});
            setOriginalFileNames(originalNames);
        }
        setEditMode(!editMode);
    };

    const handleSaveClick = () => {
        if (editMode) {
            console.log('Changes saved.');
            // Loggen der Änderungen
            changedFiles.forEach(fileKey => {
                console.log({
                    id: fileKey,
                    original_name: originalFileNames[fileKey],
                    new_name: allFiles.find(file => file.key === fileKey).name
                });
            });
            // Zustände zurücksetzen
            setEditMode(false);
            setOriginalFileNames({});
            setChangedFiles([]);
        }
    };
    const handleDeleteClick = (file) => {
        setCurrentFile(file);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        console.log({'key': currentFile.key, 'name': currentFile.name});
        setDeleteModalVisible(false);
    };

    const handleFilterClick = () => {
        setTempFilter({...filter});
        setModalVisible(true);
    };

    const handleTempFilterChange = (e) => {
        setTempFilter({...tempFilter, [e.target.name]: e.target.checked});
    };

    const handleFilterConfirm = () => {
        setFilter(tempFilter);
        setModalVisible(false);
    };

    const handleFileNameChange = (key, newNameWithoutExtension) => {
        const fileIndex = allFiles.findIndex(file => file.key === key);
        if (fileIndex !== -1) {
            // Füge die Dateiendung zurück zum Dateinamen hinzu
            const fileExtension = allFiles[fileIndex].name.split('.').pop();
            const newName = `${newNameWithoutExtension}.${fileExtension}`;

            // Aktualisiere den Dateinamen
            allFiles[fileIndex].name = newName;

            // Verfolge die Änderung, wenn sie noch nicht verfolgt wird
            if (!changedFiles.includes(key)) {
                setChangedFiles(prev => [...prev, key]);
            }
        }
    };

    const removeFileExtension = (filename) => {
        return filename.split('.').slice(0, -1).join('.');
    };


    const columns = [
        {
            title: 'File Name',
            dataIndex: 'name',
            key: 'name',
            width: '50%', // Festgelegte Breite für die Spalte
            render: (text, file) => (
                editMode ? (
                    <Input
                        defaultValue={removeFileExtension(text)}
                        onChange={(e) => handleFileNameChange(file.key, e.target.value)}
                        style={{width: '80%'}} // Input nimmt die volle Breite der Zelle ein
                    />
                ) : removeFileExtension(text)
            ),
        },
        {
            title: 'File Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                // Hier können Sie weitere Formatierungen oder Übersetzungen für den Dateityp hinzufügen, wenn benötigt.
                return type;
            },
        },
        {
            title: 'Action',
            align: 'center',
            key: 'action',
            render: (_, file) => (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button icon={<DeleteOutlined/>} onClick={() => handleDeleteClick(file)} style={{color: 'red'}}/>
                </div>
            ),

        },
    ];

    return (
        <div className={'files-wrapper'}>
            <Title style={{color: '#fff', paddingBottom: '2rem'}}>File Management</Title>
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
        </div>
    );
};

export default FileManagementView;
