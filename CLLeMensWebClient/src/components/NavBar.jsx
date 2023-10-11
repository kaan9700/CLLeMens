import {
    HomeOutlined,
    CloudUploadOutlined,
    FileOutlined,
    MessageOutlined,
    RobotOutlined,
    AppstoreOutlined, // Neu importiert für das Untermenü-Icon
} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const current = location.pathname.slice(1);

    const onClick = (e) => {
        navigate(`/${e.key}`);
    };
    const navigateToHome = () => {
        navigate('/'); // Navigiert zur Home-Seite
    };
    const logoItem = [
        {
            label: (
                <div
                    onClick={navigateToHome}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: 'pointer'
                    }}> {/* cursor: 'pointer' zeigt an, dass es anklickbar ist */}
                    <RobotOutlined style={{fontSize: "50px", marginRight: "10px", color: 'white'}}/>
                    <span style={{color: 'white', padding: '10px 0', fontSize: '1.2rem'}}>CLLeMens</span>
                </div>
            ),
            key: "logo",
            disabled: false, // Auch wenn es deaktiviert ist, funktioniert der onClick-Handler immer noch
        },
    ];

    const items = [
        {
            label: "Home",
            key: "",
            icon: <HomeOutlined/>,
        },
        {
            label: "Upload",
            key: "upload",
            icon: <CloudUploadOutlined/>,
        },
        {
            label: "Files",
            key: "files",
            icon: <FileOutlined/>,
        },
         {
            label: "Chat",
            key: "chatMenu", // Dies wird jetzt als Menü-ID verwendet
            icon: <AppstoreOutlined />,
            children: [ // Untermenüpunkte
                {
                    label: "Chat",
                    key: "chat",
                    icon: <MessageOutlined />,
                },
                {
                    label: "OpenAI Token",
                    key: "token",
                    icon: <MessageOutlined />, // Sie können hier auch ein anderes Symbol verwenden, wenn Sie möchten
                }
            ],
        },
    ];

    return (
        <div
            className={'navbar'}
            style={{
                width: '100%'
            }}
        >
            <Menu
                className="navbar-logo"
                selectedKeys={[current]}
                mode="horizontal"
                items={logoItem}
                style={{

                }}
            />
            <Menu
                className="customNavbar"
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{
                    color: 'white'
                }}
            />
        </div>
    );

};

export default NavBar;
