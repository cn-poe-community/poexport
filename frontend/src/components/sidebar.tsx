import {
    Tab,
    TabList,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import { useNavigate } from 'react-router-dom';

import {
    Building24Filled,
    Building24Regular,
    Translate24Filled,
    Translate24Regular,
    DatabaseSearch24Filled,
    DatabaseSearch24Regular,
    Settings24Filled,
    Settings24Regular,
    Info24Filled,
    Info24Regular,
    bundleIcon,
} from "@fluentui/react-icons";

import './sidebar.css';

const sidebarStyles = makeStyles({
    sidebar: {
        height: "100vh",
        width: "85px",
        backgroundColor: tokens.colorBrandBackground2,
        flexShrink:0,
        flexGrow:0,
    }
});

const Building = bundleIcon(Building24Filled, Building24Regular);
const Translate = bundleIcon(Translate24Filled, Translate24Regular);
const DatabaseSearch = bundleIcon(DatabaseSearch24Filled, DatabaseSearch24Regular);
const Settings = bundleIcon(Settings24Filled, Settings24Regular);
const Info = bundleIcon(Info24Filled, Info24Regular);

function Sidebar() {
    const styles = sidebarStyles();
    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            <TabList vertical size="medium" defaultSelectedValue="building">
                <Tab value="building" onClick={()=>navigate("building")} icon={<Building />} className="nav-item">构建</Tab>
                <Tab value="translation" onClick={()=>navigate("translation")} icon={<Translate />} className="nav-item">翻译</Tab>
                <Tab value="dict" onClick={()=>navigate("database")} icon={<DatabaseSearch />} className="nav-item">字典</Tab>
                <Tab value="settings" onClick={()=>navigate("settings")} icon={<Settings />} className="nav-item">设置</Tab>
                <Tab value="about" onClick={()=>navigate("about")} icon={<Info />} className="nav-item">关于</Tab>
            </TabList>
        </div>
    );
}

export default Sidebar