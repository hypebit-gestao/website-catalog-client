import Container from "@/components/container";
import FooterMenuItem from "@/components/footer-item-menu";
import useStore from "@/utils/hooks/use-store";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";

interface FooterProps {
  background: string;
}

const Footer = ({ background }: FooterProps) => {
  const params = useParams();
  const store = useStore();
  return (
    <div
      style={{
        backgroundColor: background !== null ? `${background}` : "#1e3222",
      }}
      className={`w-full  py-24 px-4 lg:py-24 lg:px-24 mt-24  ${
        !params.loja && "hidden"
      }`}
    >
      <Container>
        <div className="w-full flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full ">
            <ul>
              <FooterMenuItem href={`/${params.loja}`} name="Página Inicial" />
              <FooterMenuItem href="#featured" name="Em destaque" />
              <FooterMenuItem href="#categories" name="Categorias" />
            </ul>
          </div>
          <div className="w-full mt-6 lg:mt-0">
            <ul>
              <li>
                <h1 className="text-gray-200 text-2xl font-bold">
                  Fale com o vendedor
                </h1>
                <div className="flex flex-col">
                  <Link
                    href={`https://api.whatsapp.com/send/?phone=${store?.store?.phone}&text&type=phone_number&app_absent=0`}
                    target="_blank"
                  >
                    <button className="my-4">
                      <div className="flex flex-row items-center">
                        <IoLogoWhatsapp color="white" size={32} />
                        <h1 className="text-white text-2xl ml-4 break-words break-all text-justify">
                          {store?.store?.name}
                        </h1>
                      </div>
                    </button>
                  </Link>
                  <Link href="#" target="_blank">
                    <button className="my-4">
                      <div className="flex flex-row items-center">
                        <MdEmail color="white" size={32} />
                        <h1 className="text-white text-2xl ml-4 break-words break-all text-justify">
                          {store?.store?.email}
                        </h1>
                      </div>
                    </button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
