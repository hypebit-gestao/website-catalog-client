import { Category } from "@/models/category";
import { fetchWrapper } from "@/utils/functions/fetch";

export const useCategoryService = () => {
  const GETALL = async (

  ): Promise<Category[] | undefined> => {
    const response = await fetchWrapper<Category[]>(
      `category`,
      {
        method: "GET",
      }
    );

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  

  return {
    GETALL,
   
  };
};
