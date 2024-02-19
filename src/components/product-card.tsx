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

interface ProductCardProps {
  name: string;
  price: string;
  images?: string[];
  onClick?: () => void;
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

const ProductCard = ({ name, price, images, onClick }: ProductCardProps) => {
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
  //   <div className=" w-full h-[450px] rounded-lg ">
  //   <Image
  //     className="w-full h-full object-cover object-center rounded-lg "
  //     src={`${
  //       product?.images?.length > 0
  //         ? product?.images[0]
  //         : ""
  //     }`}
  //     alt="Shoes"
  //     width={450}
  //     height={300}
  //   />
  // </div>
  return (
    <div className="w-full h-full ">
      <div className="relative w-full h-full rounded-xl">
        <Slider {...settings}>
          {images?.map((src, index) => (
            <div
              onClick={onClick}
              className="cursor-pointer border border-solid border-gray-200 rounded-md"
              key={index}
            >
              <div className=" relative w-full h-[350px]">
                <Image
                  className="w-full h-full object-cover object-center rounded-lg"
                  src={src}
                  width={450}
                  height={300}
                  alt={`Imagem Produto ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </Slider>
        <div className="mt-8  flex flex-col items-center w-full">
          <div className="w-full">
            <h1 className="text-2xl text-center text-gray-800 truncate">
              {name}
            </h1>
          </div>
          <h3 className="text-2xl font-bold">{price}</h3>
          <div className="mt-5 w-full">
            <button
              onClick={onClick}
              className="bg-green-primary w-full px-3 py-1 rounded-lg hover:opacity-70 transition-all duration-200"
            >
              <h1 className="text-white text-lg">Comprar</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
