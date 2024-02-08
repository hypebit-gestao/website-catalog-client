import { create } from "zustand";

interface UsePaymentModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePaymentModal = create<UsePaymentModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePaymentModal;
