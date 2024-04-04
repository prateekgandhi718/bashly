import { BashDocument, MemberDocument } from "@/models/BashModels";
import { create } from "zustand"
export type ModalType = "createServer" | "invite" | "editBash" | "members" | "createChannel" | "leaveBash";

interface ModalData {
    bash?: BashDocument
    members?: any[] //This members is a special type which has the profile attribute populated!
}

interface ModalStore {
    type: ModalType | null
    data: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, data?: ModalData) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => {
        set((state) => ({
            isOpen: true,
            type: type,
            data: { ...state.data, ...data }, // Merge existing data with new data since if only want to update the members and not the bash which is present from before.
        }));
    },
    onClose: () => set({ type: null, isOpen: false }),
}));


// This hook will control all of the modals in our app. Zustand is a state management tool like redux.