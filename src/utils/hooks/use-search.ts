import { create } from "zustand";

interface UseSearchProps {
    text: string
}

const useSearch = create<UseSearchProps>((set) => ({
    text: ""
}));

export default useSearch;
