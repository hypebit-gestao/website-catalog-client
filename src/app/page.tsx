"use client";

import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

export default function Home() {
  initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d");

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
    return new Promise((resolve, reject) => {
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
        .then((response) => {
          // receber o resultado do pagamento
          // resolve();
        })
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject();
        });
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
    <main className="flex justify-center items-center min-h-screen w-full bg-green-primary">
      <div className="text-2xl text-white">CADASTRE SUA LOJA CONOSCO</div>
      <CardPayment
        customization={customization}
        initialization={initialization}
        onSubmit={onSubmit as any}
        onReady={onReady}
        onError={onError}
      />
    </main>
  );
}
