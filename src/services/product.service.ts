import { Product } from "@/models/product";
import { fetchWrapper } from "@/utils/functions/fetch";

export const useProductService = () => {
  const GETPRODUCTS = async (
    person_link: string,
    name: string,
    category: string
  ): Promise<Product[] | undefined> => {
    const response = await fetchWrapper<Product[]>(
      `product/user/person/person_link?person_link=${person_link}&name=${name}&category=${category}`,
      {
        method: "GET",
      }
    );

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const GETBYID = async (id: string): Promise<Product | undefined> => {
    const response = await fetchWrapper<Product>(`product/${id}`, {
      method: "GET",
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  return {
    GETPRODUCTS,
    GETBYID,
  };
};
