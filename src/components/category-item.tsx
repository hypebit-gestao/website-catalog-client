import Image from "next/image";
import React from "react";

interface CategoryItemProps {
  name: string | undefined;
  image: string | undefined;
  onClick?: () => void;
}

const CategoryItem = ({ name, image, onClick }: CategoryItemProps) => {
  return (
    <div onClick={onClick} className="mx-5 flex flex-col items-center justify-center cursor-pointer">
      <div className="w-[64px] h-[64px]">
        <Image
          className=" rounded-full w-[64px] h-[64px]"
          alt="Categoria"
          src={image ? image : "https://via.placeholder.com/64"}
          width={64}
          height={64}
        />
      </div>
      <div>
        <h3 className="text-green-primary text-lg cursor-pointer">{name}</h3>
      </div>
    </div>
  );
};

export default CategoryItem;
