"use client";

import React, { useRef } from "react";
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
import { useState } from "react";
import { useCepService } from "@/services/cep.service";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Address } from "@/models/address";
import { useAddressService } from "@/services/address.service";
import { useUserService } from "@/services/user.service";
import { useUploadService } from "@/services/upload.service";
import { ReturnUpload } from "@/models/upload";
import Image from "next/image";
import { TiDelete } from "react-icons/ti";

const formSchema = z.object({
  name: z.string().min(1, "O campo Nome é obrigatório"),
  cpf_cnpj: z.string().min(1, "O campo CPF/CNPJ é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  username: z.string().min(1, "O campo Nome de usuário é obrigatório"),
  image_url: z.any(),
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

const Register = () => {
  const cepService = useCepService();
  const addressService = useAddressService();
  const uploadService = useUploadService();
  const userService = useUserService();
  const url = useSearchParams();
  const customerId = url.get("customerId");
  const router = useRouter();

  const inputFileRef = useRef<any>(null);
  const [filePreview, setFilePreview] = useState<any>(null);

  const handleDeleteFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    setCustomValue("image_url", "");
    setFilePreview(null);
  };

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
      image_url: "",
      city: "",
      state: "",
      complement: "",
    },
  });

  console.log("ID: ", customerId);

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

  const onSubmit = async (data: any) => {
    try {
      if (customerId) {
        const addressResponse: Address | undefined = await addressService.POST({
          cep: removeFormatting(data.cep),
          street: data.street,
          number: Number(data.number),
          district: data.district,
          city: data.city,
          state: data.state,
          complement: data.complement,
        });
        if (addressResponse) {
          if (data?.image_url) {
            await uploadService
              .POST({
                file: data.image_url,
                folderName: data.name,
              })
              .then(async (res: ReturnUpload | undefined) => {
                if (Array.isArray(res) && res.length > 0 && res[0].imageUrl) {
                  await userService.POST({
                    name: data.name,
                    cpf_cnpj: removeFormatting(data.cpf_cnpj),
                    email: data.email,
                    phone: removeFormatting(data.phone),
                    username: data.username,
                    password: data.password,
                    person_link: data.person_link,
                    payer_id: customerId,
                    image_url: res[0].imageUrl,
                    address_id: addressResponse.id,
                    user_type: 1,
                    status: "ACTIVE",
                  });
                }
              });
          } else {
            await userService.POST({
              name: data.name,
              cpf_cnpj: removeFormatting(data.cpf_cnpj),
              email: data.email,
              phone: removeFormatting(data.phone),
              username: data.username,
              password: data.password,
              person_link: data.person_link,
              payer_id: customerId,
              image_url: null,
              address_id: addressResponse.id,
              user_type: 1,
              status: "ACTIVE",
            });
          }
        }
      }

      toast.success(`Loja criado com sucesso`);

      router.push("/register/success");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <section className="min-h-screen h-full w-full flex justify-center items-center bg-green-secondary">
      <div className="w-1/2 rounded-xl shadow-xl bg-white p-6 h-[80vh] overflow-auto">
        <h1 className="text-center text-green-secondary text-3xl font-bold">
          Cadastrar Loja
        </h1>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div>
                <h1 className="my-4 font-semibold text-green-primary">
                  Informações da loja
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
                <div className="w-full mt-5 ">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Logo da Loja</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={inputFileRef}
                            placeholder="Logo da Loja"
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) => {
                              onChange(
                                event.target.files && event.target.files[0]
                              );
                              if (event.target.files) {
                                if (event.target.files[0]) {
                                  const reader = new FileReader();

                                  reader.onloadend = () => {
                                    setFilePreview(reader.result);
                                  };

                                  reader.readAsDataURL(event.target.files[0]);
                                }
                              }
                            }}
                          />
                        </FormControl>
                        {filePreview && (
                          <div className="relative mt-3 w-[300px] ">
                            <div
                              className="absolute top-0 right-0 cursor-pointer"
                              onClick={handleDeleteFile}
                            >
                              <TiDelete color="red" size={24} />
                            </div>

                            {filePreview.startsWith("data:image") ? (
                              <Image
                                className=""
                                src={filePreview}
                                alt="Preview"
                                width={300}
                                height={300}
                              />
                            ) : (
                              <p>Arquivo selecionado: {filePreview}</p>
                            )}
                          </div>
                        )}
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
                            <Input placeholder="Insira o bairro" {...field} />
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
                            <Input placeholder="Insira a cidade" {...field} />
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
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Register;
