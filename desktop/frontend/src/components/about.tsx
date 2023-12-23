import { Link, } from "@fluentui/react-components";
import { CheckForUpdate } from "../../wailsjs/go/main/App";
import { useLoaderData } from "react-router-dom";
import { main } from "../../wailsjs/go/models";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";

export async function loader() {
    const updateInfo = await CheckForUpdate()
    return { updateInfo }
}

export default function About() {
    const { updateInfo } = useLoaderData() as { updateInfo: main.UpdateInfo };

    const githubClickHandler = (e: { preventDefault: () => void; })=>{
        e.preventDefault();
        BrowserOpenURL("https://github.com/cn-poe-community/poexport");
    }

    const panClickHandler = (e: { preventDefault: () => void; })=>{
        e.preventDefault();
        BrowserOpenURL("https://www.lanzout.com/b02vcj9hg");
    }

    return <div className="section">
        <div className="line"><span>当前版本</span><div>{updateInfo.current}</div></div>
        <div className="line"><span>最新版本</span><div>{updateInfo.ok ? updateInfo.latest : "unknown"}</div></div>
        <div className="line"><span>下载地址</span><div>
            <Link onClick={githubClickHandler}>github</Link>
            <Link style={{ marginLeft: "10px" }} onClick={panClickHandler}>网盘（密码1234）</Link>
        </div></div>
    </div>
}