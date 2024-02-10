"use client";

import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Payment, initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d", {
    locale: "pt-BR",
  });
  const [paymentId, setPaymentId] = useState();
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
    const handleMessage = (event: any) => {
      console.log("EVENT: ", event);
      if (event.data && event.data.status === "COMPLETE") {
        window.location.href = "https://www.exemplo.com";
      }
    };

    // Adiciona o listener para escutar mensagens postadas
    window.addEventListener("message", handleMessage);

    // Remove o listener quando o componente é desmontado para evitar vazamento de memória
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [pathname]);

  const onSubmit = async ({ formData }: any) => {
    // callback chamado ao clicar no botão de submissão dos dados
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
          resolve(response) as any;
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });

      if (formData?.token) {
        await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer APP_USR-4713727283011042-112717-6fc1bcca6957327267771b618a6b1dec-1567253255",
          },
          body: JSON.stringify({
            description: "Pagamento teste",
            installments: 1,
            issuer_id: formData?.issuer_id,
            payer: {
              email: "rafacesar0070@gmail.com",
            },
            payment_method_id: "master",
            token: formData?.token,
            transaction_amount: 1,
            three_d_secure_mode: "optional",
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (data?.three_ds_info) {
              setPaymentId(data.id);
              // Iniciar o desafio 3DS
              start3DSChallenge(
                data.three_ds_info.external_resource_url,
                data.three_ds_info.creq
              );
            }
          })
          .catch((error) => {
            console.error("Erro ao criar pagamento:", error);
          });
      }
    });
  };

  const checkPaymentStatus = async (paymentId: any) => {
    try {
      const response = await fetch(
        "https://api.mercadopago.com/v1/payments/${paymentId}",
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer APP_USR-4713727283011042-112717-6fc1bcca6957327267771b618a6b1dec-1567253255", // Substitua pelo seu token de acesso do Mercado Pago
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter detalhes do pagamento");
      }

      const paymentDetails = await response.json();
      return paymentDetails.status;
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      // Trate aqui o erro de solicitação ou qualquer outro erro que possa ocorrer ao verificar o status do pagamento
      return "error";
    }
  };

  const start3DSChallenge = (externalResourceUrl: any, creq: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = externalResourceUrl;
    form.style.display = "none";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "creq";
    input.value = creq;
    form.appendChild(input);
    document.body.appendChild(form);
    form.addEventListener("submit", async () => {
      console.log("Formulário submetido");

      // Aguarda a conclusão do pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2 segundos (ajuste conforme necessário)

      // Verifica o status do pagamento
      const paymentStatus = await checkPaymentStatus(paymentId); // Implemente a função para verificar o status do pagamento

      if (paymentStatus === "approved") {
        console.log("Pagamento aprovado!");
        setShowStatus(true);
        // Redireciona para a página de sucesso
        router.push("/");
      } else {
        console.log("Pagamento não aprovado.");
        // Trate aqui o caso em que o pagamento não foi aprovado
      }
    });
    form.submit();
  };

  console.log("SHowStatus: ", showStatus);

  return (
    <main>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
      />
    </main>
  );
}
