"use client";

import { Inter, Poppins } from "next/font/google";
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
import { FaWhatsapp } from "react-icons/fa";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });
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
  const pathname = usePathname();

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

    if (params.loja) {
      getStore();
    }
  }, [params]);

  return (
    <html lang="en">
      <head>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <body className={`relative ${poppins.className}`}>
        <CartWrapper cartId={cartId}>
          <ToastProvider />
          <ViewCartModal
            isOpen={viewCartModal.isOpen}
            onClose={viewCartModal.onClose}
          />
          <div>{isClient && <Header />}</div>
          {/* {pathname === "/" && (
            <div className="fixed top-0 w-full">
              <Navbar />
            </div>
          )} */}
          <div
            className={`${
              pathname === "/" ||
              pathname === "/register" ||
              pathname === "register/success"
                ? "pb-0"
                : "pb-24"
            }`}
          >
            {children}
            {pathname !== "/" && pathname !== "/register" && (
              <div className="fixed bottom-6 right-6">
                <Link
                  target="_blank"
                  href={`https://wa.me/${store?.store?.phone}`}
                >
                  <div className="rounded-full bg-[#25D366] w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-opacity-90">
                    <FaWhatsapp color="#fff" size={34} />
                  </div>
                </Link>
              </div>
            )}
          </div>
          <Footer background={store?.store?.background_color} />
        </CartWrapper>
      </body>
    </html>
  );
}
