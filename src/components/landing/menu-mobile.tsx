import {
  RiWhatsappFill,
  RiInstagramFill,
  RiLinkedinFill,
} from "react-icons/ri";
import LinkNext from "next/link";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-scroll";
import Image from "next/image";
import useMenu from "@/utils/hooks/use-menu";

const MenuMobile = () => {
  const menu = useMenu();

  return (
    <div className="z-50 fixed inset-0 bg-white  w-full min-h-screen  transition-all duration-700 animate-in slide-in-from-left flex flex-col items-center justify-center text-center">
      <div className="absolute top-4 right-4 text-black">
        <AiOutlineClose
          onClick={() => menu.onClose()}
          className="text-blue-primary text-5xl cursor-pointer"
        />
      </div>
      <ul className="flex flex-col  w-full py-12 mb-24">
        <Link
          onClick={() => menu.onClose()}
          to="plans"
          spy={true}
          smooth={true}
          offset={0}
          duration={700}
        >
          <li className="text-green-primary  mb-4 text-3xl  transition-all duration-500 cursor-pointer  py-3">
            Planos
          </li>
        </Link>
        <Link
          onClick={() => menu.onClose()}
          to="features"
          spy={true}
          smooth={true}
          offset={0}
          duration={700}
        >
          <li className="text-green-primary   mb-4 text-3xl  transition-all duration-500 cursor-pointer  py-3">
            Recursos
          </li>
        </Link>
        <Link
          onClick={() => menu.onClose()}
          to="faq"
          spy={true}
          smooth={true}
          offset={0}
          duration={700}
        >
          <li className="text-green-primary text-3xl  transition-all duration-500 cursor-pointer  py-3">
            Dúvidas Frequentes
          </li>
        </Link>
      </ul>

      <div className="absolute top-3 left-7">
        <Image alt="logo" src="/images/logo-dark.png" width={80} height={10} />
      </div>

      <div className="">
        <div className="flex flex-col">
          <h1 className="text-black  text-2xl mb-12 hover:text-green-primary transition-all duration-500 cursor-pointer">
            <a href="mailto:hypebitcontato@gmail.com.br">
              catalogoplace@gmail.com
            </a>
          </h1>
          <div className="flex justify-center">
            <LinkNext
              href="https://instagram.com/catalogoplace"
              target="_blank"
            >
              <div className="bg-green-primary rounded-full p-2 mr-5 cursor-pointer hover:bg-green-secondary text-white  hover:text-white  transition-all duration-500">
                <RiInstagramFill className="text-3xl" />
              </div>
            </LinkNext>
            <LinkNext href="https://wa.me/5537999314716" target="_blank">
              <div className="bg-green-primary rounded-full p-2 mr-5 cursor-pointer hover:bg-green-secondary text-white  hover:text-white  transition-all duration-500">
                <RiWhatsappFill className="text-3xl" />
              </div>
            </LinkNext>
            <div className="bg-green-primary rounded-full p-2 cursor-pointer hover:bg-green-secondary text-white  hover:text-white  transition-all duration-500">
              <RiLinkedinFill className="text-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuMobile;
