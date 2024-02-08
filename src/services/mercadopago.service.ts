import { fetchWrapper } from "../utils/functions/fetch";
import { Product } from "@/models/product";

export const useMercadoPagoService = () => {
  const POST = async (body: any): Promise<any> => {
    const response = await fetchWrapper(
      `https://api.mercadopago.com/preapproval`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer APP_USR-4713727283011042-112717-6fc1bcca6957327267771b618a6b1dec-1567253255`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  return {
    POST,
  };
};
