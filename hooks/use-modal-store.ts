import { BashDocument } from "@/models/BashModels";
import { create } from "zustand"
export type ModalType = "createServer" | "invite";

interface ModalData {
    bash?: BashDocument
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
    onOpen: (type, data={}) => set({ isOpen: true, type: type, data:data}),
    onClose: () => set({ type: null, isOpen: false})
}))

// This hook will control all of the modals in our app. Zustand is a state management tool like redux.