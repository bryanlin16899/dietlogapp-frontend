import { Button, Menu, MenuTarget } from "@mantine/core";
import { IconArrowsLeftRight, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

export function NavMenu() {
    return (
        <Menu shadow="md" radius="md">
            <MenuTarget>
                <Button>Menu</Button>
            </MenuTarget>

            <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/ingredient"
            >
                Ingredients
            </Menu.Item>
            {/* <Menu.Item leftSection={<IconMessageCircle size={14} />}>
            Messages
            </Menu.Item>
            <Menu.Item leftSection={<IconPhoto size={14} />}>
            Gallery
            </Menu.Item>
            <Menu.Item
            leftSection={<IconSearch size={14} />}
            rightSection={
                <Text size="xs" c="dimmed">
                    ⌘K
                </Text>
            }
            >
            Search
            </Menu.Item> */}

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
