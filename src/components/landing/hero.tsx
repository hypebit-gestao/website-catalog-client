import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import img from "../../../public/images/cellphone.png";
import img_full from "../../../public/images/full.png";

const Hero = () => {
  return (
    <section className="min-h-screen h-full w-full  flex flex-col">
      <div className=" px-12 2xl:px-44 flex flex-row items-center justify-center 2xl:justify-start min-h-screen ">
        <div className="max-w-full 2xl:max-w-[50%] h-full  ">
          <div className="max-w-full 2xl:max-w-[90%]">
            <h1 className="text-[40px] 2xl:text-[60px] text-center 2xl:text-start">
              Criar seu{" "}
              <span className="text-green-primary font-bold">
                catálogo digital
              </span>{" "}
              é super simples!
            </h1>
            <div className="mt-12">
              <div className="flex flex-col">
                <div className="flex flex-row items-center justify-center 2xl:justify-start">
                  <FaCircleCheck size={32} className="text-green-primary" />
                  <h1 className="text-2xl ml-4 ">Fique livre de taxas</h1>
                </div>
                <div className="flex flex-row items-center justify-center 2xl:justify-start mt-8">
                  <FaCircleCheck size={32} className="text-green-primary" />
                  <h1 className="text-2xl ml-4 ">
                    Controle simplificado de suas vendas
                  </h1>
                </div>
                <div className="flex flex-row items-center mt-8 justify-center 2xl:justify-start">
                  <FaCircleCheck size={32} className="text-green-primary" />
                  <h1 className="text-2xl ml-4 ">
                    Modernização do seu negócio
                  </h1>
                </div>
              </div>
            </div>
            <p className="mt-12 text-xl text-center 2xl:text-start">
              Receba os pedidos da sua loja no WhatsApp e construa uma relação
              mais humanizada com seus clientes. 😍
            </p>
            <div className="mt-12 flex flex-row items-center justify-center 2xl:justify-start">
              <Button
                size="2xl"
                className=" text-xl mr-4"
                type="submit"
                variant={"default"}
              >
                Comecar agora
              </Button>
              <Button
                size="2xl"
                className=" text-xl"
                type="submit"
                variant={"outline"}
              >
                Como funciona
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[50%] hidden h-full 2xl:flex justify-center ml-24 2xl:ml-0">
          <div className="relative shadow-lg">
            <Image
              className=""
              src={img_full}
              alt="Picture of the author"
              width={1000}
              height={1000}
            />
            <div className="absolute right-12 2xl:-top-24 h-[300px] w-[300px] 2xl:w-[380px] 2xl:h-[380px] 3xl:w-[400px] 3xl:h-[400px]  ">
              <Image
                className=""
                src={img}
                alt="Picture of the author"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
