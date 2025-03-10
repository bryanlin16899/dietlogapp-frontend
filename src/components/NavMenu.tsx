import { Button, Menu, MenuTarget } from "@mantine/core";
import { IconArrowsLeftRight, IconArticle, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

export function NavMenu() {
    return (
        <Menu trigger="hover" shadow="md" radius="md">
            <MenuTarget>
                {/* <Button
                    leftSection={<IconArticle size={25}/>}
                >
                    Menu
                </Button> */}
                <Button radius={20}>
                    <IconArticle size={25}/>
                </Button>
            </MenuTarget>

            <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/"
            >
                Dashboard
            </Menu.Item>
            <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/ingredient"
            >
                Ingredients
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


