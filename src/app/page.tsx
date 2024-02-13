"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Payment, initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaCheck } from "react-icons/fa";

export default function Home() {
  const [paymentId, setPaymentId] = useState();
  const [formData, setFormData] = useState<any>();
  const pathname = usePathname();
  const router = useRouter();
  const initialization = {
    amount: 1,
    payer: {
      firstName: "",
      lastName: "",
      email: "",
    },
  };

  const customization: any = {
    visual: {
      style: {
        theme: "default",
      },
    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      atm: "all",
      bankTransfer: "all",
      maxInstallments: 1,
    },
  };

  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Inicialize o Mercado Pago com sua chave pública
    initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d", {
      locale: "pt-BR",
    });
  }, []);

  if (typeof window !== "undefined") {
    let congratsOpened = false; // Variável para controlar se a página de congrats já foi aberta

    const openCongrats = async () => {
      if (!congratsOpened) {
        router.push("/congrats"); // Redireciona para a página de congrats
        congratsOpened = true; // Define que a página de congrats foi aberta
        window.removeEventListener("message", handleMessage);
      }
    };

    const handleMessage = (e: any) => {
      if (e.data.status === "COMPLETE") {
        openCongrats();
      }
    };

    window.addEventListener("message", handleMessage);
  }

  const onSubmit = async ({ formData }: any) => {
    // callback chamado ao clicar no botão de submissão dos dados
    return new Promise(async (resolve, reject) => {
      await fetch(
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
          resolve(response) as any;
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });

      // if (formData?.token) {
      //   await fetch("https://api.mercadopago.com/v1/payments", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization:
      //         "Bearer APP_USR-4713727283011042-112717-6fc1bcca6957327267771b618a6b1dec-1567253255",
      //     },
      //     body: JSON.stringify({
      //       description: "Pagamento teste",
      //       installments: 1,
      //       issuer_id: formData?.issuer_id,
      //       payer: {
      //         email: "rafacesar0070@gmail.com",
      //       },
      //       payment_method_id: "master",
      //       token: formData?.token,
      //       transaction_amount: 1,
      //       three_d_secure_mode: "optional",
      //     }),
      //   })
      //     .then(async (res: any) => {
      //       setFormData(formData);

      //       const data = await res.json();
      //       if (data?.three_ds_info) {
      //         setPaymentId(data.id);
      //         // Iniciar o desafio 3DS
      //         start3DSChallenge(
      //           data.three_ds_info.external_resource_url,
      //           data.three_ds_info.creq
      //         );
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("Erro ao criar pagamento:", error);
      //     });
      // }
    });
  };

  const start3DSChallenge = (externalResourceUrl: any, creq: any) => {
    try {
      const iframe: any = document.createElement("iframe");
      iframe.name = "myframe";
      iframe.id = "myframe";
      document.body.appendChild(iframe);

      const idocument = iframe.contentWindow.document;

      const myform = idocument.createElement("form");
      myform.name = "myform";
      myform.setAttribute("target", "myframe");
      myform.setAttribute("method", "post");
      myform.setAttribute("action", externalResourceUrl);

      const hiddenField = idocument.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", "creq");
      hiddenField.setAttribute("value", creq);
      myform.appendChild(hiddenField);
      iframe.appendChild(myform);

      myform.submit();
    } catch (error) {
      console.log(error);
      alert("Error doing Challenge, try again later.");
    }
  };

  console.log("FormDataaa: ", formData);

  return (
    <main>
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
          className=" min-h-screen h-full flex flex-col  items-center bg-green-secondary"
        >
          <div className="mt-12 h-full">
            <h1 className=" text-[60px] font-bold text-white">
              Planos do <span className="">CatalogoPlace</span>
            </h1>
            <div className=" shadow-xl rounded-lg flex flex-col items-center bg-white my-12 ">
              <div className="bg-white p-8 ">
                <h1 className="text-4xl font-bold text-green-secondary text-center">
                  STARTER
                </h1>
                <p className="text-green-primary text-lg my-2 text-center">
                  O plano que cabe no seu orçamento!
                </p>
                <h2 className="text-4xl text-center text-black font-bold">
                  por <span className="text-[40px]">R$40,00</span>/mês
                </h2>
                <div className="flex flex-coll justify-center mt-6">
                  <ul>
                    <li className="flex flex-row items-center mb-4">
                      <FaCheck className="text-xl text-green-secondary" />
                      <span className="ml-3">
                        Recebimento do pedido no WhatsApp
                      </span>
                    </li>
                    <li className="flex flex-row items-center mb-4">
                      <FaCheck className="text-xl text-green-secondary" />
                      <span className="ml-3">
                        Cadastro de produtos ilimitados
                      </span>
                    </li>
                    <li className="flex flex-row items-center mb-4">
                      <FaCheck className="text-xl text-green-secondary" />
                      <span className="ml-3">Pedidos ilimitados</span>
                    </li>
                    <li className="flex flex-row items-center">
                      <FaCheck className="text-xl text-green-secondary" />
                      <span className="ml-3">Controle de pedidos</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() =>
                      router.push("https://buy.stripe.com/8wM4im0kA07icFi9AE")
                    }
                    className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-96 p-6 text-2xl text-center"
                    size={"lg"}
                  >
                    Começar agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
