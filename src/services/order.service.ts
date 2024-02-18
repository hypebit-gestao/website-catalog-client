import { fetchWrapper } from "../utils/functions/fetch";
import { User } from "../models/user";
import { Order, OrderItem } from "@/models/order";

export const useOrderService = () => {
  const POST = async (data: Order): Promise<Order | undefined> => {
    const response = await fetchWrapper<Order>(`order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const POSTORDERITEMS = async (
    data: OrderItem
  ): Promise<OrderItem | undefined> => {
    const response = await fetchWrapper<OrderItem>(`orderItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const GETALL = async (
    session: string | any
  ): Promise<Order[] | undefined> => {
    const response = await fetchWrapper<Order[]>("order", {
      method: "GET",
      headers: {
        Authorization: `${session}`,
      },
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const GETBYID = async (
    id: string | undefined,
    session: string | any
  ): Promise<Order | undefined> => {
    const response = await fetchWrapper<Order>(`order/${id}`, {
      method: "GET",
      headers: {
        Authorization: `${session}`,
      },
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const PUT = async (
    data: Order,
    session: string | any
  ): Promise<Order | undefined> => {
    const response = await fetchWrapper<Order>(`order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session}`,
      },
      body: JSON.stringify(data),
    });

    if (!response) {
      console.error("Sem resposta do servidor");
    }

    return response;
  };

  const DELETE = async (id: string, session: string | any): Promise<void> => {
    await fetchWrapper<User[]>(`user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session}`,
      },
    });
  };

  return {
    GETALL,
    GETBYID,
    POST,
    POSTORDERITEMS,
    PUT,
    DELETE,
  };
};
