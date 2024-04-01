import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Button } from "../ui/button";
import Link from "next/link";
import FaqItem from "../faq-item";
import { motion } from "framer-motion";

const Faq = () => {
  return (
    <section
      id="faq"
      className="px-8 w-full flex flex-col items-center pt-12 pb-20 2xl:pb-32 bg-[#F9F9F9] "
    >
      <div className="">
        <h3 className="text-green-primary text-4xl 2xl:text-6xl">
          Dúvidas frequentes
        </h3>
      </div>

      <div className="mt-12  w-full">
        <FaqItem
          name="Como irei receber os pedidos feitos em minha loja?"
          description="Seus pedidos serão enviados diretamente para o WhatsApp de sua empresa, onde você poderá gerenciá-los de forma rápida e eficiente. Isso permite que você mantenha um contato direto com seus clientes e forneça um atendimento personalizado, aumentando a satisfação e fidelidade dos mesmos."
        />
        {/* <FaqItem
          name="É possível personalizar a aparência do meu catálogo?"
          description="Sim, oferecemos uma variedade de opções de personalização para garantir que seu catálogo reflita a identidade visual de sua marca."
        /> */}
        <FaqItem
          name="É necessário baixar algum aplicativo para utilizar o Catálogo Place?"
          description="Não, o Catálogo Place é uma plataforma web que pode ser acessada diretamente de seu navegador, sem a necessidade de baixar ou instalar qualquer aplicativo adicional."
        />
        <FaqItem
          name="Como vou conseguir gerenciar meu catálogo de produtos?"
          description="Ao criar sua conta no Catálogo Place, você terá acesso a um painel de controle intuitivo e fácil de usar, onde poderá gerenciar sua loja."
        />
        <FaqItem
          name="É cobrado taxa de comissão sobre as vendas realizadas?"
          description="Não, o Catálogo Place não cobra nenhuma taxa de comissão sobre as vendas realizadas em sua loja. Você receberá o valor integral de cada venda, sem descontos ou taxas adicionais."
        />
        <FaqItem
          name="Como irei receber os pagamentos das vendas realizadas?"
          description="O Catálogo Place tem como objetivo facilitar a apresentação de seus produtos e comunicação com seus clientes. Os pagamentos das vendas realizadas são feitos diretamente entre você e seus clientes através do WhatsApp, sem a necessidade de intermediários ou taxas adicionais."
        />
      </div>
    </section>
  );
};

export default Faq;
