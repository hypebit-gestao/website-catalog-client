import { create } from "zustand";

interface useStoreProps {
    store: {
        phone: string;
        name: string;
        image_url: string;
        email: string;
    },
}

const useStore = create<useStoreProps>((set) => ({
  store: {
    phone: "",
    name: "",
    image_url: "",
    email: "",
  }
}));

export default useStore;
