import React from "react";
import { FaWhatsapp, FaCubes, FaTruck } from "react-icons/fa";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineRequestPage,
  MdDesignServices,
  MdDiscount,
} from "react-icons/md";
import { AiFillNotification } from "react-icons/ai";

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen w-full flex flex-col py-24 bg-[#F9F9F9]"
    >
      <div className=" px-8 2xl:px-44 mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8 w-full">
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <FaWhatsapp size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Pedidos no Whatsapp
              </h1>
            </div>
            <p className="text-md">
              Receba todos seus pedidos diretamente no WhatsApp.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <MdOutlineProductionQuantityLimits
                size={36}
                className="text-green-primary"
              />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Gerenciamento de Produtos
              </h1>
            </div>
            <p className="text-md">
              Gerencie seus produtos com poucos cliques.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <MdOutlineRequestPage size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Gerenciamento de Pedidos
              </h1>
            </div>
            <p className="text-md">
              Visualize todos os pedidos de forma simples e rápida
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <MdDesignServices size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Personalização de sua loja
              </h1>
            </div>
            <p className="text-md">Personalize o tema da sua loja.</p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <FaCubes size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Produtos com variações
              </h1>
            </div>
            <p className="text-md">
              Adicione informações personalizadas em seu produto: cores,
              tamanhos...
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <MdDiscount size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Cupons de desconto
              </h1>
            </div>
            <p className="text-md">
              Crie cupons de desconto para seus clientes.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <FaTruck size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">Frete</h1>
            </div>
            <p className="text-md">
              Configure o frete de acordo com a sua necessidade.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-12">
            <div className="flex flex-col">
              <AiFillNotification size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Ferramentas de marketing
              </h1>
            </div>
            <p className="text-md">
              Utilize nossas ferramentas de marketing para aumentar suas vendas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
