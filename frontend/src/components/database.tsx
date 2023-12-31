import { Link } from "react-router-dom";
import {BrowserOpenURL} from "../../wailsjs/runtime/runtime"

export default function Database(){
    const goTo = (e: { preventDefault: () => void; })=>{
        e.preventDefault();
        BrowserOpenURL("https://poe.pathof.top/query");
    }
    return <div className="section"><div className="line"><Link to={""} onClick={goTo}>poe.pathof.top/query</Link></div></div>
}