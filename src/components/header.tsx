"use client";

import React, { useState } from "react";
import Container from "./container";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useCart } from "react-use-cart";
import { useParams } from "next/navigation";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import useStore from "@/utils/hooks/use-store";
import Image from "next/image";
import useSearch from "@/utils/hooks/use-search";
import Link from "next/link";

const Header = () => {
  const { totalUniqueItems } = useCart();
  const params = useParams();
  const viewCart = useViewCartModal();
  const store = useStore();
  const search = useSearch();

  return (
    <header
      className={`fixed top-0 h-20 border-b bg-white border-gray-200 w-full shadow-md z-[99999] ${
        !params.loja && "hidden"
      }`}
    >
      <Container>
        <div className="flex justify-between items-center  h-20">
          <div className=" w-full">
            <Link href={`/${params.loja}`}>
              <Image
                src={
                  store?.store?.image_url
                    ? store?.store?.image_url
                    : "/images/logo-hypebit.png"
                }
                width={50}
                height={50}
                alt="Logo da Loja"
              />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="relative w-full items-center mr-5">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-primary" />
              <input
                className="pl-10 px-5 py-1 w-full border border-gray-200 rounded-lg placeholder:text-green-primary"
                placeholder="Pesquisar"
                value={search.text}
                onChange={(e) => useSearch.setState({ text: e.target.value })}
                type="text"
              />
            </div>
            <div onClick={() => viewCart.onOpen()} className="relative ">
              <div className="bg-green-secondary cursor-pointer rounded-full flex justify-center items-center w-5 h-5 absolute top-0 -right-3 text-center z-[99999] text-sm text-white">
                {totalUniqueItems}
              </div>
              <div className="cursor-pointer">
                <FaShoppingCart className="text-green-primary" size={28} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
