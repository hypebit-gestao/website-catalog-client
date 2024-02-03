"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "./footer";
import { useParams, usePathname } from "next/navigation";
import { CartProvider, useCart } from "react-use-cart";
import ToastProvider from "@/providers/ToastProvider";
import { useEffect, useState } from "react";
import ViewCartModal from "@/components/view-cart";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import Image from "next/image";
import Link from "next/link";
import storeData from "@/utils/storeData";
import useStore from "@/utils/hooks/use-store";
import { Store } from "@/models/store";
import CartWrapper from "@/providers/CartWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const viewCartModal = useViewCartModal();
  const params = useParams();
  const store = useStore();
  const cartId = `cart_${params.loja}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getStore = async () => {
      const fetchedStore = await storeData(params.loja);
      if (fetchedStore) {
        useStore.setState({ store: fetchedStore });
      }
    };

    getStore();
  }, [params]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartWrapper cartId={cartId}>
          <ToastProvider />
          <ViewCartModal
            isOpen={viewCartModal.isOpen}
            onClose={viewCartModal.onClose}
          />
          <div>{isClient && <Header />}</div>
          <div className="pb-24">{children}</div>
          <Footer />
          <Link href="https://www.hypebit.com.br" target="_blank">
            <div className="w-full bg-black flex items-center justify-center p-3 text-white cursor-pointer">
              <Image
                className="mr-4"
                alt="Logo da Hypebit"
                src="/images/logo-hypebit.png"
                width={44}
                height={44}
              />
              Feito com Hypebit
            </div>
          </Link>
        </CartWrapper>
      </body>
    </html>
  );
}
