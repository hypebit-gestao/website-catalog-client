import { Store } from "@/models/store";
import { create } from "zustand";

interface useStoreProps {
  store: Store;
}

const useStore = create<useStoreProps>((set) => ({
  store: {
    phone: "",
    name: "",
    image_url: "",
    email: "",
    shipping_taxes: 0,
    shipping_type: 0,
    background_color: "",
  },
}));

export default useStore;
