import { Store } from "@/models/store";
import { fetchWrapper } from "./functions/fetch";

 const storeData = async (store: string | string[]) => {
    const response = await fetchWrapper<Store | undefined>(`user/person/personLink?person_link=${store}`, {
        method: "GET",
    })

    if (!response) {
        console.error("Sem resposta do servidor")
    }

    return response
}

export default storeData

