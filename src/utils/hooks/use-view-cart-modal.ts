import { create } from "zustand";

interface UseViewCartModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useViewCartModal = create<UseViewCartModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useViewCartModal;
