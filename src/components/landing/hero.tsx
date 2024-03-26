import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import img from "../../../public/images/cellphone.png";
import img_full from "../../../public/images/full.png";
import Link from "next/link";
import { Link as LinkScroll } from "react-scroll";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen h-full w-full flex flex-col bg-white "
    >
      <div className="px-8 2xl:px-44 flex flex-row items-center justify-center 2xl:justify-start min-h-screen -mt-12">
        <div className="h-full w-full 2xl:w-[60%]">
          <div className="w-full 2xl:w-[90%]">
            <h1 className="text-[50px] 2xl:text-[70px] text-center 2xl:text-start">
              Vender seus{" "}
              <span className="text-green-primary font-bold"> produtos</span>{" "}
              nunca foi tão fácil
            </h1>
            <div className="w-full 2xl:w-[80%]">
              <p className="mt-8 text-xl text-center 2xl:text-start">
                Receba os pedidos da sua loja no WhatsApp e construa uma relação
                mais humanizada com seus clientes. 😍
              </p>
            </div>
            <div className=" w-full mt-12 flex flex-row items-center justify-center 2xl:justify-start">
              <LinkScroll
                to="plans"
                spy={true}
                smooth={true}
                offset={0}
                duration={700}
              >
                <Button
                  size="2xl"
                  className=" text-xl bg-green-primary"
                  type="submit"
                  variant={"default"}
                >
                  Comecar agora
                </Button>
              </LinkScroll>
              {/* <Button
                size="2xl"
                className=" text-xl"
                type="submit"
                variant={"outline"}
              >
                Como funciona
              </Button> */}
            </div>
          </div>
        </div>
        <div className="w-[40%] hidden h-full 2xl:flex justify-center ml-24 2xl:ml-0">
          <div className="relative shadow-lg">
            <Image
              className=""
              src={img_full}
              alt="Picture of the author"
              width={1000}
              height={1000}
            />
            <div className="absolute right-12 2xl:-top-24 h-[300px] w-[300px]   ">
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
