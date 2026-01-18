import Image from "next/image";
import React from "react";

interface CategoryItemProps {
  name: string | undefined;
  image: string | undefined;
  color?: string;
  onClick?: () => void;
}

const CategoryItem = ({ name, image, onClick, color }: CategoryItemProps) => {
  const shortName = React.useMemo(() => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 6) return trimmed;
    return trimmed.slice(0, 6) + "...";
  }, [name]);
  return (
    <div
      onClick={onClick}
      className="mr-5 xl:mr-10 flex flex-col items-center justify-center cursor-pointer "
    >
      <div className="w-[64px] h-[64px] ">
        <Image
          className=" rounded-full w-[64px] h-[64px]"
          alt="Categoria"
          src={image ? image : "https://via.placeholder.com/64"}
          width={64}
          height={64}
        />
      </div>
      <div className="hidden xl:block  max-w-[100px]">
        <h3
          style={{
            color: color,
          }}
          className="text-green-primary text-lg cursor-pointer text-center"
        >
          {name}
        </h3>
      </div>
      <div className="block xl:hidden mt-1">
        <h4 className="text-sm text-center text-gray-600">{shortName}</h4>
      </div>
    </div>
  );
};

export default CategoryItem;
