import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import FileUploadView from "./components/FileUploadView.jsx";


function App() {

    return (
        <>
          {/*<NavBar/>*/}
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/upload' element={<FileUploadView/>}/>

            </Routes>
            {/*<AppFooter/>*/}
        </>
    )
}

export default App
