import { useLoaderData } from "react-router-dom";
import { GetConfig,SetPoeSessId } from "../../wailsjs/go/main/App";
import { config } from "../../wailsjs/go/models";
import { Input,Label,Button, Toast, ToastIntent, ToastTitle, useToastController, } from "@fluentui/react-components";
import { Save16Regular,Save16Filled,bundleIcon } from "@fluentui/react-icons";

import './settings.css';
import { TOASTER_ID, notifyError, notifySuccess } from "./common/notify";

const Save = bundleIcon(Save16Filled,Save16Regular);

export async function loader() {
    const conf = await GetConfig()
    return { conf }
}

export default function Settings() {
    const {conf} = useLoaderData() as {conf:config.Config};
    const toastController = useToastController(TOASTER_ID);

    async function setPoeSessId(){
        const poeSessId:string = (document.getElementById("poeSessId") as HTMLInputElement).value;
        const {data,err} = await SetPoeSessId(poeSessId);
        if (data === true) {
            notifySuccess(toastController,"已保存");
        }else{
            notifyError(toastController,err);
        }
    }

    return <div>
        <section className="section">
            <div className="line">
                <span className="line-left"><Label htmlFor="poeSessId">PoeSessId</Label></span>
                <span  className="line-right" style={{display:"flex", alignItems:"center"}}>
                    <Input id="poeSessId" size="small" appearance="outline" defaultValue={conf.poeSessId}/>
                    <Button icon={<Save />} appearance="subtle" shape="circular" className="edit" onClick={setPoeSessId}/>
                </span>
            </div>
        </section>
    </div>
}