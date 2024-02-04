"use client";

import { useMercadoPagoService } from "@/services/mercadopago.service";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { useState } from "react";

export default function Home() {
  initMercadoPago("APP_USR-52b7b05a-4c58-432b-9f60-41cccc75369d");
  const mercadoPagoService = useMercadoPagoService();
  const [preferenceId, setPreferenceId] = useState();

  const obj = {
    items: [
      {
        title: "Assinatura Mensal",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 40.0,
      },
    ],
    subscription: {
      transaction_amount: 40.0,
      frequency: 1,
      frequency_type: "months",
    },
  };

  const createPreference = async () => {
    await mercadoPagoService
      .POSTPREFERENCE(obj)
      .then((res) => setPreferenceId(res.id));
  };

  console.log("Preference ID: ", preferenceId);

  return (
    <main className="flex justify-center items-center min-h-screen w-full bg-green-primary">
      <div className="text-2xl text-white">CADASTRE SUA LOJA CONOSCO</div>
      <div>
        <button
          onClick={() => createPreference()}
          className="p-4 rounded-md bg-blue-600"
        >
          Pagar
        </button>
      </div>
      {preferenceId && (
        <div id="wallet_container">
          <Wallet
            initialization={{ preferenceId: preferenceId as any }}
            customization={{ texts: { valueProp: "smart_option" } }}
          />
        </div>
      )}
    </main>
  );
}
