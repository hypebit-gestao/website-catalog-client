import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import { Link as LinkScroll } from "react-scroll";
import { motion } from "framer-motion";

const Pitch = () => {
  return (
    <section
      id="pitch"
      className="w-full h-full min-h-screen flex flex-col items-center pt-6 bg-[#F9F9F9]"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=" px-8 2xl:px-44 mt-6"
      >
        <div className="h-full w-full 2xl:w-[60%]">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full 2xl:w-[90%]"
          >
            <motion.div
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              <h1 className="text-[40px] 2xl:text-[50px] text-center  2xl:text-start text-green-secondary">
                Vender com o Catálogo Place é muito mais{" "}
                <span className="text-green-primary font-bold">tranquilo</span>
              </h1>
            </motion.div>
            <motion.div
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="flex flex-col mt-8 "
            >
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.5, delay: 0.1 }}
                className="flex flex-row items-center  2xl:justify-start"
              >
                <div>
                  <FaCircleCheck size={32} className="text-green-primary" />
                </div>
                <div>
                  <h1 className="text-2xl ml-4 ">
                    Livre-se do uso de catálogos via PDF
                  </h1>
                </div>
              </motion.div>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.5, delay: 0.2 }}
                className="flex flex-row items-center  2xl:justify-start mt-8 "
              >
                <div>
                  <FaCircleCheck size={32} className="text-green-primary" />
                </div>
                <div>
                  <h1 className="text-2xl ml-4 ">Fique livre de taxas</h1>
                </div>
              </motion.div>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.5, delay: 0.3 }}
                className="flex flex-row items-center  2xl:justify-start mt-8"
              >
                <div>
                  <FaCircleCheck size={32} className="text-green-primary" />
                </div>
                <div>
                  <h1 className="text-2xl ml-4 ">
                    Controle simplificado de suas vendas
                  </h1>
                </div>
              </motion.div>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.5, delay: 0.4 }}
                className="flex flex-row items-center mt-8  2xl:justify-start"
              >
                <div>
                  <FaCircleCheck size={32} className="text-green-primary" />
                </div>
                <div>
                  <h1 className="text-2xl ml-4 ">
                    Modernização do seu negócio
                  </h1>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="mt-12 flex 2xl:justify-start  w-full"
          >
            <LinkScroll
              className="w-full"
              to="plans"
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              <Button
                size="2xl"
                className=" text-xl bg-green-primary w-full lg:w-[50%]"
                type="submit"
                variant={"default"}
              >
                Comecar agora
              </Button>
            </LinkScroll>
          </motion.div>
        </div>

        <div className="w-[40%] hidden h-full 2xl:flex justify-center ml-24 2xl:ml-0">
          <div className="relative shadow-lg">
            {/* <Image
              className=""
              src={img_full}
              alt="Picture of the author"
              width={1000}
              height={1000}
            /> */}
            <div className="absolute right-12 2xl:-top-24 h-[300px] w-[300px]   ">
              {/* <Image
                className=""
                src={img}
                alt="Picture of the author"
                width={600}
                height={600}
              /> */}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Pitch;
