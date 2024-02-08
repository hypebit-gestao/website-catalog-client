import Link from "next/link";
import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const LandingFooter = () => {
  return (
    <footer className="bg-white p-6 w-full fixed bottom-0">
      <div className="flex flex-row justify-center items-center">
        <Link href="https://www.hypebit.com.br" target="_blank">
          <div className="cursor-pointer mr-6">
            <FaInstagram size={44} color="#2c6e49" />
          </div>
        </Link>
        <Link href="https://wa.me/37999314716" target="_blank">
          <div className="cursor-pointer">
            <FaWhatsapp size={44} color="#2c6e49" />
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default LandingFooter;
