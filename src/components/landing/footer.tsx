"use client";

import { Girassol } from "next/font/google";
import Image from "next/image";
import { Link } from "react-scroll";
import LinkNext from "next/link";
import React from "react";
import { MdEmail, MdExpandMore } from "react-icons/md";
import {
  RiWhatsappFill,
  RiInstagramFill,
  RiLinkedinFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-white  h-full relative w-full px-8 lg:px-16 xl:px-24 flex pt-16 pb-16 ">
      <div className="flex flex-col lg:flex-row xl:flex-row w-full  ">
        <div className="flex-col w-full">
          <div className="flex flex-row items-center">
            <div className="cursor-pointer mr-2  -ml-8">
              <Link
                to="hero"
                spy={true}
                smooth={true}
                offset={0}
                duration={700}
              >
                <Image
                  src="/images/logo-dark.png"
                  width={90}
                  height={90}
                  alt="Logo do catálogo place"
                />
              </Link>
            </div>
            {/* <div>
              <h1 className={`text-green-primary text-4xl uppercase `}>
                Catálogo Place
              </h1>
            </div> */}
          </div>
          <div className="mt-6 w-full">
            <p className="text-green-secondary  text-xl">
              Nunca foi tão fácil vender online!! Estamos prontos para te
              ajudar.
            </p>
          </div>
          <div className="mt-16 hidden lg:flex xl:flex ">
            <h1 className="text-green-secondary text-2xl">
              Todos os direitos reservados
            </h1>
          </div>
        </div>

        <div className=" ml-0 lg:ml-24 xl:ml-24 mt-6 border-l-2 border-solid border-green-primary  ">
          <ul className="ml-4">
            <Link to="hero" spy={true} smooth={true} offset={0} duration={700}>
              <li className="text-green-primary font-semibold text-xl mb-4 cursor-pointer hover:text-blue-primary  transition-all duration-500">
                Home
              </li>
            </Link>
            <Link
              to="features"
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              <li className="text-green-primary font-semibold text-xl mb-4 cursor-pointer hover:text-blue-primary  transition-all duration-500">
                Soluções
              </li>
            </Link>
            <Link
              to="portfolio"
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              <li className="text-green-primary font-semibold text-xl mb-4 cursor-pointer hover:text-blue-primary  transition-all duration-500">
                Projetos
              </li>
            </Link>
            <Link to="faq" spy={true} smooth={true} offset={0} duration={700}>
              <li className="text-green-primary font-semibold text-xl mb-4 cursor-pointer hover:text-blue-primary  transition-all duration-500">
                Perguntas Freq.
              </li>
            </Link>
          </ul>
        </div>

        <div className="flex  items-end justify-start lg:justify-end xl:justify-end  mt-12  z-20 w-full  mr-0 ">
          <LinkNext href="https://instagram.com/catalogoplace" target="_blank">
            <div className="bg-green-primary rounded-full p-2 mr-5 cursor-pointer hover:bg-opacity-80 text-white transition-all duration-200">
              <RiInstagramFill className="text-3xl" />
            </div>
          </LinkNext>
          <LinkNext href="https://wa.me/5537999314716" target="_blank">
            <div className="bg-green-primary rounded-full p-2 mr-5 cursor-pointer hover:bg-opacity-80 text-white     transition-all duration-200">
              <RiWhatsappFill className="text-3xl" />
            </div>
          </LinkNext>
          <LinkNext
            href="mailto:hypebitcontato@gmail.com.br?subject=aa&body="
            target="_blank"
          >
            <div className="bg-green-primary rounded-full p-2 cursor-pointer hover:bg-opacity-80 text-white  transition-all duration-200">
              <MdEmail className="text-3xl" />
            </div>
          </LinkNext>
        </div>

        <div className="mt-16 flex lg:hidden xl:hidden ">
          <h1 className="text-white font-semibold text-2xl">
            Todos os direitos reservados
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
