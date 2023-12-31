import './App.css';
import Sidebar from './components/sidebar';
import { Outlet, } from "react-router-dom";
import { Toaster, } from '@fluentui/react-components';
import { TOASTER_ID } from './components/common/notify';

function App() {
    return (
        <div id="App">
            <Sidebar/>
            <div id="detail"><Outlet/></div>
            <Toaster toasterId={TOASTER_ID} />
        </div>
    )
}

export default App
