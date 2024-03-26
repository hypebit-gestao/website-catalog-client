import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Button } from "../ui/button";
import Link from "next/link";

const Plans = () => {
  return (
    <section
      id="plans"
      className="min-h-screen w-full flex flex-col items-center py-12 px-8 bg-white"
    >
      <div className="">
        <h3 className="text-green-primary text-4xl 2xl:text-6xl">Planos</h3>
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-12 gap-y-3">
        <div className="p-8 rounded-xl border border-gray-200 mt-12 ">
          <h1 className="uppercase text-xl text-center">Plano</h1>
          <h1 className="text-4xl uppercase text-green-primary text-center">
            Standard
          </h1>
          <div className="my-6">
            <h1 className="text-green-secondary text-xl text-center">
              <span className="font-bold text-green-primary">Investimento</span>{" "}
              de R$ <span className="text-4xl font-bold">49,90</span>/mês
            </h1>
          </div>
          <hr />
          <div className="mt-6">
            <ul>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Cadastre até 1000 produtos</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Pedidos no Whatsapp</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Gerenciamento de pedidos</h1>
              </li>

              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Configuração de frete</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Personalização da loja</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <div>
                  <FaCircleCheck size={24} className="text-green-primary" />
                </div>
                <h1 className="text-xl ml-4">Variações de produtos</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Suporte no Whatsapp</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleXmark size={24} className="text-red-500" />
                <h1 className="text-xl ml-4">Cupons de desconto</h1>
              </li>
              <li className="">
                <div className="flex flex-row items-center">
                  <div>
                    <FaCircleXmark size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h1 className="text-xl ml-4">
                      Integração com Google Analytics e Pixel
                    </h1>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Link
            target="_blank"
            href="https://buy.stripe.com/4gw29t3vCaZJ57W000"
          >
            <div className="flex justify-center mt-12">
              <Button
                size="xl"
                className="text-xl bg-green-primary w-[70%]"
                type="submit"
              >
                Começe agora
              </Button>
            </div>
          </Link>
        </div>
        <div className="p-8 rounded-xl border border-gray-200 mt-12 ">
          <h1 className="uppercase text-xl text-center">Plano</h1>
          <h1 className="text-4xl uppercase text-green-primary text-center">
            Professional
          </h1>
          <div className="my-6">
            <h1 className="text-green-secondary text-xl text-center">
              <span className="font-bold text-green-primary">Investimento</span>{" "}
              de R$ <span className="text-4xl font-bold">99,90</span>/mês
            </h1>
          </div>
          <hr />
          <div className="mt-6">
            <ul>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Cadastro ilimitado de produtos</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Pedidos no Whatsapp</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Gerenciamento de pedidos</h1>
              </li>

              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Configuração de frete</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Personalização da loja</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <div>
                  <FaCircleCheck size={24} className="text-green-primary" />
                </div>
                <h1 className="text-xl ml-4">Variações de produtos</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Suporte no Whatsapp</h1>
              </li>
              <li className="flex flex-row items-center mb-4">
                <FaCircleCheck size={24} className="text-green-primary" />
                <h1 className="text-xl ml-4">Cupons de desconto</h1>
              </li>
              <li className="">
                <div className="flex flex-row items-center">
                  <div>
                    <FaCircleCheck size={24} className="text-green-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl ml-4">
                      Integração com Google Analytics e Pixel
                    </h1>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <Link
            target="_blank"
            href="https://buy.stripe.com/9AQ5lFd6c4Bl7g44gk"
          >
            <div className="flex justify-center mt-12">
              <Button
                size="xl"
                className="text-xl bg-green-primary w-[70%]"
                type="submit"
              >
                Começe agora
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Plans;
