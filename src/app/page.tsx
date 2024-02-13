"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Payment, initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaCheck } from "react-icons/fa";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();

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
            <Link href={"https://wa.me/5516996177828"} target="_blank">
              <div className="mt-8 text-center">
                <Button
                  className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-64 p-6 text-2xl"
                  size={"lg"}
                >
                  Acesse já
                </Button>
              </div>
            </Link>
          </div>
          <div></div>
        </section>

        <section
          id="plans"
          className=" min-h-screen h-full flex flex-col justify-center  items-center bg-green-secondary"
        >
          <div className="mt-12 h-full">
            <h1 className=" text-[60px] font-bold text-white ">
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
                  por <span className="text-[40px]">R$50,00</span>/mês
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
