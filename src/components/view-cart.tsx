"use client";

import React, { useEffect, useState } from "react";
import Modal from "./modal";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import { Item, useCart } from "react-use-cart";
import { MdDelete, MdEdit } from "react-icons/md";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/utils/hooks/use-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { useUserService } from "@/services/user.service";

interface ViewCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductCart {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  itemTotal: number;
}

const FormSchema = z.object({
  methodPayment: z.string().min(1, "Método de pagamento é obrigatório"),
  deliveryType: z.string().min(1, "Tipo de entrega é obrigatório"),
});

const ViewCartModal = ({ isOpen, onClose }: ViewCartModalProps) => {
  const { items, removeItem, totalItems, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { loja } = params;
  const router = useRouter();
  const userService = useUserService();
  const viewCartModal = useViewCartModal();
  const store = useStore();
  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      methodPayment: "",
      deliveryType: "",
    },
  });

  const handleDelete = (id: string) => {
    removeItem(id);
  };

  const { setValue, watch } = form;

  const deliveryType = watch("deliveryType");

  const finishOrder = (data: z.infer<typeof FormSchema>) => {
    const numeroTelefone = `55${store?.store?.phone}`;

    const mensagem = `
--------------------------
*Novo Pedido!*
--------------------------
${items
  .map(
    (item) => ` 
*${item.name}*
*Quantidade*: ${item.quantity}
*Valor*: ${
      item.quantity
        ? formater.format(item.quantity * Number(item.price))
        : Number(item.price)
    }
`
  )
  .join("")}
*Forma de pagamento*: ${data.methodPayment}
*Tipo de entrega*: ${data.deliveryType}
*Valor Total*: ${
      deliveryType === "Entrega a domícilio"
        ? formater.format(cartTotal + store?.store?.shipping_taxes)
        : formater.format(cartTotal)
    }
`;

    const mensagemURLFormatada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemURLFormatada}`;

    window.open(linkWhatsApp);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <>
          <h1 className="text-[#2c6e49] font-bold text-xl">
            Confira seu pedido
          </h1>
        </>
      }
      body={
        <>
          <div>
            {totalItems > 0 ? (
              items.map((item: ProductCart | Item, index) => (
                <div key={index} className="flex flex-col">
                  <div className="py-2 w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <div>
                        <Image
                          className="rounded-xl"
                          alt=""
                          src={item.image}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="ml-4">
                        <h1>
                          {item.quantity}x {item.name}
                        </h1>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <h1 className="text-green-secondary text-lg font-bold">
                        {item.quantity
                          ? formater.format(item.quantity * item.price)
                          : item.price}
                      </h1>
                      <div className="ml-4 flex items-center">
                        {/* <MdEdit
                          className="cursor-pointer"
                          color="blue"
                          size={24}
                        /> */}
                        <MdDelete
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer"
                          color="red"
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h1 className="text-center text-gray-500 text-xl">
                  Seu carrinho está vazio
                </h1>
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(finishOrder)} className="my-6">
                {totalItems > 0 && (
                  <FormField
                    control={form.control}
                    name="methodPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          Método de Pagamento
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um método de pagamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[300]">
                            <SelectItem value="CASH">Dinheiro</SelectItem>
                            <SelectItem value="PIX">Pix</SelectItem>
                            <SelectItem value="CREDIT_CARD">
                              Cartão de Crédito
                            </SelectItem>
                            <SelectItem value="DEBIT_CARD">
                              Cartão de Débito
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="mt-5">
                  {totalItems > 0 && (
                    <FormField
                      control={form.control}
                      name="deliveryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">
                            Tipo de entrega
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um tipo de entrega" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[300]">
                              <SelectItem value="Retirada">Retirada</SelectItem>
                              <SelectItem value="Entrega a domícilio">
                                Entrega a domícilio
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {totalItems > 0 && (
                    <div className="my-8">
                      <h1 className="text-xl ">
                        Valor total:{" "}
                        <span className="font-bold text-green-secondary text-2xl">
                          {formater.format(cartTotal)}
                        </span>
                      </h1>
                    </div>
                  )}
                  <div className="mt-6 w-full">
                    <button
                      onClick={() => {
                        viewCartModal.onClose();
                        router.push(`/${params.loja}`);
                      }}
                      className="border border-green-primary text-green-primary p-4 rounded-lg  w-full hover:opacity-90 transition-all duration-200"
                    >
                      Continuar comprando
                    </button>
                  </div>
                  {totalItems > 0 && (
                    <div className="my-6 w-full">
                      <button
                        type="submit"
                        className="bg-green-primary p-4 rounded-lg text-white w-full hover:opacity-90 transition-all duration-200"
                      >
                        Finalizar pedido
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </>
      }
    />
  );
};

export default ViewCartModal;
