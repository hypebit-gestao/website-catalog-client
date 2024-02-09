"use client";

import Container from "@/components/container";
import PaymentModal from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { useMercadoPagoService } from "@/services/mercadopago.service";
import usePaymentModal from "@/utils/hooks/use-payment-modal";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import useRegisterModal from "@/utils/hooks/use-register-modal";
import RegisterModal from "@/components/register-modal";
import toast from "react-hot-toast";
import { useCepService } from "@/services/cep.service";

export default function Home() {
  initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d", {
    locale: "pt-BR",
  });
  const paymentModal = usePaymentModal();
  const registerModal = useRegisterModal();
  const [card, setCard] = useState();
  const mercadoPagoService = useMercadoPagoService();
  const cepService = useCepService();
  const [storeData, setStoreData] = useState<any>({});

  const initialization = {
    amount: 2,
  };

  const customization = {
    paymentMethods: {
      minInstallments: 1,
      maxInstallments: 1,
    },
    labels: {
      cardNumber: "Número do cartão",
      expirationDate: "Data de expiração",
      cardholderName: "Nome do titular do cartão",
      securityCode: "Código de segurança",
      installments: "Parcelas",
      issuer: "Emissor",
      payButton: "Pagar", // Botão de pagamento
    },
  };

  const formSchema = z.object({
    name: z.string().min(1, "O campo Nome é obrigatório"),
    cpf_cnpj: z.string().min(1, "O campo CPF/CNPJ é obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(8, "Telefone inválido"),
    username: z.string().min(1, "O campo Nome de usuário é obrigatório"),
    password: z.string().min(1, "O campo Senha é obrigatório"),
    person_link: z.string().min(1, "O campo Link personalizado é obrigatório"),
    cep: z.string().min(1, "CEP é obrigatório"),
    street: z.string().min(1, "Logradouro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    district: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatório"),
    state: z.string().min(1, "Estado é obrigatório"),
    complement: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf_cnpj: "",
      email: "",
      phone: "",
      username: "",
      person_link: "",
      password: "",
      cep: "",
      street: "",
      number: "",
      district: "",
      city: "",
      state: "",
      complement: "",
    },
  });

  const phoneMask = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const cepMask = (value: string) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const cpfCnpjMask = (value: string) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return value;
  };

  const removeFormatting = (value: string) => {
    return value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
  };

  const { setValue, watch } = form;

  const cep = watch("cep");

  type FormSchemaType = z.infer<typeof formSchema>;

  type FormField = keyof FormSchemaType;

  const setCustomValue = (id: FormField, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const getCep = async () => {
    await cepService
      .GET(cep)
      .then((res) => {
        setCustomValue("street", res.logradouro);
        setCustomValue("district", res.bairro);
        setCustomValue("city", res.localidade);
        setCustomValue("state", res.uf);
        setCustomValue("complement", res.complemento);
      })
      .catch((err) => {
        toast.error("CEP não encontrado");
      });
  };

  const handlePayment = async (data: any) => {
    console.log("Data: ", data);
    setStoreData(data);
    registerModal.onClose();
    paymentModal.onOpen();
  };

  const onSubmit = async (formData: any) => {
    formData.name = storeData?.name;
    formData.cpfCnpj = storeData?.cpf_cnpj;
    formData.email = storeData?.email;
    formData.phone = storeData?.phone;
    formData.username = storeData?.username;
    formData.password = storeData?.password;
    formData.personLink = storeData?.person_link;
    formData.cep = storeData?.cep;
    formData.street = storeData?.street;
    formData.number = storeData?.number;
    formData.district = storeData?.district;
    formData.city = storeData?.city;
    formData.state = storeData?.state;
    formData.complement = storeData?.complement;

    return new Promise(async (resolve, reject) => {
      fetch(
        "https://api-catalog-sw4c.onrender.com/mercadopago/process_payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => response.json())
        .then((response: any) => {
          // receber o resultado do pagamento
          // resolve();
          resolve(response);
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });
      if (formData?.token) {
        setCard(formData?.token);
      }
    });
  };

  const onError = async (error: any) => {
    // callback chamado para todos os casos de erro do Brick
    console.log(error);
  };

  const onReady = async () => {
    /*
        Callback chamado quando o Brick estiver pronto.
        Aqui você pode ocultar loadings do seu site, por exemplo.
      */
  };

  return (
    <>
      {/* <RegisterModal
        isOpen={registerModal.isOpen}
        onClose={registerModal.onClose}
        body={
          <>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handlePayment)}
                  className=" w-full"
                >
                  <div>
                    <h1 className="my-4 font-semibold text-green-primary">
                      Informações pessoais
                    </h1>
                    <div className="flex flex-row mb-5">
                      <div className="w-full mr-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Nome
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Insira o nome do usuário"
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
                          name="cpf_cnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                CPF/CNPJ
                              </FormLabel>
                              <FormControl>
                                <Input
                                  maxLength={18}
                                  className=""
                                  placeholder="Insira o cpf/cnpj do usuário"
                                  value={cpfCnpjMask(field.value)}
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
                    </div>

                    <div className="flex flex-row mb-5">
                      <div className="w-full mr-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                E-mail
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Insira o e-mail do usuário"
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  maxLength={15}
                                  className=""
                                  placeholder="Insira o telefone do usuário"
                                  value={phoneMask(field.value)}
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
                    </div>

                    <div className="flex flex-row ">
                      <div className="w-full mr-5">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Nome de usuário
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Insira o nome de usuário"
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
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Senha
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  className=""
                                  placeholder="Insira a senha do usuário"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="w-full mt-5">
                      <FormField
                        control={form.control}
                        name="person_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-primary">
                              Link da sua loja
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Insira o link da sua loja"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-12">
                    <h1 className="my-4 font-semibold text-green-primary">
                      Informações de endereço
                    </h1>
                    <div className="flex flex-row mb-5">
                      <div className="w-full mr-5">
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
                      <div className="w-full">
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
                                  className=""
                                  placeholder="Insira a rua"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row mb-5">
                      <div className="w-full mr-5">
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
                                  placeholder="Insira o bairro"
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
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-primary">
                                Número
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className=""
                                  placeholder="Insira o número"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row ">
                      <div className="w-full mr-5">
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
                                  maxLength={2}
                                  className=""
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
                  </div>
                  <div className="mt-12">
                    <Button
                      size="lg"
                      className="w-full bg-green-secondary"
                      type="submit"
                    >
                      Próximo
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        }
      />
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.onClose}
        body={
          <CardPayment
            customization={customization}
            initialization={initialization}
            onSubmit={onSubmit as any}
            onReady={onReady}
            onError={onError}
          />
        }
      />
      <Container isLanding>
        <section className=" min-h-screen flex flex-col justify-center items-center">
          <div className="  ">
            <div>
              <h1 className="text-[130px]  uppercase leading-none text-center">
                Decole
              </h1>
              <h1 className="text-[130px]  uppercase leading-none">
                sua <span className="text-green-secondary">empresa</span>
              </h1>
            </div>
            <div className="mt-8 text-center">
              <Button
                className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-64 p-6 text-2xl"
                size={"lg"}
              >
                Acesse já
              </Button>
            </div>
          </div>
          <div></div>
        </section>

        <section
          id="plans"
          className=" min-h-screen flex flex-col  items-center bg-green-secondary"
        >
          <div className="mt-12">
            <h1 className=" text-[60px] font-bold text-white">
              Planos do <span className="">CatalogoPlace</span>
            </h1>
            <div className="shadow-xl rounded-lg flex flex-col items-center bg-white my-12">
              <div className="bg-white p-8">
                <h1 className="text-4xl font-bold text-green-secondary text-center">
                  STARTER
                </h1>
                <p className="text-green-primary text-lg my-2 text-center">
                  O plano que cabe no seu orçamento!
                </p>
                <h2 className="text-4xl text-center text-black font-bold">
                  por <span className="text-[40px]">R$40,00</span>/mês
                </h2>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => registerModal.onOpen()}
                    className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-64 p-6 text-2xl text-center"
                    size={"lg"}
                  >
                    Começar agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container> */}
      aa
      {/* <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.onClose}
        body={
          <CardPayment
            customization={customization}
            initialization={initialization}
            onSubmit={onSubmit as any}
            onReady={onReady}
            onError={onError}
          />
        }
      />
      <main className="flex justify-center items-center h-screen w-full bg-green-primary">
        <div className="bg-white rounded-xl p-4 h-[400px]">
          <h1>PLANO STARTER</h1>
          <button
            onClick={() => paymentModal.onOpen()}
            className="bg-green-primary p-4 w-full rounded-xl text-white"
          >
            Comece aqui
          </button>
        </div>
      </main> */}
    </>
  );
}
