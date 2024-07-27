"use client";

import React, { useState } from "react";
import Container from "./container";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useCart } from "react-use-cart";
import { useParams, useRouter } from "next/navigation";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import useStore from "@/utils/hooks/use-store";
import Image from "next/image";
import useSearch from "@/utils/hooks/use-search";
import Link from "next/link";
import { GrCatalog } from "react-icons/gr";

const Header = () => {
  const { totalUniqueItems } = useCart();
  const params = useParams();
  const viewCart = useViewCartModal();
  const store = useStore();
  const search = useSearch();
  const router = useRouter();

  return (
    <header
      className={`h-auto border-b bg-white border-gray-200 w-full   ${
        !params.loja && "hidden"
      }`}
    >
      <Container>
        <div className="flex justify-between items-center  h-20">
          <div className="rounded-lg">
            <Link href={`/${params.loja}`}>
              {store?.store?.image_url ? (
                <Image
                className="rounded-lg"
                  src={store?.store?.image_url}
                  width={70}
                  height={70}
                  alt="Logo da Loja"
                />
              ) : (
                <Image
                  src="/images/logo-dark.png"
                  width={80}
                  height={80}
                  alt="Logo do catálogo place"
                />
              )}
            </Link>
          </div>

          <div className="relative items-center w-[60%] lg:w-[40%]">
            <FaSearch
              style={{
                color:
                  store?.store?.background_color !== null
                    ? `${store?.store?.background_color}`
                    : "#1e3222",
              }}
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-primary"
            />
            <input
              style={{}}
              className="pl-10 px-5 py-3 w-full border border-gray-200 rounded-lg  text-center"
              placeholder="Pesquisar"
              value={search.text}
              onChange={(e) => useSearch.setState({ text: e.target.value })}
              type="text"
            />
          </div>

          <div className="flex flex-row items-center">
            <h1 className="mr-4 font-bold hidden lg:block">Meu Carrinho</h1>
            <div
              onClick={() => router.push(`/${params.loja}/cart`)}
              className="relative "
            >
              <div
                style={{
                  backgroundColor:
                    store?.store?.background_color !== null
                      ? `${store?.store?.background_color}`
                      : "#1e3222",
                }}
                className="bg-green-secondary cursor-pointer rounded-full flex justify-center items-center w-5 h-5 absolute top-0 -right-3 text-center z-[99999] text-sm text-white"
              >
                {totalUniqueItems}
              </div>
              <div className="cursor-pointer">
                <FaShoppingCart
                  style={{
                    color:
                      store?.store?.background_color !== null
                        ? `${store?.store?.background_color}`
                        : "#1e3222",
                  }}
                  className="text-green-primary"
                  size={28}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
