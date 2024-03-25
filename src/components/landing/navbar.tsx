import React from "react";
import { Button } from "../ui/button";
import Container from "../container";

import { Link } from "react-scroll";
import NextLink from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo-dark.png";
import { GiHamburgerMenu } from "react-icons/gi";
import useMenu from "@/utils/hooks/use-menu";
import MenuMobile from "./menu-mobile";

const Navbar = () => {
  const menu = useMenu();

  const handleMenu = () => {
    menu.onOpen();
  };

  return (
    <nav className=" bg-white  w-full px-12 lg:px-44 flex justify-between items-center h-24  z-[100]">
      <div className="flex flex-row justify-between items-center w-full">
        <Image
          src={logo}
          alt="Picture of the author"
          width={100}
          height={100}
        />
        <ul className="2xl:flex flex-row items-center hidden">
          <li className="text-xl mr-8 cursor-pointer hover:text-green-primary transition-all duration-500">
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
          <li className="text-xl mr-8 cursor-pointer hover:text-green-primary transition-all duration-500">
            <Link
              to={"features"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              Recursos
            </Link>
          </li>
          <li className="text-xl mr-8 cursor-pointer hover:text-green-primary transition-all duration-500">
            <Link to={"faq"} spy={true} smooth={true} offset={0} duration={700}>
              Dúvidas Frequentes
            </Link>
          </li>
        </ul>
        <div className="flex md:hidden text-4xl text-green-primary cursor-pointer">
          <GiHamburgerMenu onClick={handleMenu} />
        </div>
        {menu.isOpen ? <MenuMobile /> : ""}
        <div className="hidden md:block">
          <Link to="plans" spy={true} smooth={true} offset={0} duration={700}>
            <Button
              size="xl"
              className=" text-xl bg-green-primary cursor-pointer"
              type="submit"
              variant={"default"}
            >
              Acesse já
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
