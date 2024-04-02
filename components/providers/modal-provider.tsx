import CreateBashModal from "../modals/create-bash-modal"

export const ModalProvider = () => {
    return (
        <>
            <CreateBashModal />
        </>
    )
}

// This is more like context for modals. Add it in the layout.tsx of app.