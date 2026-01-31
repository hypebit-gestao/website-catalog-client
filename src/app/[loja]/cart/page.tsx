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
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/models/order";

interface ProductCart {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  itemTotal: number;
  attributesOptions: [];
  promotionPrice?: number;
}

interface AttributesOptions {
  attributeName: string;
  attributeOptionName: string;
}

const Cart = () => {
  const { items, removeItem, totalItems, cartTotal, setItems } = useCart();
  const params = useParams();
  const { loja } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [typeDelivery, setTypeDelivery] = useState("Retirada");
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

  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);

  const maxInstallmentsAllowed = React.useMemo(() => {
    if (!items || items.length === 0) return 36;
    const mins = items
      .map((it: any) => Number(it.max_installments ?? 36))
      .reduce((acc: number, v: number) => Math.min(acc, v), 36);
    return Math.max(1, Math.min(36, mins));
  }, [items]);

  useEffect(() => {
    setSelectedInstallments((prev) => Math.min(prev, maxInstallmentsAllowed));
  }, [maxInstallmentsAllowed, items]);

  const subtotal = items.reduce((acc: number, item: any) => {
    const unit = item?.promotionPrice ?? item?.price ?? 0;
    const qty = item?.quantity ?? 1;
    return acc + Number(unit) * Number(qty);
  }, 0);

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

  const FormSchema2 = z.object({
    fullName: z.string().min(1, "Nome é obrigatório"),
    methodPayment: z.string().min(1, "Método de pagamento é obrigatório"),
    deliveryType: z.string().min(1, "Tipo de entrega é obrigatório"),
    observation: z.string(),
    cep: z.string(),
    street: z.string().min(1, "Rua é obrigatório"),
    district: z.string().min(1, "Bairro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatório"),
    state: z.string().min(1, "Estado é obrigatório"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(
      typeDelivery === "Retirada" ? FormSchema : FormSchema2
    ),
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

  const methodPayment = watch("methodPayment");

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
        // toast.error("CEP não encontrado");
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

  const finishOrder = async (
    data: z.infer<typeof FormSchema | typeof FormSchema2>
  ) => {
    console.log("[checkout] items before submit:", items);
    console.log("[checkout] subtotal:", subtotal);
    const numeroTelefone = `55${store?.store?.phone}`;
    const formattedMethod = formatMethodPayment(data.methodPayment);

    // compute total after discount and shipping
    const totalValue =
      data.deliveryType === "Entrega a domícilio"
        ? subtotal + (store?.store?.shipping_taxes ?? 0) - discount
        : subtotal - discount;

    // installment summary for total
    let parcelaText = "";
    if (data.methodPayment === "CREDIT_CARD" && selectedInstallments > 1) {
      const anyItemWithInterest = items.some((it: any) => it.installment_with_interest);
      const interestPercent = items
        .map((it: any) => Number(it.installment_interest_value ?? 0))
        .reduce((acc, v) => Math.max(acc, v), 0);

      if (!anyItemWithInterest || interestPercent === 0) {
        const parcela = totalValue / selectedInstallments;
        parcelaText = `\n*Parcelamento*: ${selectedInstallments}x de ${formater.format(parcela)} (sem juros)`;
      } else {
        const r = interestPercent / 100;
        const n = selectedInstallments;
        const denom = 1 - Math.pow(1 + r, -n);
        let parcela = totalValue / n;
        if (denom > 0) parcela = (totalValue * r) / denom;
        parcelaText = `\n*Parcelamento*: ${selectedInstallments}x de ${formater.format(parcela)} (com juros)`;
      }
    }

    const mensagem = `
--------------------------
*Novo Pedido!*
--------------------------
${items
  .map((item) => {
    const unit = Number(item.promotionPrice ?? item.price ?? 0);

    // per-item installment info when paying by credit card
    let perItemParcelaText = "";
    if (data.methodPayment === "CREDIT_CARD" && selectedInstallments > 1) {
      const itemMax = Number(item.max_installments ?? 1);
      if (itemMax > 1) {
        const itemWithInterest = Boolean(item.installment_with_interest);
        const itemInterestPercent = Number(item.installment_interest_value ?? 0);
        if (!itemWithInterest || itemInterestPercent === 0) {
          const parcelaItem = (item.quantity ? item.quantity * unit : unit) / selectedInstallments;
          perItemParcelaText = `\n*Parcelas*: ${selectedInstallments}x de ${formater.format(parcelaItem)} (sem juros)`;
        } else {
          const rItem = itemInterestPercent / 100;
          const nItem = selectedInstallments;
          const denomItem = 1 - Math.pow(1 + rItem, -nItem);
          let parcelaItem = (item.quantity ? item.quantity * unit : unit) / nItem;
          if (denomItem > 0) parcelaItem = ((item.quantity ? item.quantity * unit : unit) * rItem) / denomItem;
          perItemParcelaText = `\n*Parcelas*: ${selectedInstallments}x de ${formater.format(parcelaItem)} (com juros)`;
        }
      }
    }

    return ` 
*${item.name}*
*Quantidade*: ${item.quantity}
${
      item.attributesOptions &&
      item.attributesOptions
        ?.map(
          (attribute: AttributesOptions, index: number) =>
            `*${attribute.attributeName}*: ${attribute.attributeOptionName}`
        )
        .join("\n")
    }
${item.sizeName ? `*Tamanho*: ${item.sizeName}` : ""}
*Valor*: ${item.quantity ? formater.format(item.quantity * unit) : formater.format(unit)}${perItemParcelaText}
`;
  })
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
*Subtotal*: ${formater.format(subtotal)}
${
  data.deliveryType === "Entrega a domícilio"
    ? `*Taxa de entrega*: ${
        store?.store?.shipping_type === 1
          ? formater.format(store?.store?.shipping_taxes)
          : "A combinar"
      } `
    : ""
}
${discount > 0 ? `*Desconto*: ${formater.format(discount)}` : ""}
*Valor Total*: ${formater.format(totalValue)}${parcelaText}
`;

    const mensagemURLFormatada = encodeURIComponent(mensagem);

    // URL para WhatsApp Web
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemURLFormatada}`;

    window.open(whatsappUrl, "_blank");

    const orderResponse = await orderService.POST({
      user_id: user?.id,
      observation: data.observation,
      status: "PENDENT",
      customer_name: data.fullName,
      total: Number(subtotal),
    });

    if (orderResponse) {
      items.forEach(async (item: any) => {
        await orderService
          .POSTORDERITEMS({
            order_id: orderResponse.id,
            product_id: item.id,
            size_id: item.sizeId,
            quantity: item.quantity,
            unit_price: Number(item.promotionPrice ?? item.price),
            total: Number((item.promotionPrice ?? item.price) * (item.quantity ?? 1)),
          })
          .then((responseOrderItem: OrderItem | undefined) => {
            if (item.attributesOptions && item.attributesOptions.length > 0) {
              item.attributesOptions.forEach(async (attribute: any) => {
                await orderService
                  .POSTORDERATTRIBUTE({
                    user_id: user?.id,
                    order_item_id:
                      responseOrderItem !== undefined && responseOrderItem?.id,
                    attribute_id: attribute?.attributeId,
                    attribute_option_id: attribute.attributeOptionId,
                  })
                  .then((res) => {})
                  .catch((err) => {
                    console.log("ERR: ", err);
                  });
              });
            }
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

  useEffect(() => {
    if (deliveryType) {
      setTypeDelivery(deliveryType);
    }
  }, [deliveryType]);

  useEffect(() => {
    const methodPayment = watch("methodPayment");
    const deliveryType = watch("deliveryType");

    if (
      methodPayment === "CREDIT_CARD" &&
      store?.store?.credit_discount !== null &&
      store?.store?.credit_discount > 0
    ) {
      setDiscount(
        (subtotal + store?.store?.shipping_taxes) *
          (store?.store?.credit_discount / 100)
      );
    } else if (
      methodPayment === "PIX" &&
      store?.store?.pix_discount !== null &&
      store?.store?.pix_discount > 0
    ) {
      setDiscount(
        (subtotal + store?.store?.shipping_taxes) *
          (store?.store?.pix_discount / 100)
      );
    } else if (
      methodPayment === "DEBIT_CARD" &&
      store?.store?.debit_discount !== null &&
      store?.store?.debit_discount > 0
    ) {
      setDiscount(
        (subtotal + store?.store?.shipping_taxes) *
          (store?.store?.debit_discount / 100)
      );
    } else if (methodPayment === "CASH") {
      setDiscount(0);
    } else {
      setDiscount(0);
    }
  }, [watch("methodPayment"), watch("deliveryType"), subtotal]);

  return (
    <Container>
      <div className="mt-4 min-h-screen">
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
                  <div className="ml-4 flex flex-col">
                    <div>
                      <h1>
                        {item.quantity}x {item.name}
                      </h1>
                    </div>
                    {item.attributesOptions &&
                      item.attributesOptions?.map(
                        (attribute: AttributesOptions, index: number) => (
                          <div key={index} className="flex items-center">
                            <h1 className="text-gray-500 text-sm">
                              {attribute.attributeName}:{" "}
                              <span className="text-black text-sm ml-1">
                                {attribute.attributeOptionName}
                              </span>
                            </h1>
                          </div>
                        )
                      )}
                  </div>
                </div>
                <div className="flex items-center">
                  <h1 className="text-black text-lg font-bold">
                    {item.quantity
                      ? formater.format(item.quantity * (item.promotionPrice ?? item.price))
                      : (item.promotionPrice ?? item.price)}
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
          <div className="flex flex-col items-center justify-center mt-8 ">
            <h1 className="text-center text-gray-500 text-xl">
              Seu carrinho está vazio
            </h1>
            <div className="mt-4 w-[60%] lg:w-[30%]">
              <Button
                className="w-full"
                size={"xl"}
                onClick={() => router.push(`/${params.loja}`)}
              >
                Voltar para o início
              </Button>
            </div>
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
              {watch("methodPayment") === "CREDIT_CARD" && (
                <div className="mt-4">
                  <FormLabel className="text-lg">Parcelamento</FormLabel>
                  <Select
                    onValueChange={(v) => setSelectedInstallments(Number(v))}
                    defaultValue={String(selectedInstallments)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione número de parcelas" />
                    </SelectTrigger>
                    <SelectContent className="z-[300]">
                      {Array.from({ length: maxInstallmentsAllowed }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Selecione em quantas vezes deseja parcelar (1 = à vista). Máximo permitido: {maxInstallmentsAllowed}x
                  </FormDescription>
                </div>
              )}

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
                    <div className="flex flex-col xl:flex-row mt-5">
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
                                  maxLength={9}
                                  onBlur={(e) => {
                                    // setCustomValue("cep", e.target.value);
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
                      <div className="w-full mr-3 xl:mt-0 mt-5">
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
                                  placeholder="Insira sua rua"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full xl:mt-0 mt-5">
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
                    <div className="flex flex-col xl:flex-row mt-5">
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
                      <div className="w-full mr-3 xl:mt-0 mt-5">
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
                                  placeholder="Insira a cidade"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full xl:mt-0 mt-5">
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
                  <div className="mt-4">
                    <h1 className="text-lg ">
                      Subtotal:{" "}
                      <span className="">{formater.format(subtotal)}</span>
                    </h1>
                  </div>
                  {store?.store?.shipping_type !== null &&
                    deliveryType === "Entrega a domícilio" && (
                      <div className="mt-4">
                        <h1 className="text-lg">
                          Taxa de entrega:{" "}
                          {store?.store?.shipping_type === 1
                            ? formater.format(store?.store?.shipping_taxes)
                            : "A combinar"}
                        </h1>
                      </div>
                    )}
                  {watch("methodPayment") == "CREDIT_CARD" &&
                    store?.store?.credit_discount !== null &&
                    store?.store?.credit_discount > 0 && (
                      <div className="mt-4">
                        <h1 className="text-lg">
                          Desconto:{" "}
                          <span className="">
                            {formater.format(
                              (subtotal + store?.store?.shipping_taxes) *
                                (store?.store?.credit_discount / 100)
                            )}
                          </span>
                        </h1>
                      </div>
                    )}
                  {watch("methodPayment") == "PIX" &&
                    store?.store?.pix_discount !== null &&
                    store?.store?.pix_discount > 0 && (
                      <div className="mt-4">
                        <h1 className="text-lg">
                          Desconto:{" "}
                          <span className="">
                            {formater.format(
                              (subtotal + store?.store?.shipping_taxes) *
                                (store?.store?.pix_discount / 100)
                            )}
                          </span>
                        </h1>
                      </div>
                    )}
                  {watch("methodPayment") == "DEBIT_CARD" &&
                    store?.store?.debit_discount !== null &&
                    store?.store?.debit_discount > 0 && (
                      <div className="mt-4">
                        <h1 className="text-lg">
                          Desconto:{" "}
                          <span className="">
                            {formater.format(
                              (subtotal + store?.store?.shipping_taxes) *
                                (store?.store?.debit_discount / 100)
                            )}
                          </span>
                        </h1>
                      </div>
                    )}
                  <div className="mt-4">
                    <h1 className="text-lg ">
                      Valor total:{" "}
                      <span className="font-bold text-black text-xl">
                          {deliveryType === "Entrega a domícilio"
                          ? formater.format(
                              subtotal +
                                store?.store?.shipping_taxes -
                                discount
                            )
                          : formater.format(subtotal - discount)}
                      </span>
                    </h1>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <button
                    style={{
                      borderColor:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                      color:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                    }}
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
                    style={{
                      backgroundColor:
                        store?.store?.background_color !== null
                          ? `${store?.store?.background_color}`
                          : "#1e3222",
                    }}
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
