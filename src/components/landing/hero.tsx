import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import img from "../../../public/images/cellphone.png";
import img_full from "../../../public/images/mockup-hero.png";
import Link from "next/link";
import { Link as LinkScroll } from "react-scroll";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen h-full w-full flex flex-col bg-white "
    >
      <div className="px-8 2xl:px-24 flex flex-row items-center justify-center 2xl:justify-start min-h-screen -mt-12">
        <div className="h-full w-full 2xl:w-[60%]">
          <div className="w-full 2xl:w-[90%]">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              <h1 className="text-[50px] 2xl:text-[70px] text-center 2xl:text-start">
                Vender seus{" "}
                <span className="text-green-primary font-bold"> produtos</span>{" "}
                nunca foi tão fácil
              </h1>
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              <div className="w-full 2xl:w-full">
                <p className="mt-8 text-xl text-center 2xl:text-start">
                  Receba os pedidos da sua loja no WhatsApp e construa uma
                  relação mais humanizada com seus clientes. 😍
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
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
            </motion.div>
          </div>
        </div>
        <div className="w-[60%] hidden h-full xl:flex justify-center 2xl:ml-0  ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative "
          >
            <Image
              className="  w-full h-full"
              src={img_full}
              alt="Picture of the author"
              width={1200}
              height={1200}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
