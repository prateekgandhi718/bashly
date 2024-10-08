import CreateBashModal from "../modals/create-bash-modal"
import CreateChannelModal from "../modals/create-channel-modal"
import CreateEventModal from "../modals/create-event-modal"
import CreateItineraryModal from "../modals/create-itinerary-modal"
import DeleteBashModal from "../modals/delete-bash-modal"
import DeleteChannelModal from "../modals/delete-channel-modal"
import { DeleteMessageModal } from "../modals/delete-message-modal"
import EditBashModal from "../modals/edit-bash-modal"
import EditChannelModal from "../modals/edit-channel-modal"
import EditEventModal from "../modals/edit-event-modal"
import EditEventReadOnlyModal from "../modals/edit-event-read-only-modal"
import InviteModal from "../modals/invite-modal"
import LeaveBashModal from "../modals/leave-bash-modal"
import MembersModal from "../modals/members-modal"
import MessageFileModal from "../modals/message-file-modal"

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
            <MessageFileModal />
            <DeleteMessageModal />
            <CreateItineraryModal />
            <CreateEventModal />
            <EditEventModal />
            <EditEventReadOnlyModal />
        </>
    )
}

// This is more like context for modals. Add it in the layout.tsx of app.