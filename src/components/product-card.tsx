import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { Button } from "./ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  promotionPrice?: number | null;
  images?: string[];
  onClick?: () => void;
}

interface InstallmentProps {
  installment_available?: boolean;
  installment_with_interest?: boolean;
  installment_interest_value?: number;
  max_installments?: number;
}

function SampleNextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className={
        "p-1 z-[100] rounded-full absolute right-3 top-1/2 transform -translate-y-1/2 bg-white"
      }
    >
      <MdOutlineKeyboardArrowRight className="text-2xl text-black" />
    </button>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className={
        "p-1 z-[100] rounded-full absolute left-3 top-1/2 transform -translate-y-1/2 bg-white"
      }
    >
      <MdOutlineKeyboardArrowLeft className="text-2xl text-black" />
    </button>
  );
}

const ProductCard = ({
  name,
  price,
  promotionPrice,
  images,
  onClick,
  installment_available,
  installment_with_interest,
  installment_interest_value,
  max_installments,
}: ProductCardProps & InstallmentProps) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const settings = {
    dots: images && images?.length > 1 ? true : false,
    infinite: images && images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: images && images?.length > 1 ? <SampleNextArrow /> : <></>,
    prevArrow: images && images?.length > 1 ? <SamplePrevArrow /> : <></>,
    afterChange: (index: number) => setSliderIndex(index),
  };

  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Installment display logic (assume quantity = 1 on listing)
  const installmentInfo = React.useMemo(() => {
    const available = installment_available ?? false;
    if (!available) return null;

    const maxRaw = max_installments ?? 1;
    const max = Math.max(1, Math.min(Number(maxRaw), 36));

    // If only 1 installment is allowed, don't display installment info
    if (max <= 1) return null;

    const withInterest = installment_with_interest ?? false;

    const unitPrice = promotionPrice && promotionPrice > 0 ? Number(promotionPrice) : Number(price ?? 0);

    if (!withInterest) {
      return `ou até ${max}x sem juros no cartão`;
    }

    const interestPercent = Number(installment_interest_value ?? 0);
    const r = interestPercent / 100;

    let parcela = unitPrice / max;
    if (r > 0) {
      const denom = 1 - Math.pow(1 + r, -max);
      if (denom > 0) {
        parcela = (unitPrice * r) / denom;
      }
    }

    return `ou ${max}x de ${formater.format(parcela)} no cartão`;
  }, [installment_available, installment_with_interest, installment_interest_value, max_installments, promotionPrice, price, formater]);

  return (
    <div className="w-full h-full  relative">
      <div className="relative w-full h-full rounded-2xl">
        <Slider {...settings}>
          {images?.map((src, index) => (
            <div
              onClick={onClick}
              className="cursor-pointer border border-solid border-gray-200 rounded-2xl"
              key={index}
            >
              <div className="relative  lg:h-[300px] h-[200px] w-full">
                <Image
                  className="w-full h-full rounded-2xl object-cover object-center"
                  src={src}
                  width={300}
                  height={300}
                  alt={`Imagem Produto ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </Slider>
        <div className="mt-8 flex flex-col w-full">
          <div className="mb-20 lg:mb-24">
          <div className="w-full">
            <h1 className="text-lg lg:text-2xl text-gray-800 truncate-multiline">{name}</h1>
          </div>
          {promotionPrice && promotionPrice > 0 ? (
            <div className="flex flex-row items-center mt-2">
              <div className="flex flex-row items-center">
                <h3 className="text-md lg:text-xl font-bold">
                  {formater.format(promotionPrice)}
                </h3>
              </div>
              <h3 className="text-sm lg:text-lg  text-gray-500  ml-2 line-through">
                {formater.format(price)}
              </h3>
            </div>
          ) : (
            <div className="mt-2">
              <h3 className="text-md lg:text-xl font-bold">{formater.format(price)}</h3>
            </div>
          )}
          {installmentInfo && (
            <div className="text-sm text-gray-600 mt-1">{installmentInfo}</div>
          )}
          </div>
          <div className="mt-12 w-full absolute bottom-0 pt-6">
            <Button
              onClick={onClick}
              size="lg"
              className={`w-full`}
              variant={"default"}
            >
              <div className="flex items-center">
                <div className="mr-2">
                  <FaShoppingBag size={18} />
                </div>
                <h1 className="text-white text-md lg:text-lg">Comprar</h1>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
