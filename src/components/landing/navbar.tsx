import React from "react";
import { Button } from "../ui/button";
import Container from "../container";

import { Link } from "react-scroll";
import NextLink from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo-dark.png";

const Navbar = () => {
  return (
    <nav className=" bg-white  w-full shadow-md px-12 lg:px-44 flex justify-between items-center h-20  z-[100]">
      <div className="flex flex-row justify-between items-center w-full">
        <Image
          src={logo}
          alt="Picture of the author"
          width={100}
          height={100}
        />
        <ul className="2xl:flex flex-row items-center hidden">
          <li className="text-xl mr-8">
            <Link
              to={"plans"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              Planos
            </Link>
          </li>
          <li className="text-xl mr-8">
            <Link
              to={"plans"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              Recursos
            </Link>
          </li>
          <li className="text-xl mr-8">
            <Link
              to={"plans"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              Dúvidas Frequentes
            </Link>
          </li>
          <li className="text-xl cursor-pointer ">
            <Link
              to={"plans"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              Como funciona?
            </Link>
          </li>
        </ul>
        <Button
          size="xl"
          className=" text-xl"
          type="submit"
          variant={"default"}
        >
          Acesse já
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
