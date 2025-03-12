import { useUser } from "@/context/userContext";
import { Button, Menu } from "@mantine/core";
import { IconArrowsLeftRight, IconArticle, IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { GoogleAuth } from "./GoogleAuth";

export function NavMenu() {
    const { userInfo, setUserInfo } = useUser();
    
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        window.location.href = '/';
    };

    // If no user is logged in, show the Google login button
    if (!userInfo) {
        return <GoogleAuth />;
    }
    
    // Otherwise show the menu for logged in users
    return (
        <Menu trigger="hover" shadow="md" radius="md">
            <Menu.Target>
                <Button radius={20}>
                    <IconArticle size={25}/>
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/"
            >
                主畫面
            </Menu.Item>
            <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/ingredient"
            >
                食材
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Account</Menu.Label>
            <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
            >
                登出
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item
                leftSection={<IconArrowsLeftRight size={14} />}
            >
                Transfer my data
            </Menu.Item>
            <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
            >
                Delete my account
            </Menu.Item>
        </Menu.Dropdown>
        </Menu>
    );
}


