import { useUser } from "@/context/userContext";
import { Button, Menu } from "@mantine/core";
import { IconArrowsLeftRight, IconArticle, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

export function NavMenu() {
    const { userInfo, setUserInfo } = useUser();
    
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


