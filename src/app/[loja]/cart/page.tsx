"use client";

import React, { useEffect, useState } from "react";

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
import Container from "@/components/container";
import { Input } from "@/components/ui/input";
import { useOrderService } from "@/services/order.service";
import { useSession } from "next-auth/react";
import { useUserService } from "@/services/user.service";
import { User } from "@/models/user";
import { useCepService } from "@/services/cep.service";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

interface ProductCart {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  itemTotal: number;
}

const Cart = () => {
  const { items, removeItem, totalItems, cartTotal, setItems } = useCart();
  const params = useParams();
  const { loja } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const viewCartModal = useViewCartModal();
  const userService = useUserService();
  const orderService = useOrderService();
  const cepService = useCepService();
  const [user, setUser] = useState<User>();
  const store = useStore();
  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const FormSchema = z.object({
    fullName: z.string().min(1, "Nome é obrigatório"),
    methodPayment: z.string().min(1, "Método de pagamento é obrigatório"),
    deliveryType: z.string().min(1, "Tipo de entrega é obrigatório"),
    observation: z.string(),
    cep: z.string(),
    street: z.string(),
    district: z.string(),
    number: z.string(),
    city: z.string(),
    state: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      methodPayment: "CREDIT_CARD",
      deliveryType: "Retirada",
      observation: "",
      cep: "",
      street: "",
      district: "",
      number: "",
      city: "",
      state: "",
    },
  });

  const { setValue, watch } = form;

  const deliveryType = watch("deliveryType");

  const cep = watch("cep");

  type FormSchemaType = z.infer<typeof FormSchema>;

  type FormField = keyof FormSchemaType;

  const setCustomValue = (id: FormField, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDelete = (id: string) => {
    removeItem(id);
  };

  const cepMask = (value: string) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const getCep = async () => {
    await cepService
      .GET(cep)
      .then((res) => {
        setCustomValue("street", res.logradouro);
        setCustomValue("district", res.bairro);
        setCustomValue("city", res.localidade);
        setCustomValue("state", res.uf);
      })
      .catch((err) => {
        toast.error("CEP não encontrado");
      });
  };

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const fetchedUser = await userService.GETUSER(loja as string);
      if (fetchedUser) {
        if (fetchedUser?.status !== "INACTIVE") {
          setLoading(false);
          setUser(fetchedUser);
        } else {
          router.push("/");
          setLoading(true);
        }
      } else {
        setLoading(false);
        router.push("/");
      }
    };
    getUser();
  }, [loja]);

  const finishOrder = async (data: z.infer<typeof FormSchema>) => {
    const numeroTelefone = `55${store?.store?.phone}`;
    const formattedMethod = formatMethodPayment(data.methodPayment);

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
*Nome completo*: ${data.fullName}
*Forma de pagamento*: ${formattedMethod}
*Tipo de entrega*: ${data.deliveryType}
${
  data.deliveryType === "Entrega a domícilio"
    ? `
*CEP*: ${data.cep}
*Rua*: ${data.street}
*Bairro*: ${data.district}
*Número*: ${data.number}
*Cidade*: ${data.city}
*Estado*: ${data.state}
`
    : ""
}
${data.observation ? `*Observação*: ${data.observation}` : ""}
*Valor Total*: ${formater.format(Number(cartTotal))}
`;

    const mensagemURLFormatada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemURLFormatada}`;

    window.open(linkWhatsApp);

    const orderResponse = await orderService.POST({
      user_id: user?.id,
      observation: data.observation,
      status: "PENDENT",
      customer_name: data.fullName,
      total: Number(cartTotal),
    });

    if (orderResponse) {
      items.forEach(async (item: any) => {
        await orderService.POSTORDERITEMS({
          order_id: orderResponse.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.itemTotal,
        });
      });
    }

    setItems([]);
    router.push(`/${params.loja}`);
  };

  const formatMethodPayment = (method: string) => {
    switch (method) {
      case "CASH":
        return "Dinheiro";
      case "PIX":
        return "Pix";
      case "CREDIT_CARD":
        return "Cartão de Crédito";
      case "DEBIT_CARD":
        return "Cartão de Débito";
      default:
        return "";
    }
  };

  return (
    <Container>
      <div className="mt-32 min-h-screen">
        {totalItems > 0 ? (
          items.map((item: ProductCart | Item, index) => (
            <div key={index} className="flex flex-col">
              <div className="py-2 w-full flex justify-between items-center">
                <div className="flex items-center">
                  <div>
                    <Image
                      className="rounded-xl"
                      alt=""
                      src={
                        item.image
                          ? item.image
                          : "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png"
                      }
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
        {totalItems > 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(finishOrder)} className="my-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-primary">
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira seu nome completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-5">
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
              </div>

              <div className="mt-5">
                <div>
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
                </div>
                {deliveryType === "Entrega a domícilio" && (
                  <>
                    <div className="flex flex-row mt-5">
                      <div className="w-full mr-3">
                        <FormField
                          control={form.control}
                          name="cep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Cep
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  maxLength={9}
                                  onBlur={(e) => {
                                    setCustomValue("cep", e.target.value);
                                    getCep();
                                  }}
                                  placeholder="Insira o cep"
                                  value={cepMask(field.value)}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full mr-3">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Rua
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  placeholder="Insira sua rua"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Bairro
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  placeholder="Insira seu bairro"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row mt-5">
                      <div className="w-full mr-3">
                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Número
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  type="number"
                                  placeholder="Insira o número"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full mr-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Cidade
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  placeholder="Insira a cidade"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Estado
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required={
                                    deliveryType === "Entrega a domícilio"
                                  }
                                  placeholder="Insira o estado"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Caso tiver alguma observação sobre o pedido, insira aqui"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="my-8">
                  <h1 className="text-xl ">
                    Valor total:{" "}
                    <span className="font-bold text-green-secondary text-2xl">
                      {formater.format(cartTotal)}
                    </span>
                  </h1>
                </div>

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

                <div className="my-6 w-full">
                  <button
                    type="submit"
                    className="bg-green-primary p-4 rounded-lg text-white w-full hover:opacity-90 transition-all duration-200"
                  >
                    Finalizar pedido
                  </button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default Cart;
