"use client";
import toast, { Toaster } from "react-hot-toast";
import Container from "@/components/container";
import ViewCartModal from "@/components/view-cart";
import { Product } from "@/models/product";
import { useProductService } from "@/services/product.service";
import useViewCartModal from "@/utils/hooks/use-view-cart-modal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import { useCart } from "react-use-cart";
import Loader from "@/components/loader";

const ProductPage = () => {
  const productService = useProductService();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [currentImg, setCurrentImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const viewCartModal = useViewCartModal();
  const router = useRouter();
  const { addItem, items, removeItem } = useCart();

  const formater = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = (quantity: number) => {
    addItem(
      {
        id: product?.id as string,
        name: product?.name as string,
        price: product?.price as number,
        image: product?.images && product?.images[0],
      },
      quantity
    );

    toast.success("Produto adicionado ao carrinho", {
      style: {
        marginTop: "90px",
      },
    });

    router.push(`/${params.loja}/cart`);
  };

  useEffect(() => {
    setLoading(true);
    const getProduct = async () => {
      const fetchedProduct = await productService.GETBYID(
        params.productId as string
      );
      if (fetchedProduct) {
        setLoading(false);
        setProduct(fetchedProduct);
      }
    };
    getProduct();
  }, []);

  return (
    <>
      {loading ? (
        <Loader color="text-green-primary" />
      ) : (
        <Container>
          <div className="mt-36">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-row lg:flex-col overflow-auto  max-h-[450px]">
                {product?.images?.map((img) => (
                  <>
                    <Image
                      onClick={() => setCurrentImg(img as string)}
                      className={`border border-solid border-gray-200 rounded-md cursor-pointer mb-3 w-[100px] h-[100px] lg:h-[150px] lg:w-[150px] object-cover object-center ${
                        currentImg === img && "border-2 border-green-secondary"
                      }`}
                      alt="Imagem do produto"
                      src={img as string}
                      width={150}
                      height={150}
                    />
                  </>
                ))}
              </div>
              <div className="ml-0 lg:ml-12 border border-solid border-gray-200 rounded-md w-full lg:w-[450px] h-[450px] ">
                <Image
                  className=" rounded-md cursor-pointer w-full h-full object-cover object-center lg:w-[450px]"
                  alt="Imagem do produto"
                  src={
                    currentImg ||
                    (product?.images && product?.images.length > 0
                      ? product?.images[0]
                      : "https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png")
                  }
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-6 lg:ml-12 w-auto lg:w-1/2 ">
                <h1 className="text-4xl truncate text-gray-500 w-full ">
                  {product?.name}
                </h1>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6">
                  <div className="flex ">
                    <div
                      onClick={() => handleRemove()}
                      className="rounded-full bg-green-primary p-3 mr-5 cursor-pointer"
                    >
                      <IoRemove className="text-white" />
                    </div>
                    <input
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      value={quantity}
                      className="w-[100px] border border-gray-200 rounded-xl text-center"
                      type="number"
                    />
                    <div
                      onClick={() => handleAdd()}
                      className="rounded-full bg-green-primary p-3 ml-5 cursor-pointer"
                    >
                      <IoAdd className="text-white" />
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0 lg:ml-12">
                    <h1 className="text-green-secondary font-bold text-3xl">
                      {formater.format(
                        Number(product?.price && product?.price * quantity)
                      )}
                    </h1>
                  </div>
                </div>
                <div className="my-5 lg:my-12">
                  <h3 className="text-gray-600 text-xl mb-4">
                    Descrição do produto
                  </h3>
                  <div className="">{product?.description}</div>
                </div>
                <div>
                  <button
                    onClick={() => addToCart(quantity)}
                    className="bg-green-primary w-full py-2 rounded-lg text-white text-xl"
                  >
                    Adicionar ao carrinho
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="mt-5 border border-solid border-green-primary w-full py-2 rounded-lg text-green-primary text-xl"
                  >
                    Voltar para a loja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default ProductPage;
