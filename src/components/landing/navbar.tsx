import React from "react";
import { Button } from "../ui/button";
import Container from "../container";

const Navbar = () => {
  return (
    <Container isLanding>
      <nav className="flex justify-between p-8 z-[9999999] bg-white">
        <div>
          <h1 className="font-bold text-2xl">
            Catalogo<span className="text-green-secondary">Place</span>
          </h1>
        </div>
        <div className="flex flex-row items-center">
          <ul className="flex flex-row mr-6">
            <li className="px-4 text-green-primary cursor-pointer">Planos</li>
          </ul>
          <Button
            className="bg-green-secondary hover:bg-green-primary/90 rounded-3xl w-44"
            size={"lg"}
          >
            Entre em contato
          </Button>
        </div>
      </nav>
    </Container>
  );
};

export default Navbar;
