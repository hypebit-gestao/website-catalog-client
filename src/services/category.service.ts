import { Category } from "@/models/category";
import { fetchWrapper } from "@/utils/functions/fetch";

export const useCategoryService = () => {
  const GETCATEGORIES = async (
    person_link: string
  ): Promise<Category[] | undefined> => {
    const response = await fetchWrapper<Category[]>(
      `category/user/person/person_link?person_link=${person_link}`,
      {
        method: "GET",
      }
    );

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const GETALL = async (): Promise<Category[] | undefined> => {
    const response = await fetchWrapper<Category[]>(`category`, {
      method: "GET",
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  return {
    GETCATEGORIES,
    GETALL,
  };
};
