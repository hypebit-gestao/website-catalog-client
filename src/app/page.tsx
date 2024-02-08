"use client";

import PaymentModal from "@/components/payment-modal";
import { useMercadoPagoService } from "@/services/mercadopago.service";
import usePaymentModal from "@/utils/hooks/use-payment-modal";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { useState } from "react";

export default function Home() {
  initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d");
  const paymentModal = usePaymentModal();
  const [card, setCard] = useState();
  const mercadoPagoService = useMercadoPagoService();

  const initialization = {
    amount: 2,
  };

  const customization = {
    paymentMethods: {
      minInstallments: 1,
      maxInstallments: 1,
    },
  };

  const onSubmit = async (formData: any) => {
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
          // resolve();
          resolve(response);
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });
      if (formData?.token) {
        try {
          const response = await fetch(
            "https://api.mercadopago.com/preapproval",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Se necessário, adicione outros cabeçalhos aqui
              },
              body: JSON.stringify({
                back_url: "https://www.mercadopago.com.br",
                card_token_id: formData.token,
                external_reference: "YG-1231",
                payer_email: formData?.payer?.email,
                preapproval_plan_id: "2c9380848d698da5018d8605014114a6",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Falha ao processar pagamento");
          }

          const responseData = await response.json();
          console.log("Resposta do MercadoPago:", responseData);

          // Aqui você pode fazer algo com a resposta, se necessário
        } catch (error) {
          console.error("Erro ao processar pagamento:", error);
          // Lidar com o erro, se necessário
        }
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
      </main>
    </>
  );
}
