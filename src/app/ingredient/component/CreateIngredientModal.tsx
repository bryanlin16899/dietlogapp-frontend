import { Modal } from "@mantine/core";

export function CreateIngredientModal({ opened = false, close }: { opened?: boolean; close: () => void }) {
    return (
        <>
        <Modal opened={opened} onClose={close} title="Create Ingredient">
            {/* Modal content */}
        </Modal>
        </>
    );
}