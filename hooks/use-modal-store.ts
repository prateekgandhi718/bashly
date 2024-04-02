import { create } from "zustand"
export type ModalType = "createServer";

interface ModalStore {
    type: ModalType | null
    isOpen: boolean
    onOpen: (type: ModalType) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type: type}),
    onClose: () => set({ type: null, isOpen: false})
}))

// This hook will control all of the modals in our app. Zustand is a state management tool like redux.