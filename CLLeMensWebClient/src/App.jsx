import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import FileUploadView from "./components/FileUploadView.jsx";
import FileManagementView from "./components/FileManagementView.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {

    return (
        <>
          <NavBar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/upload' element={<FileUploadView/>}/>
                <Route path='/files' element={<FileManagementView/>}/>

            </Routes>
        </>
    )
}

export default App
