import React from "react";
import { FaWhatsapp, FaCubes, FaTruck } from "react-icons/fa";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineRequestPage,
  MdDesignServices,
  MdDiscount,
} from "react-icons/md";
import { AiFillNotification } from "react-icons/ai";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen w-full flex flex-col pt-36 pb-24 bg-[#F9F9F9]"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=" px-8 2xl:px-24 mt-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8 w-full">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
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
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
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
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
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
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
            <div className="flex flex-col">
              <MdDesignServices size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Personalização de sua loja
              </h1>
            </div>
            <p className="text-md">Personalize o tema da sua loja.</p>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
            <div className="flex flex-col">
              <FaCubes size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Produtos com variações
              </h1>
            </div>
            <p className="text-md">
              Adicione informações personalizadas de tamanho em seu produto
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
            <div className="flex flex-col">
              <MdDiscount size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">
                Desconto por método de pagamento
              </h1>
            </div>
            <p className="text-md">
              Crie descontos para seus clientes de acordo com o método de
              pagamento selecionado na compra
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
            <div className="flex flex-col">
              <FaTruck size={36} className="text-green-primary" />
            </div>
            <div className="my-4">
              <h1 className="text-2xl text-green-primary font-bold">Frete</h1>
            </div>
            <p className="text-md">
              Configure o frete de acordo com a sua necessidade.
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="rounded-xl border border-gray-200 px-6 py-12"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
