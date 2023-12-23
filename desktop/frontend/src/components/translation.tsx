import { Link } from "react-router-dom";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

const goTo = (e: { preventDefault: () => void; })=>{
    e.preventDefault();
    BrowserOpenURL("https://poe.pathof.top/item");
}

export default function Translation(){
    return <div className="section"><div className="line"><Link to={"https://poe.pathof.top/item"} onClick={goTo}>poe.pathof.top/item</Link></div></div>
}