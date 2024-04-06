import CreateBashModal from "../modals/create-bash-modal"
import CreateChannelModal from "../modals/create-channel-modal"
import DeleteBashModal from "../modals/delete-bash-modal"
import DeleteChannelModal from "../modals/delete-channel-modal"
import EditBashModal from "../modals/edit-bash-modal"
import EditChannelModal from "../modals/edit-channel-modal"
import InviteModal from "../modals/invite-modal"
import LeaveBashModal from "../modals/leave-bash-modal"
import MembersModal from "../modals/members-modal"

export const ModalProvider = () => {
    return (
        <>
            <CreateBashModal />
            <InviteModal />
            <EditBashModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveBashModal />
            <DeleteBashModal />
            <DeleteChannelModal />
            <EditChannelModal />
        </>
    )
}

// This is more like context for modals. Add it in the layout.tsx of app.