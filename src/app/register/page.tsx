"use client";

import React, { useMemo, useRef } from "react";
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
import { IoCloudUploadOutline } from "react-icons/io5";
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
import StepByStep from "@/components/step-by-step";
import Loader from "@/components/loader";

enum REGISTER_STORE_STEPS {
  BASIC_INFORMATION = 0,
  ADDRESS = 1,
  ATTACHMENT = 2,
}

const Register = () => {
  const [loading, setLoading] = useState(false);
  const cepService = useCepService();
  const addressService = useAddressService();
  const uploadService = useUploadService();
  const userService = useUserService();
  const url = useSearchParams();
  const customerId = url.get("customerId");
  const planId = url.get("planId");
  const router = useRouter();
  const [step, setStep] = useState(REGISTER_STORE_STEPS.BASIC_INFORMATION);
  const [formData, setFormData] = useState<z.infer<typeof formSchema>>(
    {} as z.infer<typeof formSchema>
  );
  const lengthSteps = Object.values(REGISTER_STORE_STEPS).filter(
    (val) => typeof val === "number"
  ).length;
  const actualStep = step + 1;
  const requiredInfos = [
    {
      step: 1,
      fields: [
        "name",
        "cpf_cnpj",
        "email",
        "phone",
        "password",
        "confirmation_password",
        "person_link",
      ],
    },
    {
      step: 2,
      fields: ["cep", "street", "number", "district", "city", "state"],
    },
  ];

  const primaryLabelButton = useMemo(() => {
    if (step === REGISTER_STORE_STEPS.BASIC_INFORMATION) {
      return "Cancelar";
    }

    return "Anterior";
  }, [step]);

  const secondaryLabelButton = useMemo(() => {
    if (step === REGISTER_STORE_STEPS.ATTACHMENT) {
      return "Criar";
    }

    return "Próximo";
  }, [step]);

  const formSchemaStep1 = z
    .object({
      name: z.string().min(1, "O campo nome da loja é obrigatório"),
      cpf_cnpj: z.string().min(1, "O campo CPF/CNPJ é obrigatório"),
      email: z.string().email("O campo e-mail é obrigatório"),
      phone: z.string().min(8, "O campo telefone é obrigatório"),
      password: z.string().min(1, "O campo senha é obrigatório"),
      confirmation_password: z
        .string()
        .min(1, "O campo confirmação de senha é obrigatório"),
      person_link: z
        .string()
        .min(1, "O campo link personalizado é obrigatório"),
    })
    .refine((data) => data.password === data.confirmation_password, {
      message: "As senhas não coincidem",
      path: ["confirmation_password"],
    }) as any;

  const formSchemaStep2 = z.object({
    cep: z.string().min(1, "O campo CEP é obrigatório"),
    street: z.string().min(1, "O campo rua é obrigatório"),
    number: z.string().min(1, "O campo número é obrigatório"),
    district: z.string().min(1, "O campo bairro é obrigatório"),
    city: z.string().min(1, "O campo cidade é obrigatório"),
    state: z.string().min(1, "O campo estado é obrigatório"),
    complement: z.string(),
  });

  const formSchemaStep3 = z.object({
    image_url: z.any(),
  });

  const stepSchemas = [formSchemaStep1, formSchemaStep2, formSchemaStep3];
  const formSchema = z.object({
    ...formSchemaStep1.shape,
    ...formSchemaStep2.shape,
    ...formSchemaStep3.shape,
  });

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
    resolver: zodResolver(stepSchemas[step]),
    defaultValues: {
      name: "",
      cpf_cnpj: "",
      email: "",
      phone: "",
      person_link: "",
      password: "",
      confirmation_password: "",
      cep: "",
      street: "",
      number: "",
      district: "",
      city: "",
      state: "",
      complement: "",
      image_url: "",
    },
  });

  const {
    watch,
    setValue,
    clearErrors,
    register,
    trigger,
    formState: { errors },
  } = form;

  const storeLink = watch("person_link");

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

  type FormSchemaType = z.infer<typeof formSchema>;

  type FormField = keyof FormSchemaType & string;

  const setCustomValue = (id: FormField, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleInputImage = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleStepChange = async (newStep: number) => {
    if (newStep > step + 1) {
      for (let i = step; i < newStep - 1; i++) {
        const fieldInfo: { step: number; fields: FormField[] | any }[] =
          requiredInfos;

        const currentStepInfo = fieldInfo.find((info) => info.step === i + 1);
        if (currentStepInfo) {
          const isValid = await trigger(currentStepInfo.fields);
          if (!isValid) {
            return;
          }
        }
      }
    }

    setStep(newStep - 1);
  };

  const onCancel = () => {
    router.push("/stock");
  };

  const onBack = () => {
    setStep((value) => Math.max(value - 1, 0));
  };

  const onNext = () => {
    setStep((value) => Math.min(value + 1, lengthSteps - 1));
  };

  const cep = watch("cep");

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (loading) return;
    setLoading(true);

    setFormData({
      ...formData,
      ...data,
    });

    if (step !== REGISTER_STORE_STEPS.ATTACHMENT) {
      setLoading(false);
      return onNext();
    }
    if (customerId) {
      const addressResponse: Address | undefined = await addressService.POST({
        cep: removeFormatting(formData.cep),
        street: formData.street,
        number: Number(formData.number),
        district: formData.district,
        city: formData.city,
        state: formData.state,
        complement: formData.complement,
      });
      if (addressResponse) {
        if (formData?.image_url) {
          await uploadService
            .POST({
              file: formData.image_url,
              folderName: formData.name,
            })
            .then(async (res: ReturnUpload | undefined) => {
              if (Array.isArray(res) && res.length > 0 && res[0].imageUrl) {
                await userService
                  .POST({
                    name: formData.name,
                    cpf_cnpj: removeFormatting(formData.cpf_cnpj),
                    email: formData.email,
                    phone: removeFormatting(formData.phone),
                    password: formData.password,
                    person_link: formData.person_link,
                    payer_id: customerId,
                    plan_id: planId,
                    image_url: res[0].imageUrl,
                    address_id: addressResponse.id,
                    user_type: 1,
                    status: "ACTIVE",
                    shipping_taxes: null,
                    shipping_type: null,
                    background_color: "#000",
                  })
                  .then((res) => {
                    setLoading(false);
                    toast.success("Loja cadastrada com sucesso");
                    router.push("/register/success");
                  })
                  .catch((err) => {
                    setLoading(false);
                    toast.error(err.message);
                  });
              }
            });
        } else {
          await userService
            .POST({
              name: formData.name,
              cpf_cnpj: removeFormatting(formData.cpf_cnpj),
              email: formData.email,
              phone: removeFormatting(formData.phone),
              password: formData.password,
              person_link: formData.person_link,
              payer_id: customerId,
              plan_id: planId,
              image_url: null,
              address_id: addressResponse.id,
              user_type: 1,
              status: "ACTIVE",
              shipping_taxes: null,
              shipping_type: null,
              background_color: "#000",
            })
            .then((res) => {
              setLoading(false);
              toast.success("Loja cadastrada com sucesso");
              form.reset();
              setStep(REGISTER_STORE_STEPS.BASIC_INFORMATION);
              router.push("/register/success");
            })
            .catch((err) => {
              setLoading(false);
              toast.error(err.message);
            });
        }
      }
    } else {
      setLoading(false);
      toast.error("Erro ao cadastrar loja");
    }

    //   router.push("/register/success");
  };

  let body;

  if (REGISTER_STORE_STEPS.BASIC_INFORMATION === step) {
    body = (
      <div>
        <h1 className="my-4 font-semibold text-green-primary text-xl mb-3">
          Dados da loja
        </h1>
        <div className="flex flex-col xl:flex-row mb-5">
          <div className="w-full mr-5 mb-5 xl:mb-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">
                    Nome da loja
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o nome da loja" {...field} />
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
                  <FormLabel className="text-blue-primary">CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={18}
                      className=""
                      placeholder="Insira o cpf/cnpj da loja"
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

        <div className="flex flex-col xl:flex-row mb-5">
          <div className="w-full mr-5 mb-5 xl:mb-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o e-mail da loja" {...field} />
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
                  <FormLabel className="text-blue-primary">Telefone</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={15}
                      className=""
                      placeholder="Insira o telefone da loja"
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
        <div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="person_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">
                    Informe o nome da sua loja tudo junto e sem acento
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Insira o link de sua loja"
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
          {storeLink !== "" && (
            <div className="mt-5 border border-solid border-green-primary p-1 rounded-lg">
              <h3>
                O link da sua loja vai ficar https://www.catalogoplace.com.br/
                {storeLink}
              </h3>
            </div>
          )}
        </div>

        <h1 className="my-4 font-semibold text-green-primary text-xl mb-3 mt-8">
          Sua conta
        </h1>

        <div className="flex flex-col xl:flex-row ">
          <div className="w-full mr-3 mb-5 xl:mb-0">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className=""
                      placeholder="Insira sua senha"
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
              name="confirmation_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">
                    Confirme sua senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita sua senha"
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
    );
  }

  if (REGISTER_STORE_STEPS.ADDRESS === step) {
    body = (
      <>
        <div>
          <h1 className="my-4 font-semibold text-green-primary text-xl mb-3">
            Informações de endereço
          </h1>
          <div className="flex flex-col xl:flex-row mb-5">
            <div className="w-full mr-5 mb-5 xl:mb-0">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-primary">CEP</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={9}
                        className=""
                        placeholder="Insira o seu CEP"
                        value={cepMask(field.value)}
                        onBlur={(e) => {
                          setCustomValue("cep", e.target.value);
                          getCep();
                        }}
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
                    <FormLabel className="text-blue-primary">Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira sua rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row mb-5">
            <div className="w-full mr-5 mb-5 xl:mb-0">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-primary">Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o número" {...field} />
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
                    <FormLabel className="text-blue-primary">Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o seu bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row mb-5">
            <div className="w-full mr-5 mb-5 xl:mb-0">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-primary">Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira sua cidade" {...field} />
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
                    <FormLabel className="text-blue-primary">Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira seu estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (REGISTER_STORE_STEPS.ATTACHMENT === step) {
    body = (
      <>
        <div>
          <h1 className="my-4 font-semibold text-green-primary text-xl mb-3">
            Informações adicionais
          </h1>
          <div>
            <div className="w-full mt-5 ">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="">
                    <FormLabel>Logo da Loja</FormLabel>

                    <div
                      onClick={handleInputImage}
                      className="relative border border-solid border-gray-200 p-12 rounded-lg flex justify-center items-center cursor-pointer min-h-[200px]"
                    >
                      <div className="flex flex-col justify-center items-center">
                        <div>
                          <IoCloudUploadOutline size={40} />
                        </div>
                        <div className="mt-4">
                          <h1>Clique para enviar ou arraste até aqui </h1>
                        </div>
                      </div>
                      <FormControl className="">
                        <Input
                          id="image_url"
                          className="cursor-pointer"
                          style={{
                            display: "none",
                          }}
                          {...fieldProps}
                          ref={inputFileRef}
                          content="Selecione um arquivo"
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
                        <>
                          <div
                            className="absolute -top-9 right-0 cursor-pointer z-[9999]"
                            onClick={handleDeleteFile}
                          >
                            <TiDelete color="red" size={24} />
                          </div>

                          {filePreview.startsWith("data:image") ? (
                            <Image
                              className="w-full h-full object-contain"
                              src={filePreview}
                              alt="Preview"
                              fill
                            />
                          ) : (
                            <p>Arquivo selecionado: {filePreview}</p>
                          )}
                        </>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="min-h-screen h-full w-full flex justify-center items-center ">
      <div className=" w-[60%] h-screen hidden xl:block">
        <Image
          className="h-full object-cover object-left"
          src="/images/background-register.png"
          alt="Banner de cadastro"
          width={1666}
          height={1080}
          objectFit="cover"
          objectPosition="right"
        />
      </div>
      <div className="w-[95%] xl:w-1/2  shadow-xl bg-white px-6 py-12 h-screen overflow-auto">
        <div className="">
          {/* <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Logo do Catálogo Place"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </div> */}
          <StepByStep
            numSteps={lengthSteps}
            actualStep={actualStep}
            onStepChange={handleStepChange}
          />
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <>
                  {body}
                  <div className="flex flex-row w-full justify-center mt-16">
                    <Button
                      onClick={() => {
                        step === REGISTER_STORE_STEPS.BASIC_INFORMATION
                          ? onCancel()
                          : onBack();
                      }}
                      size="lg"
                      className="w-[50%] md:w-[30%] text-lg"
                      type="button"
                      variant={"outline"}
                    >
                      {primaryLabelButton}
                    </Button>
                    <Button
                      size="lg"
                      className={`w-[50%] md:w-[30%] text-lg ml-6 ${
                        loading && "cursor-not-allowed"
                      }`}
                      type="submit"
                      variant={"default"}
                    >
                      {loading ? <Loader color="#fff" /> : secondaryLabelButton}
                    </Button>
                  </div>
                </>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
