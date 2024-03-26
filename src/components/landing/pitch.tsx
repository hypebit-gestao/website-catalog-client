import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import { Link as LinkScroll } from "react-scroll";

const Pitch = () => {
  return (
    <section className="w-full flex flex-col pt-6 bg-[#F9F9F9]">
      <div className=" px-12 2xl:px-44 mt-6">
        <div className="h-full w-full 2xl:w-[60%]">
          <div className="w-full 2xl:w-[90%]">
            <h1 className="text-[40px] 2xl:text-[50px] text-center  2xl:text-start text-green-secondary">
              Vender com o Catálogo Place é muito mais{" "}
              <span className="text-green-primary font-bold">tranquilo</span>
            </h1>
            <div className="mt-8">
              <div className="flex flex-col  ">
                <div className="flex flex-row items-center  2xl:justify-start">
                  <div>
                    <FaCircleCheck size={32} className="text-green-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl ml-4 ">
                      Livre-se do uso de catálogos via PDF
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row items-center  2xl:justify-start mt-8 ">
                  <div>
                    <FaCircleCheck size={32} className="text-green-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl ml-4 ">Fique livre de taxas</h1>
                  </div>
                </div>
                <div className="flex flex-row items-center  2xl:justify-start mt-8">
                  <div>
                    <FaCircleCheck size={32} className="text-green-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl ml-4 ">
                      Controle simplificado de suas vendas
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row items-center mt-8  2xl:justify-start">
                  <div>
                    <FaCircleCheck size={32} className="text-green-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl ml-4 ">
                      Modernização do seu negócio
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex 2xl:justify-start  w-full">
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
                className=" text-xl bg-green-primary w-full"
                type="submit"
                variant={"default"}
              >
                Comecar agora
              </Button>
            </LinkScroll>
          </div>
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
      </div>
    </section>
  );
};

export default Pitch;
