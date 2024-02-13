import React from "react";
import { Button } from "../ui/button";
import Container from "../container";

import { Link } from "react-scroll";
import NextLink from "next/link";

const Navbar = () => {
  return (
    <Container isLanding>
      <nav className="flex justify-between p-8 z-[9999999] bg-white">
        <NextLink href={"/"}>
          <div>
            <h1 className="font-bold text-2xl cursor-pointer">
              Catalogo<span className="text-green-secondary">Place</span>
            </h1>
          </div>
        </NextLink>
        <div className="flex flex-row items-center">
          <ul className="flex flex-row mr-6">
            <Link
              to={"plans"}
              spy={true}
              smooth={true}
              offset={0}
              duration={700}
            >
              <li className="px-4 text-green-primary cursor-pointer">Planos</li>
            </Link>
          </ul>
          <NextLink href={"https://wa.me/5516996177828"} target="_blank">
            <Button
              className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-44"
              size={"lg"}
            >
              Entre em contato
            </Button>
          </NextLink>
        </div>
      </nav>
    </Container>
  );
};

export default Navbar;
