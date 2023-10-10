import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import FileUploadView from "./components/FileUploadView.jsx";
import FileManagementView from "./components/FileManagementView.jsx";
import NavBar from "./components/NavBar.jsx";
import Chat from "./components/Chat.jsx";
import {pdfjs} from 'react-pdf';


function App() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return (
        <>
            <NavBar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/upload' element={<FileUploadView/>}/>
                <Route path='/files' element={<FileManagementView/>}/>
                <Route path='/chat' element={<Chat/>}/>

            </Routes>
        </>
    )
}

export default App
