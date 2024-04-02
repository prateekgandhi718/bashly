import CreateBashModal from "../modals/create-bash-modal"
import InviteModal from "../modals/invite-modal"

export const ModalProvider = () => {
    return (
        <>
            <CreateBashModal />
            <InviteModal />
        </>
    )
}

// This is more like context for modals. Add it in the layout.tsx of app.