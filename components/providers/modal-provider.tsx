import CreateBashModal from "../modals/create-bash-modal"
import EditBashModal from "../modals/edit-bash-modal"
import InviteModal from "../modals/invite-modal"
import MembersModal from "../modals/members-modal"

export const ModalProvider = () => {
    return (
        <>
            <CreateBashModal />
            <InviteModal />
            <EditBashModal />
            <MembersModal />
        </>
    )
}

// This is more like context for modals. Add it in the layout.tsx of app.